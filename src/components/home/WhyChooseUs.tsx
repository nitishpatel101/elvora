'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Award, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const [counts, setCounts] = useState({ years: 0, customers: 0, products: 0 });

  // Animate count up when component mounts
  useEffect(() => {
    let frame = 0;
    const totalFrames = 40;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCounts({
        years: Math.min(3, Math.round(progress * 3)),
        customers: Math.min(6400, Math.round(progress * 6400)),
        products: Math.min(139, Math.round(progress * 139)),
      });

      if (frame >= totalFrames) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-b border-stone-200">
      {/* Bright Yellow Header Banner */}
      <div className="bg-[#F5C400] text-black py-4 sm:py-5 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Why People Choose ELVORA
        </h2>
      </div>

      {/* Stats and Guarantees Container */}
      <div className="bg-[#FAFAFA] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* 3 Numerical Stats with Animated Counters */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center mb-12 sm:mb-16">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
              <span className="block text-3xl sm:text-6xl font-black text-stone-900 tracking-tight">
                {counts.years}+
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-semibold mt-1">
                Years of trust
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
              <span className="block text-3xl sm:text-6xl font-black text-stone-900 tracking-tight">
                {counts.customers >= 1000 ? `${(counts.customers / 1000).toFixed(1)}K+` : `${counts.customers}+`}
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-semibold mt-1">
                Happy customers
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
              <span className="block text-3xl sm:text-6xl font-black text-stone-900 tracking-tight">
                {counts.products}+
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-semibold mt-1">
                Unique Products
              </span>
            </div>
          </div>

          {/* 3 Trust Pillars with Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center pt-6 border-t border-stone-200">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-stone-200/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#F5C400]/20 border-2 border-[#F5C400] flex items-center justify-center mb-4 text-stone-900 shadow-xs">
                <Truck className="w-8 h-8 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                Free Express Shipping
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Get FREE Safe &amp; Insured Shipping on all orders across India
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-stone-200/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#F5C400]/20 border-2 border-[#F5C400] flex items-center justify-center mb-4 text-stone-900 shadow-xs">
                <Award className="w-8 h-8 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                Quality Guaranteed
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Premium materials, crystal-clear optics &amp; precision craft
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-stone-200/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#F5C400]/20 border-2 border-[#F5C400] flex items-center justify-center mb-4 text-stone-900 shadow-xs">
                <Headphones className="w-8 h-8 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                24/7 Dedicated Support
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Live WhatsApp assistance (+91 63866 45203) for custom gifts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
