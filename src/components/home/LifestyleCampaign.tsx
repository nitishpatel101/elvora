'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause } from 'lucide-react';

export default function LifestyleCampaign() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="relative w-full h-[55vh] sm:h-[80vh] min-h-[380px] sm:min-h-[480px] max-h-[820px] bg-[#181818] overflow-hidden">
      {/* High-fashion Editorial Campaign Image / Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/brand/story-couple.jpg"
          alt="ELVORA Couple Connection Campaign"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-all duration-1000 ${
            isPlaying ? 'scale-100 filter-none' : 'scale-102 brightness-90'
          }`}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Centered Campaign Heading matching AUrate frame 013 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <span className="text-[9px] sm:text-xs tracking-[0.24em] sm:tracking-[0.3em] uppercase font-semibold text-white/90 block mb-2 sm:mb-3">
          HOLIDAY CAMPAIGN
        </span>
        <h2 className="text-xl sm:text-4xl lg:text-5xl font-light text-white tracking-[0.14em] sm:tracking-[0.2em] uppercase font-sans">
          ELVORA &times; CONNECTION
        </h2>
        <div className="mt-4 sm:mt-6">
          <Link
            href="/shop"
            className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] font-semibold text-white pb-1 border-b border-white hover:text-white/80 hover:border-white/80 transition-colors"
          >
            DISCOVER THE CAMPAIGN
          </Link>
        </div>
      </div>

      {/* Pause / Play Control on Bottom Right matching AUrate frame 013 & 015 */}
      <div className="absolute right-4 sm:right-10 bottom-4 sm:bottom-10 z-20">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause campaign visual' : 'Play campaign visual'}
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white text-white" />
          ) : (
            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
          )}
        </button>
      </div>
    </section>
  );
}

