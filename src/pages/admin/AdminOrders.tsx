import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Search, Filter, CheckCircle2, Truck, X, Clock, ExternalLink } from 'lucide-react';
import { Order } from '../../types';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('zk_token');
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const token = localStorage.getItem('zk_token');
      const body: any = { status };
      if (paymentStatus) body.paymentStatus = paymentStatus;

      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151515]/70 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full p-6 shadow-2xl border border-[#151515]/10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#151515]/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#B99A5B] block">
                  ORDER FULFILLMENT FILE
                </span>
                <h3 className="font-mono text-lg font-bold text-[#151515]">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#858585] hover:text-[#151515]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Modifiers */}
            <div className="grid grid-cols-2 gap-4 bg-[#F7F7F5] p-4 text-xs border border-[#151515]/10">
              <div>
                <label className="block text-[#858585] mb-1 font-mono">FULFILLMENT STAGE:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="w-full bg-white border border-[#151515]/15 p-2 font-semibold"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing (Vault Packing)</option>
                  <option value="Shipped">Shipped (Dispatched)</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[#858585] mb-1 font-mono">PAYMENT CLEARANCE:</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, selectedOrder.status, e.target.value)}
                  className="w-full bg-white border border-[#151515]/15 p-2 font-semibold"
                >
                  <option value="pending">Pending ABA Verification</option>
                  <option value="verified">Verified</option>
                  <option value="paid">Paid (Funds In Account)</option>
                  <option value="failed">Failed / Void</option>
                </select>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-xs space-y-2 border border-[#151515]/10 p-4">
              <div className="flex justify-between">
                <span className="text-[#858585]">Recipient Name:</span>
                <span className="font-semibold text-[#151515]">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858585]">Phone:</span>
                <span className="font-mono text-[#151515]">{selectedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858585]">Email:</span>
                <span className="text-[#151515]">{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#858585]">Delivery Address:</span>
                <span className="text-[#151515] text-right max-w-xs">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.country}</span>
              </div>
              {selectedOrder.notes && (
                <div className="flex justify-between pt-1 border-t border-[#151515]/5">
                  <span className="text-[#858585]">Special Courier Notes:</span>
                  <span className="text-[#151515] italic">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#858585] block">
                MANIFEST ITEMS
              </span>
              <div className="divide-y divide-[#151515]/5 border border-[#151515]/10">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-10 object-contain bg-[#F7F7F5] p-1 border" />
                      <div>
                        <span className="font-semibold text-[#151515]">{it.name}</span>
                        <span className="block text-[10px] text-[#858585] font-mono">
                          Qty: {it.quantity} × ${it.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#151515]">
                      ${(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="bg-[#F7F7F5] p-3 text-xs flex justify-between items-center font-bold">
              <span>Total Settlement ({selectedOrder.paymentMethod.replace('_', ' ')}):</span>
              <span className="font-mono text-base text-[#B99A5B]">${selectedOrder.total.toLocaleString()} USD</span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#151515] text-white text-xs font-bold uppercase hover:bg-[#B99A5B]"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#151515]/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            FULFILLMENT & REVENUE PIPELINE
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
            CUSTOMER ORDERS ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#151515]/10 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#858585] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, phone, or email..."
            className="w-full text-xs bg-transparent focus:outline-none text-[#151515]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[#858585]">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7F5] border border-[#151515]/15 px-3 py-1.5 font-medium text-[#151515] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#151515]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#151515]/10 bg-[#F7F7F5] text-[10px] font-mono uppercase text-[#858585]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515]/5">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F7F5]/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#151515]">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-[#858585] font-mono text-[11px]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#151515]">{order.customerName}</div>
                    <div className="text-[10px] text-[#858585]">{order.phone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div>{order.paymentMethod.replace('_', ' ')}</div>
                    <span className={`text-[10px] font-mono ${
                      order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#151515]">
                    ${order.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold ${
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-[#151515] hover:bg-[#B99A5B] text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
