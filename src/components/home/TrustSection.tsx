'use client';

import React from 'react';
import { Lock, PackageCheck, Headphones, Truck, Check } from 'lucide-react';

export default function TrustSection() {
  const benefits = [
    {
      icon: Lock,
      title: 'Secure Online Payments',
      description:
        'All orders are processed through encrypted 256-bit SSL gateways. Cash on Delivery is strictly prohibited.',
    },
    {
      icon: PackageCheck,
      title: 'Carefully Packed Orders',
      description:
        'Every piece is individually sealed in protective jewel cases and arrives in signature presentation packaging.',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description:
        'Our dedicated concierge team is available to assist you with inquiries, sizing, and order tracking.',
    },
    {
      icon: Truck,
      title: 'Shipping Information',
      description:
        'Reliable paid express delivery across India (₹99) and internationally (₹1,299 / $15 USD) with door-to-door tracking.',
    },
  ];

  return (
    <section className="py-20 bg-[#FFFFFF] border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#708579] font-medium block">
            OUR PROMISE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-1 tracking-tight">
            The ELVORA Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-8 border border-[#EAE5DE] flex flex-col justify-between transition-all hover:border-[#24332C]/50 hover:shadow-xs"
              >
                <div>
                  <div className="w-11 h-11 bg-[#EEF3F0] border border-[#D5E0D9] flex items-center justify-center text-[#24332C] mb-5">
                    <Icon className="w-5 h-5 stroke-[1.4]" />
                  </div>
                  <h3 className="font-serif text-lg text-[#181818] font-light mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5C5852] leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EAE5DE] flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[#24332C] font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed Policy</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
