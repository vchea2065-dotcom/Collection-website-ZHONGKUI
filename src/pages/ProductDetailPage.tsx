import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, Heart, ShieldCheck, ArrowLeft, Check, Truck, Award, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  productId: string;
  products: Product[];
  onNavigate: (page: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  onNavigate,
  onQuickView
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find(p => p.id === productId || p.slug === productId);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage('');
    setQuantity(1);
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-[#151515]">COLLECTIBLE NOT FOUND</h2>
        <p className="text-xs text-[#858585]">
          The item you requested may have been archived or moved to private treaty.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-[#151515] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B99A5B] transition-colors"
        >
          RETURN TO CATALOG
        </button>
      </div>
    );
  }

  const currentImage = selectedImage || product.mainImage;
  const effectivePrice = product.discountPrice ?? product.price;
  const isWishlisted = isInWishlist(product.id);
  const isSoldOut = product.stock <= 0 || product.status === 'sold_out';

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs font-mono text-[#858585] border-b border-[#151515]/10 pb-4">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1.5 hover:text-[#151515] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO CATALOG</span>
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span>ZHONGKUI</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[#151515] truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section: Two Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Gallery & Viewport */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-4/3 w-full bg-white border border-[#151515]/10 p-6 flex items-center justify-center overflow-hidden shadow-xs">
            {product.condition && (
              <div className="absolute top-4 left-4 z-10 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 bg-[#151515] text-[#B99A5B] font-bold">
                {product.condition}
              </div>
            )}
            
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-colors ${
                isWishlisted
                  ? 'text-red-500 bg-[#F7F7F5]'
                  : 'text-[#858585] hover:text-[#151515] bg-[#F7F7F5]'
              }`}
              aria-label="Save to wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <img
              src={currentImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 p-2 bg-white shrink-0 border transition-all cursor-pointer ${
                    currentImage === img
                      ? 'border-[#B99A5B] ring-2 ring-[#B99A5B]/30'
                      : 'border-[#151515]/10 hover:border-[#151515]/40'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Curatorial Preservation Notes */}
          <div className="bg-[#F7F7F5] border border-[#151515]/10 p-5 space-y-3 mt-6">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#B99A5B]" />
              <span>ZHONGKUI VAULT AUTHENTICITY PLEDGE</span>
            </h4>
            <p className="text-xs text-[#858585] leading-relaxed">
              Every graded trading card and scale miniature in the ZHONGKUI catalog undergoes microscopic surface inspection. Cards are cross-checked against official PSA, BGS, or CGC online certification registries. Scale diecast models are inspected for intact tamper seals and mirror finishes.
            </p>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (PDP) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B99A5B] mb-1.5">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#151515] leading-snug">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-[#151515]/10">
              <span className="text-3xl font-mono font-bold text-[#151515] tabular-nums">
                ${effectivePrice.toLocaleString()} <span className="text-xs font-normal text-[#858585]">USD</span>
              </span>
              {product.discountPrice && (
                <span className="text-base font-mono text-[#858585] line-through tabular-nums">
                  ${product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Stock & Condition Status */}
          <div className="flex items-center justify-between text-xs font-mono py-2 bg-white px-3 border border-[#151515]/10">
            <span className="text-[#858585]">Condition Status:</span>
            <span className="font-bold text-[#151515]">{product.condition}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono py-2 bg-white px-3 border border-[#151515]/10">
            <span className="text-[#858585]">Vault Inventory:</span>
            {isSoldOut ? (
              <span className="font-bold text-red-600 uppercase">Archived / Sold Out</span>
            ) : product.stock === 1 ? (
              <span className="font-bold text-amber-700">1 Unit in Stock (Vault Single)</span>
            ) : (
              <span className="font-bold text-emerald-700">{product.stock} Units Available</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider block">
              CURATORIAL DESCRIPTION
            </span>
            <p className="text-xs text-[#858585] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Purchase Actions */}
          {!isSoldOut ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#858585]">QTY:</span>
                <div className="flex items-center border border-[#151515]/20 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs hover:bg-[#F7F7F5]"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-xs hover:bg-[#F7F7F5]"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#858585] font-mono">
                  Total: ${(effectivePrice * quantity).toLocaleString()} USD
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-[#B99A5B]" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#B99A5B] hover:bg-[#a6894c] text-[#151515] text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>BUY NOW · DIRECT CHECKOUT</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-neutral-100 border border-neutral-300 text-center space-y-2">
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono">
                CURRENTLY ARCHIVED / SOLD OUT
              </p>
              <p className="text-[11px] text-[#858585]">
                Contact our concierge to register a sourcing request for similar authenticated pieces.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className="mt-2 text-xs font-semibold text-[#151515] underline hover:text-[#B99A5B]"
              >
                Inquire with Concierge
              </button>
            </div>
          )}

          {/* Specifications Table (Detailed Specs for Pokémon / Diecast) */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-4 border-t border-[#151515]/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#151515] font-bold block">
                AUTHENTIC SPECIFICATIONS SHEET
              </span>
              <div className="bg-white border border-[#151515]/10 divide-y divide-[#151515]/5">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="py-2.5 px-3 flex justify-between text-xs">
                    <span className="text-[#858585]">{key}</span>
                    <span className="font-medium text-[#151515] text-right font-mono">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Shipping Info */}
          <div className="pt-2 grid grid-cols-2 gap-3 text-xs text-[#858585]">
            <div className="flex items-center gap-2 bg-white p-2.5 border border-[#151515]/10">
              <Truck className="w-4 h-4 text-[#B99A5B] shrink-0" />
              <span>Complimentary over $300</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 border border-[#151515]/10">
              <Award className="w-4 h-4 text-[#B99A5B] shrink-0" />
              <span>Tamper-evident vault seal</span>
            </div>
          </div>
        </div>

      </div>

      {/* RELATED COLLECTIBLES */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#151515]/10 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
                COMPLEMENTARY PIECES
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-[#151515]">
                RELATED FROM SAME ARCHIVE
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-semibold text-[#151515] hover:text-[#B99A5B] uppercase tracking-wider"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
