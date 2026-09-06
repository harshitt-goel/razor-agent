import React, { useState } from 'react';
import { BuyerSimulatorResult } from '../../types';
import { Users, Play, CheckCircle2, ShoppingCart, DollarSign, Bot, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface BuyerSimulatorModalProps {
  results: BuyerSimulatorResult[];
  onRunSimulation: () => void;
  isLoading: boolean;
}

export const BuyerSimulatorModal: React.FC<BuyerSimulatorModalProps> = ({
  results,
  onRunSimulation,
  isLoading
}) => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>('BUYER-1');

  const totalSimulatedRevenue = results.reduce((acc, r) => acc + (r.purchaseCompleted ? r.totalCartValue : 0), 0);
  const totalUpsellsAccepted = results.filter(r => r.upsellAccepted).length;

  const currentResult = results.find(r => r.personaId === selectedPersona) || results[0];

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Title Header */}
      <div className="bg-[#151c2e] border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">AI Buyer Simulator Engine</h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full uppercase">
              Hackathon Multi-Persona Tester
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate 4 distinct autonomous customer shopping journeys to test agent reasoning, upsell conversion, and merchant revenue impact.
          </p>
        </div>

        <button
          onClick={onRunSimulation}
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Simulating Sessions...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Run All 4 Buyer Simulations</span>
            </>
          )}
        </button>
      </div>

      {/* Aggregate Growth Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Total Generated Revenue</span>
            <div className="text-xl font-black text-white font-mono">₹{totalSimulatedRevenue.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Upsell Adoption Rate</span>
            <div className="text-xl font-black text-amber-400 font-mono">
              {results.length > 0 ? `${((totalUpsellsAccepted / results.length) * 100).toFixed(0)}%` : '100%'}
            </div>
          </div>
        </div>

        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Authorized Payments</span>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {results.filter(r => r.purchaseCompleted).length} / {results.length} Sessions
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Persona Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {results.map((res) => (
          <button
            key={res.personaId}
            onClick={() => setSelectedPersona(res.personaId)}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
              selectedPersona === res.personaId
                ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-[#151c2e] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">{res.personaId}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Budget: ₹{res.budget.toLocaleString()}
                </span>
              </div>
              <h4 className="font-bold text-xs text-white line-clamp-1">{res.personaName}</h4>
            </div>

            <div className="text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span>Cart: ₹{res.totalCartValue.toLocaleString()}</span>
              <span className="text-emerald-400 font-bold">PAID</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detailed Selected Buyer Session Output */}
      {currentResult && (
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{currentResult.personaId}: {currentResult.personaName}</span>
              <h3 className="text-base font-bold text-white mt-0.5">"{currentResult.userPrompt}"</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Razorpay Payment ID:</span>
              <span className="font-mono text-xs text-cyan-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                {currentResult.razorpayPaymentId}
              </span>
            </div>
          </div>

          {/* Reasoning & Execution Summary */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Bot className="w-4 h-4" />
              <span>Agentic Workflow & Execution Summary:</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {currentResult.executionSummary}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold">Agent Tools Executed:</span>
              {currentResult.agentToolsUsed.map((tool, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                  {tool}()
                </span>
              ))}
            </div>
          </div>

          {/* Product Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Primary Product */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Primary Product Recommendation</span>
              <h4 className="font-bold text-white text-sm">{currentResult.primaryProductRecommended}</h4>
              <div className="font-mono text-cyan-300 text-xs">Price: ₹{currentResult.primaryProductPrice.toLocaleString()}</div>
            </div>

            {/* Intelligent Upsell */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Intelligent Complementary Upsell</span>
              <h4 className="font-bold text-white text-sm">{currentResult.upsellProductRecommended}</h4>
              <div className="font-mono text-amber-300 text-xs">Price: ₹{currentResult.upsellProductPrice.toLocaleString()} (Accepted ✓)</div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
