'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Hero3DContainer from '@/components/3d/Hero3DContainer';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0] border-b border-[#E8DCCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Copy & CTA */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-px bg-[#B69A65]" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#B69A65] font-medium">
                MADE FOR YOUR SPECIAL CONNECTIONS
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-light tracking-tight leading-[1.12]">
              Jewellery that brings hearts closer.
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#6B655D] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover thoughtfully designed pieces that turn everyday moments into lasting memories.
            </p>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#111111] text-[#FFFFFF] px-9 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#B69A65] transition-all duration-300"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop/couple-bracelets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#111111] text-[#111111] px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#111111] hover:text-[#FFFFFF] transition-all duration-300"
              >
                <span>COUPLE BRACELETS</span>
              </Link>
            </div>

            {/* Refined editorial micro-features */}
            <div className="pt-8 grid grid-cols-3 border-t border-[#E8DCCD] max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#B69A65] block font-medium">Materials</span>
                <span className="text-xs text-[#111111] font-light mt-0.5 block">316L Steel & Gold</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#B69A65] block font-medium">Curations</span>
                <span className="text-xs text-[#111111] font-light mt-0.5 block">Matched Pairs</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#B69A65] block font-medium">Dispatch</span>
                <span className="text-xs text-[#111111] font-light mt-0.5 block">Insured Express</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Premium Product Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/5 w-full bg-[#E8DCCD]/30 border border-[#E8DCCD] overflow-hidden group shadow-sm">
              <Image
                src="/images/products/touch-distance-bracelet/hero.jpg"
                alt="ELVORA Touch Distance Couple Bracelet on velvet display"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
              />

              {/* Editorial bottom caption bar */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/40 to-transparent p-6 text-white flex items-end justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#E8DCCD] block">
                    Signature Couple Edition
                  </span>
                  <div className="font-serif text-lg text-white font-light mt-0.5">
                    Touch Distance Bracelet &bull; &#8377;1,399
                  </div>
                </div>

                <Link
                  href="/product/touch-distance-couple-bracelet"
                  className="text-[10px] uppercase tracking-[0.2em] text-white hover:text-[#DFCDB4] flex items-center gap-1.5 transition-colors underline underline-offset-4"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Subtle 3D Interactive Jewel Accent in corner */}
              <div className="absolute top-4 right-4 hidden sm:block w-28 h-28 pointer-events-none opacity-85">
                <Hero3DContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
