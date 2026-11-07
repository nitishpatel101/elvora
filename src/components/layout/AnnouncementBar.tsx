'use client';

import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#F5C400] text-[#111111] py-2 px-4 text-xs font-semibold tracking-wide border-b border-[#E0B200] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 sm:gap-12 flex-wrap text-center">
        <span className="flex items-center gap-1.5">
          <span>⭐</span>
          <span>Rated 5 Stars by Thousands of Happy Gift-Givers</span>
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <span>🎁</span>
          <span>200+ Unique Custom Gifts Made for Every Occasion</span>
        </span>
        <span className="hidden lg:flex items-center gap-1.5">
          <span>💖</span>
          <span>Over 10,000+ Relationships Celebrated</span>
        </span>
      </div>
    </div>
  );
}
