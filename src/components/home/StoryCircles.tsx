'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface StoryItem {
  id: string;
  label: string;
  image: string;
  href: string;
  headline: string;
  tagline: string;
}

const STORIES: StoryItem[] = [
  {
    id: 's-anniversary',
    label: 'Anniversary',
    image: '/images/giftify/stories/anniversary.jpg',
    href: '/shop?category=anniversary-gifts',
    headline: 'Anniversary Specials 🥂',
    tagline: 'Memories that stay forever young and close to heart',
  },
  {
    id: 's-couple',
    label: 'Couple',
    image: '/images/giftify/stories/couple.jpg',
    href: '/shop?category=couple-gifts',
    headline: 'For You & Your Forever ❤️',
    tagline: 'Vibrating touch bracelets & couple lockets',
  },
  {
    id: 's-birthday',
    label: 'Birthday',
    image: '/images/giftify/stories/birthday.jpg',
    href: '/shop?category=birthday-gifts',
    headline: 'Make Their Birthday Magical 🎂',
    tagline: 'Customized currency notes, magic mugs & crystal cubes',
  },
  {
    id: 's-personalized',
    label: 'Personalized',
    image: '/images/giftify/stories/personalized.jpg',
    href: '/shop?category=personalized-gifts',
    headline: 'Handcrafted With Your Names ✨',
    tagline: 'Engraved wooden frames & 3D name flips',
  },
  {
    id: 's-for-him',
    label: 'For Him',
    image: '/images/giftify/stories/for-him.jpg',
    href: '/shop?category=couple-gifts',
    headline: 'Thoughtful Gifts For Him 🎁',
    tagline: 'Personalized wallets, keychains & projection bracelets',
  },
  {
    id: 's-for-her',
    label: 'For Her',
    image: '/images/giftify/stories/for-her.jpg',
    href: '/shop?category=anniversary-gifts',
    headline: 'Surprise Her Like Never Before 💖',
    tagline: 'Love pearl oysters, magic photo lockets & glow lamps',
  },
  {
    id: 's-love',
    label: 'Love',
    image: '/images/giftify/stories/love.jpg',
    href: '/shop?category=couple-gifts',
    headline: 'Express What Words Cannot 💌',
    tagline: 'Pure romance and everlasting keepsakes',
  },
  {
    id: 's-surprise',
    label: 'Surprise',
    image: '/images/giftify/stories/surprise.jpg',
    href: '/shop',
    headline: 'Unbox Pure Happiness 🎉',
    tagline: 'Trending gifts that bring happy tears',
  },
];

export default function StoryCircles() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Auto-progress timer for Instagram Story viewer
  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go to next story or close
          if (activeStoryIndex < STORIES.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex]);

  const openStory = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveStoryIndex(idx);
    setProgress(0);
  };

  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < STORIES.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };

  return (
    <>
      <section className="bg-white py-5 sm:py-6 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto pb-2 scrollbar-none px-2 snap-x snap-mandatory scroll-smooth">
            {STORIES.map((story, idx) => (
              <button
                key={story.id}
                onClick={(e) => openStory(idx, e)}
                className="flex flex-col items-center group flex-shrink-0 cursor-pointer text-center focus:outline-hidden snap-start"
              >
                {/* Clean Giftify Yellow Story Circle matching frame 001 */}
                <div className="relative w-[76px] h-[76px] sm:w-[90px] sm:h-[90px] rounded-full overflow-hidden shadow-xs group-hover:shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 bg-white">
                  <Image
                    src={story.image}
                    alt={story.label}
                    fill
                    sizes="(max-width: 640px) 76px, 90px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-stone-900 mt-2 group-hover:text-[#F5C400] transition-colors tracking-tight">
                  {story.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 text-white/80 hover:text-white p-2 bg-black/40 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Close story"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Desktop Left / Right Navigation Arrows */}
          <button
            onClick={prevStory}
            disabled={activeStoryIndex === 0}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center transition-colors disabled:opacity-20"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <button
            onClick={nextStory}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center transition-colors"
            aria-label="Next story"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Story Phone Card Container */}
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border border-stone-800 flex flex-col justify-between">
            {/* Background Story Image */}
            <Image
              src={STORIES[activeStoryIndex].image}
              alt={STORIES[activeStoryIndex].headline}
              fill
              className="object-cover"
              priority
              unoptimized
            />

            {/* Top Vignette and Progress Bars */}
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              {/* Progress bars row */}
              <div className="flex gap-1.5 mb-3">
                {STORIES.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{
                        width:
                          i < activeStoryIndex
                            ? '100%'
                            : i === activeStoryIndex
                            ? `${progress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Author Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#F5C400] text-black font-extrabold flex items-center justify-center text-sm shadow-sm">
                  🎁
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold leading-tight flex items-center gap-1.5">
                    ELVORA
                    <span className="bg-[#F5C400] text-black text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      VERIFIED
                    </span>
                  </h4>
                  <span className="text-stone-300 text-[10px]">
                    {STORIES[activeStoryIndex].label} Spotlight
                  </span>
                </div>
              </div>
            </div>

            {/* Tap areas for mobile story nav */}
            <div className="absolute inset-y-20 inset-x-0 z-10 flex">
              <div className="w-1/2 h-full" onClick={prevStory} />
              <div className="w-1/2 h-full" onClick={nextStory} />
            </div>

            {/* Bottom Content & CTA */}
            <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
              <span className="inline-flex items-center gap-1.5 text-[#F5C400] text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Spotlight
              </span>
              <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-1 drop-shadow-md">
                {STORIES[activeStoryIndex].headline}
              </h3>
              <p className="text-stone-200 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">
                {STORIES[activeStoryIndex].tagline}
              </p>

              <Link
                href={STORIES[activeStoryIndex].href}
                onClick={() => setActiveStoryIndex(null)}
                className="w-full bg-[#F5C400] hover:bg-[#FFD747] text-black font-extrabold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
              >
                <span>Shop This Collection</span>
                <span>👉</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
