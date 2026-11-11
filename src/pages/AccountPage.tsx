import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, LogOut, User as UserIcon, Heart, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Order } from '../types';
import { ProductCard } from '../components/ProductCard';

interface AccountPageProps {
  onNavigate: (page: string) => void;
  onQuickView: (product: any) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onQuickView }) => {
  const { user, logout, token } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
          if (data.length > 0) setSelectedOrder(data[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingOrders(false));
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-[#151515]">ACCOUNT ACCESS</h2>
        <p className="text-xs text-[#858585]">
          Please sign in to view your orders, saved pieces, and delivery tracking.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          SIGN IN / REGISTER
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-bold">CONFIRMED</span>;
      case 'Processing':
        return <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-bold">PREPARING DISPATCH</span>;
      case 'Shipped':
        return <span className="text-purple-700 bg-purple-50 px-2.5 py-0.5 font-mono text-[10px] font-bold">IN TRANSIT</span>;
      case 'Delivered':
        return <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold">DELIVERED</span>;
      case 'Cancelled':
        return <span className="text-red-700 bg-red-50 px-2.5 py-0.5 font-mono text-[10px] font-bold">CANCELLED</span>;
      default:
        return <span className="text-neutral-700 bg-neutral-100 px-2.5 py-0.5 font-mono text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="border-b border-[#151515]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            COLLECTOR CLIENT DASHBOARD
          </span>
          <h1 className="font-cinzel text-3xl font-black text-[#151515]">
            WELCOME, {user.name.toUpperCase()}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="text-xs text-[#858585] hover:text-red-600 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#151515]/10 gap-6 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'border-[#B99A5B] text-[#151515] font-bold'
              : 'border-transparent text-[#858585] hover:text-[#151515]'
          }`}
        >
          My Acquisitions & Tracking ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'wishlist'
              ? 'border-[#B99A5B] text-[#151515] font-bold'
              : 'border-transparent text-[#858585] hover:text-[#151515]'
          }`}
        >
          Saved Wishlist ({wishlistItems.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#B99A5B] text-[#151515] font-bold'
              : 'border-transparent text-[#858585] hover:text-[#151515]'
          }`}
        >
          Profile & Security
        </button>
      </div>

      {/* Tab 1: Orders and Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="p-12 text-center text-xs font-mono text-[#858585]">
              Loading your acquisition records...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-[#151515]/10 p-12 text-center space-y-4">
              <Package className="w-10 h-10 text-[#858585] mx-auto stroke-1" />
              <h3 className="font-cinzel text-lg font-bold text-[#151515]">NO ACQUISITIONS FOUND</h3>
              <p className="text-xs text-[#858585] max-w-sm mx-auto">
                You have not placed any orders yet. Discover our latest Pokémon card and diecast arrivals.
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-2.5 bg-[#151515] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B99A5B] transition-colors"
              >
                DISCOVER THE COLLECTION
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Order List */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#858585] block">
                  ORDER HISTORY ({orders.length})
                </span>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 border transition-all cursor-pointer ${
                      selectedOrder?.id === order.id
                        ? 'border-[#B99A5B] bg-white shadow-sm ring-1 ring-[#B99A5B]'
                        : 'border-[#151515]/10 bg-white hover:border-[#151515]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#151515]">
                        #{order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#858585]">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="font-mono font-bold text-[#151515]">
                        ${order.total.toLocaleString()} USD
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-[#858585] truncate">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Tracking & Item Details */}
              <div className="lg:col-span-7">
                {selectedOrder ? (
                  <div className="bg-white border border-[#151515]/10 p-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#151515]/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-[#B99A5B] uppercase tracking-wider block">
                          ACQUISITION DOSSIER
                        </span>
                        <h3 className="font-mono text-base font-bold text-[#151515]">
                          Order #{selectedOrder.orderNumber}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedOrder.status)}
                        <span className="text-xs font-mono text-[#858585]">
                          {selectedOrder.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Visual Tracking Progress */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#858585] block">
                        COURIER PROGRESSION
                      </span>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                        <div className={`p-2 border ${['Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(selectedOrder.status) ? 'border-[#B99A5B] bg-[#B99A5B]/10 font-bold text-[#151515]' : 'border-neutral-200 text-neutral-400'}`}>
                          1. Confirmed
                        </div>
                        <div className={`p-2 border ${['Processing', 'Shipped', 'Delivered'].includes(selectedOrder.status) ? 'border-[#B99A5B] bg-[#B99A5B]/10 font-bold text-[#151515]' : 'border-neutral-200 text-neutral-400'}`}>
                          2. Vault Inspection
                        </div>
                        <div className={`p-2 border ${['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'border-[#B99A5B] bg-[#B99A5B]/10 font-bold text-[#151515]' : 'border-neutral-200 text-neutral-400'}`}>
                          3. In Transit
                        </div>
                        <div className={`p-2 border ${selectedOrder.status === 'Delivered' ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-800' : 'border-neutral-200 text-neutral-400'}`}>
                          4. Delivered
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#858585] block">
                        ITEMS IN THIS SHIPMENT
                      </span>
                      <div className="divide-y divide-[#151515]/5 border border-[#151515]/10">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-contain bg-[#F7F7F5] border border-[#151515]/10 p-1"
                              />
                              <div>
                                <h4 className="font-semibold text-[#151515]">{item.name}</h4>
                                <span className="text-[11px] text-[#858585] font-mono">
                                  Qty: {item.quantity} · ${(item.price).toLocaleString()} each
                                </span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-[#151515]">
                              ${(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Billing Info */}
                    <div className="bg-[#F7F7F5] p-4 text-xs space-y-2 border border-[#151515]/10">
                      <div className="flex justify-between">
                        <span className="text-[#858585]">Recipient:</span>
                        <span className="font-semibold text-[#151515]">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#858585]">Contact:</span>
                        <span className="font-mono text-[#151515]">{selectedOrder.phone} · {selectedOrder.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#858585]">Delivery Address:</span>
                        <span className="text-[#151515]">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.country}</span>
                      </div>
                      {selectedOrder.notes && (
                        <div className="flex justify-between pt-1 border-t border-[#151515]/10">
                          <span className="text-[#858585]">Notes:</span>
                          <span className="text-[#151515] italic">{selectedOrder.notes}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-[#151515]/10 flex justify-between font-bold text-sm">
                        <span>Total Paid:</span>
                        <span className="font-mono text-[#B99A5B]">${selectedOrder.total.toLocaleString()} USD</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-[#858585] bg-white border border-[#151515]/10">
                    Select an order from the list to view tracking details.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistItems.length === 0 ? (
            <div className="bg-white border border-[#151515]/10 p-12 text-center space-y-4">
              <Heart className="w-10 h-10 text-[#858585] mx-auto stroke-1" />
              <h3 className="font-cinzel text-lg font-bold text-[#151515]">YOUR WISHLIST IS EMPTY</h3>
              <p className="text-xs text-[#858585] max-w-sm mx-auto">
                Save rare pieces and limited editions by clicking the heart icon on any product card.
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-2.5 bg-[#151515] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B99A5B] transition-colors"
              >
                BROWSE THE CATALOG
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile & Security */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white border border-[#151515]/10 p-6 space-y-6">
          <h3 className="font-cinzel text-base font-bold text-[#151515] border-b border-[#151515]/10 pb-3">
            COLLECTOR PROFILE SETTINGS
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#858585] mb-1">Full Legal Name</label>
              <input
                type="text"
                disabled
                value={user.name}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[#858585] mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[#858585] mb-1">Contact Phone</label>
              <input
                type="text"
                disabled
                value={user.phone || 'Not configured'}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515]"
              />
            </div>
            <div>
              <label className="block text-[#858585] mb-1">Account Role</label>
              <span className="font-mono uppercase font-bold text-[#B99A5B]">
                {user.role === 'admin' ? 'Curator Administrator' : 'Verified Collector'}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
