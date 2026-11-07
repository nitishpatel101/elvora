'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BurgundyBanner() {
  return (
    <section className="relative bg-[#3A1218] text-white py-10 sm:py-20 overflow-hidden border-y border-[#260B10]">
      {/* Subtle ambient luxury glow */}
      <div className="absolute inset-0 bg-radial from-[#5C1F28]/50 via-transparent to-transparent opacity-80" />

      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Label with underline matching AUrate frame 008 */}
        <div className="inline-block pb-1.5 border-b border-white/60 mb-6 sm:mb-12">
          <span className="text-[11px] sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.28em] font-medium text-white/90">
            THE ART OF GIFTING &bull; MADE FOR TWO
          </span>
        </div>

        {/* Glistening Jewellery Centerpiece */}
        <div className="relative max-w-2xl mx-auto aspect-16/9 my-3 sm:my-4 rounded-sm overflow-hidden shadow-2xl border border-white/10">
          <Image
            src="/images/products/touch-distance-bracelet/macro.jpg"
            alt="ELVORA Glistening Fine Jewellery"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover transition-transform duration-1000 hover:scale-103"
          />
        </div>

        <div className="max-w-xl mx-auto mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light text-white leading-tight">
            Celebrate the little things that make your connection special.
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
            Every piece is delivered in our signature velvet presentation case, complete with an authenticity certificate.
          </p>
          <div className="pt-2">
            <Link
              href="/shop/couple-bracelets"
              className="inline-block text-xs uppercase tracking-[0.24em] font-semibold text-white pb-1 border-b-2 border-white hover:text-white/80 hover:border-white/80 transition-colors"
            >
              SHOP COUPLE COLLECTION
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

