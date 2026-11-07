'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import storiesData from '../../../data/stories.json';

interface StoryItem {
  id: string;
  label: string;
  image: string;
  href: string;
  headline?: string;
  tagline?: string;
}

const DEFAULT_STORIES: StoryItem[] = storiesData;

export default function StoryCircles() {
  const [stories, setStories] = useState<StoryItem[]>(DEFAULT_STORIES);

  // Fetch updated stories dynamically from admin API
  useEffect(() => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStories(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-5 sm:py-6 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto pb-2 scrollbar-none px-2 snap-x snap-mandatory scroll-smooth">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={story.href || '/shop'}
              className="flex flex-col items-center group flex-shrink-0 cursor-pointer text-center focus:outline-hidden snap-start"
            >
              {/* Clean Giftify Yellow Story Circle */}
              <div className="relative w-[76px] h-[76px] sm:w-[90px] sm:h-[90px] rounded-full overflow-hidden shadow-xs ring-2 ring-stone-100 group-hover:ring-[#F5C400] group-hover:shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 bg-white">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
