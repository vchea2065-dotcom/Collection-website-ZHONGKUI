import React, { useState } from 'react';
import { Boxes, AlertTriangle, Check, Plus, Minus, Search } from 'lucide-react';
import { Product } from '../../types';

interface AdminInventoryProps {
  products: Product[];
  onRefreshProducts: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ products, onRefreshProducts }) => {
  const [stockChanges, setStockChanges] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');

  const handleStockDelta = (productId: string, currentStock: number, delta: number) => {
    const currentPending = stockChanges[productId] ?? currentStock;
    const nextVal = Math.max(0, currentPending + delta);
    setStockChanges(prev => ({ ...prev, [productId]: nextVal }));
  };

  const handleSaveStock = async (product: Product) => {
    const newStock = stockChanges[product.id];
    if (newStock === undefined) return;

    setSavingId(product.id);
    try {
      const token = localStorage.getItem('zk_token');
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stock: newStock,
          status: newStock === 0 ? 'sold_out' : (product.status === 'sold_out' && newStock > 0 ? 'published' : product.status)
        })
      });

      if (res.ok) {
        onRefreshProducts();
        setStockChanges(prev => {
          const copy = { ...prev };
          delete copy[product.id];
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    if (filterType === 'low') return matchesSearch && p.stock > 0 && p.stock <= 3;
    if (filterType === 'out') return matchesSearch && (p.stock === 0 || p.status === 'sold_out');
    return matchesSearch;
  });

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 3).length;
  const soldOutCount = products.filter(p => p.stock === 0 || p.status === 'sold_out').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-[#151515]/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            VAULT QUANTITY AUDIT
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
            INVENTORY MANAGEMENT
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#151515] text-white'
              : 'bg-white border border-[#151515]/10 text-[#858585] hover:text-[#151515]'
          }`}
        >
          All Items ({products.length})
        </button>
        <button
          onClick={() => setFilterType('low')}
          className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterType === 'low'
              ? 'bg-amber-600 text-white'
              : 'bg-white border border-[#151515]/10 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low Stock Alert ({lowStockCount})</span>
        </button>
        <button
          onClick={() => setFilterType('out')}
          className={`px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer ${
            filterType === 'out'
              ? 'bg-red-700 text-white'
              : 'bg-white border border-[#151515]/10 text-red-700 hover:bg-red-50'
          }`}
        >
          Sold Out / Archived ({soldOutCount})
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#151515]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#151515]/10 bg-[#F7F7F5] text-[10px] font-mono uppercase text-[#858585]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current In-Stock</th>
                <th className="py-3 px-4">Adjustment Stepper</th>
                <th className="py-3 px-4 text-right">Commit Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515]/5">
              {filtered.map((product) => {
                const targetStock = stockChanges[product.id] ?? product.stock;
                const hasChanges = stockChanges[product.id] !== undefined && stockChanges[product.id] !== product.stock;

                return (
                  <tr key={product.id} className="hover:bg-[#F7F7F5]/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-10 h-10 object-contain bg-[#F7F7F5] border p-1"
                        />
                        <div>
                          <h4 className="font-semibold text-[#151515] truncate max-w-xs">{product.name}</h4>
                          <span className="text-[10px] font-mono text-[#858585]">{product.condition}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#858585]">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {product.stock <= 0 ? (
                        <span className="text-red-600 uppercase">0 (Sold Out)</span>
                      ) : product.stock <= 3 ? (
                        <span className="text-amber-700">{product.stock} units (Critical)</span>
                      ) : (
                        <span className="text-[#151515]">{product.stock} units</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#151515]/20 bg-white">
                          <button
                            onClick={() => handleStockDelta(product.id, product.stock, -1)}
                            className="p-1 hover:bg-[#F7F7F5]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className={`w-12 text-center font-mono font-bold ${hasChanges ? 'text-[#B99A5B] bg-amber-50' : 'text-[#151515]'}`}>
                            {targetStock}
                          </span>
                          <button
                            onClick={() => handleStockDelta(product.id, product.stock, 1)}
                            className="p-1 hover:bg-[#F7F7F5]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {hasChanges && (
                          <span className="text-[10px] text-[#B99A5B] font-mono font-semibold">
                            Pending Save
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {hasChanges && (
                        <button
                          onClick={() => handleSaveStock(product)}
                          disabled={savingId === product.id}
                          className="px-3 py-1.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-[11px] font-bold uppercase transition-colors"
                        >
                          {savingId === product.id ? 'Updating...' : 'Save Stock'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
