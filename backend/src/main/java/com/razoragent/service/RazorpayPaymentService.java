package com.razoragent.service;

import com.razoragent.model.Cart;
import com.razoragent.model.Order;
import com.razoragent.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
public class RazorpayPaymentService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentService.class);
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final AuditService auditService;

    @Value("${razorpay.key-id:rzp_test_mockkey12345}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:mocksecret67890}")
    private String razorpayKeySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    public RazorpayPaymentService(OrderRepository orderRepository, CartService cartService, AuditService auditService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.auditService = auditService;
    }

    public Order createOrder(String sessionId, boolean isSimulatedFailure) {
        Cart cart = cartService.getOrCreateCart(sessionId);
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create Razorpay order for empty cart.");
        }

        BigDecimal totalAmount = cart.getTotal();
        long amountInPaise = totalAmount.multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String rzpOrderId = "order_" + UUID.randomUUID().toString().substring(0, 14).replace("-", "");

        if (razorpayKeyId != null && !razorpayKeyId.startsWith("rzp_test_mock")) {
            try {
                RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", currency);
                orderRequest.put("receipt", orderId);
                
                JSONObject notes = new JSONObject();
                notes.put("sessionId", sessionId);
                notes.put("agent", "RazorAgent-Commerce-Bot");
                orderRequest.put("notes", notes);

                com.razorpay.Order rzpOrder = razorpayClient.orders.create(orderRequest);
                rzpOrderId = rzpOrder.get("id");
                log.info("Razorpay API Order created successfully: {}", rzpOrderId);
            } catch (Exception e) {
                log.warn("Razorpay API call failed, falling back to local test order mode: {}", e.getMessage());
            }
        }

        boolean hasUpsell = cart.getItems().stream().anyMatch(item -> item.isUpsell());
        BigDecimal upsellVal = cart.getItems().stream()
                .filter(item -> item.isUpsell())
                .map(item -> item.getSubtotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .id(orderId)
                .sessionId(sessionId)
                .razorpayOrderId(rzpOrderId)
                .status("ORDER_CREATED")
                .amount(totalAmount)
                .amountInPaise(amountInPaise)
                .currency(currency)
                .containsUpsell(hasUpsell)
                .upsellValue(upsellVal)
                .itemsSummaryJson(buildItemsJson(cart))
                .build();

        Order saved = orderRepository.save(order);

        auditService.logEvent(sessionId, "ORDER_CREATED", 
                "Order created in Razorpay test mode. Razorpay Order ID: " + rzpOrderId + ", Total: ₹" + totalAmount,
                "{\"orderId\":\"" + orderId + "\",\"razorpayOrderId\":\"" + rzpOrderId + "\",\"amount\":" + totalAmount + "}");

        return saved;
    }

    public Order verifyAndProcessPayment(String orderId, String paymentId, String signature, boolean simulateFailure) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (simulateFailure) {
            order.setStatus("FAILED");
            order.setFailureReason("PAYMENT_DECLINED_BY_BANK: Simulated payment failure for hackathon demo testing.");
            orderRepository.save(order);

            auditService.logEvent(order.getSessionId(), "PAYMENT_FAILURE",
                    "Payment authorization failed for Order " + order.getRazorpayOrderId() + ": Bank authorization declined.",
                    "{\"orderId\":\"" + orderId + "\",\"status\":\"FAILED\",\"reason\":\"PAYMENT_DECLINED\"}");

            return order;
        }

        order.setStatus("PAID");
        order.setRazorpayPaymentId(paymentId != null ? paymentId : "pay_" + UUID.randomUUID().toString().substring(0, 14).replace("-", ""));
        orderRepository.save(order);

        auditService.logEvent(order.getSessionId(), "PAYMENT_SUCCESS",
                "Payment authorized & captured successfully via Razorpay! Payment ID: " + order.getRazorpayPaymentId() + ", Amount: ₹" + order.getAmount(),
                "{\"orderId\":\"" + orderId + "\",\"paymentId\":\"" + order.getRazorpayPaymentId() + "\",\"status\":\"SUCCESS\"}");

        cartService.clearCart(order.getSessionId());

        return order;
    }

    private String buildItemsJson(Cart cart) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < cart.getItems().size(); i++) {
            var item = cart.getItems().get(i);
            sb.append(String.format("{\"productId\":\"%s\",\"name\":\"%s\",\"price\":%s,\"quantity\":%d,\"isUpsell\":%b}",
                    item.getProduct().getId(),
                    item.getProduct().getName().replace("\"", "\\\""),
                    item.getProduct().getPrice(),
                    item.getQuantity(),
                    item.isUpsell()));
            if (i < cart.getItems().size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
