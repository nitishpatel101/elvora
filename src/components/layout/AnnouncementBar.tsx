'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  initialText?: string;
}

export default function AnnouncementBar({
  initialText = 'DISCOVER THE ART OF GIFTING | ELEGANCE IN EVERY DETAIL',
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#111111] text-[#F8F5F0] text-[10px] sm:text-[11px] tracking-[0.26em] uppercase py-2 px-6 text-center relative font-light transition-all duration-300 border-b border-[#242220]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="truncate">{initialText}</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-[#8C867E] hover:text-[#FFFFFF] transition-colors p-1"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
