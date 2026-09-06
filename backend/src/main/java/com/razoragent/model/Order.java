package com.razoragent.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String id;
    private String sessionId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String status;
    private BigDecimal amount;
    private Long amountInPaise;
    private String currency;

    @Column(length = 4000)
    private String itemsSummaryJson;
    private boolean containsUpsell;
    private BigDecimal upsellValue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String failureReason;

    public Order() {}

    public Order(String id, String sessionId, String razorpayOrderId, String razorpayPaymentId, String status,
                 BigDecimal amount, Long amountInPaise, String currency, String itemsSummaryJson,
                 boolean containsUpsell, BigDecimal upsellValue, LocalDateTime createdAt, LocalDateTime updatedAt, String failureReason) {
        this.id = id;
        this.sessionId = sessionId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.status = status;
        this.amount = amount;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.itemsSummaryJson = itemsSummaryJson;
        this.containsUpsell = containsUpsell;
        this.upsellValue = upsellValue;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.failureReason = failureReason;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Long getAmountInPaise() { return amountInPaise; }
    public void setAmountInPaise(Long amountInPaise) { this.amountInPaise = amountInPaise; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getItemsSummaryJson() { return itemsSummaryJson; }
    public void setItemsSummaryJson(String itemsSummaryJson) { this.itemsSummaryJson = itemsSummaryJson; }

    public boolean isContainsUpsell() { return containsUpsell; }
    public void setContainsUpsell(boolean containsUpsell) { this.containsUpsell = containsUpsell; }

    public BigDecimal getUpsellValue() { return upsellValue; }
    public void setUpsellValue(BigDecimal upsellValue) { this.upsellValue = upsellValue; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String sessionId;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String status;
        private BigDecimal amount;
        private Long amountInPaise;
        private String currency;
        private String itemsSummaryJson;
        private boolean containsUpsell;
        private BigDecimal upsellValue;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String failureReason;

        public Builder id(String id) { this.id = id; return this; }
        public Builder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
        public Builder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public Builder razorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder amountInPaise(Long amountInPaise) { this.amountInPaise = amountInPaise; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder itemsSummaryJson(String itemsSummaryJson) { this.itemsSummaryJson = itemsSummaryJson; return this; }
        public Builder containsUpsell(boolean containsUpsell) { this.containsUpsell = containsUpsell; return this; }
        public Builder upsellValue(BigDecimal upsellValue) { this.upsellValue = upsellValue; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder failureReason(String failureReason) { this.failureReason = failureReason; return this; }

        public Order build() {
            return new Order(id, sessionId, razorpayOrderId, razorpayPaymentId, status, amount, amountInPaise, currency, itemsSummaryJson, containsUpsell, upsellValue, createdAt, updatedAt, failureReason);
        }
    }
}
