'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-24 bg-[#EFEAE2]/60 border-b border-[#E7E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/5 w-full bg-[#F8F6F2] border border-[#E7E1D8] shadow-lg overflow-hidden">
              <Image
                src="/images/brand/story-couple.jpg"
                alt="ELVORA Couple Holding Hands with Touch Distance Bracelets"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Subtle decorative gold badge */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-[#171717] text-[#EFEAE2] p-6 border border-[#B89A69]/40 shadow-xl max-w-xs">
              <span className="font-serif text-lg italic text-[#B89A69] block">
                &ldquo;Distance is measured in miles; love is felt in moments.&rdquo;
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#A39E96] mt-2 block">
                The ELVORA Philosophy
              </span>
            </div>
          </div>

          {/* Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
              The Maison
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171717] font-light leading-tight">
              An Intimate Dialogue Between Craft and Emotion.
            </h2>

            <p className="text-sm text-[#77736D] leading-relaxed font-light">
              Founded on the belief that jewelry should not merely decorate but connect, ELVORA harmonizes classical goldsmithing techniques with modern tactile innovation. Every moon and sun emblem is sculpted with exacting geometrical balance, translating timeless human affection into contemporary keepsakes.
            </p>

            <p className="text-sm text-[#77736D] leading-relaxed font-light">
              We exclusively select hypoallergenic 316L surgical stainless steel, multilayer PVD gold plating, and hand-cut crystals. From lovers separated across timezones to those who hold quiet devotion in everyday gestures, ELVORA remains a steady talisman of presence.
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#B89A69] transition-colors"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4 text-[#B89A69]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

