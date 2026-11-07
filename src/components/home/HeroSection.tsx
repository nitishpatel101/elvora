'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState('/images/hero/hero-couple-tight.png');
  const [heroSubheading, setHeroSubheading] = useState('BLACK FRIDAY SALE');
  const [heroHeading, setHeroHeading] = useState('30% OFF');
  const [heroButtonText, setHeroButtonText] = useState('SHOP NOW');
  const [heroLink, setHeroLink] = useState('/shop');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.heroImage) setHeroImage(data.heroImage);
          if (data.heroSubheading !== undefined) setHeroSubheading(data.heroSubheading);
          if (data.heroHeading !== undefined) setHeroHeading(data.heroHeading);
          if (data.heroButtonText !== undefined) setHeroButtonText(data.heroButtonText);
          if (data.heroLink) setHeroLink(data.heroLink);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative w-full bg-[#181818] overflow-hidden border-b border-[#EAE5DE]">
      {/* Responsive, mobile-fitted editorial hero banner */}
      <Link
        href={heroLink}
        className="block relative w-full aspect-[2.1/1] sm:aspect-[2.5/1] md:aspect-[2.8/1] min-h-[175px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[440px] max-h-[540px] group cursor-pointer overflow-hidden"
        aria-label={`ELVORA Fine Jewellery - ${heroSubheading || 'Collection'} ${heroHeading || ''} - ${heroButtonText || 'Shop'}`}
      >
        <Image
          src={heroImage}
          alt="ELVORA Fine Jewellery - Made for Two"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center sm:object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />

        {/* Subtle cinematic gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/15 transition-colors duration-300" />

        {/* Proportional centered typography optimized for mobile & desktop */}
        {(heroSubheading || heroHeading || heroButtonText) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 sm:px-6 z-10 pointer-events-none">
            {heroSubheading && (
              <span className="text-[9px] sm:text-xs md:text-sm uppercase tracking-[0.22em] sm:tracking-[0.32em] font-medium text-white/95 mb-1 sm:mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {heroSubheading}
              </span>
            )}
            {heroHeading && (
              <h1 className="font-sans text-xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-[0.04em] sm:tracking-[0.06em] mb-1.5 sm:mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                {heroHeading}
              </h1>
            )}
            {heroButtonText && (
              <span className="inline-block text-[9px] sm:text-xs md:text-sm uppercase tracking-[0.18em] sm:tracking-[0.28em] font-semibold text-white pb-0.5 sm:pb-1 border-b sm:border-b-2 border-white group-hover:border-white/80 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {heroButtonText}
              </span>
            )}
          </div>
        )}
      </Link>
    </section>
  );
}
