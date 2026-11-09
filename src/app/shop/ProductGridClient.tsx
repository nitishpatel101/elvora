'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { Search, SlidersHorizontal, ArrowUpDown, X, ShoppingBag } from 'lucide-react';

interface ProductGridClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
}

export default function ProductGridClient({
  initialProducts,
  categories,
  initialSearch = '',
  initialCategory = 'all',
}: ProductGridClientProps) {
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  const filteredAndSortedProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'couple-bracelets' || selectedCategory === 'couple-gifts') {
            if (product.categorySlug !== 'couple-bracelets' && product.categorySlug !== 'couple-gifts') {
              return false;
            }
          } else if (product.categorySlug !== selectedCategory) {
            return false;
          }
        }

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.colours.some((c) => c.toLowerCase().includes(q));
          if (!match) return false;
        }

        // In-stock filter
        if (inStockOnly && !product.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [initialProducts, selectedCategory, search, sortBy, inStockOnly]);

  return (
    <div className="space-y-8">
      {/* Control Bar: AUrate-style Search, Category Tabs & Sort */}
      <div className="bg-[#FFFFFF] border border-[#EAE5DE] p-4 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#708579] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by piece name, stone, finish..."
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] pl-9 pr-3 py-2 text-xs text-[#181818] placeholder-[#8A857D] focus:outline-none focus:border-[#24332C]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#708579] hover:text-[#181818]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown & In-Stock Checkbox */}
          <div className="flex items-center gap-4 justify-between md:justify-end">
            <label className="flex items-center gap-2 text-xs text-[#5C5852] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#24332C] w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5 border border-[#EAE5DE] bg-[#FAF8F5] px-3 py-2 text-xs text-[#181818]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#708579]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'newest')}
                className="bg-transparent border-none focus:outline-none text-xs text-[#181818] cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EAE5DE]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs uppercase tracking-[0.16em] px-4 py-2 border transition-colors ${selectedCategory === 'all'
              ? 'bg-[#24332C] text-[#FFFFFF] border-[#24332C]'
              : 'bg-[#FAF8F5] text-[#181818] border-[#EAE5DE] hover:border-[#24332C]'
              }`}
          >
            All Pieces ({initialProducts.length})
          </button>

          {categories.map((cat) => {
            const count = initialProducts.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs uppercase tracking-[0.16em] px-4 py-2 border transition-colors ${selectedCategory === cat.slug
                  ? 'bg-[#24332C] text-[#FFFFFF] border-[#24332C]'
                  : 'bg-[#FAF8F5] text-[#181818] border-[#EAE5DE] hover:border-[#24332C]'
                  }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#5C5852] px-1 font-light">
        <span>Showing {filteredAndSortedProducts.length} of {initialProducts.length} creations</span>
        {search && <span>Filtered by &ldquo;{search}&rdquo;</span>}
      </div>

      {/* Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFFFF] border border-[#EAE5DE] space-y-4">
          <SlidersHorizontal className="w-8 h-8 text-[#708579] mx-auto stroke-1" />
          <h3 className="font-serif text-xl text-[#181818]">No pieces matched your selection</h3>
          <p className="text-xs text-[#5C5852] max-w-sm mx-auto font-light">
            Try adjusting your search criteria or resetting filters to browse our entire portfolio.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="mt-2 bg-[#24332C] text-white text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-[#19241F] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      {/* AUrate-style Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setQuickViewProduct(null)}
          />

          <div className="relative bg-[#FFFFFF] border border-[#EAE5DE] max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <button
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 p-1.5 text-[#5C5852] hover:text-[#181818] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-square bg-[#FAF8F5] border border-[#EAE5DE] overflow-hidden">
              <Image
                src={quickViewProduct.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
                alt={quickViewProduct.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Modal Info & CTA */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#708579] font-medium block">
                  {quickViewProduct.category}
                </span>
                <h3 className="font-serif text-2xl text-[#181818] font-light mt-1">
                  {quickViewProduct.name}
                </h3>
                <div className="mt-2 text-base font-serif text-[#181818]">
                  {format(quickViewProduct.price)}
                </div>
              </div>

              <p className="text-xs text-[#5C5852] line-clamp-3 leading-relaxed font-light">
                {quickViewProduct.description}
              </p>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, 1);
                    setQuickViewProduct(null);
                  }}
                  disabled={!quickViewProduct.inStock}
                  className="w-full bg-[#24332C] text-white py-3 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{quickViewProduct.inStock ? 'Add to Bag' : 'Sold Out'}</span>
                </button>

                <Link
                  href={`/product/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full border border-[#EAE5DE] text-[#181818] py-2.5 px-4 text-xs uppercase tracking-wider text-center block hover:border-[#24332C] transition-colors font-light"
                >
                  View Full Product Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
