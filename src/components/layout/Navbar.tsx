'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ArrowRight,
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

  // Dropdown states for Desktop
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const shopSublinks = [
    { label: 'All Jewellery', href: '/shop', desc: 'Browse the entire curated catalogue' },
    { label: 'Couple Bracelets', href: '/shop/couple-bracelets', desc: 'Touch Distance & Celestial pairs' },
    { label: 'Necklaces & Pendants', href: '/shop/necklaces', desc: 'Gemstones, chokers & layered silver' },
    { label: 'Lantern Earrings', href: '/shop/earrings', desc: 'Gold chandeliers with freshwater pearls' },
  ];

  const collectionsSublinks = [
    { label: 'The Couple Series', href: '/shop/couple-bracelets', desc: 'Matched bracelets bridging distance' },
    { label: 'The Crimson Heart', href: '/product/heart-sword-pendant-necklace', desc: 'Dramatic ruby crystal & pierced sword' },
    { label: 'Golden Lanterns', href: '/product/golden-lantern-pearl-earrings', desc: 'Architectural lanterns with cascading pearls' },
    { label: 'Gift Curations', href: '/shop?collection=gifts', desc: 'Complimentary signature velvet packaging' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F8F5F0]/95 backdrop-blur-md shadow-xs border-b border-[#E8DCCD]'
            : 'bg-[#F8F5F0] border-b border-[#E8DCCD]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#111111] hover:text-[#B69A65] transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/" className="group inline-flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.24em] font-light text-[#111111] uppercase transition-colors group-hover:text-[#B69A65]">
                  ELVORA
                </span>
                <span className="text-[7.5px] tracking-[0.42em] uppercase text-[#6B655D] -mt-0.5 font-light">
                  Haute Joaillerie
                </span>
              </Link>
            </div>

            {/* Center: Luxury Navigation */}
            <nav className="hidden lg:flex items-center space-x-10 text-[11px] tracking-[0.22em] uppercase font-light text-[#111111]">
              {/* Shop Link with Dropdown */}
              <div
                className="relative py-7"
                onMouseEnter={() => handleMouseEnter('shop')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/shop"
                  className={`inline-flex items-center gap-1 hover:text-[#B69A65] transition-colors ${
                    pathname.startsWith('/shop') && pathname !== '/shop/couple-bracelets'
                      ? 'text-[#B69A65] font-medium'
                      : ''
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3 h-3 text-[#B69A65] transition-transform duration-200" />
                </Link>

                {activeDropdown === 'shop' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-[#FFFFFF] border border-[#E8DCCD] shadow-xl p-5 z-50">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-[#B69A65] mb-3 pb-2 border-b border-[#E8DCCD]">
                      Shop by Category
                    </div>
                    <div className="space-y-3">
                      {shopSublinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block group/item transition-colors"
                        >
                          <div className="text-xs font-serif text-[#111111] group-hover/item:text-[#B69A65] transition-colors">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-[#6B655D] tracking-normal capitalize font-light mt-0.5">
                            {item.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E8DCCD]">
                      <Link
                        href="/shop"
                        className="text-[10px] tracking-[0.18em] uppercase text-[#111111] hover:text-[#B69A65] inline-flex items-center gap-1 font-medium"
                      >
                        <span>View Entire Vault</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Best Sellers Link */}
              <Link
                href="/shop?filter=bestsellers"
                className="hover:text-[#B69A65] transition-colors py-7"
              >
                Best Sellers
              </Link>

              {/* Collections Link with Dropdown */}
              <div
                className="relative py-7"
                onMouseEnter={() => handleMouseEnter('collections')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/shop/couple-bracelets"
                  className={`inline-flex items-center gap-1 hover:text-[#B69A65] transition-colors ${
                    pathname === '/shop/couple-bracelets' ? 'text-[#B69A65] font-medium' : ''
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown className="w-3 h-3 text-[#B69A65] transition-transform duration-200" />
                </Link>

                {activeDropdown === 'collections' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-[#FFFFFF] border border-[#E8DCCD] shadow-xl p-5 z-50">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-[#B69A65] mb-3 pb-2 border-b border-[#E8DCCD]">
                      Signature Capsule
                    </div>
                    <div className="space-y-3">
                      {collectionsSublinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block group/item transition-colors"
                        >
                          <div className="text-xs font-serif text-[#111111] group-hover/item:text-[#B69A65] transition-colors">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-[#6B655D] tracking-normal capitalize font-light mt-0.5">
                            {item.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* About Link */}
              <Link
                href="/about"
                className={`hover:text-[#B69A65] transition-colors py-7 ${
                  pathname === '/about' ? 'text-[#B69A65] font-medium' : ''
                }`}
              >
                About
              </Link>
            </nav>

            {/* Right: Currency & Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5 text-[#111111]">
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search catalogue"
                className="p-2 hover:text-[#B69A65] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Account Link */}
              <Link
                href={isCustomerLoggedIn ? '/account' : '/auth/login'}
                aria-label="Client account"
                className="p-2 hover:text-[#B69A65] transition-colors"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="p-2 hover:text-[#B69A65] transition-colors relative"
              >
                <Heart className="w-4 h-4" />
                {totalWishlist > 0 && (
                  <span className="absolute 1 top-1 -right-0.5 w-4 h-4 rounded-full bg-[#B69A65] text-white text-[9px] flex items-center justify-center font-medium">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              {/* Shopping Bag */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                aria-label="Shopping bag"
                className="p-2 hover:text-[#B69A65] transition-colors relative"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute top-1 -right-0.5 w-4 h-4 rounded-full bg-[#111111] text-[#F8F5F0] text-[9px] flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay Bar */}
        {searchOpen && (
          <div className="border-t border-[#E8DCCD] bg-[#FFFFFF] py-4 px-4 sm:px-8 shadow-md animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-[#6B655D] absolute left-3" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bracelets, necklaces, earrings or gold keepsakes..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs text-[#111111] bg-transparent border-b border-[#E8DCCD] focus:border-[#B69A65] focus:outline-none placeholder-[#6B655D] tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-[#6B655D] hover:text-[#111111]"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#F8F5F0] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DCCD]">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <span className="font-serif text-2xl tracking-[0.24em] font-light text-[#111111] uppercase">
                    ELVORA
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#111111] hover:text-[#B69A65]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="py-6 space-y-4 text-xs uppercase tracking-[0.2em] font-light text-[#111111]">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#E8DCCD]/60 hover:text-[#B69A65]"
                >
                  Shop All Jewellery
                </Link>
                <Link
                  href="/shop?filter=bestsellers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#E8DCCD]/60 hover:text-[#B69A65]"
                >
                  Best Sellers
                </Link>
                <Link
                  href="/shop/couple-bracelets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#E8DCCD]/60 hover:text-[#B69A65]"
                >
                  Couple Bracelets
                </Link>
                <Link
                  href="/shop/necklaces"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#E8DCCD]/60 hover:text-[#B69A65]"
                >
                  Necklaces & Pendants
                </Link>
                <Link
                  href="/shop/earrings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#E8DCCD]/60 hover:text-[#B69A65]"
                >
                  Lantern Earrings
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 border-b border-[#E8DCCD]/60 hover:text-[#B69A65]"
                >
                  About the Maison
                </Link>
              </nav>
            </div>

            {/* Mobile Footer & Currency */}
            <div className="pt-6 border-t border-[#E8DCCD] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#6B655D]">Currency</span>
                <CurrencySelector />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href={isCustomerLoggedIn ? '/account' : '/auth/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="luxury-btn-outline text-center py-2 text-[10px]"
                >
                  Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="luxury-btn-primary text-center py-2 text-[10px]"
                >
                  Wishlist ({totalWishlist})
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
