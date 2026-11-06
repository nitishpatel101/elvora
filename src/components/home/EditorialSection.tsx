'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function EditorialSection() {
  return (
    <section className="py-24 bg-[#F8F6F2] border-b border-[#E7E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Campaign Editorial
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light mt-1">
            Sculpted in Elegance
          </h2>
          <div className="w-12 h-px bg-[#B89A69] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Editorial 1: The Heart & Sword Pendant */}
          <div className="group flex flex-col space-y-5">
            <div className="relative aspect-4/5 w-full bg-[#EFEAE2] overflow-hidden border border-[#E7E1D8]">
              <Image
                src="/images/brand/editorial-necklace.jpg"
                alt="Editorial Portrait: Model wearing Heart Sword Pendant Necklace"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#171717] text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-medium">
                The Pendant Series
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#77736D]">
                Layered Silver & Lab Ruby
              </span>
              <h3 className="font-serif text-2xl text-[#171717] font-normal group-hover:text-[#B89A69] transition-colors">
                The Heart Sword Pendant
              </h3>
              <p className="text-xs text-[#77736D] leading-relaxed max-w-md">
                A vivid crimson crystal pierced by an intricate silver dagger, suspended upon cascading chains for dramatic grace.
              </p>
              <div className="pt-2">
                <Link
                  href="/product/heart-sword-pendant-necklace"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-medium text-[#171717] hover:text-[#B89A69] transition-colors"
                >
                  <span>Acquire Pendant (₹499)</span>
                  <ArrowUpRight className="w-4 h-4 text-[#B89A69]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Editorial 2: The Golden Lantern Pearl Earring */}
          <div className="group flex flex-col space-y-5 lg:mt-12">
            <div className="relative aspect-4/5 w-full bg-[#EFEAE2] overflow-hidden border border-[#E7E1D8]">
              <Image
                src="/images/brand/editorial-earrings.jpg"
                alt="Editorial Portrait: Model wearing illuminated Golden Lantern Pearl Earrings"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#171717] text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-medium">
                The Lantern Series
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#77736D]">
                18K Gold & Cultured Pearls
              </span>
              <h3 className="font-serif text-2xl text-[#171717] font-normal group-hover:text-[#B89A69] transition-colors">
                The Golden Lantern Earrings
              </h3>
              <p className="text-xs text-[#77736D] leading-relaxed max-w-md">
                Pagoda-style lantern frames adorned with triple-tier pearl bells catching natural sunlight and evening glow.
              </p>
              <div className="pt-2">
                <Link
                  href="/product/golden-lantern-pearl-earrings"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-medium text-[#171717] hover:text-[#B89A69] transition-colors"
                >
                  <span>Acquire Earrings (₹399)</span>
                  <ArrowUpRight className="w-4 h-4 text-[#B89A69]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
