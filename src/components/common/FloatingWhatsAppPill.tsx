'use client';

import React from 'react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.953.562 3.828 1.625 5.438L2 22l4.672-1.625A9.97 9.97 0 0 0 12.031 22C17.562 22 22 17.531 22 12.031 22 6.5 17.531 2 12.031 2zm5.781 14.156c-.25.688-1.406 1.344-1.969 1.406-.531.063-1.188.094-1.906-.156-.469-.156-1.063-.375-1.844-.719-3.25-1.406-5.375-4.688-5.531-4.906-.156-.219-1.281-1.719-1.281-3.281 0-1.563.813-2.313 1.094-2.625.281-.313.625-.406.844-.406.219 0 .438 0 .625.031.219.031.469-.063.719.563.281.688.938 2.281 1.031 2.469.094.188.156.406.031.625-.094.219-.188.344-.344.531-.156.188-.344.406-.469.563-.156.156-.313.344-.125.656.188.313.844 1.375 1.813 2.25 1.25 1.125 2.313 1.469 2.625 1.625.313.156.5.125.688-.094.188-.219.813-.938 1.031-1.281.219-.344.438-.281.719-.188.281.094 1.813.844 2.125 1 .313.156.531.25.625.375.094.125.094.75-.156 1.438z" />
  </svg>
);

export default function FloatingWhatsAppPill() {
  const whatsappUrl =
    'https://wa.me/916386645203?text=Hi%20ELVORA,%20I%20am%20interested%20in%20Long%20Distance%20Touch%20Bracelets!';

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center group">
      {/* Pulse Rings */}
      <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />
      <span className="absolute -inset-2 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none" />

      {/* Circular Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40 cursor-pointer hover:shadow-[0_0_30px_rgba(37,211,102,0.7)]"
        aria-label="Chat with ELVORA on WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        </span>
      </a>

      {/* Floating Hover Label Tooltip */}
      <div className="absolute right-full mr-3 px-3 py-1.5 bg-black/85 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 border border-white/10 hidden sm:block">
        Chat on WhatsApp
      </div>
    </div>
  );
}
