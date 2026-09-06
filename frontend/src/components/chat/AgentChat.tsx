import React, { useState } from 'react';
import { AgentResponse, AuditLog } from '../../types';
import { Bot, Send, Sparkles, ChevronDown, ChevronUp, ShoppingBag, ShieldCheck, ArrowRight, RefreshCcw, Check, Plus, Trash2 } from 'lucide-react';
import { FinancialApprovalGate } from '../checkout/FinancialApprovalGate';

interface AgentChatProps {
  onSendMessage: (msg: string) => void;
  onApprove: () => void;
  onConversationalRemoveCase: () => void;
  agentState: AgentResponse | null;
  isLoading: boolean;
  logs: AuditLog[];
}

export const AgentChat: React.FC<AgentChatProps> = ({
  onSendMessage,
  onApprove,
  onConversationalRemoveCase,
  agentState,
  isLoading
}) => {
  const [input, setInput] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const samplePrompts = [
    "I need wireless headphones under ₹5000 for working from home.",
    "Find me a birthday gift for my brother under ₹3000.",
    "I need a gaming setup under ₹1 lakh.",
    "I need a work-from-home desk setup."
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] rounded-2xl border border-[#232f48] overflow-hidden text-slate-100 shadow-xl">
      
      {/* Header */}
      <div className="bg-[#151c2e] p-4 border-b border-[#232f48] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">RazorAgent Autonomous Commerce Assistant</h2>
            <p className="text-xs text-slate-400">Tool-calling AI Agent • Bound Financial Safety Enabled</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Financial Safety Boundaries Active</span>
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Welcome Banner if no agent response yet */}
        {!agentState && (
          <div className="text-center py-10 px-4 space-y-4 max-w-xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">RazorAgent Commerce Assistant</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your shopping intent below. RazorAgent uses tool calling to search catalog items, compare products, recommend complementary upsells, and calculate draft orders.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Try Judge Starter Queries:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt)}
                    className="p-3 rounded-xl bg-[#151c2e] hover:bg-[#1e293b] border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 transition flex items-center justify-between group"
                  >
                    <span>"{prompt}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Agent State Display */}
        {agentState && (
          <div className="space-y-4 max-w-3xl mx-auto">
            
            {/* Reasoning Steps Accordion */}
            {agentState.reasoningSteps && (
              <div className="bg-[#151c2e] border border-cyan-500/25 rounded-xl overflow-hidden text-xs">
                <button
                  onClick={() => setShowReasoning(!showReasoning)}
                  className="w-full px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold flex items-center justify-between border-b border-cyan-500/20 transition"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Agent Tool Calling & Reasoning Timeline</span>
                  </div>
                  {showReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showReasoning && (
                  <div className="p-3.5 font-mono text-[11px] text-slate-300 space-y-2 bg-slate-950/70">
                    <p className="text-slate-300 leading-relaxed">{agentState.reasoningSteps}</p>

                    {/* Tool Badges */}
                    {agentState.toolsCalled && agentState.toolsCalled.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                        <span className="text-[10px] text-slate-500 font-sans font-bold">Tools Invoked:</span>
                        {agentState.toolsCalled.map((tool, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                            {tool}()
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Agent Text Response Card */}
            <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-5 text-sm space-y-3 text-slate-200 leading-relaxed shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Bot className="w-4 h-4" />
                <span>RazorAgent Commerce Employee Response:</span>
              </div>
              <div className="whitespace-pre-line font-sans text-slate-200 leading-relaxed">
                {agentState.textResponse}
              </div>
            </div>

            {/* Product Card if Recommended */}
            {agentState.recommendedProduct && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={agentState.recommendedProduct.imageUrl}
                  alt={agentState.recommendedProduct.name}
                  className="w-24 h-24 object-cover rounded-xl border border-slate-800 bg-slate-950"
                />
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      Primary Match ({agentState.recommendedProduct.category})
                    </span>
                    <span className="font-mono text-sm font-bold text-white">₹{agentState.recommendedProduct.price.toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{agentState.recommendedProduct.name}</h4>
                  <p className="text-slate-400 line-clamp-2">{agentState.recommendedProduct.description}</p>
                  {agentState.recommendedProduct.keyFeatures && (
                    <div className="text-[11px] text-slate-300 pt-1 font-mono">
                      Features: {agentState.recommendedProduct.keyFeatures}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Intelligent Upsell Card */}
            {agentState.proposedUpsell && (
              <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      Merchant Intelligent Upsell Recommendation
                    </span>
                    <span className="font-mono text-sm font-bold text-amber-300">+₹{agentState.proposedUpsell.price.toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{agentState.proposedUpsell.name}</h4>
                  <p className="text-slate-400">{agentState.proposedUpsell.description}</p>
                  
                  {/* Conversational Action shortcut */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={onConversationalRemoveCase}
                      className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 hover:border-rose-500/30 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Conversational Remove ("Remove the case")</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Safety Approval Gate */}
            {agentState.requiresUserApproval && agentState.cart && (
              <FinancialApprovalGate
                cart={agentState.cart}
                onApprove={onApprove}
                isLoading={isLoading}
              />
            )}

          </div>
        )}

      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#151c2e] border-t border-[#232f48] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your shopping request (e.g., 'I need wireless headphones under ₹5000' or 'Remove the case')..."
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition disabled:opacity-50 text-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
