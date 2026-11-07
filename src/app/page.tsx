import { getAllProducts } from '@/lib/db';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import BestSellersSection from '@/components/home/BestSellersSection';
import BurgundyBanner from '@/components/home/BurgundyBanner';
import LifestyleCampaign from '@/components/home/LifestyleCampaign';
import BrandStory from '@/components/home/BrandStory';
import TrustSection from '@/components/home/TrustSection';
import CustomerReviewsSection from '@/components/reviews/CustomerReviewsSection';

export const revalidate = 0; // Dynamic products from database

export default async function HomePage() {
  const products = await getAllProducts(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. AUrate Editorial Hero Section */}
      <HeroSection />

      {/* 2. AUrate 4-Image Category Showcase (from Frame 004 of recording) */}
      <CategoryGrid />

      {/* 3. AUrate Bestsellers Section (from Frame 004 & 007 of recording) */}
      <BestSellersSection initialProducts={products} />

      {/* 4. AUrate Deep Burgundy Editorial Banner (from Frame 008 of recording) */}
      <BurgundyBanner />

      {/* 5. AUrate Full-Width Lifestyle Campaign with Play/Pause (from Frame 013 & 015) */}
      <LifestyleCampaign />

      {/* 6. Brand Story Section: More Than Jewellery. A Feeling. */}
      <BrandStory />

      {/* 7. Verified Hinglish Customer Reviews & Write a Review */}
      <CustomerReviewsSection />

      {/* 8. Clean Trust Guarantees */}
      <TrustSection />
    </div>
  );
}
