'use client';

import React from 'react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.953.562 3.828 1.625 5.438L2 22l4.672-1.625A9.97 9.97 0 0 0 12.031 22C17.562 22 22 17.531 22 12.031 22 6.5 17.531 2 12.031 2zm5.781 14.156c-.25.688-1.406 1.344-1.969 1.406-.531.063-1.188.094-1.906-.156-.469-.156-1.063-.375-1.844-.719-3.25-1.406-5.375-4.688-5.531-4.906-.156-.219-1.281-1.719-1.281-3.281 0-1.563.813-2.313 1.094-2.625.281-.313.625-.406.844-.406.219 0 .438 0 .625.031.219.031.469-.063.719.563.281.688.938 2.281 1.031 2.469.094.188.156.406.031.625-.094.219-.188.344-.344.531-.156.188-.344.406-.469.563-.156.156-.313.344-.125.656.188.313.844 1.375 1.813 2.25 1.25 1.125 2.313 1.469 2.625 1.625.313.156.5.125.688-.094.188-.219.813-.938 1.031-1.281.219-.344.438-.281.719-.188.281.094 1.813.844 2.125 1 .313.156.531.25.625.375.094.125.094.75-.156 1.438z" />
  </svg>
);

export default function FloatingWhatsAppPill() {
  const whatsappUrl = 'https://wa.me/916386645203?text=Hi%20ELVORA,%20I%20want%20to%20order%20a%20gift/jewellery.';

  return (
    <aside
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 left-4 sm:left-6 z-40 animate-fade-in-up"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full flex items-center gap-2.5 shadow-2xl hover:shadow-xl transition-all duration-300 font-bold text-xs sm:text-sm active:scale-95 group"
      >
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <WhatsAppIcon className="w-5 h-5 text-white" />
        </div>
        <span className="tracking-wide">Order on WhatsApp</span>
      </a>
    </aside>
  );
}

