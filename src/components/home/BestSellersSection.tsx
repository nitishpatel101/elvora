'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';

interface BestSellersSectionProps {
  initialProducts: Product[];
}

export default function BestSellersSection({ initialProducts }: BestSellersSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { label: 'All Pieces', value: 'all' },
    { label: 'Couple Bracelets', value: 'couple-bracelets' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Earrings', value: 'earrings' },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? initialProducts
      : initialProducts.filter((p) => p.categorySlug === activeCategory);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#EAE5DE]">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exact AUrate Section Header */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE5DE] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal tracking-[0.22em] uppercase text-[#24332C]">
              BESTSELLERS
            </h2>
            <p className="text-xs text-[#708579] tracking-wider uppercase mt-1">
              Curated pieces designed to bring hearts closer
            </p>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-[10px] sm:text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 transition-all duration-200 border ${
                  activeCategory === cat.value
                    ? 'bg-[#24332C] text-white border-[#24332C] font-semibold'
                    : 'bg-white text-[#5C5852] border-[#EAE5DE] hover:border-[#24332C] hover:text-[#181818]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid: 4 columns across matching AUrate layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* AUrate Horizontal progress indicator bar below products */}
        <div className="mt-10 max-w-xs mx-auto">
          <div className="h-[2px] bg-[#EAE5DE] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-[#24332C]" />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#181818] hover:text-[#24332C] pb-1 border-b border-[#181818] hover:border-[#24332C] transition-all"
          >
            <span>SHOP ALL BESTSELLERS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
