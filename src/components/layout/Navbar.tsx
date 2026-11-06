'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import CurrencySelector from './CurrencySelector';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { totalWishlist } = useWishlist();
  const { isCustomerLoggedIn, isAdminLoggedIn } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
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
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'Couple Bracelets', href: '/shop/couple-bracelets' },
    { label: 'Necklaces', href: '/shop/necklaces' },
    { label: 'Earrings', href: '/shop/earrings' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F8F6F2]/95 backdrop-blur-md shadow-xs border-b border-[#E7E1D8]'
            : 'bg-[#F8F6F2] border-b border-[#E7E1D8]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#171717] hover:text-[#B89A69] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#171717] hover:text-[#B89A69] transition-colors ml-1"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-light text-[#171717] uppercase transition-colors group-hover:text-[#B89A69]">
                  ELVORA
                </span>
                <span className="block text-[8px] tracking-[0.4em] uppercase text-[#77736D] text-center">
                  Haute Joaillerie
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase tracking-[0.18em] transition-colors relative py-1 ${
                      isActive
                        ? 'text-[#B89A69] font-medium'
                        : 'text-[#171717] hover:text-[#B89A69]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89A69]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & Currency */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Currency Selector */}
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex p-1.5 text-[#171717] hover:text-[#B89A69] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Link */}
              <Link
                href={isCustomerLoggedIn ? '/account' : '/auth/login'}
                className="p-1.5 text-[#171717] hover:text-[#B89A69] transition-colors"
                aria-label="Account"
                title={isCustomerLoggedIn ? 'My Account' : 'Sign In'}
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-1.5 text-[#171717] hover:text-[#B89A69] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlist > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B89A69] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-1.5 text-[#171717] hover:text-[#B89A69] transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#171717] text-[#F8F6F2] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Admin Link shortcut if logged in */}
              {isAdminLoggedIn && (
                <Link
                  href="/admin"
                  className="hidden xl:flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#B89A69] border border-[#B89A69] px-2 py-0.5"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#F8F6F2] border-b border-[#E7E1D8] p-4 shadow-md transition-all duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-[#77736D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rings, couple bracelets, pendants, earrings..."
                autoFocus
                className="flex-1 bg-transparent border-none text-[#171717] placeholder-[#77736D] text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-wider bg-[#171717] text-white px-4 py-2 hover:bg-[#B89A69] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#77736D] hover:text-[#171717]"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#F8F6F2] h-full shadow-2xl flex flex-col justify-between z-10 p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E7E1D8]">
                <Link href="/" className="font-serif text-xl tracking-[0.2em] uppercase text-[#171717]">
                  ELVORA
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#171717]"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Currency Selector for mobile */}
              <div className="py-4 border-b border-[#E7E1D8] flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#77736D]">Currency</span>
                <CurrencySelector />
              </div>

              {/* Navigation Links */}
              <nav className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between text-sm uppercase tracking-[0.16em] text-[#171717] hover:text-[#B89A69] py-2"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#77736D]" />
                  </Link>
                ))}
              </nav>

              <div className="border-t border-[#E7E1D8] pt-6 space-y-3">
                <Link
                  href="/track-order"
                  className="block text-xs uppercase tracking-wider text-[#77736D] hover:text-[#171717]"
                >
                  Track My Order
                </Link>
                <Link
                  href="/about"
                  className="block text-xs uppercase tracking-wider text-[#77736D] hover:text-[#171717]"
                >
                  About The Brand
                </Link>
                <Link
                  href="/contact"
                  className="block text-xs uppercase tracking-wider text-[#77736D] hover:text-[#171717]"
                >
                  Customer Concierge
                </Link>
                <Link
                  href="/admin/login"
                  className="block text-xs uppercase tracking-wider text-[#B89A69] hover:underline pt-2"
                >
                  Admin Portal
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7E1D8] text-[11px] text-[#77736D] tracking-wider text-center">
              &copy; {new Date().getFullYear()} ELVORA Haute Joaillerie
            </div>
          </div>
        </div>
      )}
    </>
  );
}
