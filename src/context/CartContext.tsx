'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string, selectedColour?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string, selectedVariant?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalInr: number;
  shippingInr: number;
  grandTotalInr: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DOMESTIC_SHIPPING_INR = 99; // Standard paid express shipping

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('elvora_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('elvora_cart', JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to save cart to storage', e);
      }
    }
  }, [items, mounted]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariant?: string,
    selectedColour?: string
  ) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedVariant === (selectedVariant || product.variants?.[0]?.name)
      );

      if (existingIdx >= 0) {
        const copy = [...prev];
        const newQty = copy[existingIdx].quantity + quantity;
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: Math.min(newQty, product.stock),
        };
        return copy;
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
          selectedVariant: selectedVariant || product.variants?.[0]?.name,
          selectedColour: selectedColour || product.colours[0],
        },
      ];
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number, selectedVariant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedVariant === selectedVariant) {
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stock),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedVariant?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedVariant === selectedVariant)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalInr = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  // Paid shipping is applied whenever there are items in the cart
  const shippingInr = items.length > 0 ? DOMESTIC_SHIPPING_INR : 0;
  const grandTotalInr = subtotalInr + shippingInr;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotalInr,
        shippingInr,
        grandTotalInr,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

