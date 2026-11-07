'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Send } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.953.562 3.828 1.625 5.438L2 22l4.672-1.625A9.97 9.97 0 0 0 12.031 22C17.562 22 22 17.531 22 12.031 22 6.5 17.531 2 12.031 2zm5.781 14.156c-.25.688-1.406 1.344-1.969 1.406-.531.063-1.188.094-1.906-.156-.469-.156-1.063-.375-1.844-.719-3.25-1.406-5.375-4.688-5.531-4.906-.156-.219-1.281-1.719-1.281-3.281 0-1.563.813-2.313 1.094-2.625.281-.313.625-.406.844-.406.219 0 .438 0 .625.031.219.031.469-.063.719.563.281.688.938 2.281 1.031 2.469.094.188.156.406.031.625-.094.219-.188.344-.344.531-.156.188-.344.406-.469.563-.156.156-.313.344-.125.656.188.313.844 1.375 1.813 2.25 1.25 1.125 2.313 1.469 2.625 1.625.313.156.5.125.688-.094.188-.219.813-.938 1.031-1.281.219-.344.438-.281.719-.188.281.094 1.813.844 2.125 1 .313.156.531.25.625.375.094.125.094.75-.156 1.438z" />
  </svg>
);

export default function FloatingChatBubble() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const whatsappNumber = '6386645203';
  const whatsappFormatted = '+91 63866 45203';
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=Hi%20ELVORA,%20I%20need%20assistance%20with%20an%20order/inquiry.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setSent(true);
    setMsg('');
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <aside aria-label="Customer Concierge" className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 z-40">
      {/* Floating Circular Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#24332C] hover:bg-[#19241F] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Open concierge chat"
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
          </div>
        )}
      </button>

      {/* Flyout Concierge Card */}
      {open && (
        <div className="absolute bottom-14 sm:bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white border border-[#EAE5DE] shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-2 duration-200 rounded-xl">
          <div className="pb-3 border-b border-[#EAE5DE] mb-3 flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#708579] font-medium block">
                Maison Concierge
              </span>
              <h4 className="font-serif text-base sm:text-lg text-[#181818] font-normal mt-0.5">
                Need assistance with an order?
              </h4>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Direct WhatsApp Support Button */}
          <div className="mb-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat on WhatsApp ({whatsappFormatted})</span>
            </a>
            <p className="text-[10px] text-stone-500 text-center mt-1">
              Typically replies within 5 minutes &bull; Mon&ndash;Sun
            </p>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-2 text-[10px] text-stone-400 uppercase tracking-wider">or leave a message</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {sent ? (
            <div className="p-4 bg-[#EEF3F0] text-[#24332C] text-xs text-center font-medium rounded-lg mt-2">
              Thank you! Our concierge team will connect shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Ask about sizing, touch bracelets, delivery, etc...."
                rows={2}
                required
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] p-2 text-xs text-[#181818] rounded focus:outline-none focus:border-[#24332C] resize-none"
              />
              <div className="flex items-center justify-between">
                <Link
                  href="/track-order"
                  className="text-[11px] uppercase tracking-wider text-[#708579] hover:underline"
                >
                  Track Order
                </Link>
                <button
                  type="submit"
                  className="bg-[#24332C] text-white px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#19241F] transition-colors flex items-center gap-1.5 rounded"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </aside>
  );
}
