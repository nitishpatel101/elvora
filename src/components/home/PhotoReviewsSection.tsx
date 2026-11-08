'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, X, ZoomIn, CheckCircle } from 'lucide-react';

interface ReviewItem {
  id: string;
  image: string;
  title: string;
  comment: string;
  stars: number;
  author: string;
  city: string;
  product: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'r-1',
    image: '/images/reviews/rating-1.jpg',
    title: 'Looks so classy on the wrist!',
    comment:
      'Bracelets look super premium and aesthetic. Vibrating touch feature works flawlessly without any lag across Mumbai and Delhi.',
    stars: 5,
    author: 'Ananya & Kabir',
    city: 'Mumbai',
    product: 'Touch Couple Bracelet',
  },
  {
    id: 'r-2',
    image: '/images/reviews/rating-2.jpg',
    title: 'Unboxing was a pure luxury feeling',
    comment:
      'Velvet case packing is stunning! Gift presentation is 10/10. My partner loved the surprise completely.',
    stars: 5,
    author: 'Priya Sharma',
    city: 'Bengaluru',
    product: 'Long Distance Couple Set',
  },
  {
    id: 'r-3',
    image: '/images/reviews/rating-3.jpg',
    title: 'Glowing touch pendant is magical',
    comment:
      'Pendants are high quality and shine beautifully. App connectivity is smooth on iPhone and Android.',
    stars: 5,
    author: 'Rohan Verma',
    city: 'Gurugram',
    product: 'Touch Vibration Pendant',
  },
  {
    id: 'r-4',
    image: '/images/reviews/rating-4.jpg',
    title: 'Sun & Moon gold chain looks royal',
    comment:
      '18K gold finish chain and moon design looks very luxury. Battery life easily lasts 5-6 days.',
    stars: 5,
    author: 'Sneha Patel',
    city: 'Ahmedabad',
    product: 'Sun & Moon Couple Bracelet',
  },
  {
    id: 'r-5',
    image: '/images/reviews/rating-5.jpg',
    title: 'Superb packaging & quality',
    comment:
      'Packaging is 10/10! Premium dual Charge For Love boxes mili hain. Bluetooth pairing was super easy with the app. Both bracelets light up immediately.',
    stars: 5,
    author: 'Aakash & Tanya',
    city: 'Pune',
    product: 'Charge For Love Set',
  },
  {
    id: 'r-6',
    image: '/images/reviews/rating-6.jpg',
    title: 'Loved the finish & shine',
    comment:
      'Chain quality is really solid and heavy. The glow looks so aesthetic at night. My partner was shocked and so emotional after receiving this surprise!',
    stars: 5,
    author: 'Pooja Hegde',
    city: 'Chennai',
    product: 'Couple Locket Set',
  },
  {
    id: 'r-7',
    image: '/images/reviews/rating-7.jpg',
    title: 'Best gift for long distance',
    comment:
      'Distance does not matter anymore! Hum dono daily use kar rahe hain. Battery bhi 5 din se zyada chalti hai. Highly recommended for couples in LDR.',
    stars: 5,
    author: 'Nikhil & Simran',
    city: 'Chandigarh',
    product: 'Touch Vibration Bracelet',
  },
  {
    id: 'r-8',
    image: '/images/reviews/rating-8.jpg',
    title: '100% genuine and authentic',
    comment:
      'Original Totwoo model mila hai exactly as shown. Finishing and materials are high quality. WhatsApp support helped me with setup very quickly.',
    stars: 5,
    author: 'Divya Rao',
    city: 'Jaipur',
    product: 'Couple Bracelet Set',
  },
  {
    id: 'r-9',
    image: '/images/reviews/rating-9.jpg',
    title: 'Pure magic when it vibrates!',
    comment:
      'The subtle vibration and warm glow when touched from hundreds of km away is an unreal feeling. Box presentation is pure luxury. Best gift ever!',
    stars: 5,
    author: 'Arjun Mehta',
    city: 'Kolkata',
    product: 'Touch Distance Bracelet',
  },
];

export default function PhotoReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Keyboard navigation & body scroll lock for modal
  useEffect(() => {
    if (activeReviewIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveReviewIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveReviewIndex((prev) =>
          prev !== null ? (prev === 0 ? REVIEWS.length - 1 : prev - 1) : null
        );
      } else if (e.key === 'ArrowRight') {
        setActiveReviewIndex((prev) =>
          prev !== null ? (prev === REVIEWS.length - 1 ? 0 : prev + 1) : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeReviewIndex]);

  const activeReview = activeReviewIndex !== null ? REVIEWS[activeReviewIndex] : null;

  return (
    <section id="reviews" className="bg-white py-14 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Star Rating */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Customer Photo Reviews
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="flex items-center text-stone-900">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#F5C400] text-[#F5C400]" />
              ))}
            </div>
            <span className="text-sm font-bold text-stone-900 ml-1">
              4.92 ★ (1,569+ Verified Reviews)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Tap any photo below to view real customer unboxing and touch experience
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-300 shadow-md flex items-center justify-center hover:bg-stone-50 z-20 cursor-pointer"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-300 shadow-md flex items-center justify-center hover:bg-stone-50 z-20 cursor-pointer"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5 text-stone-700" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 px-2 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {REVIEWS.map((rev, idx) => (
              <div
                key={rev.id}
                onClick={() => setActiveReviewIndex(idx)}
                className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group p-2.5 sm:p-3 snap-start cursor-pointer"
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

                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium">
                    <ZoomIn className="w-4 h-4 text-[#F5C400]" />
                    <span>Click to view</span>
                  </div>
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
                      {rev.product} • {rev.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LIGHTBOX POPUP MODAL (Opens on clicking any review image)
      ───────────────────────────────────────────────────────────── */}
      {activeReview && activeReviewIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveReviewIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveReviewIndex(null)}
            aria-label="Close review photo"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer border border-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation: Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveReviewIndex((prev) =>
                prev !== null ? (prev === 0 ? REVIEWS.length - 1 : prev - 1) : null
              );
            }}
            aria-label="Previous customer photo"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation: Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveReviewIndex((prev) =>
                prev !== null ? (prev === REVIEWS.length - 1 ? 0 : prev + 1) : null
              );
            }}
            aria-label="Next customer photo"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content Box */}
          <div
            className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Large Crisp Image */}
            <div className="relative w-full md:w-3/5 bg-stone-950 aspect-square md:aspect-auto min-h-[280px] md:min-h-[480px]">
              <Image
                src={activeReview.image}
                alt={activeReview.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <CheckCircle className="w-3 h-3" />
                <span>Verified Buyer Photo</span>
              </span>
              <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                {activeReviewIndex + 1} of {REVIEWS.length}
              </span>
            </div>

            {/* Right: Review Details */}
            <div className="w-full md:w-2/5 p-5 sm:p-7 flex flex-col justify-between bg-[#FAF8F5]">
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(activeReview.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F5C400] text-[#F5C400]" />
                  ))}
                  <span className="text-xs font-bold text-stone-800 ml-1.5">5.0 / 5.0</span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug mb-3">
                  &ldquo;{activeReview.title}&rdquo;
                </h3>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 font-light">
                  {activeReview.comment}
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-4 border-t border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                      {activeReview.author}
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      {activeReview.city}, India
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-semibold border border-emerald-300">
                    <CheckCircle className="w-3 h-3 text-emerald-700" />
                    Verified
                  </span>
                </div>

                <div className="text-[11px] text-stone-500 pt-1">
                  Product: <span className="font-medium text-stone-700">{activeReview.product}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
