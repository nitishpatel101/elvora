'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { isVideoFileOrUrl } from '@/lib/imageCompression';
import defaultSlides from '../../../data/hero_slides.json';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  mediaType?: 'image' | 'video' | string;
  tag: string;
  highlight: string;
}

interface HeroSectionProps {
  initialSlides?: HeroSlide[];
}

export default function HeroSection({ initialSlides }: HeroSectionProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : (defaultSlides as unknown as HeroSlide[])
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sync with localStorage (instant across browser tabs) and fetch updated slides from API
  useEffect(() => {
    // 1. Instant check from localStorage
    try {
      const local = localStorage.getItem('elvora_hero_slides');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
        }
      }
    } catch { }

    // 2. Fresh fetch from server API
    fetch(`/api/hero-slides?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          try {
            localStorage.setItem('elvora_hero_slides', JSON.stringify(data));
          } catch { }
        }
      })
      .catch(() => { });
  }, []);

  // Auto-slide every 5.5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeIndex = currentSlide >= slides.length ? 0 : currentSlide;
  const slide = slides[activeIndex] || slides[0];

  if (!slide) return null;

  return (
    <section className="w-full relative overflow-hidden bg-stone-950">
      <div className="relative w-full aspect-[4/3] sm:aspect-[2.2/1] md:aspect-[2.8/1] lg:aspect-[3.2/1] min-h-[300px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px] overflow-hidden group bg-stone-900">
        {/* Slides Images or Videos with Smooth Crossfade */}
        {slides.map((s, idx) => {
          const isVid = isVideoFileOrUrl(s.image, s.mediaType);
          return (
            <div
              key={s.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {isVid ? (
                <video
                  src={s.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.02] transition-transform duration-1000"
                />
              ) : (
                <Image
                  src={s.image || '/images/giftify/hero-banner.jpg'}
                  alt={s.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover object-center scale-100 group-hover:scale-[1.02] transition-transform duration-1000"
                  unoptimized
                />
              )}
              {/* Vignette Overlay: Light bottom gradient on mobile so bracelet visual is 100% visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent sm:bg-gradient-to-r sm:from-black/75 sm:via-black/25 sm:to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* Slide Text Content: Sleek & compact at bottom on mobile, full centered on desktop */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-12 md:px-16 flex flex-col justify-end pb-5 sm:pb-0 sm:justify-center text-white">
          <div className="max-w-xl">
            {/* Brand Logo & Pill Tag */}
            <div className="flex items-center gap-2 mb-1.5 sm:mb-3.5">
              <div className="relative w-6 h-6 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-lg border border-[#E5B54F]/60 bg-black/70 backdrop-blur-md flex-none">
                <Image
                  src="/images/logo-transparent.png"
                  alt="ELVORA"
                  fill
                  className="object-contain p-0.5 sm:p-1"
                />
              </div>
              <span className="inline-flex items-center gap-1 bg-[#F5C400] text-black text-[9px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black" />
                {slide.tag}
              </span>
            </div>

            {/* Heading: Compact text-lg on mobile, large text-4xl/5xl on desktop */}
            <h1 className="font-sans text-lg sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-1 sm:mb-3 tracking-tight drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle: Hidden on mobile so banner images are not blocked, shown on desktop */}
            <p className="hidden sm:block text-xs sm:text-sm text-stone-200 font-normal max-w-md mb-4 sm:mb-6 drop-shadow-sm leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Highlight Banner: Desktop only */}
            {slide.highlight && (
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#F5C400] font-bold mb-4">
                <span>●</span>
                <span>{slide.highlight}</span>
              </div>
            )}

            {/* CTA Button: Compact on mobile, full sized on desktop */}
            <div className="flex items-center gap-3 pt-1 sm:pt-0">
              <Link
                href={slide.link || '/shop'}
                className="inline-flex items-center gap-1.5 bg-[#F5C400] hover:bg-[#FFD747] text-black font-extrabold text-[11px] sm:text-sm px-4 py-2 sm:px-8 sm:py-3.5 rounded-lg sm:rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
              >
                <span>{slide.cta || 'Shop Now'}</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Left / Right Carousel Buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-xs text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-xs text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Carousel Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-12 z-30 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex
                  ? 'w-7 sm:w-9 bg-[#F5C400] shadow-md'
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
