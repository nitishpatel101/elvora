'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function FeaturedCollections() {
  const collections = [
    {
      title: 'Couple Bracelets',
      subtitle: 'Celestial Synchrony & Touch Indicators',
      href: '/shop/couple-bracelets',
      image: '/images/products/touch-distance-bracelet/hero.jpg',
      itemCount: '4 Creations',
    },
    {
      title: 'Necklaces & Pendants',
      subtitle: 'Ruby Crystal & Sculpted Daggers',
      href: '/shop/necklaces',
      image: '/images/products/heart-sword-pendant-necklace/hero.jpg',
      itemCount: 'Fine Silver Tier',
    },
    {
      title: 'Lantern Earrings',
      subtitle: 'Architectural Gold & Freshwater Pearls',
      href: '/shop/earrings',
      image: '/images/products/golden-lantern-pearl-earrings/hero.jpg',
      itemCount: '18K Gold Plated',
    },
  ];

  return (
    <section className="py-20 bg-[#F8F6F2] border-b border-[#E7E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A69] font-medium block">
              Curated Universes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light mt-1">
              Featured Collections
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#171717] hover:text-[#B89A69] transition-colors mt-4 md:mt-0 font-medium"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              className="group relative flex flex-col overflow-hidden bg-[#EFEAE2] border border-[#E7E1D8]"
            >
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white flex items-end justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#D7C4A5] block">
                    {col.itemCount}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-white mt-1 group-hover:text-[#D7C4A5] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-[11px] text-white/80 font-light mt-1">
                    {col.subtitle}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:bg-[#B89A69] group-hover:border-[#B89A69] transition-colors shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
