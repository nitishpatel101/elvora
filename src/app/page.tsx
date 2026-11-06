import { getAllProducts } from '@/lib/db';
import HeroSection from '@/components/home/HeroSection';
import CategoryStrip from '@/components/home/CategoryStrip';
import BestSellersSection from '@/components/home/BestSellersSection';
import EditorialBanners from '@/components/home/EditorialBanners';
import BrandStory from '@/components/home/BrandStory';
import TrustSection from '@/components/home/TrustSection';

export const revalidate = 0; // Dynamic products from database

export default async function HomePage() {
  const products = await getAllProducts(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5F0]">
      {/* 1. Large Editorial Hero Section */}
      <HeroSection />

      {/* 2. Category Navigation Strip */}
      <CategoryStrip />

      {/* 3. Featured Products Showcase: CURATED FOR YOU */}
      <BestSellersSection initialProducts={products} />

      {/* 4. Side-by-Side Editorial Promotional Banners: Made for Two & The Art of Gifting */}
      <EditorialBanners />

      {/* 5. Brand Story Section: More Than Jewellery. A Feeling. */}
      <BrandStory />

      {/* 6. Clean Trust Section: 4 Verified Store Benefits */}
      <TrustSection />
    </div>
  );
}
