import { getAllProducts, getHeroSlides } from '@/lib/db';
import HeroSection from '@/components/home/HeroSection';
import TotwooShowcaseSection from '@/components/home/TotwooShowcaseSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import PhotoReviewsSection from '@/components/home/PhotoReviewsSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';

export const revalidate = 0; // Dynamic products from database

export default async function HomePage() {
  const products = await getAllProducts(false);
  const heroSlides = await getHeroSlides();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section: Feel Love Close To You & Video Banners */}
      <HeroSection initialSlides={heroSlides} />

      {/* 2. Totwoo Reference Interactive Showcase (Connected Features, Collections Slider, Spotlights) */}
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
