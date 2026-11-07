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
          if (data.heroSubheading) setHeroSubheading(data.heroSubheading);
          if (data.heroHeading) setHeroHeading(data.heroHeading);
          if (data.heroButtonText) setHeroButtonText(data.heroButtonText);
          if (data.heroLink) setHeroLink(data.heroLink);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative w-full bg-[#181818] overflow-hidden border-b border-[#EAE5DE]">
      {/* Sleek, elegantly cropped AUrate-proportioned editorial hero */}
      <Link
        href={heroLink}
        className="block relative w-full aspect-[2.4/1] sm:aspect-[2.6/1] md:aspect-[2.8/1] min-h-[260px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[460px] max-h-[520px] group cursor-pointer overflow-hidden"
        aria-label={`ELVORA Fine Jewellery - ${heroSubheading} ${heroHeading} - ${heroButtonText}`}
      >
        <Image
          src={heroImage}
          alt="ELVORA Long-Distance Connection - Made for Two"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
        />

        {/* Subtle cinematic gradient overlay to ensure perfect contrast for white typography */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/15 transition-colors duration-300" />

        {/* AUrate clean centered typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none">
          <span className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.32em] font-medium text-white/95 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {heroSubheading}
          </span>
          <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-[0.06em] mb-3 sm:mb-4 drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
            {heroHeading}
          </h1>
          <span className="inline-block text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold text-white pb-1 border-b-2 border-white group-hover:border-white/80 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {heroButtonText}
          </span>
        </div>
      </Link>
    </section>
  );
}
