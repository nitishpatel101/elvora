import { notFound } from 'next/navigation';
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
    <div className="min-h-screen bg-[#F8F6F2] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Dedicated Collection
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#171717] font-light mt-1">
            {currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#77736D] mt-3 font-light leading-relaxed">
            {currentCategory.description}
          </p>
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

