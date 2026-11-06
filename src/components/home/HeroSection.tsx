'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero3DContainer from '@/components/3d/Hero3DContainer';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F6F2] via-[#F4EFE6]/40 to-[#F8F6F2] py-12 lg:py-20 border-b border-[#E7E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Statement & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFEAE2] border border-[#E7E1D8] text-[10px] tracking-[0.25em] uppercase text-[#B89A69] font-medium">
              <Sparkles className="w-3 h-3 text-[#B89A69]" />
              <span>Haute Joaillerie & Celestial Keepsakes</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171717] font-light tracking-tight leading-[1.12]">
              Bound by Design, <br />
              <span className="italic font-normal text-[#B89A69]">Connected</span> Across Distance.
            </h1>

            <p className="text-sm sm:text-base text-[#77736D] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Crafted in hypoallergenic 316L stainless steel, natural quartz, and 18K champagne gold. Explore our signature Touch Distance couple bracelets and evocative gemstone pendants engineered to bridge the space between hearts.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#171717] text-white px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#B89A69] transition-all duration-300 shadow-xs"
              >
                <span>Explore Creations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop/couple-bracelets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#171717] text-[#171717] px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:border-[#B89A69] hover:text-[#B89A69] transition-colors"
              >
                <span>Couple Bracelets</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 grid grid-cols-3 border-t border-[#E7E1D8] max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="font-serif text-xl sm:text-2xl text-[#171717] font-light">100%</div>
                <div className="text-[10px] uppercase tracking-wider text-[#77736D]">Hypoallergenic</div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl text-[#171717] font-light">18K</div>
                <div className="text-[10px] uppercase tracking-wider text-[#77736D]">PVD Finish</div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl text-[#171717] font-light">Global</div>
                <div className="text-[10px] uppercase tracking-wider text-[#77736D]">Express Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Jewelry Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Hero3DContainer />
          </div>
        </div>
      </div>
    </section>
  );
}
