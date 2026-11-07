'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_MESSAGES = [
  '🚚 FREE ALL-INDIA EXPRESS DELIVERY ON ORDERS ₹499+',
  '⚡ INSTANT WHATSAPP SUPPORT: +91 63866 45203',
  '⭐ RATED 4.9★ BY 10,000+ HAPPY GIFT-GIVERS ACROSS INDIA',
  '🎁 200+ HANDCRAFTED & PERSONALIZED GIFTS MADE WITH LOVE',
  '💖 100% SAFE DELIVERY & GENUINE QUALITY GUARANTEE',
];

export default function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES);
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch admin announcement settings dynamically
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          if (data.announcementVisible === false) {
            setVisible(false);
            return;
          }
          if (data.announcementText && data.announcementText.trim()) {
            const custom = [
              data.announcementText.toUpperCase(),
              data.announcementSubText ? data.announcementSubText.toUpperCase() : null,
              ...DEFAULT_MESSAGES,
            ].filter(Boolean) as string[];
            setMessages(custom);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Mobile clean rotation timer (every 3.5s)
  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!visible) return null;

  return (
    <div className="bg-[#F5C400] text-[#111111] border-b border-[#E0B200] select-none z-30 relative">
      {/* ======================================================== */}
      {/* 1. MOBILE VIEW (< 640px): CLEAN 1-AT-A-TIME TICKER (ZERO OVERLAP) */}
      {/* ======================================================== */}
      <div className="sm:hidden flex items-center justify-between h-9 px-3 w-full overflow-hidden">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)}
          className="p-1 text-black/60 hover:text-black shrink-0"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 text-center overflow-hidden px-2">
          <p
            key={currentIndex}
            className="text-[10.5px] font-extrabold tracking-wider truncate text-[#111111] animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            {messages[currentIndex]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % messages.length)}
          className="p-1 text-black/60 hover:text-black shrink-0"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP VIEW (>= 640px): SEAMLESS MARQUEE TICKER */}
      {/* ======================================================== */}
      <div className="hidden sm:block py-2 px-2 text-xs font-bold tracking-wide overflow-hidden whitespace-nowrap">
        <div className="animate-marquee flex items-center gap-8 w-max shrink-0">
          {/* Sequence 1 */}
          {messages.map((item, idx) => (
            <span key={`desk-1-${idx}`} className="inline-flex items-center gap-2 shrink-0 whitespace-nowrap">
              <span>{item}</span>
              <span className="text-[#A58200] font-black">•</span>
            </span>
          ))}
          {/* Sequence 2 for seamless continuous loop */}
          {messages.map((item, idx) => (
            <span key={`desk-2-${idx}`} className="inline-flex items-center gap-2 shrink-0 whitespace-nowrap">
              <span>{item}</span>
              <span className="text-[#A58200] font-black">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
