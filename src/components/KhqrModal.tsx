import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Copy, Check, Clock, AlertCircle, Shield } from 'lucide-react';
import { Order } from '../types';

interface KhqrModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
}

export const KhqrModal: React.FC<KhqrModalProps> = ({ order, isOpen, onClose, onPaymentSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('001 849 203 (ABA Bank)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'paid', status: 'Processing' })
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onPaymentSuccess(order.id);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151515]/70 backdrop-blur-xs">
      <div className="bg-white max-w-md w-full overflow-hidden shadow-2xl border border-[#151515]/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header with ABA / Bakong Brand Red / Dark Bar */}
        <div className="bg-[#00385F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-[#E01A22] flex items-center justify-center font-bold text-xs tracking-tighter">
              KHQR
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">ABA Bank / Bakong KHQR</h3>
              <p className="text-[10px] text-blue-200">National Bank of Cambodia Standard</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[#151515]">PAYMENT VERIFIED</h4>
            <p className="text-xs text-[#858585]">
              Thank you! Your payment of <strong>${order.total.toLocaleString()} USD</strong> has been received by ZHONGKUI Vault. Your items are now being prepared for armored dispatch.
            </p>
            <div className="pt-2 text-xs font-mono text-[#B99A5B]">
              Order #{order.orderNumber}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Merchant and Amount */}
            <div className="text-center pb-2 border-b border-[#151515]/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#858585]">MERCHANT</span>
              <p className="font-semibold text-sm text-[#151515]">ZHONGKUI PREMIUM COLLECTIBLES</p>
              <div className="mt-2 text-2xl font-mono font-bold text-[#151515]">
                ${order.total.toLocaleString()} <span className="text-xs font-normal text-[#858585]">USD</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative p-3 bg-white border-2 border-[#E01A22] rounded-lg shadow-inner">
                {/* Embedded High-Res KHQR Visual SVG */}
                <div className="w-48 h-48 bg-white flex flex-col items-center justify-center p-2 relative">
                  {/* Decorative QR Pattern */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                    {/* Corner Position Targets */}
                    <path d="M5,5 h24 v24 h-24 z M8,8 v18 h18 v-18 z M11,11 h12 v12 h-12 z" />
                    <path d="M71,5 h24 v24 h-24 z M74,8 v18 h18 v-18 z M77,11 h12 v12 h-12 z" />
                    <path d="M5,71 h24 v24 h-24 z M8,74 v18 h18 v-18 z M11,77 h12 v12 h-12 z" />
                    {/* Grid Pattern Dots */}
                    <rect x="34" y="8" width="4" height="4" />
                    <rect x="42" y="8" width="4" height="4" />
                    <rect x="54" y="8" width="8" height="4" />
                    <rect x="34" y="16" width="12" height="4" />
                    <rect x="50" y="16" width="4" height="4" />
                    <rect x="58" y="16" width="6" height="4" />
                    <rect x="34" y="24" width="4" height="8" />
                    <rect x="46" y="24" width="8" height="4" />
                    <rect x="8" y="34" width="8" height="4" />
                    <rect x="20" y="34" width="8" height="4" />
                    <rect x="36" y="34" width="16" height="4" />
                    <rect x="58" y="34" width="8" height="4" />
                    <rect x="74" y="34" width="12" height="4" />
                    <rect x="8" y="44" width="12" height="4" />
                    <rect x="28" y="44" width="4" height="8" />
                    <rect x="68" y="44" width="12" height="4" />
                    <rect x="84" y="44" width="8" height="4" />
                    <rect x="8" y="56" width="4" height="8" />
                    <rect x="18" y="54" width="8" height="4" />
                    <rect x="74" y="54" width="16" height="4" />
                    <rect x="34" y="64" width="8" height="4" />
                    <rect x="48" y="64" width="12" height="4" />
                    <rect x="68" y="64" width="4" height="8" />
                    <rect x="80" y="64" width="8" height="4" />
                    <rect x="34" y="76" width="16" height="4" />
                    <rect x="58" y="76" width="8" height="4" />
                    <rect x="74" y="76" width="12" height="4" />
                    <rect x="38" y="86" width="8" height="4" />
                    <rect x="52" y="86" width="14" height="4" />
                    <rect x="78" y="86" width="8" height="4" />
                  </svg>
                  {/* Center ABA / KHQR Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 bg-white p-0.5 rounded shadow-sm border border-[#E01A22] flex items-center justify-center">
                      <span className="text-[9px] font-black text-[#E01A22]">KHQR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#858585] font-mono">
                <Clock className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>Expires in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>
            </div>

            {/* ABA Bank Manual Transfer Option */}
            <div className="bg-[#F7F7F5] p-3 text-xs border border-[#151515]/10 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[#858585]">ABA Account Number:</span>
                <button
                  onClick={handleCopyAccount}
                  className="font-mono font-bold text-[#00385F] hover:text-[#B99A5B] flex items-center gap-1"
                >
                  <span>001 849 203 (USD)</span>
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858585]">Account Name:</span>
                <span className="font-medium text-[#151515]">ZHONGKUI COLLECTIBLES</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858585]">Payment Remark:</span>
                <span className="font-mono text-[#B99A5B] font-bold">{order.orderNumber}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-[11px] text-[#858585] space-y-1">
              <p className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#B99A5B] shrink-0" />
                <span>Scan with ABA Mobile, Bakong, ACLEDA, or any KHQR supported banking app.</span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSimulatePayment}
                disabled={isVerifying}
                className="w-full py-2.5 bg-[#00385F] hover:bg-[#002844] text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <span>Checking ABA Gateway...</span>
                ) : (
                  <span>Simulate Payment Approval</span>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 bg-white border border-[#151515]/20 text-xs text-[#858585] hover:text-[#151515]"
              >
                I will pay later (Order Confirmed)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
