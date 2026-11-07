'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Check,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.name || ''
  );
  const [selectedColour, setSelectedColour] = useState(
    product.colours?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>('details');

  const inWish = isInWishlist(product.id);

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedColour);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant, selectedColour);
    router.push('/checkout');
  };

  return (
    <div className="space-y-16">
      {/* Primary 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Gallery Column */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Purchase & Information Column (AUrate style) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#708579] font-medium">
                {product.category}
              </span>
              {product.isBestSeller && (
                <span className="text-[9px] uppercase tracking-[0.2em] bg-[#24332C] text-[#FFFFFF] px-2.5 py-0.5 font-light">
                  Bestseller
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light leading-tight">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-xs text-[#5C5852] mt-1.5 font-light leading-relaxed">
                {product.tagline}
              </p>
            )}

            {/* SKU & Origin */}
            <div className="pt-2 text-[10px] text-[#8A857D] uppercase tracking-wider">
              SKU: {product.id.toUpperCase()} &bull; Origin: Fine Jewellery Atelier
            </div>

            {/* Price Row */}
            <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-[#EAE5DE]">
              <span className="font-serif text-2xl sm:text-3xl font-light text-[#181818]">
                {format(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#8A857D] line-through font-light">
                  {format(product.originalPrice)}
                </span>
              )}
              {discountPercentage && (
                <span className="text-[11px] font-medium text-[#24332C] bg-[#EEF3F0] px-2 py-0.5 uppercase tracking-wider">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="pt-3 flex items-center gap-2 text-xs">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.inStock ? 'bg-emerald-600' : 'bg-red-500'
                }`}
              />
              <span className="text-[#181818] font-light">
                {product.inStock
                  ? `In Stock (${product.stock} units available)`
                  : 'Currently Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="pt-4">
              <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Colour Selector if multiple */}
            {product.colours && product.colours.length > 0 && (
              <div className="pt-6 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#181818] font-medium block">
                  Curated Colourway: <span className="text-[#5C5852] font-light">{selectedColour}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColour(col)}
                      className={`text-xs px-3.5 py-1.5 border transition-all ${
                        selectedColour === col
                          ? 'border-[#24332C] bg-[#EEF3F0] text-[#24332C] font-medium'
                          : 'border-[#EAE5DE] text-[#5C5852] hover:border-[#181818]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants if present */}
            {product.variants && product.variants.length > 1 && (
              <div className="pt-4 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#181818] font-medium block">
                  Edition:
                </span>
                <div className="space-y-1.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.name)}
                      className={`w-full text-left text-xs p-3 border flex items-center justify-between transition-all ${
                        selectedVariant === v.name
                          ? 'border-[#24332C] bg-[#EEF3F0] text-[#24332C] font-medium'
                          : 'border-[#EAE5DE] text-[#5C5852] hover:border-[#181818]'
                      }`}
                    >
                      <span>{v.name}</span>
                      {selectedVariant === v.name && (
                        <Check className="w-4 h-4 text-[#24332C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-6 flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#181818] font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-[#EAE5DE] bg-[#FFFFFF]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-xs text-[#5C5852] hover:text-[#181818]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-medium text-[#181818]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-xs text-[#5C5852] hover:text-[#181818]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="pt-6 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#24332C] text-[#FFFFFF] py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`p-4 border transition-colors ${
                    inWish
                      ? 'border-[#24332C] bg-[#EEF3F0] text-[#24332C]'
                      : 'border-[#EAE5DE] text-[#181818] hover:border-[#24332C] hover:text-[#24332C]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-[#24332C]' : ''}`} />
                </button>
              </div>

              {product.inStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#24332C] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-colors shadow-xs"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              )}
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-[#EAE5DE] grid grid-cols-2 gap-4 text-[11px] text-[#5C5852] font-light">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#708579] shrink-0" />
                <span>Paid Insured Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#708579] shrink-0" />
                <span>Online Payment Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#708579] shrink-0" />
                <span>Signature Presentation Box</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#708579] shrink-0" />
                <span>Authenticity Certificate</span>
              </div>
            </div>
          </div>

          {/* Accordion Sections: Materials & Dimensions, Packaging, Shipping Policy, Care Guide */}
          <div className="border-t border-[#EAE5DE] divide-y divide-[#EAE5DE]">
            {/* Specifications Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'details' ? '' : 'details')
                }
                className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#181818] font-medium hover:text-[#24332C] transition-colors"
              >
                <span>Materials &amp; Dimensions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === 'details' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'details' && (
                <div className="pb-4 text-xs text-[#5C5852] space-y-2 font-light">
                  {product.details ? (
                    Object.entries(product.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-[#EAE5DE]/60">
                        <span className="capitalize font-medium text-[#181818]">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="text-right max-w-xs">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p>Meticulously cast in surgical grade 316L stainless steel with 18K gold PVD finish.</p>
                  )}
                </div>
              )}
            </div>

            {/* Packaging Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'packaging' ? '' : 'packaging')
                }
                className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#181818] font-medium hover:text-[#24332C] transition-colors"
              >
                <span>Luxury Presentation Case</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === 'packaging' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'packaging' && (
                <div className="pb-4 text-xs text-[#5C5852] leading-relaxed font-light">
                  Every order arrives in ELVORA&rsquo;s custom debossed presentation case with gold-stamped interior, twin storage pouches, a lint-free polishing cloth, and a serialized Certificate of Authenticity.
                </div>
              )}
            </div>

            {/* Shipping Policy Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')
                }
                className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#181818] font-medium hover:text-[#24332C] transition-colors"
              >
                <span>Paid Shipping &amp; Dispatch</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'shipping' && (
                <div className="pb-4 text-xs text-[#5C5852] leading-relaxed space-y-2 font-light">
                  <p>
                    <strong>India:</strong> Standard Express Paid Shipping (₹99) via Blue Dart / Delhivery Express. Delivery in 3-5 business days.
                  </p>
                  <p>
                    <strong>International:</strong> DHL Express Air (₹1,299 / $15 USD). Delivery in 7-10 business days.
                  </p>
                  <p className="text-[11px] text-[#8A857D]">
                    * Orders are dispatched only upon 100% verified online payment. Cash on Delivery is strictly unavailable.
                  </p>
                </div>
              )}
            </div>

            {/* Care Guide Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'care' ? '' : 'care')
                }
                className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#181818] font-medium hover:text-[#24332C] transition-colors"
              >
                <span>Jewellery Care Guide</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'care' && (
                <div className="pb-4 text-xs text-[#5C5852] leading-relaxed space-y-1 font-light">
                  <p>&bull; Store in the supplied ELVORA anti-tarnish velvet case when not in use.</p>
                  <p>&bull; Clean gently with the provided microfiber polishing cloth.</p>
                  <p>&bull; Avoid direct contact with heavy perfumes, chlorine pools, or harsh domestic chemicals.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-[#EAE5DE]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#708579] font-medium block">
              CURATED PAIRINGS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light mt-1">
              You May Also Admire
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#EAE5DE] p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-11 bg-[#FFFFFF] border border-[#EAE5DE] overflow-hidden shrink-0">
            <Image
              src={product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-serif text-[#181818] truncate font-light">
              {product.name}
            </h4>
            <span className="text-xs font-medium text-[#181818]">
              {format(product.price)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-[#24332C] text-white py-2.5 px-4 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1.5 active:bg-[#19241F] transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
