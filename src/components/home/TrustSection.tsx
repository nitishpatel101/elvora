'use client';

import React from 'react';
import { Lock, ShieldCheck, Truck, Headphones, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TrustSection() {
  const trustPillars = [
    {
      icon: Lock,
      title: 'Online Payments Only',
      description:
        'Cash on Delivery is strictly prohibited across all orders. All transactions are securely processed and 256-bit SSL encrypted.',
    },
    {
      icon: Truck,
      title: 'Paid Insured Shipping',
      description:
        'Every parcel is dispatched with tamper-proof seal and tracked door-to-door via premium express logistics partners.',
    },
    {
      icon: Sparkles,
      title: 'Noble Materials',
      description:
        'Engineered with 316L hypoallergenic stainless steel, natural semiprecious gemstones, and multi-micron 18K PVD gold plating.',
    },
    {
      icon: Headphones,
      title: 'Direct Brand Concierge',
      description:
        'Dedicated advisory support available for sizing assistance, gifting advice, and priority order dispatch assistance.',
    },
  ];

  return (
    <section className="py-20 bg-[#EFEAE2]/40 border-b border-[#E7E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            The ELVORA Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light mt-1">
            Uncompromising Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8F6F2] p-8 border border-[#E7E1D8] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#B89A69] mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#171717] font-normal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#77736D] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E7E1D8] flex items-center gap-1.5 text-[11px] text-[#B89A69] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

