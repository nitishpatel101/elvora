'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-12 border-b border-stone-800">
          {/* Column 1: Collections */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Touch Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/shop" className="hover:text-[#F5C400] transition-colors">Smart Touch Bracelets</Link></li>
              <li><Link href="/shop/couple-bracelets" className="hover:text-[#F5C400] transition-colors">Couple Bracelets Set</Link></li>
              <li><Link href="/shop" className="hover:text-[#F5C400] transition-colors">Sun &amp; Moon Series</Link></li>
              <li><Link href="/shop" className="hover:text-[#F5C400] transition-colors">Snake Chain Luxury Editions</Link></li>
              <li><Link href="/shop" className="hover:text-[#F5C400] transition-colors">Milanese Mesh Editions</Link></li>
              <li><Link href="/#bestsellers" className="hover:text-[#F5C400] transition-colors">Best Sellers</Link></li>
              <li><Link href="/#reviews" className="hover:text-[#F5C400] transition-colors">Verified Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link href="/" className="hover:text-[#F5C400] transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-[#F5C400] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#F5C400] transition-colors">Contact</Link></li>
              <li><Link href="/track-order" className="hover:text-[#F5C400] transition-colors">Track Order</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#F5C400] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#F5C400] transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#F5C400] transition-colors">Return and Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#F5C400] transition-colors">Shipping Policy</Link></li>
              <li><Link href="/admin/login" className="hover:text-[#F5C400] transition-colors text-stone-500">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Get In Touch
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <p>
                <span className="text-stone-300 font-medium block">Email:</span>
                <a href="mailto:concierge@elvora.com" className="text-white hover:text-[#EBB05D] transition-colors font-mono">
                  concierge@elvora.com
                </a>
              </p>
              <p>
                <span className="text-stone-300 font-medium block">WhatsApp &amp; Mobile:</span>
                <a href="https://wa.me/916386645203" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold text-sm font-mono block hover:underline">
                  +91 63866 45203
                </a>
              </p>
              <p className="text-[11px] text-stone-500">
                Operating Hours: Monday &ndash; Saturday 10:00 AM &ndash; 7:00 PM IST
              </p>
            </div>
          </div>

          {/* Column 4: Brand About & Social */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-1 ring-[#D79648]/40 shadow-md flex-shrink-0 bg-black">
                <Image
                  src="/images/logo-circle.png"
                  alt="ELVORA"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-[#D79648] via-[#FBE8C0] to-[#EBB05D] bg-clip-text text-transparent font-serif">
                ELVORA
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              ELVORA is India&apos;s luxury destination for smart touch distance bracelets and connected couple jewelry. Feel your partner&apos;s gentle touch, light and vibration in real-time across any distance.
            </p>
            <div className="flex items-center gap-4 text-stone-300 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#EBB05D] transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#EBB05D] transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#EBB05D] transition-colors">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} ELVORA Gifts &bull; All Rights Reserved.</p>
          <p className="text-stone-400">Made with ❤️ for Indian Celebrations</p>
        </div>
      </div>
    </footer>
  );
}
