package com.razoragent.service;

import com.razoragent.model.Cart;
import com.razoragent.model.CartItem;
import com.razoragent.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CartService {

    private static final Logger log = LoggerFactory.getLogger(CartService.class);
    private final CatalogService catalogService;
    private final Map<String, Cart> cartStorage = new ConcurrentHashMap<>();

    public CartService(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    public Cart getOrCreateCart(String sessionId) {
        return cartStorage.computeIfAbsent(sessionId, id -> Cart.builder()
                .sessionId(id)
                .items(new ArrayList<>())
                .discountAmount(BigDecimal.ZERO)
                .taxRate(new BigDecimal("0.18"))
                .build());
    }

    public Cart addToCart(String sessionId, String productId, int quantity, boolean isUpsell, String upsellReason) {
        Cart cart = getOrCreateCart(sessionId);
        Product product = catalogService.getProductById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
            if (isUpsell) {
                existingItem.get().setUpsell(true);
                existingItem.get().setUpsellReason(upsellReason);
            }
        } else {
            cart.getItems().add(CartItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .isUpsell(isUpsell)
                    .upsellReason(upsellReason)
                    .build());
        }

        log.info("Session {}: Added product {} (Qty: {}) to cart.", sessionId, productId, quantity);
        return cart;
    }

    public Cart removeFromCart(String sessionId, String productId) {
        Cart cart = getOrCreateCart(sessionId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        log.info("Session {}: Removed product {} from cart.", sessionId, productId);
        return cart;
    }

    public Cart updateCartQuantity(String sessionId, String productId, int quantity) {
        Cart cart = getOrCreateCart(sessionId);
        if (quantity <= 0) {
            return removeFromCart(sessionId, productId);
        }

        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));

        log.info("Session {}: Updated product {} quantity to {}.", sessionId, productId, quantity);
        return cart;
    }

    public void clearCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        cart.getItems().clear();
    }

    public Optional<Product> getUpsellRecommendationForCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        if (cart.getItems().isEmpty()) {
            return Optional.empty();
        }

        for (CartItem item : cart.getItems()) {
            List<String> complementary = item.getProduct().getComplementaryProductIds();
            if (complementary != null && !complementary.isEmpty()) {
                for (String compId : complementary) {
                    boolean alreadyInCart = cart.getItems().stream()
                            .anyMatch(ci -> ci.getProduct().getId().equals(compId));
                    if (!alreadyInCart) {
                        Optional<Product> compProd = catalogService.getProductById(compId);
                        if (compProd.isPresent()) {
                            return compProd;
                        }
                    }
                }
            }
        }

        String defaultUpsellId = "PROD-ACC-001";
        boolean alreadyInCart = cart.getItems().stream()
                .anyMatch(ci -> ci.getProduct().getId().equals(defaultUpsellId));
        if (!alreadyInCart) {
            return catalogService.getProductById(defaultUpsellId);
        }

        return Optional.empty();
    }
}
