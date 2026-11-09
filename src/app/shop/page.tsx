import Image from 'next/image';
import { getAllProducts, getCategories } from '@/lib/db';
import ProductGridClient from './ProductGridClient';

export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; collection?: string }>;
}) {
  const { search, category, collection } = await searchParams;
  const products = await getAllProducts(false);
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Long Distance Touch Bracelets Luxury Collection Banner */}
        <div className="relative w-full aspect-[2/1] sm:aspect-[2.8/1] lg:aspect-[3.2/1] max-h-[380px] rounded-2xl overflow-hidden shadow-xl mb-10 sm:mb-12 border border-stone-200/80 bg-stone-900">
          <Image
            src="/images/totwoo_collection_banner.gif"
            alt="Feel Love Close To You - Long Distance Bracelets"
            fill
            unoptimized
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/40 sm:to-transparent flex items-end sm:items-center p-4 sm:p-10 lg:p-14 pb-4 sm:pb-10">
            <div className="max-w-lg text-white">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1 sm:mb-2.5">
                <div className="relative w-6 h-6 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#E5B54F]/70 bg-black/60 backdrop-blur-md flex-none shadow-md">
                  <Image src="/images/logo-transparent.png" alt="ELVORA" fill className="object-contain p-0.5 sm:p-1" />
                </div>
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#E5B54F]">
                  Long Distance Bracelets
                </span>
              </div>
              <h1 className="font-serif text-lg sm:text-3xl lg:text-4xl font-normal leading-tight mb-1 sm:mb-3">
                Feel Love Close To You
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed hidden sm:block">
                ELVORA’s bond bracelets for couples turn every touch, tap, flash, or buzz into a message from the heart.
                Crafted for emotional connection and long-distance love.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Client Grid with AUrate Filters and Sorting */}
        <ProductGridClient
          key={category || 'all'}
          initialProducts={products}
          categories={categories}
          initialSearch={search}
          initialCategory={category || (collection === 'gifts' ? 'all' : undefined)}
        />
      </div>
    </div>
  );
}
