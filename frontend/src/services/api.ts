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
      const all = mockProducts();
      if (!query || query.trim() === '') return all;
      const q = query.toLowerCase().trim();
      return all.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
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
    proposedUpsell: mockProducts()[5],
    cart: {
      sessionId,
      items: [
        { product: mockProducts()[0], quantity: 1, isUpsell: false, subtotal: 4299 },
        { product: mockProducts()[5], quantity: 1, isUpsell: true, upsellReason: "Frequently purchased complementary product", subtotal: 500 }
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
  const list: Product[] = [];

  list.push({
    id: "PROD-AUDIO-001",
    name: "Sony WH-CH720N Wireless ANC Headphones",
    description: "Lightweight active noise cancelling over-ear headphones with 35-hour battery life and Dual Noise Sensor technology.",
    category: "Audio",
    price: 4299,
    inventory: 45,
    brand: "Sony",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    rating: 4.7,
    tags: ["wireless", "anc", "headphones", "bluetooth"],
    useCases: ["work from home", "travel"],
    complementaryProductIds: ["PROD-ACC-001", "PROD-ACC-002"],
    keyFeatures: "ANC Active Noise Cancellation, 35h battery life"
  });

  list.push({
    id: "PROD-AUDIO-002",
    name: "JBL Tune 760NC Over-Ear Wireless Headphones",
    description: "Active noise cancelling headphones with JBL Pure Bass sound, hands-free call support, and 44h battery duration.",
    category: "Audio",
    price: 4999,
    inventory: 30,
    brand: "JBL",
    imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    rating: 4.5,
    tags: ["wireless", "headphones", "jbl", "bass"],
    useCases: ["music", "work from home"],
    complementaryProductIds: ["PROD-ACC-001"]
  });

  list.push({
    id: "PROD-AUDIO-003",
    name: "Sennheiser HD 450BT Wireless Headphones",
    description: "Premium German audio engineering with active noise cancellation and AptX Low Latency codec support.",
    category: "Audio",
    price: 7999,
    inventory: 20,
    brand: "Sennheiser",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
    rating: 4.8,
    tags: ["wireless", "premium", "audiophile"],
    useCases: ["audiophile listening", "travel"],
    complementaryProductIds: ["PROD-ACC-001"]
  });

  list.push({
    id: "PROD-AUDIO-004",
    name: "boAt Airdopes 141 TWS Earbuds",
    description: "True wireless earbuds with 42 hours playback time, ENx voice call clarity, and IPX4 rating.",
    category: "Audio",
    price: 1299,
    inventory: 120,
    brand: "boAt",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    rating: 4.2,
    tags: ["earbuds", "tws", "budget"],
    useCases: ["commute", "workouts"],
    complementaryProductIds: ["PROD-ACC-003"]
  });

  list.push({
    id: "PROD-AUDIO-005",
    name: "Sony WF-1000XM5 Premium Noise Cancelling Earbuds",
    description: "Industry-leading noise cancellation earbuds with High-Res Audio Wireless and AI noise reduction.",
    category: "Audio",
    price: 19990,
    inventory: 15,
    brand: "Sony",
    imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500",
    rating: 4.9,
    tags: ["premium", "anc", "sony"],
    useCases: ["executive travel", "wfh"],
    complementaryProductIds: ["PROD-ACC-002"]
  });

  list.push({
    id: "PROD-ACC-001",
    name: "Hard Shell Headphone Carrying Case",
    description: "Shockproof EVA travel case with soft velour lining, cable storage mesh pocket, and universal fit.",
    category: "Accessories",
    price: 500,
    inventory: 150,
    brand: "RazorGuard",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
    rating: 4.6,
    tags: ["case", "protection", "travel"],
    useCases: ["travel", "headphone protection"],
    complementaryProductIds: ["PROD-AUDIO-001"]
  });

  list.push({
    id: "PROD-ACC-002",
    name: "RazorCare 2-Year Extended Hardware Warranty",
    description: "Comprehensive extended coverage protecting against drops, liquid spills, and battery degradation.",
    category: "Accessories",
    price: 499,
    inventory: 999,
    brand: "RazorCare",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500",
    rating: 4.9,
    tags: ["warranty", "protection"],
    useCases: ["peace of mind"],
    complementaryProductIds: ["PROD-AUDIO-001", "PROD-GAMING-001"]
  });

  list.push({
    id: "PROD-ACC-003",
    name: "Premium Braided Type-C Fast Charging Cable (2m)",
    description: "Ultra-durable nylon braided USB-C cable supporting 100W Power Delivery and high-speed data sync.",
    category: "Accessories",
    price: 399,
    inventory: 200,
    brand: "RazorTech",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    rating: 4.7,
    tags: ["cable", "charger", "type-c"],
    useCases: ["fast charging"],
    complementaryProductIds: ["PROD-AUDIO-001"]
  });

  list.push({
    id: "PROD-ACC-004",
    name: "Ergonomic Aluminium Laptop Stand",
    description: "Adjustable desktop laptop riser made from aerospace aluminum with heat dissipation vents.",
    category: "Accessories",
    price: 1499,
    inventory: 60,
    brand: "RazorDesk",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    rating: 4.8,
    tags: ["laptop stand", "desk accessory"],
    useCases: ["wfh", "posture"],
    complementaryProductIds: ["PROD-OFFICE-001"]
  });

  list.push({
    id: "PROD-OFFICE-001",
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    description: "Quiet click ergonomic mouse with 8K DPI tracking on glass and MagSpeed electromagnetic scrolling.",
    category: "Office",
    price: 8995,
    inventory: 35,
    brand: "Logitech",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
    rating: 4.9,
    tags: ["mouse", "logitech", "mx master"],
    useCases: ["wfh", "productivity"],
    complementaryProductIds: ["PROD-OFFICE-002"]
  });

  list.push({
    id: "PROD-OFFICE-002",
    name: "Logitech MX Keys S Wireless Illuminated Keyboard",
    description: "Advanced low-profile wireless keyboard with smart backlighting and quiet mechanical feel.",
    category: "Office",
    price: 11995,
    inventory: 25,
    brand: "Logitech",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    rating: 4.8,
    tags: ["keyboard", "logitech", "wireless"],
    useCases: ["coding", "typing"],
    complementaryProductIds: ["PROD-OFFICE-001"]
  });

  list.push({
    id: "PROD-OFFICE-003",
    name: "Anker PowerConf C200 2K Webcam",
    description: "Ultra-clear 2K HD webcam with dual stereo noise-cancelling microphones and privacy cover.",
    category: "Office",
    price: 4499,
    inventory: 40,
    brand: "Anker",
    imageUrl: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500",
    rating: 4.6,
    tags: ["webcam", "video calls"],
    useCases: ["zoom calls", "wfh"],
    complementaryProductIds: ["PROD-AUDIO-001"]
  });

  list.push({
    id: "PROD-OFFICE-004",
    name: "Ergonomic Lumbar Support Office Desk Chair",
    description: "Breathable mesh high-back office chair with 3D adjustable armrests and dynamic lumbar support.",
    category: "Office",
    price: 14999,
    inventory: 18,
    brand: "GreenSoul",
    imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500",
    rating: 4.7,
    tags: ["chair", "ergonomic"],
    useCases: ["long seating", "wfh"],
    complementaryProductIds: ["PROD-OFFICE-001"]
  });

  list.push({
    id: "PROD-GAMING-001",
    name: "ASUS ROG Strix G16 Gaming Laptop",
    description: "Intel Core i7-13650HX, RTX 4060, 16GB DDR5 RAM, 1TB SSD, 16-inch 165Hz FHD+ Display.",
    category: "Gaming",
    price: 89990,
    inventory: 8,
    brand: "ASUS",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    rating: 4.9,
    tags: ["gaming laptop", "rtx 4060", "rog"],
    useCases: ["gaming setup", "esports"],
    complementaryProductIds: ["PROD-GAMING-002", "PROD-GAMING-003"]
  });

  list.push({
    id: "PROD-GAMING-002",
    name: "Razer BlackShark V2 Pro Wireless Gaming Headset",
    description: "Esports Wireless Gaming Headset with HyperClear Superwide Band Mic and THX Spatial Audio.",
    category: "Gaming",
    price: 9499,
    inventory: 22,
    brand: "Razer",
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
    rating: 4.7,
    tags: ["gaming headset", "razer"],
    useCases: ["gaming setup", "discord"],
    complementaryProductIds: ["PROD-GAMING-001"]
  });

  list.push({
    id: "PROD-GAMING-003",
    name: "LG UltraGear 27-inch QHD IPS 165Hz Gaming Monitor",
    description: "1440p Nano IPS Gaming Monitor with 1ms response time and NVIDIA G-Sync Compatibility.",
    category: "Gaming",
    price: 22499,
    inventory: 12,
    brand: "LG",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    rating: 4.8,
    tags: ["monitor", "165hz", "qhd"],
    useCases: ["gaming setup", "creative work"],
    complementaryProductIds: ["PROD-GAMING-001"]
  });

  list.push({
    id: "PROD-GAMING-004",
    name: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    description: "Ultra-lightweight 63g esports gaming mouse with Focus Pro 30K Optical Sensor.",
    category: "Gaming",
    price: 7999,
    inventory: 30,
    brand: "Razer",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    rating: 4.8,
    tags: ["gaming mouse", "razer"],
    useCases: ["competitive gaming"],
    complementaryProductIds: ["PROD-GAMING-001"]
  });

  list.push({
    id: "PROD-GIFT-001",
    name: "Smart Fitness Band 8 with AMOLED Display",
    description: "Fitness tracker with 1.62\" AMOLED screen, SpO2 monitoring, and 16 days battery life. Ideal gift for brother!",
    category: "Fitness",
    price: 2499,
    inventory: 80,
    brand: "FitMax",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
    rating: 4.6,
    tags: ["gift", "fitness band", "birthday gift"],
    useCases: ["birthday gift for brother"],
    complementaryProductIds: ["PROD-ACC-003"]
  });

  list.push({
    id: "PROD-GIFT-002",
    name: "Marshall Style Vintage Bluetooth Speaker (10W)",
    description: "Retro compact portable Bluetooth speaker with deep bass and brass control knobs.",
    category: "Audio",
    price: 2899,
    inventory: 40,
    brand: "SoundCraft",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    rating: 4.7,
    tags: ["gift", "speaker", "bluetooth"],
    useCases: ["birthday gift for brother"],
    complementaryProductIds: ["PROD-ACC-003"]
  });

  list.push({
    id: "PROD-GIFT-003",
    name: "Premium Leather Wallet & Keyring Gift Set",
    description: "Handcrafted genuine RFID-blocking leather wallet paired with an alloy carabiner in a gift box.",
    category: "Accessories",
    price: 1899,
    inventory: 65,
    brand: "UrbanCraft",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    rating: 4.8,
    tags: ["gift", "wallet", "brother gift"],
    useCases: ["birthday gift for brother"],
    complementaryProductIds: ["PROD-GIFT-001"]
  });

  // Seed 32 more diverse merchant products to reach 52 items total!
  for (let i = 1; i <= 32; i++) {
    const category = (i % 5 === 0) ? "Fitness" : (i % 4 === 0) ? "Gaming" : (i % 3 === 0) ? "Office" : (i % 2 === 0) ? "Electronics" : "Audio";
    const price = 300 + (i * 250);
    list.push({
      id: `PROD-CAT-${String(i).padStart(3, '0')}`,
      name: `${category} Essential Item #${i}`,
      description: `High-performance merchant item designed for daily productivity and quality in ${category}`,
      category,
      price,
      inventory: 20 + (i * 3),
      brand: "RazorBrand",
      imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
      rating: Number((4.0 + (i % 10) * 0.1).toFixed(1)),
      tags: [category.toLowerCase(), "merchant item", "gadget"],
      useCases: ["daily use", `${category.toLowerCase()} setup`],
      complementaryProductIds: ["PROD-ACC-001", "PROD-ACC-002"]
    });
  }

  return list;
}
