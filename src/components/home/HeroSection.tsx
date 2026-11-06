'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#9B9084] overflow-hidden border-b border-[#EAE5DE]">
      {/* Full-width clean AUrate-style editorial banner matching user attachment */}
      <Link
        href="/shop"
        className="block relative w-full aspect-[1024/407] min-h-[260px] sm:min-h-[360px] md:min-h-[440px] lg:min-h-[500px] xl:min-h-[580px] max-h-[760px] group cursor-pointer overflow-hidden"
        aria-label="ELVORA Fine Jewellery Black Friday Sale 30% Off - Shop Now"
      >
        <Image
          src="/images/hero/hero-clean-banner.jpg"
          alt="ELVORA Fine Jewellery Black Friday Sale 30% Off - Shop Now"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />

        {/* Subtle luxury overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300" />

        {/* Screen-reader accessible heading & CTA */}
        <span className="sr-only">
          ELVORA Fine Jewellery &bull; Black Friday Sale 30% Off &bull; Shop Now
        </span>
      </Link>
    </section>
  );
}
