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

        {/* Purchase & Information Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A69] font-medium">
                {product.category}
              </span>
              {product.isBestSeller && (
                <span className="text-[9px] uppercase tracking-[0.2em] bg-[#171717] text-white px-2 py-0.5 font-medium">
                  Bestseller
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light leading-tight">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-xs text-[#77736D] mt-1 font-light italic">
                {product.tagline}
              </p>
            )}

            {/* Price Row */}
            <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-[#E7E1D8]">
              <span className="font-serif text-2xl sm:text-3xl font-light text-[#171717]">
                {format(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#A39E96] line-through">
                  {format(product.originalPrice)}
                </span>
              )}
              {discountPercentage && (
                <span className="text-xs font-medium text-[#B89A69] bg-[#F5EFE6] px-2 py-0.5">
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
              <span className="text-[#171717]">
                {product.inStock
                  ? `In Stock (${product.stock} units available)`
                  : 'Currently Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="pt-4">
              <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Colour Selector if multiple */}
            {product.colours && product.colours.length > 0 && (
              <div className="pt-6 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#171717] font-medium block">
                  Curated Colourway: <span className="text-[#77736D]">{selectedColour}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColour(col)}
                      className={`text-xs px-3.5 py-1.5 border transition-all ${
                        selectedColour === col
                          ? 'border-[#B89A69] bg-[#F5EFE6] text-[#171717] font-medium'
                          : 'border-[#E7E1D8] text-[#77736D] hover:border-[#171717]'
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
                <span className="text-xs uppercase tracking-wider text-[#171717] font-medium block">
                  Edition:
                </span>
                <div className="space-y-1.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.name)}
                      className={`w-full text-left text-xs p-3 border flex items-center justify-between transition-all ${
                        selectedVariant === v.name
                          ? 'border-[#B89A69] bg-[#F5EFE6] text-[#171717] font-medium'
                          : 'border-[#E7E1D8] text-[#77736D] hover:border-[#171717]'
                      }`}
                    >
                      <span>{v.name}</span>
                      {selectedVariant === v.name && (
                        <Check className="w-4 h-4 text-[#B89A69]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-6 flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#171717] font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-[#E7E1D8] bg-[#F8F6F2]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-xs text-[#77736D] hover:text-[#171717]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-medium text-[#171717]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-xs text-[#77736D] hover:text-[#171717]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart, Buy Now, Wishlist */}
            <div className="pt-6 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#171717] text-[#F8F6F2] py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#B89A69] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`p-4 border transition-colors ${
                    inWish
                      ? 'border-[#B89A69] bg-[#F5EFE6] text-[#B89A69]'
                      : 'border-[#E7E1D8] text-[#171717] hover:border-[#B89A69] hover:text-[#B89A69]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-[#B89A69]' : ''}`} />
                </button>
              </div>

              {product.inStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full border border-[#B89A69] bg-[#B89A69] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#9F8354] transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Instant Checkout</span>
                </button>
              )}
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-[#E7E1D8] grid grid-cols-2 gap-4 text-[11px] text-[#77736D]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B89A69] shrink-0" />
                <span>Paid Insured Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B89A69] shrink-0" />
                <span>Online Payment Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B89A69] shrink-0" />
                <span>Signature Velvet Case Included</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#B89A69] shrink-0" />
                <span>Authenticity Certificate</span>
              </div>
            </div>
          </div>

          {/* Accordion Sections: Details, Packaging, Shipping */}
          <div className="border-t border-[#E7E1D8] divide-y divide-[#E7E1D8]">
            {/* Specifications Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'details' ? '' : 'details')
                }
                className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#171717] font-medium hover:text-[#B89A69] transition-colors"
              >
                <span>Material & Specifications</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === 'details' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'details' && (
                <div className="pb-4 text-xs text-[#77736D] space-y-2">
                  {product.details ? (
                    Object.entries(product.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-[#E7E1D8]/50">
                        <span className="capitalize font-medium text-[#171717]">
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
                className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#171717] font-medium hover:text-[#B89A69] transition-colors"
              >
                <span>Luxury Presentation Case</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === 'packaging' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'packaging' && (
                <div className="pb-4 text-xs text-[#77736D] leading-relaxed">
                  Every order arrives in ELVORA&rsquo;s custom debossed ivory or black velvet presentation case with gold-stamped interior, twin storage pouches, a lint-free polishing cloth, and a serialized Certificate of Authenticity.
                </div>
              )}
            </div>

            {/* Shipping Policy Accordion */}
            <div>
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')
                }
                className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#171717] font-medium hover:text-[#B89A69] transition-colors"
              >
                <span>Paid Shipping & Dispatch</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'shipping' && (
                <div className="pb-4 text-xs text-[#77736D] leading-relaxed space-y-2">
                  <p>
                    <strong>India:</strong> Standard Express Paid Shipping (₹99) via Blue Dart / Delhivery Express. Delivery in 3-5 business days.
                  </p>
                  <p>
                    <strong>International:</strong> DHL Express Air (₹1,299 / $15 USD). Delivery in 7-10 business days.
                  </p>
                  <p className="text-[11px] text-[#A39E96]">
                    * Orders are dispatched only upon 100% verified online payment. Cash on Delivery is strictly unavailable.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-[#E7E1D8]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A69] font-medium block">
              Curated Pairings
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-light mt-1">
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
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#F8F6F2]/95 backdrop-blur-md border-t border-[#E7E1D8] p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-11 bg-[#EFEAE2] border border-[#E7E1D8] overflow-hidden shrink-0">
            <Image
              src={product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-serif text-[#171717] truncate font-medium">
              {product.name}
            </h4>
            <span className="text-xs font-semibold text-[#171717]">
              {format(product.price)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-[#171717] text-white py-2.5 px-4 text-[11px] uppercase tracking-wider font-medium flex items-center gap-1.5 active:bg-[#B89A69] transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

