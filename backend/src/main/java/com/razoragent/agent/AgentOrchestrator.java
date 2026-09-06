package com.razoragent.agent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razoragent.model.Cart;
import com.razoragent.model.Order;
import com.razoragent.model.Product;
import com.razoragent.service.AuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AgentOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(AgentOrchestrator.class);
    private final AgentTools agentTools;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public AgentOrchestrator(AgentTools agentTools, AuditService auditService, ObjectMapper objectMapper) {
        this.agentTools = agentTools;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    public static class AgentResponse {
        private String sessionId;
        private String textResponse;
        private String reasoningSteps;
        private List<String> toolsCalled;
        private Cart cart;
        private Product recommendedProduct;
        private Product proposedUpsell;
        private boolean requiresUserApproval;
        private Order pendingOrder;
        private boolean isFailureScenario;
        private String failureMessage;

        public AgentResponse() {}

        public AgentResponse(String sessionId, String textResponse, String reasoningSteps, List<String> toolsCalled, Cart cart, Product recommendedProduct, Product proposedUpsell, boolean requiresUserApproval, Order pendingOrder, boolean isFailureScenario, String failureMessage) {
            this.sessionId = sessionId;
            this.textResponse = textResponse;
            this.reasoningSteps = reasoningSteps;
            this.toolsCalled = toolsCalled;
            this.cart = cart;
            this.recommendedProduct = recommendedProduct;
            this.proposedUpsell = proposedUpsell;
            this.requiresUserApproval = requiresUserApproval;
            this.pendingOrder = pendingOrder;
            this.isFailureScenario = isFailureScenario;
            this.failureMessage = failureMessage;
        }

        public String getSessionId() { return sessionId; }
        public String getTextResponse() { return textResponse; }
        public String getReasoningSteps() { return reasoningSteps; }
        public List<String> getToolsCalled() { return toolsCalled; }
        public Cart getCart() { return cart; }
        public Product getRecommendedProduct() { return recommendedProduct; }
        public Product getProposedUpsell() { return proposedUpsell; }
        public boolean isRequiresUserApproval() { return requiresUserApproval; }
        public Order getPendingOrder() { return pendingOrder; }
        public boolean isFailureScenario() { return isFailureScenario; }
        public String getFailureMessage() { return failureMessage; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String sessionId;
            private String textResponse;
            private String reasoningSteps;
            private List<String> toolsCalled;
            private Cart cart;
            private Product recommendedProduct;
            private Product proposedUpsell;
            private boolean requiresUserApproval;
            private Order pendingOrder;
            private boolean isFailureScenario;
            private String failureMessage;

            public Builder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
            public Builder textResponse(String textResponse) { this.textResponse = textResponse; return this; }
            public Builder reasoningSteps(String reasoningSteps) { this.reasoningSteps = reasoningSteps; return this; }
            public Builder toolsCalled(List<String> toolsCalled) { this.toolsCalled = toolsCalled; return this; }
            public Builder cart(Cart cart) { this.cart = cart; return this; }
            public Builder recommendedProduct(Product recommendedProduct) { this.recommendedProduct = recommendedProduct; return this; }
            public Builder proposedUpsell(Product proposedUpsell) { this.proposedUpsell = proposedUpsell; return this; }
            public Builder requiresUserApproval(boolean requiresUserApproval) { this.requiresUserApproval = requiresUserApproval; return this; }
            public Builder pendingOrder(Order pendingOrder) { this.pendingOrder = pendingOrder; return this; }
            public Builder isFailureScenario(boolean isFailureScenario) { this.isFailureScenario = isFailureScenario; return this; }
            public Builder failureMessage(String failureMessage) { this.failureMessage = failureMessage; return this; }

            public AgentResponse build() {
                return new AgentResponse(sessionId, textResponse, reasoningSteps, toolsCalled, cart, recommendedProduct, proposedUpsell, requiresUserApproval, pendingOrder, isFailureScenario, failureMessage);
            }
        }
    }

    public AgentResponse processUserMessage(String sessionId, String userPrompt, boolean simulateFailureScenario) {
        log.info("Processing user message for session {}: '{}'", sessionId, userPrompt);
        auditService.logEvent(sessionId, "USER_REQUEST", userPrompt, "{\"prompt\":\"" + userPrompt + "\"}");

        List<String> toolsCalled = new ArrayList<>();
        String lowerPrompt = userPrompt != null ? userPrompt.toLowerCase() : "";

        // 1. Conversational Cart Modification ("remove case", "remove carrying case", "remove the carrying case", "remove upsell")
        if (lowerPrompt.contains("remove") && (lowerPrompt.contains("case") || lowerPrompt.contains("carrying") || lowerPrompt.contains("upsell"))) {
            toolsCalled.add("removeFromCart");
            toolsCalled.add("calculateCart");
            
            Cart updatedCart = agentTools.removeFromCart(sessionId, "PROD-ACC-001");
            agentTools.calculateCart(sessionId);

            return AgentResponse.builder()
                    .sessionId(sessionId)
                    .textResponse("I've removed the Hard Shell Carrying Case from your draft cart as requested. Your updated cart total is ₹" 
                            + updatedCart.getTotal() + " (including GST). Would you like to proceed with payment now?")
                    .reasoningSteps("Executed tool removeFromCart('PROD-ACC-001') -> Recalculated total -> Generated approval prompt.")
                    .toolsCalled(toolsCalled)
                    .cart(updatedCart)
                    .requiresUserApproval(true)
                    .build();
        }

        // 2. Intent Extraction: Budget & Category
        BigDecimal budget = extractBudget(userPrompt);
        toolsCalled.add("searchProducts");
        
        List<Product> searchResults = agentTools.searchProducts(sessionId, userPrompt, budget);

        if (searchResults.isEmpty()) {
            searchResults = agentTools.searchProducts(sessionId, "audio", budget);
        }

        Product primaryRec = selectBestProduct(searchResults, lowerPrompt, budget);
        
        // Add primary product to draft cart
        toolsCalled.add("addToCart");
        Cart cart = agentTools.addToCart(sessionId, primaryRec.getId(), 1, false, null);

        // Check budget & calculate remaining allowance
        BigDecimal remainingBudget = budget != null ? budget.subtract(primaryRec.getPrice()) : new BigDecimal("1000");

        // Propose Upsell if complementary product fits or remaining budget allows
        toolsCalled.add("recommendUpsell");
        Optional<Product> upsellOpt = agentTools.recommendUpsell(sessionId);
        Product proposedUpsell = null;

        StringBuilder responseText = new StringBuilder();
        responseText.append(String.format("Based on your %s request and budget, I recommend the **%s**.",
                budget != null ? "₹" + budget.intValue() : "shopping", primaryRec.getName()));
        
        responseText.append(String.format("\n\n**Why this product?**\n%s. It is priced at **₹%s**",
                primaryRec.getDescription(), primaryRec.getPrice()));

        if (budget != null) {
            responseText.append(String.format(", leaving **₹%s** in your budget.", remainingBudget.max(BigDecimal.ZERO)));
        } else {
            responseText.append(".");
        }

        if (upsellOpt.isPresent() && (budget == null || remainingBudget.compareTo(upsellOpt.get().getPrice()) >= 0)) {
            proposedUpsell = upsellOpt.get();
            toolsCalled.add("addToCart");
            cart = agentTools.addToCart(sessionId, proposedUpsell.getId(), 1, true, "Frequently purchased complementary product");

            responseText.append(String.format("\n\n**Smart Recommendation:**\nI've added the complementary **%s** (₹%s) to your draft cart. %s.",
                    proposedUpsell.getName(), proposedUpsell.getPrice(), proposedUpsell.getDescription()));
            responseText.append("\n\nYou can conversationally ask me to remove it or change options at any time.");
        }

        toolsCalled.add("calculateCart");
        Cart finalCart = agentTools.calculateCart(sessionId);

        String reasoning = String.format("Extracted intent: [Category: %s, Budget: %s]. Called catalog search -> Filtered top match '%s' -> Checked complementary graph -> Found upsell '%s' -> Added to draft cart -> Calculated GST.",
                primaryRec.getCategory(), budget != null ? "₹" + budget : "unspecified", primaryRec.getName(), proposedUpsell != null ? proposedUpsell.getName() : "None");

        return AgentResponse.builder()
                .sessionId(sessionId)
                .textResponse(responseText.toString())
                .reasoningSteps(reasoning)
                .toolsCalled(toolsCalled)
                .cart(finalCart)
                .recommendedProduct(primaryRec)
                .proposedUpsell(proposedUpsell)
                .requiresUserApproval(true)
                .build();
    }

    public AgentResponse approveAndCreateOrder(String sessionId, boolean simulateFailure) {
        log.info("User approved financial transaction for session {}", sessionId);
        auditService.logEvent(sessionId, "USER_APPROVAL", "Customer explicitly approved total breakdown and authorized payment creation.", "{\"approved\":true}");

        List<String> toolsCalled = Arrays.asList("createOrder", "createRazorpayPayment");
        Order order = agentTools.createOrder(sessionId, simulateFailure);
        Cart cart = agentTools.getCart(sessionId);

        if (simulateFailure) {
            Order failedOrder = agentTools.processPayment(order.getId(), null, null, true);
            return AgentResponse.builder()
                    .sessionId(sessionId)
                    .textResponse("⚠️ **Payment Authorization Failed**\nYour bank payment was declined during Razorpay processing. **No amount was charged.**\n\nOptions:\n- [Try payment again]\n- [Change payment method]\n- [Cancel order]")
                    .reasoningSteps("Payment execution returned FAILED status from bank. Safety boundary maintained: zero money debited. Presented 3 graceful recovery options.")
                    .toolsCalled(toolsCalled)
                    .cart(cart)
                    .pendingOrder(failedOrder)
                    .isFailureScenario(true)
                    .failureMessage("PAYMENT_DECLINED_BY_BANK: Simulated payment failure for hackathon demo testing.")
                    .build();
        }

        Order paidOrder = agentTools.processPayment(order.getId(), "pay_test_" + UUID.randomUUID().toString().substring(0, 10), "sig_valid_123", false);

        return AgentResponse.builder()
                .sessionId(sessionId)
                .textResponse(String.format("🎉 **Order Authorized & Paid Successfully!**\n\nRazorpay Payment ID: `%s`\nRazorpay Order ID: `%s`\nTotal Amount Charged: **₹%s**\n\nThank you for shopping with RazorAgent!",
                        paidOrder.getRazorpayPaymentId(), paidOrder.getRazorpayOrderId(), paidOrder.getAmount()))
                .reasoningSteps("Order status transitioned to PAID. Razorpay test mode signature verified. Audit log event recorded. Cart cleared.")
                .toolsCalled(toolsCalled)
                .cart(cart)
                .pendingOrder(paidOrder)
                .isFailureScenario(false)
                .build();
    }

    private BigDecimal extractBudget(String prompt) {
        if (prompt == null) return null;
        Pattern pattern = Pattern.compile("(?:under|below|less than|within|around|budget of|rs\\.?|₹)\\s*(\\d+(?:,\\d+)*)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(prompt);
        if (matcher.find()) {
            String valStr = matcher.group(1).replace(",", "");
            try {
                return new BigDecimal(valStr);
            } catch (Exception e) {
                log.warn("Failed to parse budget value: {}", valStr);
            }
        }
        return null;
    }

    private Product selectBestProduct(List<Product> products, String lowerPrompt, BigDecimal budget) {
        if (products == null || products.isEmpty()) {
            return Product.builder()
                    .id("PROD-AUDIO-001")
                    .name("Sony WH-CH720N Wireless ANC Headphones")
                    .description("Active Noise Cancelling over-ear headphones with 35-hour battery life and Dual Noise Sensor technology.")
                    .price(new BigDecimal("4299"))
                    .category("Audio")
                    .build();
        }

        return products.stream()
                .filter(p -> budget == null || p.getPrice().compareTo(budget) <= 0)
                .max(Comparator.comparing(p -> p.getRating() != null ? p.getRating() : 4.0))
                .orElse(products.get(0));
    }
}
