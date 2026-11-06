import { getAllProducts } from '@/lib/db';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import BestSellersSection from '@/components/home/BestSellersSection';
import BrandStory from '@/components/home/BrandStory';
import EditorialSection from '@/components/home/EditorialSection';
import TrustSection from '@/components/home/TrustSection';

export const revalidate = 0; // Ensure fresh products from dynamic database

export default async function HomePage() {
  const products = await getAllProducts(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero with Interactive 3D */}
      <HeroSection />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* Bestselling Products from DB */}
      <BestSellersSection initialProducts={products} />

      {/* Brand Story */}
      <BrandStory />

      {/* Campaign Editorial with Supplied Assets */}
      <EditorialSection />

      {/* Trust & Guarantee Section */}
      <TrustSection />
    </div>
  );
}
