'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    id: 'r-1',
    image: '/images/giftify/reviews/panda-lamp.jpg',
    title: 'Wonderful and beautifful',
    stars: 5,
    author: 'Sangram Ambrale',
    product: 'Panda Night Lamp',
  },
  {
    id: 'r-2',
    image: '/images/giftify/reviews/family-merge-art.jpg',
    title: 'The edit is fantastic',
    stars: 5,
    author: 'Sindhuja',
    product: 'Family Merge Art',
  },
  {
    id: 'r-3',
    image: '/images/giftify/reviews/birthday-currency-note.jpg',
    title: 'Absolutely beautiful original note.',
    stars: 5,
    author: 'Prakash',
    product: 'Birthday Currency Note',
  },
  {
    id: 'r-4',
    image: '/images/giftify/reviews/projection-bracelet.jpg',
    title: 'Worth it!',
    stars: 5,
    author: 'Ritu Sharma',
    product: 'Photo Projection Bracelet...',
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
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 px-2 scrollbar-none scroll-smooth"
          >
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Real Customer Photo */}
                <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={rev.image}
                    alt={rev.title}
                    fill
                    sizes="288px"
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Review Text */}
                <div className="p-4 flex flex-col items-center text-center flex-1 justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-900 text-xs sm:text-sm mb-2">
                      {rev.title}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F5C400] text-[#F5C400]" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      {rev.author}
                    </span>
                    <span className="text-[11px] text-stone-500 mt-0.5 block">
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

