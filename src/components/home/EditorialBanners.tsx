'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function EditorialBanners() {
  return (
    <section className="py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Banner 1: Made for Two */}
          <div className="relative group overflow-hidden bg-[#FAF8F5] border border-[#EAE5DE]">
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden">
              <Image
                src="/images/brand/story-couple.jpg"
                alt="Couple wearing ELVORA Touch Distance Bracelets"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#19241F]/90 via-[#19241F]/40 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 text-[#FFFFFF] flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#D5E0D9] font-medium block">
                THE COUPLE ATELIER
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] font-light mt-1.5 leading-tight">
                Made for Two
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF8F5]/85 mt-2 max-w-md font-light leading-relaxed">
                Celebrate the little things that make your connection special.
              </p>
              <div className="pt-5">
                <Link
                  href="/shop/couple-bracelets"
                  className="inline-flex items-center gap-2.5 bg-[#FFFFFF] text-[#24332C] px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#EEF3F0] transition-all duration-300"
                >
                  <span>SHOP COUPLE COLLECTION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2: The Art of Gifting */}
          <div className="relative group overflow-hidden bg-[#FAF8F5] border border-[#EAE5DE]">
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden">
              <Image
                src="/images/brand/editorial-earrings.jpg"
                alt="ELVORA Gifting Showcase - Golden Lantern Pearl Earrings"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#19241F]/90 via-[#19241F]/40 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 text-[#FFFFFF] flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#D5E0D9] font-medium block">
                SIGNATURE PACKAGING INCLUDED
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] font-light mt-1.5 leading-tight">
                The Art of Gifting
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF8F5]/85 mt-2 max-w-md font-light leading-relaxed">
                Thoughtful pieces for unforgettable moments.
              </p>
              <div className="pt-5">
                <Link
                  href="/shop?collection=gifts"
                  className="inline-flex items-center gap-2.5 bg-[#FFFFFF] text-[#24332C] px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#EEF3F0] transition-all duration-300"
                >
                  <span>EXPLORE GIFTS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
