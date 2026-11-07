'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="block relative w-full aspect-[2/1] sm:aspect-[2.6/1] md:aspect-[3.1/1] min-h-[220px] sm:min-h-[360px] md:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200 group cursor-pointer"
        >
          <Image
            src="/images/giftify/hero-banner.jpg"
            alt="Memories That Glow Forever - Illuminated Crystal Keepsakes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
            unoptimized
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent sm:from-black/60 sm:via-transparent" />

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-xl text-white z-10">
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal leading-tight text-white mb-2 sm:mb-3 drop-shadow">
              Memories That<br />Glow Forever
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 font-light max-w-md mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none drop-shadow-sm">
              Turn your favorite photo, baby scan, or cherished moment into a beautifully illuminated crystal keepsake.
            </p>
            <div>
              <span className="inline-block bg-[#DDB373] hover:bg-[#C9A060] text-black font-semibold text-xs sm:text-sm px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg shadow-md transition-all group-hover:scale-105">
                Get Now
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
