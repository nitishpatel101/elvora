'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Sparkles,
  Shield,
  CircleDot,
  Gift,
  LayoutGrid,
} from 'lucide-react';

export default function CategoryStrip() {
  const categories = [
    {
      label: 'Couple Bracelets',
      href: '/shop/couple-bracelets',
      icon: HeartHandshake,
    },
    {
      label: "Women's Jewellery",
      href: '/shop?collection=women',
      icon: Sparkles,
    },
    {
      label: "Men's Jewellery",
      href: '/shop?collection=men',
      icon: Shield,
    },
    {
      label: 'Necklaces',
      href: '/shop/necklaces',
      icon: CircleDot,
    },
    {
      label: 'Gift Collections',
      href: '/shop?collection=gifts',
      icon: Gift,
    },
    {
      label: 'All Products',
      href: '/shop',
      icon: LayoutGrid,
    },
  ];

  return (
    <section className="bg-[#FFFFFF] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto scrollbar-none py-6 divide-x divide-[#EAE5DE]">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.href}
                className="flex-1 min-w-[150px] sm:min-w-[170px] flex flex-col items-center justify-center px-4 py-2 group text-center transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#5C5852] group-hover:text-[#24332C] group-hover:bg-[#EEF3F0] transition-colors mb-2">
                  <Icon className="w-5 h-5 stroke-[1.4]" />
                </div>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#181818] font-light group-hover:text-[#24332C] transition-colors">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
