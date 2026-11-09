import { getAllProducts } from '@/lib/db';
import TotwooHomeHero from '@/components/home/TotwooHomeHero';
import TotwooShowcaseSection from '@/components/home/TotwooShowcaseSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import PhotoReviewsSection from '@/components/home/PhotoReviewsSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';

export const revalidate = 0; // Dynamic products from database

export default async function HomePage() {
  const products = await getAllProducts(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Official Video Hero: Love Knows No Distance (Cleanly trimmed without Totwoo logo) */}
      <TotwooHomeHero />

      {/* 2. Totwoo Interactive Showcase (Synced Touch, Call Alert, Anniversary, Collections) */}
      <TotwooShowcaseSection />

      {/* 3. Best Sellers Carousel */}
      <BestSellersSection initialProducts={products} />

      {/* 4. Real Photo Customer Reviews (★★★★★ 4.92) */}
      <PhotoReviewsSection />

      {/* 5. Why People Choose ELVORA (Yellow Banner + Trust Badges + Scroll Count-Up) */}
      <WhyChooseUs />
    </div>
  );
}
