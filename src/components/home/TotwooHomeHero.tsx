'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function TotwooHomeHero() {
  const [isMuted, setIsMuted] = useState(true);
  const videoDesktopRef = useRef<HTMLVideoElement>(null);
  const videoMobileRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoDesktopRef.current) videoDesktopRef.current.muted = nextMuted;
    if (videoMobileRef.current) videoMobileRef.current.muted = nextMuted;
  };

  useEffect(() => {
    // Attempt autoplay
    if (videoDesktopRef.current) {
      videoDesktopRef.current.play().catch(() => { });
    }
    if (videoMobileRef.current) {
      videoMobileRef.current.play().catch(() => { });
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-stone-950 text-white min-h-[540px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center">
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND VIDEO (Responsive Desktop / Mobile)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Desktop Video (Screen width >= 769px) - Cleanly trimmed without Totwoo logo */}
        <video
          ref={videoDesktopRef}
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center scale-100 transition-opacity duration-1000"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster="https://cdn.shopify.com/s/files/1/0415/3855/1967/files/Totwoo_love_connect-new-ver-fallback-pc.webp?v=1775198420"
        >
          <source
            src="/videos/totwoo-hero-desktop.mp4"
            type="video/mp4"
          />
        </video>

        {/* Mobile Video (Screen width < 769px) - Cleanly trimmed without Totwoo logo */}
        <video
          ref={videoMobileRef}
          className="block md:hidden absolute inset-0 w-full h-full object-cover object-center scale-100 transition-opacity duration-1000"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster="https://cdn.shopify.com/s/files/1/0415/3855/1967/files/Totwoo_love_connect-new-ver-fallback-mobile.webp?v=1775213080"
        >
          <source
            src="/videos/totwoo-hero-mobile.mp4"
            type="video/mp4"
          />
        </video>

        {/* Ambient Gradient Overlay: Soft at bottom on mobile so couple video is 100% visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO CONTENT & TYPOGRAPHY (Compact & sleek on mobile, full luxurious on desktop)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 text-center flex flex-col items-center justify-end sm:justify-center min-h-[460px] sm:min-h-auto">
        {/* Subtitle Pill Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/20 mb-2.5 sm:mb-5 shadow-lg animate-fade-in">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E5B54F]" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#F3E5AB]">
            Best gifts for the beloved
          </span>
        </div>

        {/* Title: Compact text-xl on mobile so video shines, text-5xl/6xl on desktop */}
        <h1 className="font-serif text-xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight mb-2 sm:mb-4 max-w-3xl drop-shadow-lg">
          Love Knows No Distance
        </h1>

        {/* Description: Hidden on small mobile to keep video clear, full on desktop */}
        <p className="hidden sm:block text-sm sm:text-lg text-stone-200/90 font-light max-w-2xl leading-relaxed mb-8 drop-shadow">
          A touch that travels across miles, a light that connects two hearts. Feel your partner&apos;s gentle vibration in real time, anywhere in the world.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="relative z-20 flex flex-row items-center gap-2.5 sm:gap-4 w-auto pt-1 sm:pt-0">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 bg-[#E5B54F] hover:bg-[#d4a33d] text-black text-[11px] sm:text-sm font-bold uppercase tracking-wider px-5 py-2.5 sm:px-8 sm:py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
          >
            <span>Send a Touch</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </Link>

          <Link
            href="/shop/couple-bracelets"
            className="inline-flex items-center justify-center gap-1.5 bg-black/60 hover:bg-black/85 text-white text-[11px] sm:text-sm font-semibold px-4 py-2.5 sm:px-7 sm:py-4 rounded-full backdrop-blur-md border border-white/25 transition-all hover:border-white/50 cursor-pointer touch-manipulation"
          >
            <span>Explore Couple Sets</span>
          </Link>
        </div>

        {/* Key USPs Mini Banner (Shown on desktop) */}
        <div className="hidden sm:flex mt-12 flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-stone-300 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-[#E5B54F]">✓</span>
            <span>Real-Time Touch Vibration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#E5B54F]">✓</span>
            <span>Worldwide Range (iOS &amp; Android)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#E5B54F]">✓</span>
            <span>Free Express Delivery Across India</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SOUND TOGGLE BUTTON (Bottom Right)
      ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-lg"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300" />
        ) : (
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5B54F]" />
        )}
      </button>
    </section>
  );
}

