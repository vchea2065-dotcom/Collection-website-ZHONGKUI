import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, itemCount, subtotal, shippingFee, total, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-20 h-20 bg-white border border-[#151515]/10 rounded-full flex items-center justify-center mx-auto text-[#858585]">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="font-cinzel text-2xl font-bold text-[#151515]">YOUR SHOPPING BAG IS EMPTY</h2>
        <p className="text-xs text-[#858585] max-w-sm mx-auto">
          Explore our vault of PSA graded cards, vintage Pokémon booster boxes, and precision miniature diecasts.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold tracking-widest uppercase transition-colors"
        >
          DISCOVER VAULT CATALOG
        </button>
      </div>
    );
  }

  const freeShippingThreshold = 300;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-[#151515]/10 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            CHECKOUT PREPARATION
          </span>
          <h1 className="font-cinzel text-3xl font-black text-[#151515]">
            SHOPPING BAG ({itemCount})
          </h1>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="text-xs font-mono text-[#858585] hover:text-[#151515] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CONTINUE SHOPPING</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Itemized List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#151515]/10 divide-y divide-[#151515]/5">
            {items.map(({ product, quantity }) => {
              const effectivePrice = product.discountPrice ?? product.price;
              return (
                <div key={product.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  
                  <div className="flex gap-4 items-center min-w-0">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-20 h-20 object-contain bg-[#F7F7F5] border border-[#151515]/10 p-2 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#B99A5B] block">
                        {product.brand} · {product.category}
                      </span>
                      <h3
                        onClick={() => onNavigate(`product-${product.id}`)}
                        className="text-sm font-semibold text-[#151515] hover:text-[#B99A5B] cursor-pointer transition-colors truncate max-w-sm"
                      >
                        {product.name}
                      </h3>
                      <div className="mt-1 text-xs text-[#858585]">
                        <span>{product.condition}</span>
                        <span className="mx-1.5">·</span>
                        <span className="font-mono text-[#151515] font-semibold">
                          ${effectivePrice.toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#151515]/5">
                    <div className="flex items-center border border-[#151515]/15 bg-white">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 hover:bg-[#F7F7F5] transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-mono font-bold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:bg-[#F7F7F5] transition-colors"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-[#151515]">
                        ${(effectivePrice * quantity).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-[#858585] hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Insured courier notice */}
          <div className="bg-[#F7F7F5] border border-[#151515]/10 p-4 flex items-center gap-3 text-xs text-[#858585]">
            <ShieldCheck className="w-5 h-5 text-[#B99A5B] shrink-0" />
            <div>
              <span className="font-semibold text-[#151515]">Padded Vault Security Standard: </span>
              <span>All collectible cards and models are double-boxed with anti-static bubble wrap and security serial tags.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
            <h3 className="font-cinzel text-base font-bold text-[#151515] border-b border-[#151515]/10 pb-3">
              ORDER SUMMARY
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#858585]">
                <span>Items Subtotal</span>
                <span className="font-mono text-[#151515]">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#858585]">
                <span>Insured Global Freight</span>
                <span className="font-mono text-[#151515]">
                  {shippingFee === 0 ? (
                    <span className="text-[#B99A5B] font-semibold">FREE (Over $300)</span>
                  ) : (
                    `$${shippingFee}`
                  )}
                </span>
              </div>
              {remainingForFree > 0 && (
                <p className="text-[11px] text-[#B99A5B] font-mono pt-1">
                  Add ${remainingForFree.toFixed(0)} more for complimentary courier!
                </p>
              )}
              <div className="pt-3 border-t border-[#151515]/10 flex justify-between text-base font-bold text-[#151515]">
                <span className="font-cinzel">TOTAL</span>
                <span className="font-mono text-[#B99A5B]">${total.toLocaleString()} USD</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-[#858585] text-center space-y-1">
              <p>Cambodia ABA Bank & KHQR Supported</p>
              <p>Free tracking link sent upon confirmation</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
