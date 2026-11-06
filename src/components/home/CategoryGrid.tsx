'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryGrid() {
  const categories = [
    {
      label: 'NECKLACES',
      href: '/shop/necklaces',
      image: '/images/products/heart-sword-pendant-necklace/hero.jpg',
      alt: 'ELVORA Necklaces and Pendants',
    },
    {
      label: 'BRACELETS',
      href: '/shop/couple-bracelets',
      image: '/images/products/sun-moon-chain-bracelet/hero.jpg',
      alt: 'ELVORA Fine Bracelets',
    },
    {
      label: 'COUPLE SETS',
      href: '/shop/couple-bracelets',
      image: '/images/products/touch-distance-bracelet/hero.jpg',
      alt: 'ELVORA Matching Couple Jewellery',
    },
    {
      label: 'EARRINGS',
      href: '/shop/earrings',
      image: '/images/products/golden-lantern-pearl-earrings/hero.jpg',
      alt: 'ELVORA Fine Earrings',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-[#EAE5DE]">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group block text-center"
            >
              <div className="relative aspect-square w-full bg-[#F0EDE8] overflow-hidden mb-3 sm:mb-4 border border-[#EAE5DE]/60">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#181818] group-hover:text-[#24332C] transition-colors">
                {cat.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

