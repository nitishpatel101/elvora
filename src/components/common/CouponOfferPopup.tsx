'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, X, Sparkles } from 'lucide-react';

export default function CouponOfferPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const closed = sessionStorage.getItem('elvora_coupon_dismissed');
      if (closed === 'true') {
        setIsOpen(false);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('LOVE300');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('elvora_coupon_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40">
      {isOpen ? (
        <div className="relative w-[300px] sm:w-[320px] bg-gradient-to-br from-[#181818] via-[#222222] to-[#111111] text-white p-4 rounded-2xl shadow-2xl border border-[#F5C400]/40 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Top Bar with Close */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#F5C400]">
              <Sparkles className="w-3 h-3 fill-[#F5C400]" />
              SPECIAL OFFER &bull; ALL PRODUCTS
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white p-1 text-xs"
                title="Minimize"
                aria-label="Minimize"
              >
                &minus;
              </button>
              <button
                onClick={handleDismiss}
                className="text-stone-400 hover:text-white p-1"
                title="Close"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1 mb-3">
            <h4 className="font-sans font-extrabold text-base sm:text-lg text-white leading-tight">
              Flat <span className="text-[#F5C400]">₹300 OFF</span> Instantly!
            </h4>
            <p className="text-[11px] text-stone-300 leading-snug">
              Apply this coupon code at checkout on any touch distance bracelet.
            </p>
          </div>

          {/* Coupon Code Pill & Copy Button */}
          <div className="flex items-center justify-between bg-black/60 border border-dashed border-[#F5C400]/70 rounded-xl p-2 gap-2">
            <div className="flex items-center gap-2 pl-1">
              <Tag className="w-4 h-4 text-[#F5C400]" />
              <span className="font-mono text-sm font-black tracking-widest text-[#F5C400]">
                LOVE300
              </span>
            </div>

            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#F5C400] hover:bg-[#FFD747] text-black active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-stone-400 text-center mt-2 font-medium">
            ⚡ E.g. ₹2,000 product available for ₹1,700 only!
          </p>
        </div>
      ) : (
        /* Minimized Pill Button */
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-3.5 py-2 rounded-full shadow-xl border border-[#F5C400]/60 text-xs font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#F5C400] animate-ping" />
          <Tag className="w-3.5 h-3.5 text-[#F5C400]" />
          <span>Use Code <strong className="text-[#F5C400]">LOVE300</strong> (-₹300)</span>
        </button>
      )}
    </div>
  );
}

