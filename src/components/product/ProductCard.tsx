'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images[0] || '/images/giftify/products/touch-vibration-bracelet.jpg';
  const secondaryImage = product.images[1] || primaryImage;
  const inWish = isInWishlist(product.id);

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-50">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </Link>

        {/* Badges */}
        {product.originalPrice && product.originalPrice > product.price ? (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              SALE
            </span>
          </div>
        ) : product.isBestSeller ? (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="bg-[#F5C400] text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              BEST SELLER
            </span>
          </div>
        ) : null}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={inWish ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-stone-700 hover:text-black transition-colors shadow-sm"
        >
          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-red-500 text-red-500' : 'stroke-[1.6]'}`} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            aria-label="Quick view product"
            className="absolute top-10 right-2.5 p-1.5 rounded-full bg-white/90 text-stone-700 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 stroke-[1.6]" />
          </button>
        )}

        {/* Quick Add To Bag overlay on hover */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className="w-full bg-black hover:bg-[#F5C400] hover:text-black text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inStock ? 'Quick Add' : 'Sold Out'}</span>
          </button>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <Link
          href={`/product/${product.slug}`}
          className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#DDB373] transition-colors line-clamp-2 leading-snug mb-2"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-stone-400 line-through">
              Rs. {product.originalPrice.toLocaleString('en-IN')}.00
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold text-stone-900">
            Rs. {product.price.toLocaleString('en-IN')}.00
          </span>
        </div>
      </div>
    </div>
  );
}
