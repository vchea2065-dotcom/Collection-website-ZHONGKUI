import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = ['Charizard', 'INNO64 Skyline', 'Liberty Walk', 'PSA 10', 'RX-78-2 Gundam', 'Hot Wheels RLC'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#151515]/70 backdrop-blur-xs">
      <div className="bg-white max-w-2xl w-full shadow-2xl border border-[#151515]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#151515]/10 flex items-center gap-3 bg-[#F7F7F5]">
          <Search className="w-5 h-5 text-[#858585] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pokémon cards, PSA grades, INNO64, LBWK models..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder-[#858585] text-[#151515]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#858585] hover:text-[#151515]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono uppercase text-[#858585] hover:text-[#151515] px-2 py-1 border border-[#151515]/10 bg-white"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="space-y-3 py-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#858585] block">
                POPULAR SEARCHES
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 bg-[#F7F7F5] border border-[#151515]/10 text-[#151515] hover:border-[#B99A5B] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="py-8 text-center text-xs text-[#858585] font-mono">
              Searching ZHONGKUI Vault catalog...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <p className="text-sm font-semibold text-[#151515]">No collectibles found for &quot;{query}&quot;</p>
              <p className="text-xs text-[#858585]">Try searching for Charizard, INNO64, or Gundam.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#151515]/5">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onNavigate(`product-${product.id}`);
                  }}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-[#F7F7F5] px-2 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-12 h-12 object-contain bg-white border border-[#151515]/10 shrink-0 p-1"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase text-[#B99A5B] tracking-wider">
                        {product.brand} · {product.category}
                      </div>
                      <h4 className="text-xs font-semibold text-[#151515] truncate group-hover:text-[#B99A5B] transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-[#858585]">{product.condition}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-[#151515]">
                      ${(product.discountPrice ?? product.price).toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#858585] group-hover:text-[#B99A5B] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
