import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2, QrCode, Building2, Banknote, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { KhqrModal } from '../components/KhqrModal';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderPlaced }) => {
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Phnom Penh');
  const [country, setCountry] = useState('Cambodia');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ABA_BANK' | 'KHQR' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY'>('ABA_BANK');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [showKhqrModal, setShowKhqrModal] = useState(false);

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-[#151515]">YOUR BAG IS EMPTY</h2>
        <p className="text-xs text-[#858585]">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#151515] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B99A5B] transition-colors"
        >
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !email || !phone || !address) {
      setError('Please complete all recipient and delivery address fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        email,
        phone,
        address,
        city,
        country,
        notes,
        paymentMethod,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.discountPrice ?? i.product.price,
          quantity: i.quantity,
          image: i.product.mainImage
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('zk_token') ? { Authorization: `Bearer ${localStorage.getItem('zk_token')}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setCreatedOrder(data);
      clearCart();
      onOrderPlaced(data);

      if (paymentMethod === 'ABA_BANK' || paymentMethod === 'KHQR') {
        setShowKhqrModal(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed successfully
  if (createdOrder && !showKhqrModal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block">
            ORDER SECURED & RECORDED
          </span>
          <h2 className="font-cinzel text-3xl font-black text-[#151515]">
            THANK YOU FOR YOUR ACQUISITION
          </h2>
          <p className="text-xs text-[#858585] max-w-md mx-auto">
            Order <strong className="font-mono text-[#151515]">#{createdOrder.orderNumber}</strong> has been logged into the vault dispatch registry. A confirmation email and tracking link have been dispatched to <strong>{createdOrder.email}</strong>.
          </p>
        </div>

        <div className="bg-white border border-[#151515]/10 p-6 text-left text-xs space-y-3">
          <div className="flex justify-between border-b border-[#151515]/10 pb-2">
            <span className="text-[#858585]">Delivery Recipient:</span>
            <span className="font-semibold text-[#151515]">{createdOrder.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-[#151515]/10 pb-2">
            <span className="text-[#858585]">Phone Contact:</span>
            <span className="font-mono text-[#151515]">{createdOrder.phone}</span>
          </div>
          <div className="flex justify-between border-b border-[#151515]/10 pb-2">
            <span className="text-[#858585]">Delivery Address:</span>
            <span className="text-[#151515]">{createdOrder.address}, {createdOrder.city}, {createdOrder.country}</span>
          </div>
          <div className="flex justify-between border-b border-[#151515]/10 pb-2">
            <span className="text-[#858585]">Payment Method:</span>
            <span className="font-bold text-[#151515]">{createdOrder.paymentMethod.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold">
            <span className="font-cinzel">Total Settled:</span>
            <span className="font-mono text-[#B99A5B]">${createdOrder.total.toLocaleString()} USD</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            onClick={() => onNavigate('account')}
            className="px-6 py-3 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            TRACK ORDER IN ACCOUNT
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-white border border-[#151515]/20 text-xs font-bold text-[#151515] uppercase tracking-wider hover:bg-[#F7F7F5]"
          >
            CONTINUE BROWSING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* KHQR Modal Overlay for Cambodia Payment Processing */}
      {createdOrder && (
        <KhqrModal
          order={createdOrder}
          isOpen={showKhqrModal}
          onClose={() => setShowKhqrModal(false)}
          onPaymentSuccess={() => {
            setShowKhqrModal(false);
          }}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#151515]/10 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            SECURE VAULT DISPATCH
          </span>
          <h1 className="font-cinzel text-3xl font-black text-[#151515]">
            CHECKOUT
          </h1>
        </div>
        <button
          onClick={() => onNavigate('cart')}
          className="text-xs font-mono text-[#858585] hover:text-[#151515] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO BAG</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Recipient, Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Recipient Information */}
            <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#151515] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#151515] text-white flex items-center justify-center text-[10px] font-mono">1</span>
                <span>RECIPIENT & CONTACT DETAILS</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#858585] mb-1 font-medium">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sothea Sok"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#858585] mb-1 font-medium">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+855 12 345 678"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#858585] mb-1 font-medium">Email Address (for Certificate & Invoices) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@example.com"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#151515] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#151515] text-white flex items-center justify-center text-[10px] font-mono">2</span>
                <span>DELIVERY DESTINATION</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[#858585] mb-1 font-medium">Street Address / Condo / Building *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Unit #, Street name, Sangkat"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#858585] mb-1 font-medium">City / District *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Phnom Penh, Siem Reap, etc."
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#858585] mb-1 font-medium">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  >
                    <option value="Cambodia">Cambodia (Local Delivery)</option>
                    <option value="Singapore">Singapore (DHL Express)</option>
                    <option value="Thailand">Thailand (DHL Express)</option>
                    <option value="Japan">Japan (EMS International)</option>
                    <option value="United States">United States (FedEx Insured)</option>
                    <option value="Other">Other Global Destination</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#858585] mb-1 font-medium">Special Courier Notes / Gate Code (Optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call upon arrival, fragile package handling"
                    className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Cambodia Payment Method */}
            <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#151515] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#151515] text-white flex items-center justify-center text-[10px] font-mono">3</span>
                <span>SELECT PAYMENT METHOD</span>
              </h3>

              <div className="space-y-3">
                {/* ABA Bank KHQR */}
                <label className={`block p-4 border transition-all cursor-pointer ${
                  paymentMethod === 'ABA_BANK'
                    ? 'border-[#B99A5B] bg-[#B99A5B]/5 ring-1 ring-[#B99A5B]'
                    : 'border-[#151515]/15 hover:border-[#151515]/40 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'ABA_BANK'}
                        onChange={() => setPaymentMethod('ABA_BANK')}
                        className="accent-[#B99A5B]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#151515]">ABA Bank & Bakong KHQR</span>
                          <span className="bg-[#E01A22] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">INSTANT</span>
                        </div>
                        <p className="text-[11px] text-[#858585] mt-0.5">
                          Instant scan with ABA Mobile, Bakong, or any Cambodian bank app.
                        </p>
                      </div>
                    </div>
                    <QrCode className="w-5 h-5 text-[#B99A5B]" />
                  </div>
                </label>

                {/* Direct Bank Wire */}
                <label className={`block p-4 border transition-all cursor-pointer ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-[#B99A5B] bg-[#B99A5B]/5 ring-1 ring-[#B99A5B]'
                    : 'border-[#151515]/15 hover:border-[#151515]/40 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={() => setPaymentMethod('BANK_TRANSFER')}
                        className="accent-[#B99A5B]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#151515]">Direct Bank Wire / SWIFT</span>
                        <p className="text-[11px] text-[#858585] mt-0.5">
                          Bank transfer to ZHONGKUI Treasury ABA Account. Verified within 1 business day.
                        </p>
                      </div>
                    </div>
                    <Building2 className="w-5 h-5 text-[#858585]" />
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`block p-4 border transition-all cursor-pointer ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-[#B99A5B] bg-[#B99A5B]/5 ring-1 ring-[#B99A5B]'
                    : 'border-[#151515]/15 hover:border-[#151515]/40 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'CASH_ON_DELIVERY'}
                        onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                        className="accent-[#B99A5B]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#151515]">Cash On Delivery (COD)</span>
                        <p className="text-[11px] text-[#858585] mt-0.5">
                          Pay upon delivery inspection (Available within Phnom Penh metropolitan area).
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-[#858585]" />
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Confirmation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
              <h3 className="font-cinzel text-base font-bold text-[#151515] border-b border-[#151515]/10 pb-3">
                ORDER REVIEW
              </h3>

              {/* Items summary */}
              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-[#151515]/5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-2 first:pt-0 flex gap-3 items-center">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-12 h-12 object-contain bg-[#F7F7F5] border border-[#151515]/10 p-1 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-[#151515] truncate">
                        {product.name}
                      </h4>
                      <div className="text-[10px] text-[#858585] font-mono">
                        Qty: {quantity} × ${(product.discountPrice ?? product.price).toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#151515]">
                      ${((product.discountPrice ?? product.price) * quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="pt-3 border-t border-[#151515]/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#858585]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#151515]">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#858585]">
                  <span>Insured Courier</span>
                  <span className="font-mono text-[#151515]">
                    {shippingFee === 0 ? <span className="text-[#B99A5B] font-semibold">FREE</span> : `$${shippingFee}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#151515]/10 flex justify-between text-base font-bold text-[#151515]">
                  <span className="font-cinzel">FINAL TOTAL</span>
                  <span className="font-mono text-[#B99A5B]">${total.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>AUTHORIZING VAULT ORDER...</span>
                  ) : (
                    <span>CONFIRM & PLACE ORDER</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-[10px] text-[#858585] space-y-1 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#B99A5B]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ZHONGKUI 100% Provenance Seal Guarantee</span>
                </div>
                <p>Orders are dispatched within 24 hours in tamper-evident crush-proof cartons.</p>
              </div>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
};
