import React, { useState, useEffect } from 'react';
import { AgentResponse, AnalyticsMetric, AuditLog, BuyerSimulatorResult } from './types';
import { api } from './services/api';
import { Header } from './components/common/Header';
import { AgentChat } from './components/chat/AgentChat';
import { ActivityTimeline } from './components/chat/ActivityTimeline';
import { MerchantGrowthDashboard } from './components/dashboard/MerchantGrowthDashboard';
import { BuyerSimulatorModal } from './components/simulator/BuyerSimulatorModal';
import { CatalogGridModal } from './components/catalog/CatalogGridModal';
import { RazorpayCheckoutModal } from './components/checkout/RazorpayCheckoutModal';
import { FailureRecoveryModal } from './components/checkout/FailureRecoveryModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'simulator' | 'catalog'>('chat');
  const [sessionId] = useState<string>(() => 'session-' + Math.random().toString(36).substring(2, 9));
  
  const [agentState, setAgentState] = useState<AgentResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<AnalyticsMetric | null>(null);
  const [simulatorResults, setSimulatorResults] = useState<BuyerSimulatorResult[]>([]);
  
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
    loadAuditTrail();
  }, []);

  const loadDashboard = async () => {
    const metrics = await api.getDashboardMetrics();
    setDashboardMetrics(metrics);
  };

  const loadAuditTrail = async () => {
    const logs = await api.getAuditTrail(sessionId);
    setAuditLogs(logs);
  };

  const handleSendMessage = async (msg: string) => {
    setIsLoading(true);
    const res = await api.sendChatMessage(sessionId, msg, simulateFailure);
    setAgentState(res);
    await loadAuditTrail();
    setIsLoading(false);
  };

  const handleApproveClick = () => {
    setIsRazorpayModalOpen(true);
  };

  const handleRazorpaySuccess = async (paymentId: string) => {
    setIsRazorpayModalOpen(false);
    setIsLoading(true);
    const res = await api.approveTransaction(sessionId, false);
    setAgentState(res);
    await loadAuditTrail();
    await loadDashboard();
    setIsLoading(false);
  };

  const handleRazorpayFailure = async (reason: string) => {
    setIsRazorpayModalOpen(false);
    setIsLoading(true);
    const res = await api.approveTransaction(sessionId, true);
    setAgentState(res);
    await loadAuditTrail();
    setIsFailureModalOpen(true);
    setIsLoading(false);
  };

  const handleConversationalRemoveCase = async () => {
    handleSendMessage('Remove the carrying case from my cart');
  };

  const handleRunSimulator = async () => {
    setIsLoading(true);
    const results = await api.runBuyerSimulator();
    setSimulatorResults(results);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      
      {/* Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        simulateFailure={simulateFailure}
        setSimulateFailure={setSimulateFailure}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <div className="lg:col-span-2 h-full">
              <AgentChat
                onSendMessage={handleSendMessage}
                onApprove={handleApproveClick}
                onConversationalRemoveCase={handleConversationalRemoveCase}
                agentState={agentState}
                isLoading={isLoading}
                logs={auditLogs}
              />
            </div>
            <div className="h-full">
              <ActivityTimeline logs={auditLogs} />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && dashboardMetrics && (
          <MerchantGrowthDashboard metrics={dashboardMetrics} />
        )}

        {activeTab === 'simulator' && (
          <BuyerSimulatorModal
            results={simulatorResults.length > 0 ? simulatorResults : [
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
            ]}
            onRunSimulation={handleRunSimulator}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogGridModal />
        )}

      </main>

      {/* Razorpay Test Mode Modal */}
      <RazorpayCheckoutModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        onSuccess={handleRazorpaySuccess}
        onFailure={handleRazorpayFailure}
        amount={agentState?.cart?.total || 5662}
        razorpayOrderId={agentState?.pendingOrder?.razorpayOrderId}
        simulateFailure={simulateFailure}
      />

      {/* Failure Scenario Recovery Modal */}
      <FailureRecoveryModal
        isOpen={isFailureModalOpen}
        onRetry={() => {
          setIsFailureModalOpen(false);
          setIsRazorpayModalOpen(true);
        }}
        onChangeMethod={() => {
          setIsFailureModalOpen(false);
          setIsRazorpayModalOpen(true);
        }}
        onCancel={() => {
          setIsFailureModalOpen(false);
        }}
        failureReason={agentState?.failureMessage}
      />

    </div>
  );
};
