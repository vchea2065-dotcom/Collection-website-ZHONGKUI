import React, { useState } from 'react';
import { Eye, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const effectivePrice = product.discountPrice ?? product.price;
  const isWishlisted = isInWishlist(product.id);
  const isSoldOut = product.stock <= 0 || product.status === 'sold_out';

  return (
    <div className="group relative flex flex-col bg-white border border-[#151515]/10 hover:border-[#B99A5B]/50 transition-all duration-300 hover:shadow-lg">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F7F7F5]">
        {/* Condition tag */}
        {product.condition && (
          <div className="absolute top-3 left-3 z-10 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 bg-[#151515]/90 text-white backdrop-blur-xs">
            {product.condition}
          </div>
        )}

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 transition-all duration-200 ${
            isWishlisted
              ? 'text-red-500 bg-white/90 shadow-sm'
              : 'text-[#858585] hover:text-[#151515] bg-white/80 hover:bg-white'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <div
          onClick={() => onNavigate(`product-${product.id}`)}
          className="w-full h-full cursor-pointer flex items-center justify-center p-3"
        >
          {!imageError ? (
            <img
              src={product.mainImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#858585] p-4 text-center">
              <span className="font-cinzel text-xs text-[#B99A5B] font-bold">ZHONGKUI</span>
              <span className="text-[11px] mt-1">{product.category}</span>
            </div>
          )}
        </div>

        {/* Hover Quick View / Add to Bag Overlay bar */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 bg-white/95 hover:bg-white text-[#151515] text-[11px] font-semibold tracking-wider uppercase border border-[#151515]/15 flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          {!isSoldOut ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="py-2 px-3 bg-[#151515] hover:bg-[#B99A5B] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer"
              title="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="py-2 px-3 bg-neutral-200 text-neutral-500 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata line: Category & Brand */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#858585] uppercase tracking-wider mb-1 font-mono">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onNavigate(`product-${product.id}`)}
            className="text-sm font-semibold text-[#151515] line-clamp-2 hover:text-[#B99A5B] transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Stock Row */}
        <div className="pt-2 border-t border-[#151515]/5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-mono font-bold text-[#151515] tabular-nums">
              ${effectivePrice.toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="text-xs font-mono text-[#858585] line-through tabular-nums">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono">
            {isSoldOut ? (
              <span className="text-red-600 font-semibold uppercase">Archived</span>
            ) : product.stock === 1 ? (
              <span className="text-amber-700 font-medium">1 in vault</span>
            ) : (
              <span className="text-[#858585]">{product.stock} available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
