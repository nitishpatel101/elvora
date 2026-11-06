'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  initialText?: string;
}

export default function AnnouncementBar({
  initialText = 'FINE JEWELLERY FOR EVERY DAY | DISCOVER THE ART OF GIFTING',
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#24332C] text-[#FAF8F5] text-[10px] sm:text-[11px] tracking-[0.24em] uppercase py-2 px-6 text-center relative font-light transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="truncate">{initialText}</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-[#A3B2A9] hover:text-[#FFFFFF] transition-colors p-1"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
