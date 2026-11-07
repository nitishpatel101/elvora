'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface StoryItem {
  label: string;
  image: string;
  href: string;
}

const STORIES: StoryItem[] = [
  { label: 'Anniversary', image: '/images/giftify/stories/anniversary.jpg', href: '/shop?category=anniversary-gifts' },
  { label: 'Couple', image: '/images/giftify/stories/couple.jpg', href: '/shop?category=couple-gifts' },
  { label: 'Birthday', image: '/images/giftify/stories/birthday.jpg', href: '/shop?category=birthday-gifts' },
  { label: 'Personalized', image: '/images/giftify/stories/personalized.jpg', href: '/shop?category=personalized-gifts' },
  { label: 'For Him', image: '/images/giftify/stories/for-him.jpg', href: '/shop?category=couple-gifts' },
  { label: 'For Her', image: '/images/giftify/stories/for-her.jpg', href: '/shop?category=anniversary-gifts' },
  { label: 'Love', image: '/images/giftify/stories/love.jpg', href: '/shop?category=couple-gifts' },
  { label: 'Surprise', image: '/images/giftify/stories/surprise.jpg', href: '/shop' },
];

export default function StoryCircles() {
  return (
    <section className="bg-white py-6 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto pb-2 scrollbar-none">
          {STORIES.map((story) => (
            <Link
              key={story.label}
              href={story.href}
              className="flex flex-col items-center group flex-shrink-0"
            >
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-[#F5C400] via-[#FFD747] to-[#F5C400] shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white border border-stone-200">
                  <Image
                    src={story.image}
                    alt={story.label}
                    fill
                    sizes="88px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-stone-800 mt-2 group-hover:text-[#F5C400] transition-colors">
                {story.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

