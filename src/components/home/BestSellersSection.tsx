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
    <section className="py-20 bg-[#F8F6F2] border-b border-[#E7E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A69] font-medium block">
            Client Favorites
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light mt-1">
            Bestselling Creations
          </h2>
          <p className="text-xs text-[#77736D] mt-3">
            Handcrafted with meticulous precision, designed for enduring elegance and meaningful connection.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-xs uppercase tracking-[0.16em] px-4 py-2 border transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-transparent text-[#171717] border-[#E7E1D8] hover:border-[#B89A69]'
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

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-[#171717] text-[#171717] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#171717] hover:text-white transition-all duration-300"
          >
            <span>View Full Jewellery Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
