'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg';
  const secondaryImage = product.images[1] || primaryImage;
  const inWish = isInWishlist(product.id);

  // Short description: prioritize tagline if present, else brief excerpt
  const shortDescription =
    product.tagline ||
    (product.description.length > 75
      ? product.description.slice(0, 75).trim() + '...'
      : product.description);

  return (
    <div
      className="group relative flex flex-col bg-[#FFFFFF] border border-[#E8DCCD] transition-all duration-300 hover:border-[#B69A65]/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F8F5F0]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
          />
        </Link>

        {/* Bestseller Badge */}
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="bg-[#111111] text-[#F8F5F0] text-[9px] uppercase tracking-[0.22em] px-2.5 py-1 font-light">
              Bestseller
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={inWish ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            inWish
              ? 'bg-[#111111] text-[#B69A65]'
              : 'bg-white/90 text-[#111111] hover:bg-white hover:text-[#B69A65]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-[#B69A65]' : ''}`} />
        </button>

        {/* Desktop Quick View Overlay */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute top-12 right-3 p-2 rounded-full bg-white/90 text-[#111111] opacity-0 group-hover:opacity-100 hover:text-[#B69A65] transition-all duration-200"
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Product Details Info */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          {/* Category & Colours */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-[#6B655D]">
            <span>{product.category}</span>
            {product.colours && product.colours.length > 0 && (
              <span className="text-[#8C867E] capitalize">
                {product.colours.join(' / ')}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="font-serif text-lg text-[#111111] group-hover:text-[#B69A65] transition-colors mt-1.5 font-light block line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#6B655D] mt-1 font-light line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-4 mt-4 border-t border-[#E8DCCD]/60 flex items-center justify-between gap-3">
          <div>
            <span className="text-sm sm:text-base font-serif text-[#111111] font-light">
              {format(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#8C867E] line-through ml-2">
                {format(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className="inline-flex items-center gap-1.5 bg-[#111111] text-[#FFFFFF] px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-[#B69A65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
