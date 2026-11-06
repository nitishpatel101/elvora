'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
          return false;
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
        // Default: featured first, then bestsellers
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [initialProducts, selectedCategory, search, sortBy, inStockOnly]);

  return (
    <div className="space-y-8">
      {/* Control Bar: Search, Category Tabs & Sort */}
      <div className="bg-[#EFEAE2]/60 border border-[#E7E1D8] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#77736D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by piece name, stone, finish..."
              className="w-full bg-[#F8F6F2] border border-[#E7E1D8] pl-9 pr-3 py-2 text-xs text-[#171717] placeholder-[#77736D] focus:outline-none focus:border-[#B89A69]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#77736D] hover:text-[#171717]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown & In-Stock Checkbox */}
          <div className="flex items-center gap-4 justify-between md:justify-end">
            <label className="flex items-center gap-2 text-xs text-[#77736D] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#B89A69] w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5 border border-[#E7E1D8] bg-[#F8F6F2] px-3 py-2 text-xs text-[#171717]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#B89A69]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'newest')}
                className="bg-transparent border-none focus:outline-none text-xs text-[#171717] cursor-pointer"
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
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E7E1D8]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs uppercase tracking-[0.15em] px-4 py-2 border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-[#F8F6F2] text-[#171717] border-[#E7E1D8] hover:border-[#B89A69]'
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
                className={`text-xs uppercase tracking-[0.15em] px-4 py-2 border transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F8F6F2] text-[#171717] border-[#E7E1D8] hover:border-[#B89A69]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#77736D] px-1">
        <span>Showing {filteredAndSortedProducts.length} of {initialProducts.length} creations</span>
        {search && <span>Filtered by &ldquo;{search}&rdquo;</span>}
      </div>

      {/* Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#EFEAE2]/30 border border-[#E7E1D8] space-y-4">
          <SlidersHorizontal className="w-8 h-8 text-[#77736D] mx-auto stroke-1" />
          <h3 className="font-serif text-xl text-[#171717]">No pieces matched your selection</h3>
          <p className="text-xs text-[#77736D] max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to browse our entire portfolio.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="mt-2 bg-[#171717] text-white text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-[#B89A69] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
