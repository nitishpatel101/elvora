'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

const REELS = [
  {
    id: 'r-1',
    title: 'Birthday Currency Note...',
    price: 'Rs. 650.00',
    slug: 'birthday-currency-note',
    image: '/images/giftify/products/reel-1.jpg',
    tag: 'Comment "Birthday" to get link',
  },
  {
    id: 'r-2',
    title: 'Long Distance Touch...',
    price: 'Rs. 6,999.00',
    slug: 'touch-distance-couple-bracelet',
    image: '/images/giftify/products/reel-2.jpg',
    tag: 'Comment "Long Distance" for link',
  },
  {
    id: 'r-3',
    title: 'Customised Dairy Milk...',
    price: 'Rs. 499.00',
    slug: 'personalized-wooden-engraving-gift',
    image: '/images/giftify/products/reel-3.jpg',
    tag: 'Happy Wedding Anniversary',
  },
  {
    id: 'r-4',
    title: 'Heart 3D Crystal Photo...',
    price: 'Rs. 2,999.00',
    slug: '3d-crystal-photo-cube',
    image: '/images/giftify/products/reel-4.jpg',
    tag: 'Heart crystal',
  },
];

export default function ShopFromVideos() {
  return (
    <section className="bg-white py-12 border-b border-stone-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 text-center tracking-tight mb-8">
          Shop From Videos
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {REELS.map((reel) => (
            <Link
              key={reel.id}
              href={`/product/${reel.slug}`}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group block"
            >
              <Image
                src={reel.image}
                alt={reel.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Play Button Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white">
                <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
              </div>

              {/* Bottom Tag / Product Pill */}
              <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-xs rounded-xl p-2.5 flex items-center gap-2 shadow-lg">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-stone-900 truncate">
                    {reel.title}
                  </h3>
                  <span className="text-xs font-extrabold text-stone-900 block mt-0.5">
                    {reel.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

