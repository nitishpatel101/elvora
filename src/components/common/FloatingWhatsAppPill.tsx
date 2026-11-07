'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsAppPill() {
  const whatsappUrl = 'https://wa.me/916386645203?text=Hi%20ELVORA,%20I%20am%20looking%20for%20a%20special%20gift!';

  return (
    <div className="fixed bottom-5 left-4 sm:left-6 z-40 flex items-center">
      {/* Radar Pulse Effect */}
      <div className="relative flex items-center">
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-75 animate-radar pointer-events-none" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/30"
          aria-label="Order on WhatsApp"
        >
          {/* Animated WhatsApp icon */}
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-ping" />
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-extrabold leading-none tracking-tight">
              Order on WhatsApp
            </span>
            <span className="text-[9px] text-white/90 font-medium leading-tight mt-0.5 hidden sm:inline">
              ● Online • Instant Reply
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
