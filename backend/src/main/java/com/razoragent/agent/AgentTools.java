package com.razoragent.agent;

import com.razoragent.model.Cart;
import com.razoragent.model.Order;
import com.razoragent.model.Product;
import com.razoragent.service.AuditService;
import com.razoragent.service.CartService;
import com.razoragent.service.CatalogService;
import com.razoragent.service.RazorpayPaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
public class AgentTools {

    private static final Logger log = LoggerFactory.getLogger(AgentTools.class);

    private final CatalogService catalogService;
    private final CartService cartService;
    private final RazorpayPaymentService paymentService;
    private final AuditService auditService;

    public AgentTools(CatalogService catalogService, CartService cartService, RazorpayPaymentService paymentService, AuditService auditService) {
        this.catalogService = catalogService;
        this.cartService = cartService;
        this.paymentService = paymentService;
        this.auditService = auditService;
    }

    public List<Product> searchProducts(String sessionId, String query, BigDecimal maxPrice) {
        auditService.logEvent(sessionId, "CATALOG_SEARCH", 
                "Agent tool call searchProducts: query='" + query + "', maxPrice=" + maxPrice,
                "{\"query\":\"" + query + "\",\"maxPrice\":" + maxPrice + "}");
        return catalogService.searchProducts(query, maxPrice);
    }

    public Optional<Product> getProduct(String sessionId, String productId) {
        return catalogService.getProductById(productId);
    }

    public List<Product> compareProducts(String sessionId, List<String> productIds) {
        auditService.logEvent(sessionId, "PRODUCT_COMPARISON",
                "Agent tool call compareProducts for IDs: " + productIds,
                "{\"productIds\":" + productIds + "}");
        return catalogService.getProductsByIds(productIds);
    }

    public Cart getCart(String sessionId) {
        return cartService.getOrCreateCart(sessionId);
    }

    public Cart addToCart(String sessionId, String productId, int quantity, boolean isUpsell, String upsellReason) {
        Cart cart = cartService.addToCart(sessionId, productId, quantity, isUpsell, upsellReason);
        auditService.logEvent(sessionId, "CART_MODIFIED",
                "Agent tool call addToCart: " + productId + " (Qty: " + quantity + ", isUpsell: " + isUpsell + ")",
                "{\"productId\":\"" + productId + "\",\"quantity\":" + quantity + ",\"total\":" + cart.getTotal() + "}");
        return cart;
    }

    public Cart removeFromCart(String sessionId, String productId) {
        Cart cart = cartService.removeFromCart(sessionId, productId);
        auditService.logEvent(sessionId, "CART_MODIFIED",
                "Agent tool call removeFromCart: " + productId,
                "{\"productId\":\"" + productId + "\",\"total\":" + cart.getTotal() + "}");
        return cart;
    }

    public Cart calculateCart(String sessionId) {
        Cart cart = cartService.getOrCreateCart(sessionId);
        auditService.logEvent(sessionId, "CART_CALCULATED",
                "Agent tool call calculateCart: Subtotal ₹" + cart.getSubtotal() + ", Tax ₹" + cart.getTax() + ", Total ₹" + cart.getTotal(),
                "{\"subtotal\":" + cart.getSubtotal() + ",\"tax\":" + cart.getTax() + ",\"total\":" + cart.getTotal() + "}");
        return cart;
    }

    public Optional<Product> recommendUpsell(String sessionId) {
        Optional<Product> upsell = cartService.getUpsellRecommendationForCart(sessionId);
        upsell.ifPresent(p -> auditService.logEvent(sessionId, "UPSELL_PROPOSED",
                "Agent tool call recommendUpsell selected: " + p.getName() + " (₹" + p.getPrice() + ")",
                "{\"upsellProductId\":\"" + p.getId() + "\",\"price\":" + p.getPrice() + "}"));
        return upsell;
    }

    public Order createOrder(String sessionId, boolean simulateFailure) {
        return paymentService.createOrder(sessionId, simulateFailure);
    }

    public Order processPayment(String orderId, String paymentId, String signature, boolean simulateFailure) {
        return paymentService.verifyAndProcessPayment(orderId, paymentId, signature, simulateFailure);
    }
}
