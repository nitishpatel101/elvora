'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#171717] text-[#EFEAE2] pt-16 pb-12 border-t border-[#2C2926]">
      {/* Brand Values Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2C2926]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2C2926] flex items-center justify-center text-[#B89A69] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white">Pure Craftsmanship</h4>
              <p className="text-[12px] text-[#A39E96] mt-0.5">316L Stainless Steel & 18K PVD Gold</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2C2926] flex items-center justify-center text-[#B89A69] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white">Insured Express Shipping</h4>
              <p className="text-[12px] text-[#A39E96] mt-0.5">Tamper-proof signature dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2C2926] flex items-center justify-center text-[#B89A69] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white">100% Secure Checkout</h4>
              <p className="text-[12px] text-[#A39E96] mt-0.5">Encrypted Online Payments Only</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2C2926] flex items-center justify-center text-[#B89A69] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-white">Authenticity Guarantee</h4>
              <p className="text-[12px] text-[#A39E96] mt-0.5">Certificate in every velvet case</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.25em] text-white uppercase font-light">
                ELVORA
              </span>
              <span className="block text-[8px] tracking-[0.45em] uppercase text-[#B89A69]">
                Haute Joaillerie
              </span>
            </Link>
            <p className="text-xs text-[#A39E96] leading-relaxed max-w-sm pt-2">
              ELVORA crafts modern, evocative jewellery designed to transcend distance and time. From tactile celestial couple bracelets to sculpted silver pendants, each piece reflects timeless emotion and modern sophistication.
            </p>
            <div className="pt-2 text-[11px] tracking-wider text-[#B89A69] uppercase">
              Curated in India • Dispatched Globally
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Collections</h5>
            <ul className="space-y-2.5 text-xs text-[#A39E96]">
              <li>
                <Link href="/shop" className="hover:text-[#B89A69] transition-colors">
                  Shop All Creations
                </Link>
              </li>
              <li>
                <Link href="/shop/couple-bracelets" className="hover:text-[#B89A69] transition-colors">
                  Couple Bracelets
                </Link>
              </li>
              <li>
                <Link href="/shop/necklaces" className="hover:text-[#B89A69] transition-colors">
                  Necklaces & Pendants
                </Link>
              </li>
              <li>
                <Link href="/shop/earrings" className="hover:text-[#B89A69] transition-colors">
                  Pearl & Lantern Earrings
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#B89A69] transition-colors">
                  Private Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Concierge</h5>
            <ul className="space-y-2.5 text-xs text-[#A39E96]">
              <li>
                <Link href="/track-order" className="hover:text-[#B89A69] transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#B89A69] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#B89A69] transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B89A69] transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B89A69] transition-colors">
                  The ELVORA Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-[0.2em] text-white font-medium">The Gazette</h5>
            <p className="text-xs text-[#A39E96] leading-relaxed">
              Receive private invitations to preview new capsule collections and limited celestial editions.
            </p>
            {subscribed ? (
              <p className="text-xs text-[#B89A69] py-2">Thank you for joining our private registry.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#242220] border border-[#3E3933] px-3 py-2 text-xs text-white placeholder-[#77736D] focus:outline-none focus:border-[#B89A69] transition-colors pr-10"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B89A69] hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
            <div className="pt-2">
              <Link href="/admin/login" className="text-[10px] text-[#77736D] hover:text-[#B89A69] transition-colors">
                Staff & Admin Portal &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#2C2926] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#77736D] gap-4">
        <div>
          &copy; {new Date().getFullYear()} ELVORA Inc. All rights reserved. Online payments only.
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/privacy-policy" className="hover:text-[#A39E96] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#A39E96] transition-colors">
            Terms of Service
          </Link>
          <Link href="/shipping-policy" className="hover:text-[#A39E96] transition-colors">
            Paid Shipping Terms
          </Link>
          <Link href="/refund-policy" className="hover:text-[#A39E96] transition-colors">
            Returns
          </Link>
        </div>
      </div>
    </footer>
  );
}
