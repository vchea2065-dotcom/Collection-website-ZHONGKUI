import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onNavigate: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { items, itemCount, subtotal, shippingFee, total, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 300;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#151515]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#151515]/10 flex items-center justify-between bg-[#F7F7F5]">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-[#151515]">SHOPPING BAG</span>
              <span className="text-xs font-mono text-[#858585] bg-white px-2 py-0.5 border border-[#151515]/10 rounded-sm">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#858585] hover:text-[#151515] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-[#151515] text-white text-xs">
            {remainingForFree > 0 ? (
              <p className="flex justify-between items-center mb-1.5 font-medium">
                <span>Add <strong className="text-[#B99A5B]">${remainingForFree.toFixed(0)}</strong> for free insured shipping</span>
                <span className="font-mono text-[#858585]">${subtotal.toFixed(0)} / $300</span>
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-[#B99A5B] font-medium mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B99A5B]" />
                <span>You unlocked complimentary insured courier!</span>
              </p>
            )}
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#B99A5B] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#151515]/5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[#F7F7F5] flex items-center justify-center mb-4 text-[#858585]">
                  <ShieldCheck className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#151515] mb-1">YOUR BAG IS EMPTY</h3>
                <p className="text-xs text-[#858585] max-w-xs mb-6">
                  Explore our curated inventory of vintage Pokémon cards, PSA slabs, and premium diecast models.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="px-6 py-2.5 bg-[#151515] text-white text-xs font-semibold tracking-wider hover:bg-[#B99A5B] transition-colors"
                >
                  DISCOVER COLLECTION
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const effectivePrice = product.discountPrice ?? product.price;
                return (
                  <div key={product.id} className="py-4 flex gap-4">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-20 h-20 object-cover bg-[#F7F7F5] rounded-xs border border-[#151515]/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-wider text-[#B99A5B]">
                            {product.brand}
                          </p>
                          <h4
                            onClick={() => {
                              setIsCartOpen(false);
                              onNavigate(`product-${product.id}`);
                            }}
                            className="text-xs font-semibold text-[#151515] line-clamp-2 hover:text-[#B99A5B] cursor-pointer transition-colors"
                          >
                            {product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[#858585] hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#151515]">
                          ${effectivePrice.toLocaleString()}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[10px] font-mono text-[#858585] line-through">
                            ${product.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[10px] text-[#858585]">· {product.condition}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-[#151515]/15 bg-white">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-[#F7F7F5] text-[#151515] transition-colors"
                            disabled={quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-medium">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-[#F7F7F5] text-[#151515] transition-colors"
                            disabled={quantity >= product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-mono font-semibold text-[#151515]">
                          ${(effectivePrice * quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#151515]/10 bg-[#F7F7F5] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#858585]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#151515]">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#858585]">
                  <span>Insured Courier</span>
                  <span className="font-mono text-[#151515]">
                    {shippingFee === 0 ? (
                      <span className="text-[#B99A5B] font-medium">COMPLIMENTARY</span>
                    ) : (
                      `$${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#151515] pt-2 border-t border-[#151515]/10">
                  <span className="font-cinzel tracking-wider">ESTIMATED TOTAL</span>
                  <span className="font-mono text-[#B99A5B]">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('checkout');
                  }}
                  className="w-full py-3 bg-[#151515] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#B99A5B] transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-sm"
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('cart');
                  }}
                  className="w-full py-2.5 bg-white border border-[#151515]/20 text-[#151515] text-xs font-semibold tracking-wider hover:bg-[#F7F7F5] transition-colors cursor-pointer"
                >
                  VIEW FULL CART
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#858585] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>Museum-grade bubble & acrylic vault packaging</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
