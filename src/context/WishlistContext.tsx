'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, WishlistItem } from '@/types';

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('elvora_wishlist');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load wishlist from storage', e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('elvora_wishlist', JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to save wishlist to storage', e);
      }
    }
  }, [items, mounted]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.productId === product.id);
      if (exists) {
        return prev.filter((item) => item.productId !== product.id);
      }
      return [
        ...prev,
        {
          productId: product.id,
          addedAt: new Date().toISOString(),
          product,
        },
      ];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        totalWishlist: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
