'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Sparkles, Eye } from 'lucide-react';
import { Product } from '@/types';

interface BestSellersSectionProps {
  initialProducts?: Product[];
}

const BEST_SELLERS = [
  {
    slug: 'touch-distance-couple-bracelet',
    name: 'Long Distance Touch Vibration Bracelet for Couples',
    price: 'Rs. 7,499.00',
    originalPrice: 'Rs. 12,999.00',
    rating: '4.9',
    reviews: '44',
    badge: 'Couples Favorite',
    image: '/images/products/touch-distance-couple-bracelet/product-1.jpg',
  },
  {
    slug: 'heat-activated-magic-photo-necklace',
    name: 'Heat Activated Magic Photo Reveal Necklace',
    price: 'Rs. 999.00',
    originalPrice: 'Rs. 1,999.00',
    rating: '4.8',
    reviews: '54',
    badge: 'Secret Locket',
    image: '/images/giftify/products/heat-activated-necklace.jpg',
  },
  {
    slug: 'birthday-currency-note',
    name: 'Personalized Birthday Currency Note Keepsake',
    price: 'Rs. 650.00',
    originalPrice: 'Rs. 1,299.00',
    rating: '4.9',
    reviews: '82',
    badge: 'Birthday Bestseller',
    image: '/images/giftify/products/birthday-currency-note.jpg',
  },
  {
    slug: 'love-pearl-oyster-necklace',
    name: 'Love Pearl Genuine Oyster Opening Necklace Kit',
    price: 'Rs. 349.00',
    originalPrice: 'Rs. 699.00',
    rating: '4.8',
    reviews: '31',
    badge: 'Top Gift',
    image: '/images/giftify/products/love-pearl-necklace.jpg',
  },
  {
    slug: '3d-crystal-photo-cube',
    name: 'Illuminated 3D Crystal Photo Cube with Rotating LED',
    price: 'Rs. 2,999.00',
    originalPrice: 'Rs. 4,999.00',
    rating: '5.0',
    reviews: '67',
    badge: 'Glow Keepsake',
    image: '/images/giftify/products/3d-crystal-photo-cube.jpg',
  },
  {
    slug: 'hug-bracelet',
    name: '"Give You A Hug" Adjustable Silver Bracelet',
    price: 'Rs. 999.00',
    originalPrice: 'Rs. 1,599.00',
    rating: '4.8',
    reviews: '39',
    badge: 'Special Touch',
    image: '/images/giftify/products/hug-bracelet.jpg',
  },
];

export default function BestSellersSection({ initialProducts }: BestSellersSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayItems =
    initialProducts && initialProducts.length > 0
      ? initialProducts.map((p, idx) => ({
          slug: p.slug,
          name: p.name,
          price: `Rs. ${p.price.toLocaleString('en-IN')}.00`,
          originalPrice: `Rs. ${(Math.round(p.price * 1.5)).toLocaleString('en-IN')}.00`,
          rating: '4.9',
          reviews: String(30 + (idx * 11)),
          badge: idx === 0 ? 'Bestseller' : 'Sale',
          image: p.images[0] || '/images/giftify/products/touch-vibration-bracelet.jpg',
        }))
      : BEST_SELLERS;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="bestsellers" className="bg-white py-12 sm:py-16 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Circle Arrows */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A58200] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Top Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-[#F5C400] hover:border-[#F5C400] hover:text-black transition-all shadow-xs cursor-pointer"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-stone-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-[#F5C400] hover:border-[#F5C400] hover:text-black transition-all shadow-xs cursor-pointer"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-stone-700" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {displayItems.map((item) => (
            <Link
              key={item.slug}
              href={`/product/${item.slug}`}
              className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer snap-start"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square w-full bg-stone-50 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="288px"
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                  unoptimized
                />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {item.badge}
                  </span>
                </div>

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-x-3 bottom-3 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="w-full bg-[#F5C400] text-black font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" /> View Details
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex text-[#F5C400]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F5C400]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-stone-600">
                      {item.rating} ({item.reviews})
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 mb-2 group-hover:text-[#A58200] transition-colors leading-snug">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 pt-2 border-t border-stone-100">
                  <span className="text-sm sm:text-base font-extrabold text-stone-900">
                    {item.price}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    {item.originalPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
