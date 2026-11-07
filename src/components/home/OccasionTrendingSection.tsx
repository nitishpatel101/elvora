'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const OCCASION_PRODUCTS = [
  {
    slug: 'birthday-currency-note',
    name: 'Birthday Currency Note',
    price: 'From Rs. 650.00',
    image: '/images/giftify/products/birthday-currency-note.jpg',
    onSale: false,
  },
  {
    slug: '3d-crystal-photo-cube',
    name: '3D Crystal Photo Cube',
    price: 'From Rs. 899.00',
    originalPrice: 'Rs. 1,249.00',
    image: '/images/giftify/products/3d-crystal-photo-cube.jpg',
    onSale: true,
  },
  {
    slug: 'feather-painting',
    name: 'Feather Painting',
    price: 'From Rs. 2,500.00',
    image: '/images/giftify/products/feather-painting.jpg',
    onSale: false,
  },
  {
    slug: 'personalized-wooden-engraving-gift',
    name: 'Personalized Wooden Engraving Gift',
    price: 'From Rs. 399.00',
    image: '/images/giftify/products/wooden-engraving-gift.jpg',
    onSale: false,
  },
];

export default function OccasionTrendingSection() {
  return (
    <section className="bg-white py-14 border-b border-stone-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 text-center tracking-tight mb-8">
          Trending Gifts in Occasion Category
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {OCCASION_PRODUCTS.map((prod) => (
            <Link
              key={prod.slug}
              href={`/product/${prod.slug}`}
              className="group block flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-50 border border-stone-200 mb-3 shadow-xs group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                {prod.onSale && (
                  <span className="absolute bottom-3 left-3 bg-black/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    Sale
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#DDB373] transition-colors leading-snug">
                  {prod.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  {prod.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      {prod.originalPrice}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    {prod.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block bg-[#111111] hover:bg-black text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-transform hover:scale-105"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

