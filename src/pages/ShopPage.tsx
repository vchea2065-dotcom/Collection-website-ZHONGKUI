import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  initialCategory?: string;
  onNavigate: (page: string) => void;
  onQuickView: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory = 'All',
  onNavigate,
  onQuickView
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  const categories = [
    'All',
    'Pokémon Cards',
    'PSA Graded Cards',
    'Premium Diecast Cars',
    'INNO64',
    'LBWK',
    'Hot Wheels',
    'Gundam',
    'Anime Figures',
    'Rare Collection',
    'New Arrivals'
  ];

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory === 'Rare Collection') {
      list = list.filter(p => p.rareCollection);
    } else if (selectedCategory === 'New Arrivals') {
      list = list.filter(p => p.newArrival);
    } else if (selectedCategory !== 'All') {
      list = list.filter(
        p => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      list = list.filter(p => p.brand === selectedBrand);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [products, selectedCategory, selectedBrand, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Slogan Header */}
      <div className="border-b border-[#151515]/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            ZHONGKUI CURATED CATALOG
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-[#151515]">
            {selectedCategory === 'All' ? 'ALL COLLECTIBLES' : selectedCategory.toUpperCase()}
          </h1>
        </div>
        <div className="text-xs font-mono text-[#858585]">
          Showing {filteredProducts.length} items in vault
        </div>
      </div>

      {/* Category Filter Pills (Functional Buttons/Tabs adhering to §1.A) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#151515] text-white shadow-xs'
                : 'bg-white border border-[#151515]/10 text-[#151515]/80 hover:border-[#151515]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Controls Bar: Brand, Sort, Mobile Toggle */}
      <div className="bg-white border border-[#151515]/10 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#858585] hidden sm:inline uppercase">BRAND:</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="text-xs bg-[#F7F7F5] border border-[#151515]/15 px-3 py-1.5 font-medium text-[#151515] focus:outline-none"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === 'All' ? 'All Brands' : b}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'All' || selectedBrand !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
              }}
              className="text-xs text-[#858585] hover:text-[#151515] flex items-center gap-1 ml-2 underline"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#858585]" />
          <span className="text-xs font-mono text-[#858585] hidden sm:inline uppercase">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-[#F7F7F5] border border-[#151515]/15 px-3 py-1.5 font-medium text-[#151515] focus:outline-none"
          >
            <option value="featured">Featured Curations</option>
            <option value="newest">Recently Acquired</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#151515]/10 p-16 text-center space-y-4">
          <SlidersHorizontal className="w-10 h-10 text-[#858585] mx-auto stroke-1" />
          <h3 className="font-cinzel text-lg font-bold text-[#151515]">NO COLLECTIBLES MATCH YOUR SELECTION</h3>
          <p className="text-xs text-[#858585] max-w-sm mx-auto">
            Try adjusting your category or brand filters to explore other rare items in our collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedBrand('All');
            }}
            className="px-6 py-2.5 bg-[#151515] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B99A5B] transition-colors"
          >
            VIEW ALL PRODUCTS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
  );
};
