'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PriceCategory {
  label: string;
  maxPrice: number;
}

const PRICE_TIERS: PriceCategory[] = [
  { label: 'Under ₹199', maxPrice: 199 },
  { label: 'Under ₹499', maxPrice: 499 },
  { label: 'Under ₹999', maxPrice: 999 },
  { label: 'Under ₹1999', maxPrice: 1999 },
  { label: 'Premium Gifts', maxPrice: 99999 },
];

const PRICE_PRODUCTS = [
  {
    name: 'Love Pearl Oyster Necklace',
    price: 'Rs. 349.00',
    slug: 'love-pearl-oyster-necklace',
    image: '/images/giftify/products/love-pearl-necklace.jpg',
    tier: 'Under ₹499',
  },
  {
    name: 'Personalized Wooden Engraving Gift',
    price: 'Rs. 399.00',
    slug: 'personalized-wooden-engraving-gift',
    image: '/images/giftify/products/wooden-engraving-gift.jpg',
    tier: 'Under ₹499',
  },
  {
    name: 'Birthday Currency Note',
    price: 'Rs. 650.00',
    slug: 'birthday-currency-note',
    image: '/images/giftify/products/birthday-currency-note.jpg',
    tier: 'Under ₹999',
  },
  {
    name: '3D Crystal Photo Cube',
    price: 'Rs. 899.00',
    slug: '3d-crystal-photo-cube',
    image: '/images/giftify/products/3d-crystal-photo-cube.jpg',
    tier: 'Under ₹999',
  },
  {
    name: 'Heat Activated Magic Necklace',
    price: 'Rs. 999.00',
    slug: 'heat-activated-magic-photo-necklace',
    image: '/images/giftify/products/heat-activated-necklace.jpg',
    tier: 'Under ₹999',
  },
  {
    name: 'Light Sculpted Couple Ring',
    price: 'Rs. 1,499.00',
    slug: 'light-sculpted-couple-ring',
    image: '/images/giftify/products/couple-ring.jpg',
    tier: 'Under ₹1999',
  },
  {
    name: 'Long Distance Touch Bracelet for Couples',
    price: 'Rs. 7,499.00',
    slug: 'touch-distance-couple-bracelet',
    image: '/images/giftify/products/touch-vibration-bracelet.jpg',
    tier: 'Premium Gifts',
  },
];

export default function ShopByPrice() {
  const [activeTier, setActiveTier] = useState<string>('all');

  const filtered =
    activeTier === 'all'
      ? PRICE_PRODUCTS
      : PRICE_PRODUCTS.filter((p) => p.tier === activeTier);

  return (
    <section className="bg-white py-14 border-b border-stone-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5 Big Yellow Price Cards matching Giftify frame 020 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-12 max-w-6xl mx-auto">
          {PRICE_TIERS.map((tier) => (
            <button
              key={tier.label}
              onClick={() => setActiveTier(activeTier === tier.label ? 'all' : tier.label)}
              className={`bg-[#F5C400] text-black aspect-square rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 ${
                activeTier === tier.label ? 'border-black ring-4 ring-black/20' : 'border-transparent'
              }`}
            >
              <span className="text-sm sm:text-base font-semibold block text-stone-900 mb-1">
                {tier.label.startsWith('Under') ? 'Under' : ''}
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-none">
                {tier.label.startsWith('Under') ? tier.label.replace('Under ', '') : tier.label}
              </span>
            </button>
          ))}
        </div>

        {/* Section Heading: Trending Gifts by Price */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Trending Gifts by Price
          </h2>
          {activeTier !== 'all' && (
            <div className="mt-2">
              <span className="inline-block bg-[#F5C400] text-black text-xs font-bold px-3 py-1 rounded-full">
                Filtering: {activeTier}
              </span>
              <button
                onClick={() => setActiveTier('all')}
                className="ml-2 text-xs text-stone-500 underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {filtered.map((prod) => (
            <Link
              key={prod.name}
              href={`/product/${prod.slug}`}
              className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group p-2.5 sm:p-3"
            >
              <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50 mb-2">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                  unoptimized
                />
              </div>

              <div className="p-2 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#F5C400] text-[10px] mb-1">
                    <span>★★★★★</span>
                    <span className="text-stone-500 font-bold">4.9</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 mb-1 group-hover:text-[#A58200] transition-colors leading-snug">
                    {prod.name}
                  </h3>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-stone-900 mt-2">
                  {prod.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

