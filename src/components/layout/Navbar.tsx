'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  Search,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { totalWishlist } = useWishlist();
  const { isCustomerLoggedIn } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'SHOP', href: '/shop' },
    { label: 'BEST SELLERS', href: '/shop?filter=bestsellers' },
    { label: 'COUPLE BRACELETS', href: '/shop/couple-bracelets' },
    { label: 'NECKLACES', href: '/shop/necklaces' },
    { label: 'EARRINGS', href: '/shop/earrings' },
    { label: 'BRACELETS', href: '/shop/couple-bracelets' },
    { label: 'HOLIDAY RUSH', href: '/shop?collection=gifts', highlight: true },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-md shadow-xs border-b border-[#EAE5DE]'
            : 'bg-white border-b border-[#EAE5DE]'
        }`}
      >
        <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="xl:hidden p-1.5 text-[#181818] hover:text-[#24332C] transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6 stroke-[1.6]" />
              </button>

              <Link
                href="/"
                className="flex items-center tracking-[0.14em] font-extrabold text-2xl sm:text-3xl text-[#181818] uppercase font-sans hover:opacity-90 transition-opacity"
              >
                ELVORA
              </Link>
            </div>

            {/* Center: Desktop Navigation Bar matching AUrate exact links */}
            <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[11px] 2xl:text-xs font-semibold tracking-[0.16em] uppercase transition-colors py-2 relative group ${
                    link.highlight
                      ? 'text-[#8E2828] hover:text-[#B53232]'
                      : 'text-[#181818] hover:text-[#24332C]'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#24332C] transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right: Utility Icons & Shopping Bag (Solid Dark Circle like AUrate) */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/about"
                className="hidden lg:inline-block text-xs font-medium tracking-[0.16em] uppercase text-[#181818] hover:text-[#24332C] transition-colors"
              >
                ABOUT
              </Link>

              <Link
                href={isCustomerLoggedIn ? '/account' : '/auth/login'}
                className="hidden lg:inline-block text-xs font-medium tracking-[0.16em] uppercase text-[#181818] hover:text-[#24332C] transition-colors"
              >
                ACCOUNT
              </Link>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-[#181818] hover:text-[#24332C] transition-colors"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              <Link
                href="/wishlist"
                className="p-1.5 text-[#181818] hover:text-[#24332C] transition-colors relative"
                aria-label="View saved pieces"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {totalWishlist > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#24332C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              {/* Exact AUrate Bag Button: Solid Dark Circle with Count */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#24332C] hover:bg-[#19241F] text-white flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 shadow-xs"
                aria-label={`Shopping bag containing ${totalItems} items`}
              >
                <span>{totalItems}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Drawer */}
        {searchOpen && (
          <div className="bg-[#FAF8F5] border-t border-[#EAE5DE] py-4 px-4 sm:px-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-[#708579]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery, couple bracelets, necklaces, pearls..."
                autoFocus
                className="flex-1 bg-transparent border-b border-[#EAE5DE] py-2 text-xs sm:text-sm text-[#181818] placeholder-[#77736D] focus:outline-none focus:border-[#24332C]"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-wider font-semibold text-[#24332C] hover:underline"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#77736D] hover:text-[#181818]"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-5 flex items-center justify-between border-b border-[#EAE5DE]">
              <span className="font-sans font-extrabold text-xl tracking-[0.14em] uppercase text-[#181818]">
                ELVORA
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#77736D] hover:text-[#181818]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-semibold uppercase tracking-[0.16em]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block py-2.5 border-b border-[#EAE5DE]/60 ${
                    link.highlight ? 'text-[#8E2828]' : 'text-[#181818]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 space-y-3 font-normal text-xs text-[#708579]">
                <Link href="/about" className="block py-1">About ELVORA</Link>
                <Link href="/track-order" className="block py-1">Track Order</Link>
                <Link href="/account" className="block py-1">Client Cabinet</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
