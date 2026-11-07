'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';

interface BestSellersSectionProps {
  initialProducts?: Product[];
}

const BEST_SELLERS = [
  {
    slug: 'heat-activated-magic-photo-necklace',
    name: 'Heat Activated Necklace - Magic Photo Necklace',
    price: 'Rs. 999.00',
    image: '/images/giftify/products/heat-activated-necklace.jpg',
  },
  {
    slug: 'love-pearl-oyster-necklace',
    name: 'Love Pearl Oyster Necklace',
    price: 'Rs. 349.00',
    image: '/images/giftify/products/love-pearl-necklace.jpg',
  },
  {
    slug: 'hug-bracelet',
    name: 'Hug Bracelet',
    price: 'Rs. 999.00',
    image: '/images/giftify/products/hug-bracelet.jpg',
  },
  {
    slug: 'light-sculpted-couple-ring',
    name: 'Light Sculpted "I Love You" Couple Ring',
    price: 'Rs. 1,499.00',
    image: '/images/giftify/products/couple-ring.jpg',
  },
  {
    slug: '3d-miniature',
    name: '3d Miniature Couple Figurine',
    price: 'Rs. 2,999.00',
    image: '/images/giftify/products/3d-miniature.jpg',
  },
  {
    slug: 'touch-distance-couple-bracelet',
    name: 'Long Distance Touch Vibration Bracelet for Couples',
    price: 'Rs. 7,499.00',
    image: '/images/giftify/products/touch-vibration-bracelet.jpg',
  },
];

export default function BestSellersSection({ initialProducts }: BestSellersSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayItems =
    initialProducts && initialProducts.length > 0
      ? initialProducts.map((p) => ({
          slug: p.slug,
          name: p.name,
          price: `Rs. ${p.price.toLocaleString('en-IN')}.00`,
          image: p.images[0] || '/images/giftify/products/touch-vibration-bracelet.jpg',
        }))
      : BEST_SELLERS;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-12 border-b border-stone-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Circle Arrows */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-12" /> {/* Spacer */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 text-center tracking-tight">
            Best Sellers
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 hover:border-stone-500 transition-colors shadow-xs"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-stone-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 hover:border-stone-500 transition-colors shadow-xs"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-stone-700" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
        >
          {displayItems.map((item) => (
            <Link
              key={item.slug}
              href={`/product/${item.slug}`}
              className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-square w-full bg-stone-50 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="288px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 mb-2 group-hover:text-[#DDB373] transition-colors leading-snug">
                  {item.name}
                </h3>
                <span className="text-sm sm:text-base font-bold text-stone-900">
                  {item.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
