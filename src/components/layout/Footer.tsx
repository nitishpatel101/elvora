'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="4" x2="12" y2="20" />
    <path d="M8 8a4 4 0 1 1 8 0c0 3-2 6-4 9" />
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
    <footer className="border-t border-[#24332C]">
      {/* Split 2-Color AUrate Footer: Left Deep Forest Green, Right Sage Green */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Left Side: Deep Forest Green (Col span 8) */}
        <div className="lg:col-span-8 bg-[#24332C] text-[#FAF8F5] p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Fine Jewelry Born & Raised In */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#A3B2A9] font-medium block leading-tight">
                FINE JEWELRY<br />BORN &amp; RAISED IN
              </span>
              <div className="inline-block border border-white/40 px-4 py-2 text-center text-xs tracking-[0.24em] font-light text-white uppercase">
                MUMBAI &bull; NYC
              </div>
            </div>

            {/* Column 2: Support */}
            <div className="space-y-3">
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
                Support
              </h5>
              <ul className="space-y-2 text-xs text-[#A3B2A9] font-light">
                <li><Link href="/contact" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">CONTACT US</Link></li>
                <li><Link href="/track-order" className="hover:text-white transition-colors">TRACK ORDER</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">RETURNS</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-white transition-colors">LIFETIME GUARANTEE</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">JEWELRY CARE</Link></li>
              </ul>
            </div>

            {/* Column 3: About Us */}
            <div className="space-y-3">
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
                About Us
              </h5>
              <ul className="space-y-2 text-xs text-[#A3B2A9] font-light">
                <li><Link href="/about" className="hover:text-white transition-colors">OUR STORY</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">SUSTAINABILITY</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">REVIEWS</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">ETHICAL CRAFT</Link></li>
              </ul>
            </div>

            {/* Column 4: Links */}
            <div className="space-y-3">
              <h5 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
                Links
              </h5>
              <ul className="space-y-2 text-xs text-[#A3B2A9] font-light">
                <li><Link href="/shop?collection=gifts" className="hover:text-white transition-colors">DIGITAL GIFT CARD</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">REFER-A-FRIEND</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">HOLIDAY OFFERS</Link></li>
                <li><Link href="/admin/login" className="hover:text-white transition-colors">ADMIN PORTAL</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Strip */}
          <div className="pt-8 border-t border-[#34463C] flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.16em] uppercase text-[#A3B2A9]">
            <div className="flex flex-wrap items-center gap-6">
              <span>&copy;2026 ELVORA</span>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
              <Link href="/terms" className="hover:text-white transition-colors">TERMS &amp; CONDITIONS</Link>
            </div>
            <div className="font-mono text-[#D5E0D9]">
              CARE@ELVORA.COM
            </div>
          </div>
        </div>

        {/* Right Side: Sage Green Newsletter Column (Col span 4) matching AUrate frame 016 */}
        <div className="lg:col-span-4 bg-[#B5C7B9] text-[#1E2C23] p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="font-serif text-2xl sm:text-3xl text-[#1E2C23] font-light leading-tight">
              Keep up with our creations
            </h4>
            <p className="text-xs text-[#304537] leading-relaxed">
              Sign up for private releases, festive gifting invitations, and member privileges.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/70 border border-[#7A9881] px-3.5 py-3 text-xs text-[#1E2C23] placeholder-[#4F6855] focus:outline-none focus:bg-white focus:border-[#24332C]"
                />
                <button
                  type="submit"
                  className="bg-[#24332C] hover:bg-[#19241F] text-white px-5 py-3 text-xs uppercase tracking-wider font-semibold transition-colors shrink-0"
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>

          {/* Social Icons matching AUrate bottom right */}
          <div className="pt-8 flex items-center space-x-6 text-[#24332C]">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-75 transition-opacity">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-75 transition-opacity">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:opacity-75 transition-opacity">
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:opacity-75 transition-opacity">
              <PinterestIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
