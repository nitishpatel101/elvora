'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import CustomerReviewsSection from '@/components/reviews/CustomerReviewsSection';
import {
  ShoppingBag,
  Zap,
  Truck,
  Sparkles,
  ChevronDown,
  Star,
  Heart,
} from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.953.562 3.828 1.625 5.438L2 22l4.672-1.625A9.97 9.97 0 0 0 12.031 22C17.562 22 22 17.531 22 12.031 22 6.5 17.531 2 12.031 2zm5.781 14.156c-.25.688-1.406 1.344-1.969 1.406-.531.063-1.188.094-1.906-.156-.469-.156-1.063-.375-1.844-.719-3.25-1.406-5.375-4.688-5.531-4.906-.156-.219-1.281-1.719-1.281-3.281 0-1.563.813-2.313 1.094-2.625.281-.313.625-.406.844-.406.219 0 .438 0 .625.031.219.031.469-.063.719.563.281.688.938 2.281 1.031 2.469.094.188.156.406.031.625-.094.219-.188.344-.344.531-.156.188-.344.406-.469.563-.156.156-.313.344-.125.656.188.313.844 1.375 1.813 2.25 1.25 1.125 2.313 1.469 2.625 1.625.313.156.5.125.688-.094.188-.219.813-.938 1.031-1.281.219-.344.438-.281.719-.188.281.094 1.813.844 2.125 1 .313.156.531.25.625.375.094.125.094.75-.156 1.438z" />
  </svg>
);

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.name || 'Standard'
  );
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [showIncentive, setShowIncentive] = useState(true);

  const inWish = isInWishlist(product.id);

  const savingsAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariant);
    router.push('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedVariant);
    router.push('/checkout');
  };

  const whatsappOrderUrl = `https://wa.me/916386645203?text=Hi%20ELVORA,%20I%20want%20to%20order%20*${encodeURIComponent(
    product.name
  )}*%20(${selectedVariant})%20priced%20at%20₹${product.price}.`;

  return (
    <div className="space-y-16">
      {/* Primary 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Gallery Column */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Purchase & Information Column (Giftify D2C Style) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand Tag */}
            <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold block">
              ELVORA
            </span>

            {/* Product Title with Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h1>
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
                className="p-2.5 rounded-full border border-stone-200 hover:border-black shrink-0 transition-colors shadow-2xs"
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-red-500 text-red-500' : 'text-stone-700 stroke-[1.6]'}`} />
              </button>
            </div>

            {/* Price Row matching Giftify */}
            <div className="flex items-baseline gap-3 pt-1">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base sm:text-lg text-stone-400 line-through font-normal">
                  Rs. {product.originalPrice.toLocaleString('en-IN')}.00
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Rs. {product.price.toLocaleString('en-IN')}.00
              </span>
              {savingsAmount > 0 && (
                <span className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sale
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 font-normal">
              Shipping calculated at checkout.
            </p>

            {/* Reviews Stars & Live Viewers */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#F5C400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-[#F5C400]" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-700">
                  44 reviews
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>🔥 29 people viewing right now</span>
              </div>
            </div>

            {/* Expected Delivery & Countdown */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <Truck className="w-4 h-4 text-[#F5C400]" />
                <span>Expected Delivery: 3-5 Business Days across India</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <span>⚡</span>
                <span>Order within <strong>03h 24m</strong> for Dispatch Tomorrow!</span>
              </p>
            </div>

            {/* Variant Pill Selectors matching Giftify frame 025 & 030 */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-4 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  Select Model / Variant:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.name)}
                      className={`text-xs px-4 py-2 rounded-full font-semibold transition-all ${
                        selectedVariant === v.name
                          ? 'bg-black text-white shadow-md'
                          : 'bg-white text-stone-800 border border-stone-300 hover:border-black'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Updates Input */}
            <div className="pt-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Whatsapp Number For Order Updates
              </label>
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden focus-within:border-black bg-stone-50">
                <span className="px-3 text-xs text-stone-500 font-mono">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full text-xs py-2.5 pr-3 bg-transparent focus:outline-none text-stone-900"
                />
              </div>
            </div>

            {/* Floating Incentive Pill */}
            {showIncentive && savingsAmount > 0 && (
              <div className="bg-stone-900 text-white rounded-full px-4 py-2 flex items-center justify-between text-xs font-medium shadow-lg animate-fade-in">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C400]" />
                  Save ₹{savingsAmount.toLocaleString('en-IN')}.00 off the original price
                </span>
                <button
                  onClick={() => setShowIncentive(false)}
                  className="text-stone-400 hover:text-white ml-2 text-sm"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Action Buttons: Buy Now & Order on WhatsApp */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-[#111111] hover:bg-black text-white py-3.5 px-6 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-[#F5C400]" />
                <span>Buy Now &bull; ₹{product.price.toLocaleString('en-IN')}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-800 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">Order on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quote / Highlight from Frame 026 */}
            <div className="pt-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                Engraved with Jane Austen&apos;s quote, <span className="font-semibold text-stone-900">&ldquo;My heart is, and always will be yours&rdquo;</span> on the backside.
              </p>
            </div>

            {/* Product Details & Care Accordion */}
            <div className="pt-4 divide-y divide-stone-200 text-xs">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                className="w-full py-3 flex items-center justify-between text-left font-bold text-stone-900"
              >
                <span>Product Specifications</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'details' && (
                <div className="py-3 text-stone-600 space-y-2 leading-relaxed">
                  <p>{product.description}</p>
                  {product.details && Object.entries(product.details).map(([k, v]) => (
                    <p key={k}>
                      <strong className="capitalize text-stone-800">{k}:</strong> {v}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Customer Reviews & Stories */}
      <CustomerReviewsSection
        productId={product.id}
        productName={product.name}
      />

      {/* Related Products Recommendation Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-stone-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#F5C400] font-bold block">
              MORE GIFTING IDEAS
            </span>
            <h2 className="text-2xl sm:text-3xl text-stone-900 font-extrabold mt-1">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* Floating Gift Assistant / Save Incentive Pill (Giftify Frame 036) */}
      {showIncentive && savingsAmount > 0 && (
        <div className="fixed bottom-6 right-4 sm:right-8 z-40 flex flex-col items-end gap-2 animate-bounce-subtle pointer-events-auto">
          {/* Question bubble */}
          <div className="bg-stone-900 text-white text-[11px] sm:text-xs font-semibold py-1.5 px-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-1.5">
            <span>💭</span>
            <span>Is this a good gift for anniversaries?</span>
          </div>

          {/* Action pill */}
          <div className="bg-white text-stone-900 border border-stone-200 rounded-full pl-3 pr-2 py-1.5 shadow-2xl flex items-center gap-2 text-xs font-extrabold hover:border-[#F5C400] transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#111111] text-[#F5C400] flex items-center justify-center text-[10px]">
              ✨
            </span>
            <span>Save ₹{savingsAmount.toLocaleString('en-IN')}.00 off original price</span>
            <button
              onClick={() => setShowIncentive(false)}
              className="text-stone-400 hover:text-black p-1 text-sm leading-none ml-1 cursor-pointer"
              aria-label="Dismiss incentive"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Sticky Mobile Buy Now Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-11 h-11 bg-white border border-stone-200 rounded-lg overflow-hidden shrink-0">
            <Image
              src={product.images[0] || '/images/giftify/products/touch-vibration-bracelet.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">
              {product.name}
            </h4>
            <span className="text-xs font-extrabold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="bg-black text-white py-2.5 px-5 rounded-lg text-xs uppercase font-bold shrink-0 shadow active:scale-95 flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-[#F5C400]" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
