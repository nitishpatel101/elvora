import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 pb-6 border-b border-[#EAE5DE]">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
            Client Agreement
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light">
            Terms and Conditions
          </h1>
          <p className="text-xs text-[#77736D]">Effective: November 2026</p>
        </div>

        <div className="text-xs sm:text-sm text-[#77736D] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">1. General Overview</h2>
            <p>
              By accessing the ELVORA boutique portal or placing an order, you agree to be bound unconditionally by these Terms and Conditions. These terms govern all sales of fine jewellery and accessories by ELVORA.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">2. Online Payments Exclusively &amp; COD Prohibition</h2>
            <p>
              <strong>Cash on Delivery (COD) is strictly prohibited across all product lines and jurisdictions.</strong> All orders must be settled via verified electronic payment gateways prior to dispatch. An order is confirmed strictly when the financial transaction receives verified &lsquo;PAID&rsquo; authorization from the issuing institution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">3. Pricing &amp; Currency</h2>
            <p>
              All baseline prices are designated in Indian Rupees (INR ₹). When an international currency (such as USD $) is selected, it serves as an informative display conversion calculated against contemporary market rates. Settlement occurs in accordance with gateway multi-currency authorization without concealed surcharges.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">4. Intellectual Property</h2>
            <p>
              All designs, brand signatures, photographs, 3D assets, and trademarks displayed on this domain remain the exclusive property of ELVORA Fine Jewellery.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
