import { getAllProducts } from '@/lib/db';
import StoryCircles from '@/components/home/StoryCircles';
import HeroSection from '@/components/home/HeroSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import ShopFromVideos from '@/components/home/ShopFromVideos';
import PhotoReviewsSection from '@/components/home/PhotoReviewsSection';
import OccasionTrendingSection from '@/components/home/OccasionTrendingSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ShopByPrice from '@/components/home/ShopByPrice';

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

      {/* 4. Shop From Videos (Reels / Shorts) */}
      <ShopFromVideos />

      {/* 5. Real Photo Customer Reviews (★★★★★ 4.88) */}
      <PhotoReviewsSection />

      {/* 6. Trending Gifts in Occasion Category (Sale Badges) */}
      <OccasionTrendingSection />

      {/* 7. Why People Choose ELVORA (Yellow Banner + Trust Badges) */}
      <WhyChooseUs />

      {/* 8. Shop by Price (Under ₹199, ₹499, ₹999, ₹1999, Premium) */}
      <ShopByPrice />
    </div>
  );
}
