'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#19241F] text-[#FAF8F5] pt-16 pb-12 border-t border-[#24332C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-[#2A3B33]">
          {/* Brand Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-3xl tracking-[0.22em] text-[#FFFFFF] uppercase font-light group-hover:text-[#D5E0D9] transition-colors">
                ELVORA
              </span>
              <span className="block text-[8px] tracking-[0.4em] uppercase text-[#708579] font-medium mt-0.5">
                Fine Jewellery
              </span>
            </Link>

            <p className="text-xs text-[#A3B2A9] leading-relaxed max-w-sm font-light pt-2">
              ELVORA crafts modern, evocative jewellery designed to celebrate connection and everyday elegance. High-grade surgical steel, natural stones, and multi-micron 18K gold.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-[#A3B2A9]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ELVORA Instagram"
                className="hover:text-[#FFFFFF] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ELVORA Facebook"
                className="hover:text-[#FFFFFF] transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-[10px] tracking-wider text-[#708579] uppercase font-light">
              Online Payments Only &bull; Express Tracked Dispatch
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.2em] text-[#FFFFFF] font-medium">
              Shop Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A3B2A9] font-light">
              <li>
                <Link href="/shop" className="hover:text-[#FFFFFF] transition-colors">
                  All Jewellery
                </Link>
              </li>
              <li>
                <Link href="/shop/couple-bracelets" className="hover:text-[#FFFFFF] transition-colors">
                  Couple Bracelets
                </Link>
              </li>
              <li>
                <Link href="/shop/necklaces" className="hover:text-[#FFFFFF] transition-colors">
                  Necklaces &amp; Pendants
                </Link>
              </li>
              <li>
                <Link href="/shop/earrings" className="hover:text-[#FFFFFF] transition-colors">
                  Pearl &amp; Lantern Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestsellers" className="hover:text-[#FFFFFF] transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.2em] text-[#FFFFFF] font-medium">
              Customer Support
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A3B2A9] font-light">
              <li>
                <Link href="/track-order" className="hover:text-[#FFFFFF] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#FFFFFF] transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#FFFFFF] transition-colors">
                  Return &amp; Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFFFFF] transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFFFFF] transition-colors">
                  About ELVORA
                </Link>
              </li>
            </ul>
          </div>

          {/* Functional Newsletter Column */}
          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.2em] text-[#FFFFFF] font-medium">
              Join the Circle
            </h5>
            <p className="text-xs text-[#A3B2A9] leading-relaxed font-light">
              Receive private invitations to preview new capsule collections and limited editions.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#D5E0D9] py-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you for joining our private list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#24332C] border border-[#3A4E44] px-3.5 py-2.5 text-xs text-[#FFFFFF] placeholder-[#708579] focus:outline-none focus:border-[#D5E0D9] transition-colors pr-10"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#D5E0D9] hover:text-[#FFFFFF] transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="text-[10px] uppercase tracking-wider text-[#708579] hover:text-[#D5E0D9] transition-colors"
              >
                Staff Portal &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#708579] gap-4">
          <div>
            &copy; {new Date().getFullYear()} ELVORA. All rights reserved. Strictly online payments only.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/shipping-policy" className="hover:text-[#A3B2A9] transition-colors">
              Shipping Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-[#A3B2A9] transition-colors">
              Return Policy
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#A3B2A9] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#A3B2A9] transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
