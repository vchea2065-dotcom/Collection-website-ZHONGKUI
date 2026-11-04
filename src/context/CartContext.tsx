import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('zk_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1): { success: boolean; message?: string } => {
    if (product.stock <= 0 || product.status === 'sold_out') {
      return { success: false, message: 'This item is currently sold out.' };
    }

    let success = true;
    let message = 'Added to bag.';

    setItems(prevItems => {
      const existing = prevItems.find(i => i.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          success = false;
          message = `Cannot add more than ${product.stock} in stock.`;
          return prevItems;
        }
        return prevItems.map(i =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      } else {
        if (quantity > product.stock) {
          success = false;
          message = `Only ${product.stock} available.`;
          return prevItems;
        }
        return [...prevItems, { product, quantity }];
      }
    });

    if (success) {
      setIsCartOpen(true);
    }

    return { success, message };
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  // Insured premium worldwide shipping free over $300, else $25 flat
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 300 ? 0 : 25;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingFee,
        total,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
