export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  inventory: number;
  brand: string;
  imageUrl: string;
  rating: number;
  tags: string[];
  useCases: string[];
  complementaryProductIds: string[];
  keyFeatures?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isUpsell: boolean;
  upsellReason?: string;
  subtotal: number;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  totalItems: number;
}

export interface Order {
  id: string;
  sessionId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ORDER_CREATED' | 'PAYMENT_PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  amount: number;
  currency: string;
  containsUpsell: boolean;
  upsellValue: number;
  createdAt: string;
  failureReason?: string;
}

export interface AuditLog {
  id: number;
  sessionId: string;
  eventType: string;
  description: string;
  payloadJson: string;
  timestamp: string;
}

export interface AgentResponse {
  sessionId: string;
  textResponse: string;
  reasoningSteps: string;
  toolsCalled: string[];
  cart: Cart;
  recommendedProduct?: Product;
  proposedUpsell?: Product;
  requiresUserApproval: boolean;
  pendingOrder?: Order;
  isFailureScenario: boolean;
  failureMessage?: string;
}

export interface MetricPair {
  storefront: string;
  aiAgent: string;
  upliftPercentage: string;
}

export interface AnalyticsMetric {
  totalGmv: number;
  conversionRate: number;
  averageOrderValue: number;
  upsellAcceptanceRate: number;
  crossSellRate: number;
  revenuePerSession: number;
  aiAttributedRevenue: number;
  totalSessions: number;
  abandonedCarts: number;
  recoveredCarts: number;
  storefrontVsAgent: {
    conversion: MetricPair;
    aov: MetricPair;
    upsellRate: MetricPair;
    revPerSession: MetricPair;
  };
}

export interface BuyerSimulatorResult {
  personaId: string;
  personaName: string;
  userPrompt: string;
  budget: number;
  primaryProductRecommended: string;
  primaryProductPrice: number;
  upsellProductRecommended: string;
  upsellProductPrice: number;
  upsellAccepted: boolean;
  totalCartValue: number;
  purchaseCompleted: boolean;
  razorpayPaymentId: string;
  agentToolsUsed: string[];
  executionSummary: string;
}
