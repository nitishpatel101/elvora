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
    { label: 'All Curations', value: 'all' },
    { label: 'Couple Bracelets', value: 'couple-bracelets' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Earrings', value: 'earrings' },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? initialProducts
      : initialProducts.filter((p) => p.categorySlug === activeCategory);

  return (
    <section className="py-20 lg:py-24 bg-[#F8F5F0] border-b border-[#E8DCCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A65] font-medium block">
            THE CATALOGUE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] font-light mt-1.5 tracking-tight">
            CURATED FOR YOU
          </h2>
          <p className="text-xs sm:text-sm text-[#6B655D] mt-3 font-light leading-relaxed">
            Discover pieces designed to make every connection special.
          </p>

          {/* Minimalist Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-[11px] uppercase tracking-[0.2em] px-4 py-2 transition-all duration-200 border ${
                  activeCategory === cat.value
                    ? 'bg-[#111111] text-[#FFFFFF] border-[#111111]'
                    : 'bg-transparent text-[#6B655D] border-[#E8DCCD] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-[#111111] text-[#111111] px-9 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#111111] hover:text-[#FFFFFF] transition-all duration-300"
          >
            <span>DISCOVER COMPLETE VAULT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
