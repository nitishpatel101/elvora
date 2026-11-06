'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#171717] text-[#EFEAE2] text-[11px] sm:text-xs tracking-[0.2em] uppercase py-2 px-4 text-center relative font-medium transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span>Complimentary Signature Velvet Packaging on All Curated Orders</span>
        <span className="hidden sm:inline text-[#B89A69]">•</span>
        <span className="hidden sm:inline text-[#D7C4A5]">Worldwide Express Dispatch</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close notification"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-[#77736D] hover:text-[#F8F6F2] transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
