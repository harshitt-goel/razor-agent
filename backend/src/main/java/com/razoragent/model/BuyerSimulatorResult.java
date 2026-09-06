package com.razoragent.model;

import java.math.BigDecimal;
import java.util.List;

public class BuyerSimulatorResult {
    private String personaId;
    private String personaName;
    private String userPrompt;
    private BigDecimal budget;
    private String primaryProductRecommended;
    private BigDecimal primaryProductPrice;
    private String upsellProductRecommended;
    private BigDecimal upsellProductPrice;
    private boolean upsellAccepted;
    private BigDecimal totalCartValue;
    private boolean purchaseCompleted;
    private String razorpayPaymentId;
    private List<String> agentToolsUsed;
    private String executionSummary;

    public BuyerSimulatorResult() {}

    public BuyerSimulatorResult(String personaId, String personaName, String userPrompt, BigDecimal budget, String primaryProductRecommended, BigDecimal primaryProductPrice, String upsellProductRecommended, BigDecimal upsellProductPrice, boolean upsellAccepted, BigDecimal totalCartValue, boolean purchaseCompleted, String razorpayPaymentId, List<String> agentToolsUsed, String executionSummary) {
        this.personaId = personaId;
        this.personaName = personaName;
        this.userPrompt = userPrompt;
        this.budget = budget;
        this.primaryProductRecommended = primaryProductRecommended;
        this.primaryProductPrice = primaryProductPrice;
        this.upsellProductRecommended = upsellProductRecommended;
        this.upsellProductPrice = upsellProductPrice;
        this.upsellAccepted = upsellAccepted;
        this.totalCartValue = totalCartValue;
        this.purchaseCompleted = purchaseCompleted;
        this.razorpayPaymentId = razorpayPaymentId;
        this.agentToolsUsed = agentToolsUsed;
        this.executionSummary = executionSummary;
    }

    public String getPersonaId() { return personaId; }
    public void setPersonaId(String personaId) { this.personaId = personaId; }

    public String getPersonaName() { return personaName; }
    public void setPersonaName(String personaName) { this.personaName = personaName; }

    public String getUserPrompt() { return userPrompt; }
    public void setUserPrompt(String userPrompt) { this.userPrompt = userPrompt; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public String getPrimaryProductRecommended() { return primaryProductRecommended; }
    public void setPrimaryProductRecommended(String primaryProductRecommended) { this.primaryProductRecommended = primaryProductRecommended; }

    public BigDecimal getPrimaryProductPrice() { return primaryProductPrice; }
    public void setPrimaryProductPrice(BigDecimal primaryProductPrice) { this.primaryProductPrice = primaryProductPrice; }

    public String getUpsellProductRecommended() { return upsellProductRecommended; }
    public void setUpsellProductRecommended(String upsellProductRecommended) { this.upsellProductRecommended = upsellProductRecommended; }

    public BigDecimal getUpsellProductPrice() { return upsellProductPrice; }
    public void setUpsellProductPrice(BigDecimal upsellProductPrice) { this.upsellProductPrice = upsellProductPrice; }

    public boolean isUpsellAccepted() { return upsellAccepted; }
    public void setUpsellAccepted(boolean upsellAccepted) { this.upsellAccepted = upsellAccepted; }

    public BigDecimal getTotalCartValue() { return totalCartValue; }
    public void setTotalCartValue(BigDecimal totalCartValue) { this.totalCartValue = totalCartValue; }

    public boolean isPurchaseCompleted() { return purchaseCompleted; }
    public void setPurchaseCompleted(boolean purchaseCompleted) { this.purchaseCompleted = purchaseCompleted; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public List<String> getAgentToolsUsed() { return agentToolsUsed; }
    public void setAgentToolsUsed(List<String> agentToolsUsed) { this.agentToolsUsed = agentToolsUsed; }

    public String getExecutionSummary() { return executionSummary; }
    public void setExecutionSummary(String executionSummary) { this.executionSummary = executionSummary; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String personaId;
        private String personaName;
        private String userPrompt;
        private BigDecimal budget;
        private String primaryProductRecommended;
        private BigDecimal primaryProductPrice;
        private String upsellProductRecommended;
        private BigDecimal upsellProductPrice;
        private boolean upsellAccepted;
        private BigDecimal totalCartValue;
        private boolean purchaseCompleted;
        private String razorpayPaymentId;
        private List<String> agentToolsUsed;
        private String executionSummary;

        public Builder personaId(String personaId) { this.personaId = personaId; return this; }
        public Builder personaName(String personaName) { this.personaName = personaName; return this; }
        public Builder userPrompt(String userPrompt) { this.userPrompt = userPrompt; return this; }
        public Builder budget(BigDecimal budget) { this.budget = budget; return this; }
        public Builder primaryProductRecommended(String primaryProductRecommended) { this.primaryProductRecommended = primaryProductRecommended; return this; }
        public Builder primaryProductPrice(BigDecimal primaryProductPrice) { this.primaryProductPrice = primaryProductPrice; return this; }
        public Builder upsellProductRecommended(String upsellProductRecommended) { this.upsellProductRecommended = upsellProductRecommended; return this; }
        public Builder upsellProductPrice(BigDecimal upsellProductPrice) { this.upsellProductPrice = upsellProductPrice; return this; }
        public Builder upsellAccepted(boolean upsellAccepted) { this.upsellAccepted = upsellAccepted; return this; }
        public Builder totalCartValue(BigDecimal totalCartValue) { this.totalCartValue = totalCartValue; return this; }
        public Builder purchaseCompleted(boolean purchaseCompleted) { this.purchaseCompleted = purchaseCompleted; return this; }
        public Builder razorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; return this; }
        public Builder agentToolsUsed(List<String> agentToolsUsed) { this.agentToolsUsed = agentToolsUsed; return this; }
        public Builder executionSummary(String executionSummary) { this.executionSummary = executionSummary; return this; }

        public BuyerSimulatorResult build() {
            return new BuyerSimulatorResult(personaId, personaName, userPrompt, budget, primaryProductRecommended, primaryProductPrice, upsellProductRecommended, upsellProductPrice, upsellAccepted, totalCartValue, purchaseCompleted, razorpayPaymentId, agentToolsUsed, executionSummary);
        }
    }
}
