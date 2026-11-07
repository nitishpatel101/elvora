'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { isCustomerLoggedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Anniversary Gifts', emoji: '💍', href: '/shop?category=anniversary-gifts' },
    { label: 'Birthday Gifts', emoji: '🎂', href: '/shop?category=birthday-gifts' },
    { label: 'Gifts by Occasion', emoji: '🎉', href: '/shop' },
    { label: 'Gifts by Relationship', emoji: '💛', href: '/shop?category=couple-gifts' },
    { label: 'Gifts by Type', emoji: '🎁', href: '/shop' },
    { label: 'All Products', emoji: '📦', href: '/shop' },
    { label: 'Trending', emoji: '🔥', href: '/shop?filter=trending' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A] text-white border-b border-stone-800 shadow-md">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 text-stone-300 hover:text-white"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Luxury Monogram Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-1 ring-[#D79648]/40 shadow-md group-hover:scale-105 group-hover:ring-[#FBE8C0] transition-all bg-black flex-shrink-0">
                <Image
                  src="/images/logo-circle.png"
                  alt="ELVORA"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-[#D79648] via-[#FBE8C0] to-[#EBB05D] bg-clip-text text-transparent leading-none font-serif">
                  ELVORA
                </span>
                <span className="text-[8px] uppercase tracking-[0.22em] text-[#D79648]/80 font-medium mt-0.5">
                  GIFT WITH SMILE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links with Emojis */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-xs font-semibold text-stone-200">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 py-2 px-1 hover:text-[#EBB05D] transition-colors"
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
                {item.label.includes('Gifts') && (
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-300 hover:text-[#EBB05D] transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href={isCustomerLoggedIn ? '/account' : '/auth/login'}
              className="p-2 text-stone-300 hover:text-[#EBB05D] transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-stone-300 hover:text-[#EBB05D] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#D79648] to-[#EBB05D] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search Drawer */}
        {searchOpen && (
          <div className="py-3 pb-4 border-t border-stone-800 animate-in fade-in duration-150">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="max-w-2xl mx-auto flex items-center gap-3 bg-stone-900 border border-stone-700 px-4 py-2 rounded-xl"
            >
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts, couple bracelets, crystal cube, necklace..."
                autoFocus
                className="flex-1 bg-transparent text-xs text-white placeholder-stone-500 focus:outline-none"
              />
              <button
                type="submit"
                className="text-xs bg-[#F5C400] text-black px-3 py-1.5 rounded-lg font-bold hover:bg-[#ffcf1a]"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#111111] text-white h-full shadow-2xl flex flex-col z-10 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#D79648]/40 shadow-sm flex-shrink-0 bg-black">
                  <Image
                    src="/images/logo-circle.png"
                    alt="ELVORA"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-[#D79648] via-[#FBE8C0] to-[#EBB05D] bg-clip-text text-transparent font-serif">
                  ELVORA
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-stone-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-sm font-semibold">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-stone-800 text-stone-200 hover:text-[#EBB05D] transition-colors"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="pt-4 border-t border-stone-800 space-y-2 text-xs text-stone-400 font-normal">
                <Link href="/about" className="block py-1 hover:text-white">About ELVORA</Link>
                <Link href="/contact" className="block py-1 hover:text-white">Contact &amp; WhatsApp</Link>
                <Link href="/track-order" className="block py-1 hover:text-white">Track Order</Link>
                <Link href="/admin/login" className="block py-1 text-stone-500 hover:text-white">Admin Portal</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
