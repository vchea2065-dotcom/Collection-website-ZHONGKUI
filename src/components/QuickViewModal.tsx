import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onNavigate
}) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  if (!isOpen || !product) return null;

  const currentImage = selectedImage || product.mainImage;
  const effectivePrice = product.discountPrice ?? product.price;
  const isSoldOut = product.stock <= 0 || product.status === 'sold_out';

  const handleAdd = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151515]/70 backdrop-blur-xs">
      <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#151515]/10 flex flex-col md:flex-row relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#858585] hover:text-[#151515] bg-white/80 hover:bg-white rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Gallery */}
        <div className="w-full md:w-1/2 p-6 bg-[#F7F7F5] flex flex-col justify-between">
          <div className="aspect-square w-full flex items-center justify-center overflow-hidden border border-[#151515]/10 bg-white p-4">
            <img
              src={currentImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 shrink-0 border p-1 bg-white transition-all ${
                    currentImage === img
                      ? 'border-[#B99A5B] ring-1 ring-[#B99A5B]'
                      : 'border-[#151515]/10 hover:border-[#151515]/40'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specs & Buy */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B99A5B] mb-1">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
            </div>

            <h3 className="font-cinzel text-lg font-bold text-[#151515] leading-snug mb-2">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xl font-mono font-bold text-[#151515] tabular-nums">
                ${effectivePrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-sm font-mono text-[#858585] line-through tabular-nums">
                  ${product.price.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                {product.condition}
              </span>
            </div>

            <p className="text-xs text-[#858585] leading-relaxed line-clamp-3 mb-4">
              {product.description}
            </p>

            {/* Quick Specs Snapshot */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-[#F7F7F5] p-3 border border-[#151515]/10 text-xs space-y-1.5 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#858585] block font-semibold">
                  AUTHENTIC SPECIFICATIONS
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  {Object.entries(product.specifications).slice(0, 4).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[#858585]">{key}: </span>
                      <span className="font-medium text-[#151515]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-[#151515]/10">
            {!isSoldOut ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#151515]/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs hover:bg-[#F7F7F5]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-xs hover:bg-[#F7F7F5]"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-[#B99A5B]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Bag · ${(effectivePrice * quantity).toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="py-2.5 bg-neutral-100 text-neutral-500 text-center text-xs font-mono uppercase tracking-wider border border-neutral-200">
                Item Archived / Sold Out
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                onNavigate(`product-${product.id}`);
              }}
              className="w-full text-xs text-[#858585] hover:text-[#151515] font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 py-1 transition-colors"
            >
              <span>View Full Provenance & Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#858585]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B99A5B]" />
              <span>Includes tamper-evident seal & certificate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
