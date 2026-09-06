package com.razoragent.model;

import java.math.BigDecimal;

public class CartItem {
    private Product product;
    private int quantity;
    private boolean isUpsell;
    private String upsellReason;

    public CartItem() {}

    public CartItem(Product product, int quantity, boolean isUpsell, String upsellReason) {
        this.product = product;
        this.quantity = quantity;
        this.isUpsell = isUpsell;
        this.upsellReason = upsellReason;
    }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public boolean isUpsell() { return isUpsell; }
    public void setUpsell(boolean upsell) { isUpsell = upsell; }

    public String getUpsellReason() { return upsellReason; }
    public void setUpsellReason(String upsellReason) { this.upsellReason = upsellReason; }

    public BigDecimal getSubtotal() {
        if (product == null || product.getPrice() == null) return BigDecimal.ZERO;
        return product.getPrice().multiply(BigDecimal.valueOf(quantity));
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Product product;
        private int quantity;
        private boolean isUpsell;
        private String upsellReason;

        public Builder product(Product product) { this.product = product; return this; }
        public Builder quantity(int quantity) { this.quantity = quantity; return this; }
        public Builder isUpsell(boolean isUpsell) { this.isUpsell = isUpsell; return this; }
        public Builder upsellReason(String upsellReason) { this.upsellReason = upsellReason; return this; }

        public CartItem build() {
            return new CartItem(product, quantity, isUpsell, upsellReason);
        }
    }
}
