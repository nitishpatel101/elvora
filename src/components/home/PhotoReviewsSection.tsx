'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  // Original 4 Giftify Reviews (Restored in High Quality)
  {
    id: 'orig-1',
    image: '/images/giftify/reviews/panda-lamp.jpg',
    title: 'Wonderful and beautifful',
    stars: 5,
    author: 'Sangram Ambrale',
    product: 'Panda Night Lamp',
  },
  {
    id: 'orig-2',
    image: '/images/giftify/reviews/family-merge-art.jpg',
    title: 'The edit is fantastic',
    stars: 5,
    author: 'Sindhuja',
    product: 'Family Merge Art',
  },
  {
    id: 'orig-3',
    image: '/images/giftify/reviews/birthday-currency-note.jpg',
    title: 'Absolutely beautiful original note.',
    stars: 5,
    author: 'Prakash',
    product: 'Birthday Currency Note',
  },
  {
    id: 'orig-4',
    image: '/images/giftify/reviews/projection-bracelet.jpg',
    title: 'Worth it!',
    stars: 5,
    author: 'Ritu Sharma',
    product: 'Photo Projection Bracelet...',
  },

  // 9 New Real Customer Rating Reviews (Laptop Downloads)
  {
    id: 'r-1',
    image: '/images/reviews/rating-1.jpg',
    title: 'Looks so classy on the wrist!',
    stars: 5,
    author: 'Ananya & Kabir',
    product: 'Touch Couple Bracelet',
  },
  {
    id: 'r-2',
    image: '/images/reviews/rating-2.jpg',
    title: 'Unboxing was a pure luxury feeling',
    stars: 5,
    author: 'Priya Sharma',
    product: 'Long Distance Couple Set',
  },
  {
    id: 'r-3',
    image: '/images/reviews/rating-3.jpg',
    title: 'Glowing touch pendant is magical',
    stars: 5,
    author: 'Rohan Verma',
    product: 'Touch Vibration Pendant',
  },
  {
    id: 'r-4',
    image: '/images/reviews/rating-4.jpg',
    title: 'Sun & Moon gold chain looks royal',
    stars: 5,
    author: 'Sneha Patel',
    product: 'Sun & Moon Couple Bracelet',
  },
  {
    id: 'r-5',
    image: '/images/reviews/rating-5.jpg',
    title: 'Superb packaging & quality',
    stars: 5,
    author: 'Aakash & Tanya',
    product: 'Charge For Love Set',
  },
  {
    id: 'r-6',
    image: '/images/reviews/rating-6.jpg',
    title: 'Loved the finish & shine',
    stars: 5,
    author: 'Pooja Hegde',
    product: 'Couple Locket Set',
  },
  {
    id: 'r-7',
    image: '/images/reviews/rating-7.jpg',
    title: 'Best gift for long distance',
    stars: 5,
    author: 'Nikhil & Simran',
    product: 'Touch Vibration Bracelet',
  },
  {
    id: 'r-8',
    image: '/images/reviews/rating-8.jpg',
    title: '100% genuine and authentic',
    stars: 5,
    author: 'Divya Rao',
    product: 'Couple Bracelet Set',
  },
  {
    id: 'r-9',
    image: '/images/reviews/rating-9.jpg',
    title: 'Pure magic when it vibrates!',
    stars: 5,
    author: 'Arjun Mehta',
    product: 'Touch Distance Bracelet',
  },
];

export default function PhotoReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-14 border-b border-stone-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Star Rating */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Reviews
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="flex items-center text-stone-900">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-stone-900 text-stone-900" />
              ))}
            </div>
            <span className="text-sm font-bold text-stone-900 ml-1">
              4.88 ★ (1,569)
            </span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-300 shadow-md flex items-center justify-center hover:bg-stone-50 z-20"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-300 shadow-md flex items-center justify-center hover:bg-stone-50 z-20"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5 text-stone-700" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 px-2 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group p-2.5 sm:p-3 snap-start"
              >
                {/* Real Customer Photo */}
                <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-stone-100 overflow-hidden mb-3">
                  <Image
                    src={rev.image}
                    alt={rev.title}
                    fill
                    sizes="288px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <span className="absolute top-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <span>✓</span>
                    <span>Verified Buyer</span>
                  </span>
                </div>

                {/* Review Text */}
                <div className="p-2 flex flex-col items-center text-center flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs sm:text-sm mb-1.5 line-clamp-2">
                      &ldquo;{rev.title}&rdquo;
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F5C400] text-[#F5C400]" />
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 w-full">
                    <span className="text-xs font-extrabold text-stone-900 block">
                      {rev.author}
                    </span>
                    <span className="text-[11px] text-stone-500 mt-0.5 block truncate">
                      {rev.product}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

