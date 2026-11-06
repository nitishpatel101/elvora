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

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      className="group relative flex flex-col bg-[#F8F6F2] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#EFEAE2] border border-[#E7E1D8]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-[#171717] text-[#F8F6F2] text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
              Bestseller
            </span>
          )}
          {discountPercentage && (
            <span className="bg-[#B89A69] text-white text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
              {discountPercentage}% Off
            </span>
          )}
          {!product.inStock && (
            <span className="bg-stone-500 text-white text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={inWish ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all duration-200 ${
            inWish
              ? 'bg-[#171717] text-[#B89A69]'
              : 'bg-white/80 text-[#171717] hover:bg-white hover:text-[#B89A69]'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-[#B89A69]' : ''}`} />
        </button>

        {/* Quick Action Overlay (Desktop Hover) */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className="flex-1 bg-[#171717] text-[#F8F6F2] text-[11px] uppercase tracking-[0.18em] py-2.5 px-3 flex items-center justify-center gap-1.5 hover:bg-[#B89A69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
          </button>

          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white/90 text-[#171717] p-2.5 hover:bg-[#B89A69] hover:text-white transition-colors"
              aria-label="Quick preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Details Info */}
      <div className="pt-4 pb-2 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#77736D]">
          <span>{product.category}</span>
          {product.colours && product.colours.length > 0 && (
            <span className="text-[#A39E96]">{product.colours.join(' & ')}</span>
          )}
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-base text-[#171717] group-hover:text-[#B89A69] transition-colors mt-1 font-normal line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-medium text-[#171717]">
            {format(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#A39E96] line-through">
              {format(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Mobile Add to Cart Button */}
        <div className="mt-3 lg:hidden">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className="w-full bg-[#171717] text-[#F8F6F2] text-[11px] uppercase tracking-[0.16em] py-2 flex items-center justify-center gap-1.5 active:bg-[#B89A69] transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

