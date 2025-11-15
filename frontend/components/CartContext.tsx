'use client';

import { createContext, useState, ReactNode } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, name: string, price: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (productId: string, name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        return prev.map(p => p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { productId, name, price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) return prev.filter(p => p.productId !== productId);
      return prev.map(p => p.productId === productId ? { ...p, quantity } : p);
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}