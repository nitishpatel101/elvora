'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Hero3DContainer from '@/components/3d/Hero3DContainer';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#EAE5DE]">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: AUrate-style Editorial Copy & Action */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            {/* Small Muted Sage Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF3F0] border border-[#D5E0D9] text-[10px] tracking-[0.24em] uppercase text-[#24332C] font-medium">
              <span>MADE FOR YOUR SPECIAL CONNECTIONS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl text-[#181818] font-light tracking-tight leading-[1.14]">
              Jewellery that brings hearts closer.
            </h1>

            {/* Editorial Description */}
            <p className="text-xs sm:text-sm text-[#5C5852] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover thoughtfully designed pieces that turn everyday moments into lasting memories. Ethically cast in surgical-grade steel and 18K champagne gold.
            </p>

            {/* AUrate Style Clean Primary & Secondary Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#24332C] text-[#FFFFFF] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#19241F] transition-all duration-300"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop/couple-bracelets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#181818] text-[#181818] px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#24332C] hover:text-[#FFFFFF] hover:border-[#24332C] transition-all duration-300"
              >
                <span>COUPLE BRACELETS</span>
              </Link>
            </div>

            {/* AUrate-inspired Ethical Hallmarks Row */}
            <div className="pt-6 grid grid-cols-3 border-t border-[#EAE5DE] max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#708579] block font-medium">
                  Material
                </span>
                <span className="text-xs text-[#181818] font-light mt-0.5 block">
                  316L Steel &amp; 18K Gold
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#708579] block font-medium">
                  Ethos
                </span>
                <span className="text-xs text-[#181818] font-light mt-0.5 block">
                  Hypoallergenic
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#708579] block font-medium">
                  Logistics
                </span>
                <span className="text-xs text-[#181818] font-light mt-0.5 block">
                  Insured Express Air
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Split-Screen Cinematic Connection Visual (India & Paris) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/9] w-full bg-[#FFFFFF] border border-[#EAE5DE] overflow-hidden group shadow-xs">
              <Image
                src="/images/hero/hero-couple-connection.png"
                alt="ELVORA Connected Moments in Paris & India - Touch Distance Couple Bracelets"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
              />

              {/* Minimal AUrate-style floating bottom pill */}
              <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 bg-white/95 backdrop-blur-md border border-[#EAE5DE] p-3 sm:p-4 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#708579] block font-medium">
                    Long Distance Connection Edition
                  </span>
                  <div className="font-serif text-sm sm:text-base text-[#181818] font-light mt-0.5">
                    Touch Distance Couple Bracelet &bull; &#8377;1,399
                  </div>
                </div>

                <Link
                  href="/product/touch-distance-couple-bracelet"
                  className="text-[10px] uppercase tracking-[0.18em] text-[#24332C] hover:text-[#181818] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Interactive 3D Accent Jewel */}
              <div className="absolute top-3 right-3 hidden sm:block w-24 h-24 pointer-events-none opacity-80">
                <Hero3DContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
