import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  onFailure: (reason: string) => void;
  amount: number;
  razorpayOrderId?: string;
  simulateFailure: boolean;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
  amount,
  razorpayOrderId = 'order_Nz9812471',
  simulateFailure
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAuthorizePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (simulateFailure) {
        onFailure('PAYMENT_DECLINED_BY_BANK: Simulated payment failure for hackathon demo testing.');
      } else {
        const paymentId = 'pay_' + Math.random().toString(36).substring(2, 12);
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch (e) {
          // ignore if confetti fails
        }
        onSuccess(paymentId);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151c2e] border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Razorpay Brand Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white tracking-wider shadow-lg shadow-blue-600/30">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">Razorpay <span className="text-blue-400 font-normal text-xs">Checkout</span></h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                TEST MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">Order Ref: <span className="font-mono text-slate-300">{razorpayOrderId}</span></p>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex items-center justify-between mb-5">
          <div>
            <span className="text-xs text-slate-400">Authorized Merchant Charge</span>
            <div className="text-xl font-black text-white font-mono mt-0.5">₹{amount.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              INR ₹ Currency
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold text-slate-300 block">Select Razorpay Test Payment Method:</label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                paymentMethod === 'upi'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>UPI / QR</span>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                paymentMethod === 'card'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Test Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition ${
                paymentMethod === 'netbanking'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Netbanking</span>
            </button>
          </div>
        </div>

        {simulateFailure && (
          <div className="mb-4 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg flex items-center gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Failure Demo Mode active: Authorization will trigger bank failure recovery.</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAuthorizePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white py-3 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Authorizing with Razorpay...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Complete Test Payment (₹{amount.toLocaleString()})</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
