package com.razoragent.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Cart {
    private String sessionId;
    private List<CartItem> items = new ArrayList<>();
    private String promoCode;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal taxRate = new BigDecimal("0.18");

    public Cart() {}

    public Cart(String sessionId, List<CartItem> items, String promoCode, BigDecimal discountAmount, BigDecimal taxRate) {
        this.sessionId = sessionId;
        this.items = items != null ? items : new ArrayList<>();
        this.promoCode = promoCode;
        this.discountAmount = discountAmount != null ? discountAmount : BigDecimal.ZERO;
        this.taxRate = taxRate != null ? taxRate : new BigDecimal("0.18");
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }

    public BigDecimal getSubtotal() {
        if (items == null) return BigDecimal.ZERO;
        return items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTax() {
        return getSubtotal().subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO)
                .max(BigDecimal.ZERO).multiply(taxRate != null ? taxRate : new BigDecimal("0.18"));
    }

    public BigDecimal getTotal() {
        return getSubtotal().subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO)
                .max(BigDecimal.ZERO).add(getTax());
    }

    public int getTotalItems() {
        if (items == null) return 0;
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String sessionId;
        private List<CartItem> items = new ArrayList<>();
        private String promoCode;
        private BigDecimal discountAmount = BigDecimal.ZERO;
        private BigDecimal taxRate = new BigDecimal("0.18");

        public Builder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
        public Builder items(List<CartItem> items) { this.items = items; return this; }
        public Builder promoCode(String promoCode) { this.promoCode = promoCode; return this; }
        public Builder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public Builder taxRate(BigDecimal taxRate) { this.taxRate = taxRate; return this; }

        public Cart build() {
            return new Cart(sessionId, items, promoCode, discountAmount, taxRate);
        }
    }
}
