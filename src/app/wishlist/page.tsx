'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#708579] font-medium block">
            PERSONAL REGISTRY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-1 tracking-tight">
            Your Private Wishlist
          </h1>
          <p className="text-xs text-[#5C5852] mt-2 font-light">
            Pieces saved for your collection or upcoming occasions.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] border border-[#EAE5DE] max-w-lg mx-auto p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#EEF3F0] flex items-center justify-center mx-auto text-[#24332C]">
              <Heart className="w-8 h-8 stroke-1" />
            </div>
            <h2 className="font-serif text-xl text-[#181818] font-light">Your wishlist is presently empty</h2>
            <p className="text-xs text-[#5C5852] leading-relaxed font-light">
              Explore our collections to save your favorite couple bracelets, necklaces, and earrings.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#24332C] text-white text-xs uppercase tracking-[0.2em] px-6 py-3 hover:bg-[#19241F] transition-colors font-medium"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ProductCard key={item.productId} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
