'use client';

import React from 'react';
import { Truck, Award, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
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
          {/* 3 Numerical Stats */}
          <div className="grid grid-cols-3 gap-6 text-center mb-12 sm:mb-16">
            <div>
              <span className="block text-4xl sm:text-6xl font-black text-stone-900 tracking-tight">
                1+
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-medium mt-1">
                Years of trust
              </span>
            </div>
            <div>
              <span className="block text-4xl sm:text-6xl font-black text-stone-900 tracking-tight">
                3K+
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-medium mt-1">
                Happy customers
              </span>
            </div>
            <div>
              <span className="block text-4xl sm:text-6xl font-black text-stone-900 tracking-tight">
                65+
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-medium mt-1">
                Products
              </span>
            </div>
          </div>

          {/* 3 Trust Pillars with Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-4 border-t border-stone-200">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#F5C400]/20 border border-[#F5C400] flex items-center justify-center mb-3 text-stone-900 shadow-xs">
                <Truck className="w-7 h-7 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                Free shipping
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Get FREE Shipping on verified prepaid orders
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#F5C400]/20 border border-[#F5C400] flex items-center justify-center mb-3 text-stone-900 shadow-xs">
                <Award className="w-7 h-7 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                Quality guaranteed
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Premium materials &amp; 100% verified testing only
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#F5C400]/20 border border-[#F5C400] flex items-center justify-center mb-3 text-stone-900 shadow-xs">
                <Headphones className="w-7 h-7 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                24/7 support
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Always here to help on WhatsApp (+91 63866 45203)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

