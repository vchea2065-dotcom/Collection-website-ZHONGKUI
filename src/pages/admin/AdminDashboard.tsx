import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { Product, Order } from '../../types';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onEditProduct: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab, onEditProduct }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('zk_token');
      const res = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('zk_token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#858585]">
        Aggregating vault statistics & orders...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            EXECUTIVE OVERVIEW
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
            VAULT METRICS & ACTIVITY
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateTab('add-product')}
            className="px-4 py-2 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            + ADD NEW PRODUCT
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white border border-[#151515]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-[#858585]">
            <span className="text-xs font-mono uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#B99A5B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#151515] tabular-nums">
            ${(stats?.totalRevenue || 0).toLocaleString()} <span className="text-xs font-normal text-[#858585]">USD</span>
          </div>
          <p className="text-[10px] text-[#858585]">Settled transactions</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#151515]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-[#858585]">
            <span className="text-xs font-mono uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#B99A5B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#151515] tabular-nums">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-[10px] text-[#858585]">Across all payment channels</p>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-[#151515]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-[#858585]">
            <span className="text-xs font-mono uppercase tracking-wider">Active Products</span>
            <Package className="w-4 h-4 text-[#B99A5B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#151515] tabular-nums">
            {stats?.totalProducts || 0}
          </div>
          <p className="text-[10px] text-[#858585]">{stats?.soldOutCount || 0} archived / sold out</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#151515]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-mono uppercase tracking-wider">Low Stock Watch</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-700 tabular-nums">
            {stats?.lowStockCount || 0} <span className="text-xs font-normal text-[#858585]">items</span>
          </div>
          <p className="text-[10px] text-[#858585]">Under 4 units remaining</p>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders and Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-[#151515]/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#151515]/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B99A5B] block">
                ORDER DISPATCH QUEUE
              </span>
              <h3 className="font-cinzel text-base font-bold text-[#151515]">
                RECENT CLIENT ORDERS
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-[#151515] hover:text-[#B99A5B] flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#858585]">
              No orders placed yet. Orders will appear here in real time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#151515]/10 text-[10px] font-mono uppercase text-[#858585]">
                    <th className="py-2.5 px-2">Order #</th>
                    <th className="py-2.5 px-2">Customer</th>
                    <th className="py-2.5 px-2">Payment</th>
                    <th className="py-2.5 px-2">Total</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151515]/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F7F7F5]">
                      <td className="py-3 px-2 font-mono font-bold text-[#151515]">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-semibold text-[#151515]">{order.customerName}</div>
                        <div className="text-[10px] text-[#858585]">{order.phone}</div>
                      </td>
                      <td className="py-3 px-2 font-mono text-[11px]">
                        {order.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-[#151515]">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold ${
                          order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-[11px] bg-[#F7F7F5] border border-[#151515]/15 px-2 py-1 focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Low Stock Items */}
        <div className="lg:col-span-4 bg-white border border-[#151515]/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#151515]/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block">
                INVENTORY WATCH
              </span>
              <h3 className="font-cinzel text-base font-bold text-[#151515]">
                LOW STOCK ALERT
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-[#858585] hover:text-[#151515]"
            >
              All Items
            </button>
          </div>

          {stats?.lowStockItems?.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#858585]">
              All products are adequately stocked.
            </div>
          ) : (
            <div className="divide-y divide-[#151515]/5">
              {stats?.lowStockItems?.map((prod: Product) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-10 h-10 object-contain bg-[#F7F7F5] border border-[#151515]/10 p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#151515] truncate">{prod.name}</h4>
                      <span className="text-[10px] font-mono text-[#858585]">{prod.category}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-700 block">
                      {prod.stock} left
                    </span>
                    <button
                      onClick={() => onEditProduct(prod)}
                      className="text-[10px] text-[#B99A5B] hover:underline"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-[#151515]/10 text-xs">
            <button
              onClick={() => onNavigateTab('inventory')}
              className="w-full py-2 bg-[#F7F7F5] hover:bg-[#151515] hover:text-white text-[#151515] text-xs font-semibold uppercase tracking-wider transition-colors text-center"
            >
              MANAGE INVENTORY LEVELS
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
