import React from 'react';
import { AlertOctagon, RefreshCw, CreditCard, XCircle, ShieldAlert } from 'lucide-react';

interface FailureRecoveryModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onChangeMethod: () => void;
  onCancel: () => void;
  failureReason?: string;
}

export const FailureRecoveryModal: React.FC<FailureRecoveryModalProps> = ({
  isOpen,
  onRetry,
  onChangeMethod,
  onCancel,
  failureReason = 'PAYMENT_DECLINED_BY_BANK: Bank payment authorization failed.'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151c2e] border-2 border-rose-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-rose-300">Payment Failure Detected</h3>
            <p className="text-xs text-slate-400">Agentic Safety Recovery Layer Active</p>
          </div>
        </div>

        {/* Failure Explanation */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-rose-500/20 mb-5 text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Zero Money Debited</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Razorpay reported that your payment was not authorized by the issuing bank. The agent detected the failure and halted automated retries.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-300">
            Error: {failureReason}
          </div>
        </div>

        {/* 3 Safe Recovery Options */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300">Recommended Recovery Actions:</label>

          <button
            onClick={onRetry}
            className="w-full bg-cyan-500 hover:bg-cyan-400 font-bold text-xs text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>[Try Payment Again]</span>
          </button>

          <button
            onClick={onChangeMethod}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-xs text-slate-200 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>[Change Payment Method (UPI / Netbanking)]</span>
          </button>

          <button
            onClick={onCancel}
            className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 font-semibold text-xs text-rose-300 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>[Cancel Order Safely]</span>
          </button>
        </div>

      </div>
    </div>
  );
};
