import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllProducts, getCategories } from '@/lib/db';
import ProductGridClient from '../ProductGridClient';

export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  if (!currentCategory) {
    notFound();
  }

  const allProducts = await getAllProducts(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner for Long Distance Smart Bracelets */}
        <div className="relative w-full aspect-[2/1] sm:aspect-[2.8/1] lg:aspect-[3.2/1] max-h-[380px] rounded-2xl overflow-hidden shadow-xl mb-10 sm:mb-12 border border-stone-200/80 bg-stone-900">
          <Image
            src="/images/totwoo_collection_banner.gif"
            alt="Feel Love Close To You - Long Distance Bracelets"
            fill
            unoptimized
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent flex items-center p-6 sm:p-10 lg:p-14">
            <div className="max-w-lg text-white">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#E5B54F]/70 bg-black/60 backdrop-blur-md flex-none shadow-md">
                  <Image src="/images/logo-transparent.png" alt="ELVORA" fill className="object-contain p-1" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#E5B54F]">
                  {currentCategory?.name || 'Long Distance Bracelets'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight mb-2 sm:mb-3">
                Feel Love Close To You
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed hidden sm:block">
                ELVORA’s bond bracelets for couples turn every touch, tap, flash, or buzz into a message from the heart.
                Crafted for emotional connection and long-distance love.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Grid Pre-filtered to this Category */}
        <ProductGridClient
          initialProducts={allProducts}
          categories={categories}
          initialCategory={categorySlug}
        />
      </div>
    </div>
  );
}
