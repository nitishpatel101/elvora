'use client';

import React from 'react';

const TICKER_ITEMS = [
  '⭐ Rated 4.9 Stars by 10,000+ Happy Gift-Givers across India',
  '🎁 200+ Unique Handcrafted & Custom Gifts Made with Love',
  '🚚 Free All-India Express Delivery on Orders ₹499+',
  '⚡ Instant WhatsApp Order Support (+91 63866 45203)',
  '💖 100% Satisfaction & Safe Delivery Guarantee',
];

export default function AnnouncementBar() {
  return (
    <div className="bg-[#F5C400] text-[#111111] py-2 px-2 text-xs font-bold tracking-wide border-b border-[#E0B200] overflow-hidden select-none whitespace-nowrap">
      <div className="animate-marquee flex items-center gap-8">
        {/* Sequence 1 */}
        {TICKER_ITEMS.map((item, idx) => (
          <span key={`t1-${idx}`} className="inline-flex items-center gap-2">
            <span>{item}</span>
            <span className="text-[#A58200] font-black">•</span>
          </span>
        ))}
        {/* Sequence 2 for seamless loop */}
        {TICKER_ITEMS.map((item, idx) => (
          <span key={`t2-${idx}`} className="inline-flex items-center gap-2">
            <span>{item}</span>
            <span className="text-[#A58200] font-black">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
