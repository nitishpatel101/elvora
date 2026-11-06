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
    <div className="min-h-screen bg-[#FAF8F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AUrate-style Clean Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#708579] font-medium block">
            THE ATELIER VAULT
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#181818] font-light mt-1 tracking-tight">
            All Jewellery Creations
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5852] mt-3 font-light leading-relaxed">
            Every piece is imbued with intention, from illuminated couple touch bracelets to handcrafted ruby crystals and architectural pearl chandeliers.
          </p>
        </div>

        {/* Dynamic Client Grid with AUrate Filters and Sorting */}
        <ProductGridClient
          initialProducts={products}
          categories={categories}
          initialSearch={search}
          initialCategory={category || (collection === 'gifts' ? 'all' : undefined)}
        />
      </div>
    </div>
  );
}
