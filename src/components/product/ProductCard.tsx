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

  // Material snippet for AUrate-style material subtitle
  const materialLabel =
    product.details?.material
      ? product.details.material.split('&')[0].trim().toUpperCase()
      : product.category.toUpperCase();

  return (
    <div
      className="group relative flex flex-col bg-white transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F0EDE8] border border-[#EAE5DE]/80">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
          />
        </Link>

        {/* AUrate Badges: BEST SELLER or SELLING FAST */}
        {product.isBestSeller ? (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="bg-white/95 border border-[#EAE5DE] text-[#181818] text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 font-medium shadow-2xs">
              BEST SELLER
            </span>
          </div>
        ) : product.stock <= 25 ? (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="bg-white/95 border border-[#EAE5DE] text-[#8E2828] text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 font-medium shadow-2xs">
              SELLING FAST
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
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-[#181818] hover:text-[#24332C] transition-colors shadow-2xs"
        >
          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-[#24332C] text-[#24332C]' : 'stroke-[1.5]'}`} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            aria-label="Quick view product"
            className="absolute top-10 right-2.5 p-1.5 rounded-full bg-white/90 text-[#181818] hover:text-[#24332C] opacity-0 group-hover:opacity-100 transition-opacity shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        )}

        {/* Quick Add To Bag overlay on hover */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className="w-full bg-[#24332C] text-white py-2 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-[#19241F] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{product.inStock ? 'Quick Add' : 'Sold Out'}</span>
          </button>
        </div>
      </div>

      {/* Product Details Info: Title on left, Price on right, Material below */}
      <div className="pt-3 pb-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-medium text-[#181818] group-hover:text-[#24332C] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          <span className="text-xs sm:text-sm font-medium text-[#181818] shrink-0">
            {format(product.price)}
          </span>
        </div>

        {/* Material in all-caps like AUrate "VERMEIL", "14K GOLD" */}
        <div className="text-[10px] tracking-[0.16em] uppercase text-[#708579] font-medium mt-0.5">
          {materialLabel}
        </div>
      </div>
    </div>
  );
}
