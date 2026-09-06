import React from 'react';
import { Cart } from '../../types';
import { ShieldCheck, Lock, ArrowRight, ShoppingBag, Info } from 'lucide-react';

interface FinancialApprovalGateProps {
  cart: Cart;
  onApprove: () => void;
  isLoading: boolean;
}

export const FinancialApprovalGate: React.FC<FinancialApprovalGateProps> = ({
  cart,
  onApprove,
  isLoading
}) => {
  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#151c2e] to-slate-900 border-2 border-cyan-500/40 rounded-2xl p-5 shadow-2xl shadow-cyan-500/10 my-4 text-slate-100">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-cyan-300">Financial Safety Gate: Customer Approval Required</h4>
            <p className="text-[11px] text-slate-400">RazorAgent bounded action limit — Money is never debited without explicit consent</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase">
          Draft Cart Authorization
        </span>
      </div>

      {/* Itemized Cart Breakdown */}
      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 mb-4 space-y-2 text-xs">
        <div className="font-semibold text-slate-300 text-xs mb-2 flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
          <span>Itemized Breakdown:</span>
        </div>

        {cart.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-1 text-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.product.name}</span>
              {item.isUpsell && (
                <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  Intelligent Upsell
                </span>
              )}
            </div>
            <span className="font-mono text-slate-300">₹{item.product.price.toLocaleString()}</span>
          </div>
        ))}

        <div className="pt-2.5 mt-2 border-t border-slate-800 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono">₹{cart.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>GST Tax (18%)</span>
            <span className="font-mono">₹{cart.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-cyan-300 pt-1 border-t border-slate-800">
            <span>Authorized Total</span>
            <span className="font-mono text-cyan-400">₹{cart.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-2 text-[11px] text-slate-400 mb-4 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>
          Clicking <strong className="text-slate-200">"Approve & Pay with Razorpay"</strong> will initiate a Razorpay Test Mode transaction. You may conversationally ask the agent to remove or swap items prior to approving.
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onApprove}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
      >
        <ShieldCheck className="w-5 h-5 text-white" />
        <span>{isLoading ? 'Processing Order Authorization...' : `Approve & Pay ₹${cart.total.toLocaleString()} with Razorpay`}</span>
        <ArrowRight className="w-4 h-4 text-white" />
      </button>

    </div>
  );
};
