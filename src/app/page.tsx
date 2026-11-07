import { getAllProducts } from '@/lib/db';
import StoryCircles from '@/components/home/StoryCircles';
import HeroSection from '@/components/home/HeroSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import PhotoReviewsSection from '@/components/home/PhotoReviewsSection';
import OccasionTrendingSection from '@/components/home/OccasionTrendingSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';

export const revalidate = 0; // Dynamic products from database

export default async function HomePage() {
  const products = await getAllProducts(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Instagram Story-Style Category Circles */}
      <StoryCircles />

      {/* 2. Hero Section: Memories That Glow Forever */}
      <HeroSection />

      {/* 3. Best Sellers Carousel */}
      <BestSellersSection initialProducts={products} />

      {/* 4. Real Photo Customer Reviews (★★★★★ 4.88) */}
      <PhotoReviewsSection />

      {/* 5. Trending Gifts in Occasion Category (Sale Badges) */}
      <OccasionTrendingSection />

      {/* 6. Why People Choose ELVORA (Yellow Banner + Trust Badges + Scroll Count-Up) */}
      <WhyChooseUs />
    </div>
  );
}
