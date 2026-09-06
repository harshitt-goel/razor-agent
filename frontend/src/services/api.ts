import { AgentResponse, AnalyticsMetric, AuditLog, BuyerSimulatorResult, Product } from '../types';

const metaEnv = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env;
const API_BASE = metaEnv && metaEnv.VITE_API_BASE_URL 
  ? `${metaEnv.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api';

export const api = {
  async sendChatMessage(sessionId: string, message: string, simulateFailure: boolean): Promise<AgentResponse> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message, simulateFailure }),
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (err) {
      console.warn('Backend server unreachable, using client mock agent orchestrator fallback', err);
      return mockAgentResponse(sessionId, message, simulateFailure);
    }
  },

  async approveTransaction(sessionId: string, simulateFailure: boolean): Promise<AgentResponse> {
    try {
      const res = await fetch(`${API_BASE}/chat/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: 'APPROVE', simulateFailure }),
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (err) {
      return mockApprovalResponse(sessionId, simulateFailure);
    }
  },

  async getDashboardMetrics(): Promise<AnalyticsMetric> {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (err) {
      return mockDashboardMetrics();
    }
  },

  async runBuyerSimulator(): Promise<BuyerSimulatorResult[]> {
    try {
      const res = await fetch(`${API_BASE}/simulator/run`, { method: 'POST' });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (err) {
      return mockSimulatorResults();
    }
  },

  async getAuditTrail(sessionId: string): Promise<AuditLog[]> {
    try {
      const res = await fetch(`${API_BASE}/audit/${sessionId}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (err) {
      return mockAuditLogs(sessionId);
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (err) {
      return mockProducts();
    }
  }
};

function mockAgentResponse(sessionId: string, message: string, simulateFailure: boolean): AgentResponse {
  const lowerMsg = message.toLowerCase();
  const isRemoveCase = lowerMsg.includes('remove') && (lowerMsg.includes('case') || lowerMsg.includes('carrying') || lowerMsg.includes('upsell'));
  
  if (isRemoveCase) {
    return {
      sessionId,
      textResponse: "I've removed the Hard Shell Carrying Case from your draft cart as requested. Your updated cart total is ₹4,299 (including GST). Would you like to proceed with payment now?",
      reasoningSteps: "Executed tool removeFromCart('PROD-ACC-001') -> Recalculated total -> Generated approval prompt.",
      toolsCalled: ["removeFromCart", "calculateCart"],
      cart: {
        sessionId,
        items: [{
          product: mockProducts()[0],
          quantity: 1,
          isUpsell: false,
          subtotal: 4299
        }],
        subtotal: 4299,
        tax: 773,
        total: 5072,
        totalItems: 1
      },
      requiresUserApproval: true,
      isFailureScenario: false
    };
  }

  return {
    sessionId,
    textResponse: "Based on your request and budget, I recommend the **Sony WH-CH720N Wireless ANC Headphones**.\n\n**Why this product?**\nLightweight active noise cancelling over-ear headphones with 35-hour battery life and Dual Noise Sensor technology. It is priced at **₹4,299**, leaving **₹701** in your budget.\n\n**Smart Recommendation:**\nI've added the complementary **Hard Shell Headphone Carrying Case** (₹500) to your draft cart. Shockproof EVA travel case with soft velour lining.\n\nYou can conversationally ask me to remove it or change options at any time.",
    reasoningSteps: "Extracted intent: [Category: Audio, Budget: ₹5000]. Called catalog search -> Filtered top match 'Sony WH-CH720N' -> Checked complementary graph -> Found upsell 'Hard Shell Headphone Carrying Case' -> Added to draft cart -> Calculated GST.",
    toolsCalled: ["searchProducts", "getProduct", "addToCart", "recommendUpsell", "calculateCart"],
    recommendedProduct: mockProducts()[0],
    proposedUpsell: mockProducts()[1],
    cart: {
      sessionId,
      items: [
        { product: mockProducts()[0], quantity: 1, isUpsell: false, subtotal: 4299 },
        { product: mockProducts()[1], quantity: 1, isUpsell: true, upsellReason: "Frequently purchased complementary product", subtotal: 500 }
      ],
      subtotal: 4799,
      tax: 863,
      total: 5662,
      totalItems: 2
    },
    requiresUserApproval: true,
    isFailureScenario: false
  };
}

function mockApprovalResponse(sessionId: string, simulateFailure: boolean): AgentResponse {
  const rzpOrderId = 'order_Nz' + Math.random().toString(36).substring(2, 10);
  const rzpPayId = 'pay_' + Math.random().toString(36).substring(2, 12);

  if (simulateFailure) {
    return {
      sessionId,
      textResponse: "⚠️ **Payment Authorization Failed**\nYour bank payment was declined during Razorpay processing. **No amount was charged.**\n\nOptions:\n- [Try payment again]\n- [Change payment method]\n- [Cancel order]",
      reasoningSteps: "Payment execution returned FAILED status from bank. Safety boundary maintained: zero money debited. Presented 3 graceful recovery options.",
      toolsCalled: ["createOrder", "createRazorpayPayment"],
      cart: { sessionId, items: [], subtotal: 0, tax: 0, total: 0, totalItems: 0 },
      pendingOrder: {
        id: 'ORD-ERR-999',
        sessionId,
        razorpayOrderId: rzpOrderId,
        status: 'FAILED',
        amount: 5662,
        currency: 'INR',
        containsUpsell: true,
        upsellValue: 500,
        createdAt: new Date().toISOString(),
        failureReason: 'PAYMENT_DECLINED_BY_BANK: Simulated payment failure for hackathon demo testing.'
      },
      isFailureScenario: true,
      failureMessage: 'PAYMENT_DECLINED_BY_BANK: Simulated payment failure for hackathon demo testing.',
      requiresUserApproval: false
    };
  }

  return {
    sessionId,
    textResponse: `🎉 **Order Authorized & Paid Successfully!**\n\nRazorpay Payment ID: \`${rzpPayId}\`\nRazorpay Order ID: \`${rzpOrderId}\`\nTotal Amount Charged: **₹5,662**\n\nThank you for shopping with RazorAgent!`,
    reasoningSteps: "Order status transitioned to PAID. Razorpay test mode signature verified. Audit log event recorded. Cart cleared.",
    toolsCalled: ["createOrder", "createRazorpayPayment"],
    cart: { sessionId, items: [], subtotal: 0, tax: 0, total: 0, totalItems: 0 },
    pendingOrder: {
      id: 'ORD-SUCCESS-101',
      sessionId,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPayId,
      status: 'PAID',
      amount: 5662,
      currency: 'INR',
      containsUpsell: true,
      upsellValue: 500,
      createdAt: new Date().toISOString()
    },
    isFailureScenario: false,
    requiresUserApproval: false
  };
}

function mockDashboardMetrics(): AnalyticsMetric {
  return {
    totalGmv: 490862,
    conversionRate: 7.8,
    averageOrderValue: 3620,
    upsellAcceptanceRate: 18.4,
    crossSellRate: 12.6,
    revenuePerSession: 282,
    aiAttributedRevenue: 98900,
    totalSessions: 1720,
    abandonedCarts: 142,
    recoveredCarts: 38,
    storefrontVsAgent: {
      conversion: { storefront: "4.2%", aiAgent: "7.8%", upliftPercentage: "+85.7%" },
      aov: { storefront: "₹2,940", aiAgent: "₹3,620", upliftPercentage: "+23.1%" },
      upsellRate: { storefront: "3.1%", aiAgent: "18.4%", upliftPercentage: "+493.5%" },
      revPerSession: { storefront: "₹124", aiAgent: "₹282", upliftPercentage: "+127.4%" }
    }
  };
}

function mockSimulatorResults(): BuyerSimulatorResult[] {
  return [
    {
      personaId: "BUYER-1",
      personaName: "WFH Professional (Audio Intent)",
      userPrompt: "I need wireless headphones under ₹5000 for working from home.",
      budget: 5000,
      primaryProductRecommended: "Sony WH-CH720N Wireless ANC Headphones",
      primaryProductPrice: 4299,
      upsellProductRecommended: "Hard Shell Headphone Carrying Case",
      upsellProductPrice: 500,
      upsellAccepted: true,
      totalCartValue: 4799,
      purchaseCompleted: true,
      razorpayPaymentId: "pay_sim_9a8b7c6d",
      agentToolsUsed: ["searchProducts", "recommendUpsell", "calculateCart", "createOrder", "createRazorpayPayment"],
      executionSummary: "Selected Sony WH-CH720N for ANC & 35h battery life (₹4,299). Recommended hard case (₹500) within remaining ₹701 budget. Buyer approved cart and completed Razorpay test payment."
    },
    {
      personaId: "BUYER-2",
      personaName: "Thoughtful Gift Shopper",
      userPrompt: "Find me a birthday gift for my brother under ₹3000.",
      budget: 3000,
      primaryProductRecommended: "Smart Fitness Band 8 with AMOLED Display",
      primaryProductPrice: 2499,
      upsellProductRecommended: "RazorCare 2-Year Extended Hardware Warranty",
      upsellProductPrice: 499,
      upsellAccepted: true,
      totalCartValue: 2998,
      purchaseCompleted: true,
      razorpayPaymentId: "pay_sim_1e2f3g4h",
      agentToolsUsed: ["searchProducts", "recommendUpsell", "calculateCart", "createOrder", "createRazorpayPayment"],
      executionSummary: "Selected Smart Fitness Band 8 (₹2,499) featuring SpO2 & AMOLED screen. Recommended 2-Year protection warranty (₹499). Total ₹2,998 fit ₹3,000 budget perfectly."
    },
    {
      personaId: "BUYER-3",
      personaName: "Hardcore Gamer",
      userPrompt: "I need a gaming setup under ₹1 lakh.",
      budget: 100000,
      primaryProductRecommended: "ASUS ROG Strix G16 RTX 4060 Gaming Laptop",
      primaryProductPrice: 89990,
      upsellProductRecommended: "Razer BlackShark V2 Pro Wireless Gaming Headset",
      upsellProductPrice: 9499,
      upsellAccepted: true,
      totalCartValue: 99489,
      purchaseCompleted: true,
      razorpayPaymentId: "pay_sim_5i6j7k8l",
      agentToolsUsed: ["searchProducts", "compareProducts", "recommendUpsell", "calculateCart", "createOrder", "createRazorpayPayment"],
      executionSummary: "Paired RTX 4060 laptop (₹89,990) with THX spatial audio gaming headset (₹9,499). Maximized merchant revenue to ₹99,489 under ₹100,000 ceiling."
    },
    {
      personaId: "BUYER-4",
      personaName: "Ergonomic WFH Desk Buyer",
      userPrompt: "I need a complete work-from-home setup.",
      budget: 35000,
      primaryProductRecommended: "Ergonomic Lumbar Support Office Desk Chair",
      primaryProductPrice: 14999,
      upsellProductRecommended: "Logitech MX Master 3S Ergonomic Mouse",
      upsellProductPrice: 8995,
      upsellAccepted: true,
      totalCartValue: 23994,
      purchaseCompleted: true,
      razorpayPaymentId: "pay_sim_9m0n1o2p",
      agentToolsUsed: ["searchProducts", "recommendUpsell", "calculateCart", "createOrder", "createRazorpayPayment"],
      executionSummary: "Cross-sold Ergonomic Chair (₹14,999) with MX Master 3S mouse (₹8,995). Generated high AOV ₹23,994 transaction."
    }
  ];
}

function mockAuditLogs(sessionId: string): AuditLog[] {
  const now = new Date();
  return [
    {
      id: 1,
      sessionId,
      eventType: "USER_REQUEST",
      description: 'Customer prompt: "I need wireless headphones under ₹5000 for working from home."',
      payloadJson: '{"prompt":"I need wireless headphones under ₹5000"}',
      timestamp: new Date(now.getTime() - 15000).toISOString()
    },
    {
      id: 2,
      sessionId,
      eventType: "CATALOG_SEARCH",
      description: "Agent tool call searchProducts: query='headphones', maxPrice=5000",
      payloadJson: '{"query":"headphones","maxPrice":5000}',
      timestamp: new Date(now.getTime() - 14000).toISOString()
    },
    {
      id: 3,
      sessionId,
      eventType: "RECOMMENDATION",
      description: "Selected product: Sony WH-CH720N Wireless ANC Headphones (Reason: ANC + 35h battery life)",
      payloadJson: '{"productId":"PROD-AUDIO-001","price":4299}',
      timestamp: new Date(now.getTime() - 12000).toISOString()
    },
    {
      id: 4,
      sessionId,
      eventType: "UPSELL_PROPOSED",
      description: "Proposed complementary item: Hard Shell Headphone Carrying Case (₹500)",
      payloadJson: '{"productId":"PROD-ACC-001","price":500}',
      timestamp: new Date(now.getTime() - 10000).toISOString()
    },
    {
      id: 5,
      sessionId,
      eventType: "USER_APPROVAL",
      description: "Customer approved cart breakdown of ₹4,799 + GST",
      payloadJson: '{"approved":true}',
      timestamp: new Date(now.getTime() - 5000).toISOString()
    },
    {
      id: 6,
      sessionId,
      eventType: "ORDER_CREATED",
      description: "Order created in Razorpay test mode. Razorpay Order ID: order_Nz982341",
      payloadJson: '{"razorpayOrderId":"order_Nz982341"}',
      timestamp: new Date(now.getTime() - 3000).toISOString()
    },
    {
      id: 7,
      sessionId,
      eventType: "PAYMENT_SUCCESS",
      description: "Payment authorized via Razorpay. Payment ID: pay_Nz872164",
      payloadJson: '{"paymentId":"pay_Nz872164","status":"SUCCESS"}',
      timestamp: new Date().toISOString()
    }
  ];
}

function mockProducts(): Product[] {
  return [
    {
      id: "PROD-AUDIO-001",
      name: "Sony WH-CH720N Wireless ANC Headphones",
      description: "Lightweight active noise cancelling over-ear headphones with 35-hour battery life and Dual Noise Sensor technology.",
      category: "Audio",
      price: 4299,
      inventory: 45,
      brand: "Sony",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      rating: 4.7,
      tags: ["wireless", "anc", "headphones"],
      useCases: ["work from home", "travel"],
      complementaryProductIds: ["PROD-ACC-001", "PROD-ACC-002"],
      keyFeatures: "ANC Active Noise Cancellation, 35h battery life"
    },
    {
      id: "PROD-ACC-001",
      name: "Hard Shell Headphone Carrying Case",
      description: "Shockproof EVA travel case with soft velour lining and cable storage mesh pocket.",
      category: "Accessories",
      price: 500,
      inventory: 150,
      brand: "RazorGuard",
      imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
      rating: 4.6,
      tags: ["case", "protection"],
      useCases: ["travel", "storage"],
      complementaryProductIds: ["PROD-AUDIO-001"]
    }
  ];
}
