'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Truck, Award, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({ years: 1, customers: 1, products: 1 });

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate count-up starting from 1 when user scrolls down
            const duration = 2200; // 2.2 seconds smooth roll
            const startTime = performance.now();

            const targetYears = 3;
            const targetCustomers = 6400;
            const targetProducts = 139;

            const updateCounts = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease Out Quartic for ultra-smooth decelerating roll
              const easeProgress = 1 - Math.pow(1 - progress, 4);

              setCounts({
                years: Math.max(1, Math.round(1 + (targetYears - 1) * easeProgress)),
                customers: Math.max(1, Math.round(1 + (targetCustomers - 1) * easeProgress)),
                products: Math.max(1, Math.round(1 + (targetProducts - 1) * easeProgress)),
              });

              if (progress < 1) {
                requestAnimationFrame(updateCounts);
              }
            };

            requestAnimationFrame(updateCounts);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="border-b border-stone-200 bg-white">
      {/* Bright Yellow Header Banner */}
      <div className="bg-[#F5C400] text-black py-4 sm:py-5 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Why People Choose ELVORA
        </h2>
      </div>

      {/* Stats and Guarantees Container */}
      <div className="bg-[#FAFAFA] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* 3 Numerical Stats with On-Scroll Animated Counters from 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center mb-12 sm:mb-16">
            {/* Stat 1: Years */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all">
              <span className="block text-4xl sm:text-6xl font-black text-stone-900 tracking-tight font-sans">
                {counts.years}+
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-semibold mt-2">
                Years of trust
              </span>
            </div>

            {/* Stat 2: Customers */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all">
              <span className="block text-4xl sm:text-6xl font-black text-stone-900 tracking-tight font-sans">
                {counts.customers >= 1000
                  ? `${(counts.customers / 1000).toFixed(1)}K+`
                  : `${counts.customers}+`}
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-semibold mt-2">
                Happy customers
              </span>
            </div>

            {/* Stat 3: Products */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all">
              <span className="block text-4xl sm:text-6xl font-black text-stone-900 tracking-tight font-sans">
                {counts.products}+
              </span>
              <span className="block text-xs sm:text-sm text-stone-600 font-semibold mt-2">
                Unique Products
              </span>
            </div>
          </div>

          {/* 3 Trust Pillars with Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center pt-6 border-t border-stone-200">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-stone-200/70 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#F5C400]/20 border-2 border-[#F5C400] flex items-center justify-center mb-4 text-stone-900 shadow-xs">
                <Truck className="w-8 h-8 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                Free Express Shipping
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
                Get FREE Safe &amp; Insured Shipping on all orders across India
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-stone-200/70 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#F5C400]/20 border-2 border-[#F5C400] flex items-center justify-center mb-4 text-stone-900 shadow-xs">
                <Award className="w-8 h-8 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                Quality Guaranteed
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
                Premium materials, crystal-clear optics &amp; precision craft
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-stone-200/70 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#F5C400]/20 border-2 border-[#F5C400] flex items-center justify-center mb-4 text-stone-900 shadow-xs">
                <Headphones className="w-8 h-8 text-stone-900 stroke-[1.8]" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">
                24/7 Dedicated Support
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
                Live WhatsApp assistance (+91 63866 45203) for custom gifts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
