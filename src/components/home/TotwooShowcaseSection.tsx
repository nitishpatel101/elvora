'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

interface FeatureItem {
  id: string;
  num: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  counter: string;
  link: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'synced-touch',
    num: '01',
    title: 'Synced Touch',
    tagline: 'Feel their touch in real-time across any distance',
    description:
      'The signature connection. Tap your piece, and your partner’s bracelet flashes and vibrates in real-time — letting them know you are thinking of them, anywhere in the world.',
    image: '/images/totwoo/feature-synced-touch.jpg',
    counter: '01 / 5',
    link: '/shop/couple-bracelets',
  },
  {
    id: 'custom-flash',
    num: '02',
    title: 'Custom Flash & Vibration',
    tagline: 'Create your private secret touch code',
    description:
      'Personalize the glow color and vibration rhythms in the app. Create unique codes and secret signals only the two of you understand.',
    image: '/images/totwoo/showcase-soulmate.jpg',
    counter: '02 / 5',
    link: '/product/touch-distance-couple-bracelet',
  },
  {
    id: 'call-alert',
    num: '03',
    title: 'Call Alert',
    tagline: 'Loved ones’ calls, felt right on time.',
    description:
      'Never miss important calls. Link up to your special contacts in the app so your smart jewelry gently flashes and buzzes when they call, even if your phone is on silent.',
    image: '/images/totwoo/feature-call-alert.jpg',
    counter: '03 / 5',
    link: '/product/touch-distance-couple-bracelet',
  },
  {
    id: 'anniversary-reminders',
    num: '04',
    title: 'Anniversary Reminders',
    tagline: 'Never miss a cherished milestone together',
    description:
      'Set your special dates and milestones. Your smart jewelry will illuminate with your chosen color and vibration pattern so every celebration feels magical.',
    image: '/images/totwoo/feature-connected-paris.jpg',
    counter: '04 / 5',
    link: '/shop',
  },
  {
    id: 'love-letters',
    num: '05',
    title: 'Love Letters',
    tagline: 'Leave secret digital surprises for them to unlock',
    description:
      'Leave hidden digital love letters, photos, voice notes, or videos. When your partner connects or taps their jewelry, they unlock your hidden message.',
    image: '/images/totwoo/showcase-locket.jpg',
    counter: '05 / 5',
    link: '/product/heat-activated-magic-photo-necklace',
  },
];

interface CollectionCard {
  id: string;
  num: string;
  total: string;
  badge?: string;
  tagline: string;
  title: string;
  image: string;
  link: string;
}

const COLLECTIONS: CollectionCard[] = [
  {
    id: 'morse-love',
    num: '01',
    total: '05',
    badge: 'NEW DROP',
    tagline: 'DOTS AND DASHES. THREE WORDS. FOREVER YOURS.',
    title: 'The Morse Love',
    image: '/images/totwoo/col-morse-love.jpg',
    link: '/shop/couple-bracelets',
  },
  {
    id: 'best-friends',
    num: '02',
    total: '05',
    tagline: "FOR THE FRIEND WHO'S ALWAYS THERE",
    title: 'Gift for Best friends',
    image: '/images/totwoo/col-best-friends.jpg',
    link: '/shop',
  },
  {
    id: 'touch-necklaces',
    num: '03',
    total: '05',
    tagline: 'ELEGANT. INTELLIGENT. CONNECTED.',
    title: 'Touch Necklaces',
    image: '/images/totwoo/col-touch-necklaces.jpg',
    link: '/shop/necklaces',
  },
  {
    id: 'mother-daughter',
    num: '04',
    total: '05',
    tagline: 'TWO BRACELETS. ONE UNBREAKABLE BOND.',
    title: 'Gift for Mother & Daughter',
    image: '/images/totwoo/col-mother-daughter.jpg',
    link: '/shop',
  },
  {
    id: 'soulmate-series',
    num: '05',
    total: '05',
    tagline: 'THE ICONIC PROMISE FOR TWO.',
    title: 'Soulmate Series',
    image: '/images/totwoo/col-soulmate.jpg',
    link: '/shop/couple-bracelets',
  },
];

export default function TotwooShowcaseSection() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(2); // Start on 03 Call Alert like the reference video
  const [isPaused, setIsPaused] = useState(false);

  // Collections Slider state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Auto-cycle accordion feature
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % FEATURES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle collections scroll tracking
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const progress = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
    setScrollProgress(progress);

    // Approximate active index based on item width
    const itemWidth = clientWidth * 0.75;
    const idx = Math.min(COLLECTIONS.length - 1, Math.round(scrollLeft / itemWidth));
    setCurrentCollectionIndex(idx);
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.65;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const activeFeature = FEATURES[activeFeatureIndex];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1C1917] selection:bg-[#EFE8DF] overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. INTERACTIVE FEATURES ACCORDION (Synced Touch, Call Alert...)
      ───────────────────────────────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Media Stage */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] max-h-[640px] rounded-2xl overflow-hidden bg-stone-900 shadow-xl border border-stone-200/50">
              {FEATURES.map((feat, idx) => (
                <div
                  key={feat.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === activeFeatureIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={feat.image}
                    alt={feat.title}
                    fill
                    priority={idx === 2}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Subtle Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                </div>
              ))}

              {/* Bottom Left Counter Overlay */}
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
                <span className="font-serif italic text-white/90 text-sm tracking-widest drop-shadow-md">
                  {activeFeature.counter}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#E5B54F] animate-pulse" />
              </div>

              {/* Bottom Right Quick CTA */}
              <div className="absolute bottom-6 right-6 z-20">
                <Link
                  href={activeFeature.link}
                  className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur transition-all hover:scale-105"
                >
                  <span>Explore Design</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5B54F]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="space-y-0 divide-y divide-stone-300/70 border-y border-stone-300/70">
              {FEATURES.map((item, idx) => {
                const isOpen = idx === activeFeatureIndex;
                return (
                  <div
                    key={item.id}
                    className={`transition-colors duration-300 cursor-pointer py-5 sm:py-6 ${
                      isOpen ? 'bg-stone-50/50' : 'hover:bg-stone-100/40'
                    }`}
                    onClick={() => {
                      setActiveFeatureIndex(idx);
                      setIsPaused(true);
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-serif italic text-xs sm:text-sm text-stone-400 font-light tracking-wider">
                          {item.num}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-stone-900 font-normal tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        aria-label={`Toggle ${item.title}`}
                        className="text-stone-500 hover:text-stone-900 transition-colors p-1"
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4 stroke-[1.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[1.5]" />
                        )}
                      </button>
                    </div>

                    {/* Smooth Expandable Description */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100 mt-3 sm:mt-4' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden pl-7 sm:pl-10 pr-4">
                        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-3">
                          <Link
                            href={item.link}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-[#C59B3F] transition-colors group"
                          >
                            <span className="uppercase tracking-widest text-[11px]">Shop Related Style</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SPOTLIGHT: SOULMATE 3 SIGNATURE ("I miss u" Glow)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C59B3F] mb-3">
                New Arrival
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal tracking-tight mb-4">
                Soulmate 3 Signature
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed mb-6 sm:mb-8">
                Refined jewelry details. A softer heart-shaped glow. A new expression of your connection.
              </p>
              <div>
                <Link
                  href="/product/touch-distance-couple-bracelet"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-stone-900 hover:text-[#C59B3F] pb-1 border-b border-stone-900 hover:border-[#C59B3F] transition-colors group"
                >
                  <span>Explore Soulmate 3</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Visual with Glowing Rings */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAF8F5] p-6 flex items-center justify-center group shadow-sm border border-stone-100">
                <Image
                  src="/images/totwoo/showcase-soulmate.jpg"
                  alt="Soulmate 3 Signature"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Floating "I miss u" Script Accent */}
                <div className="absolute top-6 right-8 font-serif italic text-stone-400 text-lg sm:text-2xl drop-shadow-xs pointer-events-none">
                  I miss u
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SPOTLIGHT: YOUR STORIES, BROUGHT TO LIFE (Smart Photo Locket)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Visual: Locket & Note */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-white shadow-md border border-stone-200/50 group">
                <Image
                  src="/images/totwoo/showcase-locket.jpg"
                  alt="Your Stories, Brought to Life"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C59B3F] mb-3">
                A Gift Made Personal
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal tracking-tight mb-4">
                Your Stories, <span className="italic font-normal">Brought to Life.</span>
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed mb-6 sm:mb-8">
                Open the Smart Locket and bring meaningful moments to life. Add a photo slideshow, short video,
                or secret memory — creating a keepsake to carry close, every single day.
              </p>
              <div>
                <Link
                  href="/product/heat-activated-magic-photo-necklace"
                  className="inline-flex items-center gap-3 bg-[#1C1917] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-105"
                >
                  <span>Order Custom Locket</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5B54F]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "FIND YOUR PERFECT MATCH." (5 Luxury Collections Carousel)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200/80 bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header with Title and Interactive Arrows */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-stone-400 mb-2 block">
                Signature Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal tracking-tight">
                Find your perfect match.
              </h2>
            </div>

            {/* Counter and Navigation Buttons */}
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <span className="text-xs font-medium tracking-widest text-stone-500 uppercase">
                {String(currentCollectionIndex + 1).padStart(2, '0')} / {String(COLLECTIONS.length).padStart(2, '0')}{' '}
                Collections
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollSlider('left')}
                  aria-label="Previous Collection"
                  className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider('right')}
                  aria-label="Next Collection"
                  className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Draggable / Scrollable Track */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12"
          >
            {COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={col.link}
                className="group relative flex-none w-[78vw] sm:w-[360px] md:w-[400px] lg:w-[440px] aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900 shadow-md transition-transform duration-500 hover:-translate-y-1 block"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 80vw, 440px"
                  className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />

                {/* Card Top Details */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  {col.badge ? (
                    <span className="bg-[#996515] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {col.badge}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="font-serif italic text-white/80 text-xs tracking-wider">
                    {col.num} / {col.total}
                  </span>
                </div>

                {/* Card Bottom Details */}
                <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5B54F] block mb-1">
                    {col.tagline}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                    {col.title}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    <span className="uppercase tracking-widest text-[10px]">Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E5B54F] group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Drag Progress Track */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
              Drag or scroll to explore &rarr;
            </span>
            <div className="flex-1 max-w-xs h-[2px] bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-800 transition-all duration-300"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SPOTLIGHT: A LITTLE MORE PERSONAL (Custom Charms & Initials)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Visual: Charms & Initials */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-white shadow-md border border-stone-200/50 group flex items-center justify-center p-6">
                <Image
                  src="/images/totwoo/showcase-charms.jpg"
                  alt="A Little More Personal - Custom Charms"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C59B3F] mb-3">
                Make It Yours
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-normal tracking-tight mb-4">
                A Little More <span className="italic font-normal">Personal.</span>
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed mb-6 sm:mb-8">
                Add a meaningful touch with sparkling birthstones, personalized initials, and charms that tell your story.
              </p>
              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 bg-[#1C1917] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-105"
                >
                  <span>Explore Charms</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5B54F]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
