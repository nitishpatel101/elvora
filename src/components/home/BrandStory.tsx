'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-24 bg-[#F8F5F0] border-b border-[#E8DCCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/5 w-full bg-[#FFFFFF] border border-[#E8DCCD] shadow-sm overflow-hidden">
              <Image
                src="/images/products/touch-distance-bracelet/macro.jpg"
                alt="Close-up detail of ELVORA jewellery design"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Subtle editorial quote block */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 hidden sm:block bg-[#111111] text-[#FFFFFF] p-6 border border-[#B69A65]/40 shadow-xl max-w-xs">
              <p className="font-serif text-base italic text-[#DFCDB4] leading-relaxed">
                &ldquo;Designed to keep what matters most close to your heart.&rdquo;
              </p>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C867E] mt-3 block">
                The ELVORA Touch
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-5 h-px bg-[#B69A65]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A65] font-medium">
                THE ELVORA PHILOSOPHY
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] font-light leading-tight tracking-tight">
              More Than Jewellery. <span className="italic font-normal text-[#B69A65]">A Feeling.</span>
            </h2>

            <p className="text-sm text-[#6B655D] leading-relaxed font-light">
              At ELVORA, we believe jewellery is more than an accessory—it is an intimate expression of connection, memory, and sentiment. Every bracelet, necklace, and earring is thoughtfully designed to celebrate bonds that transcend time and distance.
            </p>

            <p className="text-sm text-[#6B655D] leading-relaxed font-light">
              From our celestial couple bracelets that carry quiet reminders of love, to refined pendants crafted for everyday grace, each piece is shaped with care and purpose. We focus on modern aesthetics, balanced silhouettes, and enduring comfort, creating keepsakes that you and your loved ones will cherish every day.
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium text-[#111111] hover:text-[#B69A65] transition-colors"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4 text-[#B69A65]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
