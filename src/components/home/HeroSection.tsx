'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Hero3DContainer from '@/components/3d/Hero3DContainer';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: AUrate-style Editorial Copy & Action */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            {/* Small Muted Sage Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF3F0] border border-[#D5E0D9] text-[10px] tracking-[0.24em] uppercase text-[#24332C] font-medium">
              <span>MADE FOR YOUR SPECIAL CONNECTIONS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#181818] font-light tracking-tight leading-[1.12]">
              Jewellery that brings hearts closer.
            </h1>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base text-[#5C5852] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover thoughtfully designed pieces that turn everyday moments into lasting memories. Ethically cast in surgical-grade steel and 18K champagne gold.
            </p>

            {/* AUrate Style Clean Primary & Secondary Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#24332C] text-[#FFFFFF] px-9 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#19241F] transition-all duration-300"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop/couple-bracelets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#181818] text-[#181818] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#24332C] hover:text-[#FFFFFF] hover:border-[#24332C] transition-all duration-300"
              >
                <span>COUPLE BRACELETS</span>
              </Link>
            </div>

            {/* AUrate-inspired Ethical Hallmarks Row */}
            <div className="pt-8 grid grid-cols-3 border-t border-[#EAE5DE] max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
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

          {/* Right Column: Large Editorial Jewellery Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/5 w-full bg-[#FFFFFF] border border-[#EAE5DE] overflow-hidden group shadow-xs">
              <Image
                src="/images/products/touch-distance-bracelet/hero.jpg"
                alt="ELVORA Touch Distance Couple Bracelet"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
              />

              {/* Minimal AUrate-style floating bottom pill */}
              <div className="absolute inset-x-4 bottom-4 bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#EAE5DE] p-4 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#708579] block font-medium">
                    Signature Couple Edition
                  </span>
                  <div className="font-serif text-base text-[#181818] font-light mt-0.5">
                    Touch Distance Bracelet &bull; &#8377;1,399
                  </div>
                </div>

                <Link
                  href="/product/touch-distance-couple-bracelet"
                  className="text-[10px] uppercase tracking-[0.18em] text-[#24332C] hover:text-[#181818] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Interactive 3D Accent Jewel */}
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
