package com.razoragent.model;

import java.math.BigDecimal;

public class AnalyticsMetric {
    private BigDecimal totalGmv;
    private double conversionRate;
    private BigDecimal averageOrderValue;
    private double upsellAcceptanceRate;
    private double crossSellRate;
    private BigDecimal revenuePerSession;
    private BigDecimal aiAttributedRevenue;
    private int totalSessions;
    private int abandonedCarts;
    private int recoveredCarts;
    private ComparisonData storefrontVsAgent;

    public AnalyticsMetric() {}

    public AnalyticsMetric(BigDecimal totalGmv, double conversionRate, BigDecimal averageOrderValue, double upsellAcceptanceRate, double crossSellRate, BigDecimal revenuePerSession, BigDecimal aiAttributedRevenue, int totalSessions, int abandonedCarts, int recoveredCarts, ComparisonData storefrontVsAgent) {
        this.totalGmv = totalGmv;
        this.conversionRate = conversionRate;
        this.averageOrderValue = averageOrderValue;
        this.upsellAcceptanceRate = upsellAcceptanceRate;
        this.crossSellRate = crossSellRate;
        this.revenuePerSession = revenuePerSession;
        this.aiAttributedRevenue = aiAttributedRevenue;
        this.totalSessions = totalSessions;
        this.abandonedCarts = abandonedCarts;
        this.recoveredCarts = recoveredCarts;
        this.storefrontVsAgent = storefrontVsAgent;
    }

    public BigDecimal getTotalGmv() { return totalGmv; }
    public void setTotalGmv(BigDecimal totalGmv) { this.totalGmv = totalGmv; }

    public double getConversionRate() { return conversionRate; }
    public void setConversionRate(double conversionRate) { this.conversionRate = conversionRate; }

    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public double getUpsellAcceptanceRate() { return upsellAcceptanceRate; }
    public void setUpsellAcceptanceRate(double upsellAcceptanceRate) { this.upsellAcceptanceRate = upsellAcceptanceRate; }

    public double getCrossSellRate() { return crossSellRate; }
    public void setCrossSellRate(double crossSellRate) { this.crossSellRate = crossSellRate; }

    public BigDecimal getRevenuePerSession() { return revenuePerSession; }
    public void setRevenuePerSession(BigDecimal revenuePerSession) { this.revenuePerSession = revenuePerSession; }

    public BigDecimal getAiAttributedRevenue() { return aiAttributedRevenue; }
    public void setAiAttributedRevenue(BigDecimal aiAttributedRevenue) { this.aiAttributedRevenue = aiAttributedRevenue; }

    public int getTotalSessions() { return totalSessions; }
    public void setTotalSessions(int totalSessions) { this.totalSessions = totalSessions; }

    public int getAbandonedCarts() { return abandonedCarts; }
    public void setAbandonedCarts(int abandonedCarts) { this.abandonedCarts = abandonedCarts; }

    public int getRecoveredCarts() { return recoveredCarts; }
    public void setRecoveredCarts(int recoveredCarts) { this.recoveredCarts = recoveredCarts; }

    public ComparisonData getStorefrontVsAgent() { return storefrontVsAgent; }
    public void setStorefrontVsAgent(ComparisonData storefrontVsAgent) { this.storefrontVsAgent = storefrontVsAgent; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private BigDecimal totalGmv;
        private double conversionRate;
        private BigDecimal averageOrderValue;
        private double upsellAcceptanceRate;
        private double crossSellRate;
        private BigDecimal revenuePerSession;
        private BigDecimal aiAttributedRevenue;
        private int totalSessions;
        private int abandonedCarts;
        private int recoveredCarts;
        private ComparisonData storefrontVsAgent;

        public Builder totalGmv(BigDecimal totalGmv) { this.totalGmv = totalGmv; return this; }
        public Builder conversionRate(double conversionRate) { this.conversionRate = conversionRate; return this; }
        public Builder averageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; return this; }
        public Builder upsellAcceptanceRate(double upsellAcceptanceRate) { this.upsellAcceptanceRate = upsellAcceptanceRate; return this; }
        public Builder crossSellRate(double crossSellRate) { this.crossSellRate = crossSellRate; return this; }
        public Builder revenuePerSession(BigDecimal revenuePerSession) { this.revenuePerSession = revenuePerSession; return this; }
        public Builder aiAttributedRevenue(BigDecimal aiAttributedRevenue) { this.aiAttributedRevenue = aiAttributedRevenue; return this; }
        public Builder totalSessions(int totalSessions) { this.totalSessions = totalSessions; return this; }
        public Builder abandonedCarts(int abandonedCarts) { this.abandonedCarts = abandonedCarts; return this; }
        public Builder recoveredCarts(int recoveredCarts) { this.recoveredCarts = recoveredCarts; return this; }
        public Builder storefrontVsAgent(ComparisonData storefrontVsAgent) { this.storefrontVsAgent = storefrontVsAgent; return this; }

        public AnalyticsMetric build() {
            return new AnalyticsMetric(totalGmv, conversionRate, averageOrderValue, upsellAcceptanceRate, crossSellRate, revenuePerSession, aiAttributedRevenue, totalSessions, abandonedCarts, recoveredCarts, storefrontVsAgent);
        }
    }

    public static class ComparisonData {
        private MetricPair conversion;
        private MetricPair aov;
        private MetricPair upsellRate;
        private MetricPair revPerSession;

        public ComparisonData() {}

        public ComparisonData(MetricPair conversion, MetricPair aov, MetricPair upsellRate, MetricPair revPerSession) {
            this.conversion = conversion;
            this.aov = aov;
            this.upsellRate = upsellRate;
            this.revPerSession = revPerSession;
        }

        public MetricPair getConversion() { return conversion; }
        public void setConversion(MetricPair conversion) { this.conversion = conversion; }

        public MetricPair getAov() { return aov; }
        public void setAov(MetricPair aov) { this.aov = aov; }

        public MetricPair getUpsellRate() { return upsellRate; }
        public void setUpsellRate(MetricPair upsellRate) { this.upsellRate = upsellRate; }

        public MetricPair getRevPerSession() { return revPerSession; }
        public void setRevPerSession(MetricPair revPerSession) { this.revPerSession = revPerSession; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private MetricPair conversion;
            private MetricPair aov;
            private MetricPair upsellRate;
            private MetricPair revPerSession;

            public Builder conversion(MetricPair conversion) { this.conversion = conversion; return this; }
            public Builder aov(MetricPair aov) { this.aov = aov; return this; }
            public Builder upsellRate(MetricPair upsellRate) { this.upsellRate = upsellRate; return this; }
            public Builder revPerSession(MetricPair revPerSession) { this.revPerSession = revPerSession; return this; }

            public ComparisonData build() {
                return new ComparisonData(conversion, aov, upsellRate, revPerSession);
            }
        }
    }

    public static class MetricPair {
        private String storefront;
        private String aiAgent;
        private String upliftPercentage;

        public MetricPair() {}

        public MetricPair(String storefront, String aiAgent, String upliftPercentage) {
            this.storefront = storefront;
            this.aiAgent = aiAgent;
            this.upliftPercentage = upliftPercentage;
        }

        public String getStorefront() { return storefront; }
        public void setStorefront(String storefront) { this.storefront = storefront; }

        public String getAiAgent() { return aiAgent; }
        public void setAiAgent(String aiAgent) { this.aiAgent = aiAgent; }

        public String getUpliftPercentage() { return upliftPercentage; }
        public void setUpliftPercentage(String upliftPercentage) { this.upliftPercentage = upliftPercentage; }
    }
}
