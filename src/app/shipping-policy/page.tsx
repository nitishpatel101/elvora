import React from 'react';
import { Truck, Globe } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 pb-6 border-b border-[#EAE5DE]">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#708579] font-medium block">
            FULFILLMENT PROTOCOLS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light tracking-tight">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-[#5C5852] font-light">Insured Priority Transit Across India &amp; Worldwide</p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-[#FFFFFF] border border-[#EAE5DE] space-y-2 shadow-2xs">
            <Truck className="w-6 h-6 text-[#24332C]" />
            <h3 className="font-serif text-lg text-[#181818] font-light">Domestic Express (India)</h3>
            <p className="text-xs text-[#5C5852] leading-relaxed font-light">
              Standard Paid Express Fee: <strong className="text-[#181818]">₹99 INR</strong><br />
              Couriers: Blue Dart Air, Delhivery Express<br />
              Estimated Timeline: <strong className="text-[#181818]">3 to 5 Business Days</strong>
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#EAE5DE] space-y-2 shadow-2xs">
            <Globe className="w-6 h-6 text-[#24332C]" />
            <h3 className="font-serif text-lg text-[#181818] font-light">International Priority</h3>
            <p className="text-xs text-[#5C5852] leading-relaxed font-light">
              International Paid Transit Fee: <strong className="text-[#181818]">$15 USD / ₹1,299 INR</strong><br />
              Courier: DHL Express Worldwide<br />
              Estimated Timeline: <strong className="text-[#181818]">7 to 10 Business Days</strong>
            </p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-[#5C5852] space-y-6 leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">
              1. Paid Shipping Mandate
            </h2>
            <p>
              To maintain our uncompromising standard of insured, climate-controlled, and tamper-sealed transport for fine jewelry, <strong>shipping is strictly paid</strong> and calculated transparently during checkout. Free shipping is never applied by default.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">
              2. Order Verification &amp; Dispatch Timeline
            </h2>
            <p>
              Orders are dispatched solely upon 100% verified online payment. All items undergo secondary quality certification at our central atelier within 24 to 48 hours before handover to our priority logistics courier.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">
              3. Tamper-Proof Packaging &amp; Insurance
            </h2>
            <p>
              Every consignment is enclosed in our serialized, tamper-evident security pouch. If the exterior seal appears breached or damaged upon arrival, clients are advised to refuse acceptance and alert our concierge immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#181818] font-normal">
              4. Real-Time Tracking
            </h2>
            <p>
              Upon handover to the courier, an automated dispatch notice featuring your tracking number (AWB) is generated. You may follow your consignment directly on our <a href="/track-order" className="text-[#24332C] underline">Track Order page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
