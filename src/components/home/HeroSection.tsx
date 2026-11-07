'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import defaultSlides from '../../../data/hero_slides.json';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  tag: string;
  highlight: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch updated slides from API dynamically
  useEffect(() => {
    fetch('/api/hero-slides')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(() => {});
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
    <section className="bg-white py-4 sm:py-6">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-[2/1] sm:aspect-[2.6/1] md:aspect-[3.1/1] min-h-[250px] sm:min-h-[380px] md:min-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200 group bg-stone-900">
          {/* Slides Images with Smooth Crossfade */}
          {slides.map((s, idx) => (
            <div
              key={s.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center scale-100 group-hover:scale-[1.02] transition-transform duration-1000"
                unoptimized
              />
              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent sm:from-black/75 sm:via-black/25" />
            </div>
          ))}

          {/* Slide Text Content */}
          <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-xl text-white">
            {/* Pill Tag */}
            <div className="animate-float mb-2 sm:mb-3">
              <span className="inline-flex items-center gap-1.5 bg-[#F5C400] text-black text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                <Sparkles className="w-3 h-3 fill-black" />
                {slide.tag}
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-sans text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-2 sm:mb-3 tracking-tight drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-200 font-normal max-w-md mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none drop-shadow-sm leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Highlight Banner */}
            {slide.highlight && (
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#F5C400] font-bold mb-4">
                <span>●</span>
                <span>{slide.highlight}</span>
              </div>
            )}

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Link
                href={slide.link || '/shop'}
                className="inline-flex items-center gap-2 bg-[#F5C400] hover:bg-[#FFD747] text-black font-extrabold text-xs sm:text-sm px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 animate-pulse-glow"
              >
                <span>{slide.cta || 'Shop Now'}</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Left / Right Carousel Buttons */}
          {slides.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Carousel Slide Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 z-30 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-7 sm:w-9 bg-[#F5C400] shadow-md'
                      : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
