import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, AlertTriangle, Check, X } from 'lucide-react';
import { Product } from '../../types';

interface AdminProductsProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
  onViewProductOnStore: (productId: string) => void;
  onRefreshProducts: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProductOnStore,
  onRefreshProducts
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(deleteCandidate.id);
      setDeleteCandidate(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151515]/70 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-cinzel text-base font-bold text-[#151515]">CONFIRM PRODUCT REMOVAL</h3>
            </div>
            <p className="text-xs text-[#858585] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#151515]">&quot;{deleteCandidate.name}&quot;</strong> from the ZHONGKUI catalog? This action will remove all recorded vault images and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 border border-[#151515]/20 text-xs font-semibold text-[#858585] hover:text-[#151515]"
                disabled={isDeleting}
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {isDeleting ? 'DELETING...' : 'YES, PERMANENTLY REMOVE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#151515]/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            CATALOG INVENTORY
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
            PRODUCT DIRECTORY ({products.length})
          </h1>
        </div>
        <button
          onClick={onAddProduct}
          className="px-5 py-2.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#151515]/10 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#858585] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand, category..."
            className="w-full text-xs bg-transparent focus:outline-none text-[#151515]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="p-1 text-[#858585]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-[#858585]">CATEGORY:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7F7F5] border border-[#151515]/15 px-2.5 py-1.5 font-medium text-[#151515] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <span className="font-mono text-[#858585] ml-2">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7F5] border border-[#151515]/15 px-2.5 py-1.5 font-medium text-[#151515] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#151515]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#151515]/10 bg-[#F7F7F5] text-[10px] font-mono uppercase text-[#858585]">
                <th className="py-3 px-4">Item & Provenance</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Price (USD)</th>
                <th className="py-3 px-4">Vault Stock</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515]/5">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[#F7F7F5]/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-12 h-12 object-contain bg-[#F7F7F5] border border-[#151515]/10 p-1 shrink-0"
                      />
                      <div className="max-w-xs">
                        <h4 className="font-semibold text-[#151515] truncate">{product.name}</h4>
                        <span className="text-[10px] text-[#858585] font-mono">
                          {product.images?.length || 1} photos {product.featured && '· ★ Featured'} {product.rareCollection && '· ✦ Rare Vault'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#858585]">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#151515]">
                    {product.brand}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#151515]">
                    ${product.price.toLocaleString()}
                    {product.discountPrice && (
                      <span className="block text-[10px] text-emerald-700">
                        Disc: ${product.discountPrice.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {product.stock <= 0 ? (
                      <span className="text-red-600 font-bold uppercase">0 (Sold Out)</span>
                    ) : product.stock <= 3 ? (
                      <span className="text-amber-700 font-bold">{product.stock} units (Low)</span>
                    ) : (
                      <span className="text-[#151515]">{product.stock} units</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <span className="px-2 py-0.5 bg-[#F7F7F5] border border-[#151515]/10 font-mono text-[#151515]">
                      {product.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold ${
                      product.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                      product.status === 'draft' ? 'bg-neutral-100 text-neutral-600' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewProductOnStore(product.id)}
                        className="p-1.5 text-[#858585] hover:text-[#151515] transition-colors"
                        title="View on store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 text-[#858585] hover:text-[#B99A5B] transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(product)}
                        className="p-1.5 text-[#858585] hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
