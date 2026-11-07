'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import defaultOccasions from '../../../data/occasions.json';

interface OccasionItem {
  id?: string;
  name: string;
  emoji: string;
  image: string;
  href: string;
}

const OCCASION_PRODUCTS = [
  {
    slug: 'birthday-currency-note',
    name: 'Birthday Currency Note Keepsake',
    price: 'Rs. 650.00',
    originalPrice: 'Rs. 1,299.00',
    image: '/images/giftify/products/birthday-currency-note.jpg',
    onSale: true,
  },
  {
    slug: '3d-crystal-photo-cube',
    name: '3D Crystal Photo Cube with Rotating LED',
    price: 'Rs. 899.00',
    originalPrice: 'Rs. 1,249.00',
    image: '/images/giftify/products/3d-crystal-photo-cube.jpg',
    onSale: true,
  },
  {
    slug: 'feather-painting',
    name: 'Handcrafted Feather Painting Portrait',
    price: 'Rs. 2,500.00',
    originalPrice: 'Rs. 3,500.00',
    image: '/images/giftify/products/feather-painting.jpg',
    onSale: false,
  },
  {
    slug: 'personalized-wooden-engraving-gift',
    name: 'Personalized Wooden Engraving Gift',
    price: 'Rs. 399.00',
    originalPrice: 'Rs. 699.00',
    image: '/images/giftify/products/wooden-engraving-gift.jpg',
    onSale: false,
  },
];

export default function OccasionTrendingSection() {
  const [occasions, setOccasions] = useState<OccasionItem[]>(defaultOccasions);

  useEffect(() => {
    fetch('/api/occasions', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOccasions(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-stone-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Gifts by Occasion - 5 Cute 3D Yellow Cards */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A58200] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Celebrate Every Special Moment
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Gifts by Occasion
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 max-w-6xl mx-auto">
            {occasions.map((occ) => (
              <Link
                key={occ.name}
                href={occ.href}
                className="group flex flex-col items-center cursor-pointer text-center"
              >
                {/* 3D Character Card */}
                <div className="relative w-full aspect-[1.15/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300 border border-stone-200/80 bg-[#F5C400]">
                  <Image
                    src={occ.image}
                    alt={occ.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="text-sm">{occ.emoji}</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#A58200] transition-colors">
                    {occ.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. Trending Gifts in Occasion Category */}
        <div className="pt-8 border-t border-stone-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 text-center tracking-tight mb-8 sm:mb-12">
            Trending Gifts in Occasion Category
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {OCCASION_PRODUCTS.map((prod) => (
              <Link
                key={prod.slug}
                href={`/product/${prod.slug}`}
                className="group block flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-3 border border-stone-200/90 hover:border-[#F5C400] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50 mb-3 shadow-xs">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700"
                    unoptimized
                  />
                  {prod.onSale && (
                    <span className="absolute bottom-3 left-3 bg-[#F5C400] text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                      Sale 🔥
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[#F5C400] text-[10px] mb-1">
                    <span>★★★★★</span>
                    <span className="text-stone-500 font-bold">4.9</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#A58200] transition-colors leading-snug line-clamp-1">
                    {prod.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    {prod.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {prod.originalPrice}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                      {prod.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide shadow-md transition-transform hover:scale-105"
            >
              <span>View all products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3. Gifts made with ❤️ for you - Heartfelt Brand Note */}
        <div className="mt-20 pt-12 border-t border-stone-200 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-stone-900 mb-4">
            <span>Gifts made with</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
            <span>for you</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Finding the perfect gift for best friend? Choose from fun, emotional, and personalized keepsakes created to celebrate your bond. For your partner, discover thoughtful surprises when you need a gift for wife, husband, boyfriend, or girlfriend. From customized illuminated crystals and touch vibration bracelets to handmade keepsakes, we craft memories that last forever.
          </p>
        </div>
      </div>
    </section>
  );
}
