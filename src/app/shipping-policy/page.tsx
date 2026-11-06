import React from 'react';
import { Truck, ShieldCheck, Clock, Globe } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 pb-6 border-b border-[#E7E1D8]">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Fulfillment Protocols
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-[#77736D]">Insured Priority Transit Across India &amp; Worldwide</p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-[#EFEAE2]/60 border border-[#E7E1D8] space-y-2">
            <Truck className="w-6 h-6 text-[#B89A69]" />
            <h3 className="font-serif text-lg text-[#171717]">Domestic Express (India)</h3>
            <p className="text-xs text-[#77736D] leading-relaxed">
              Standard Paid Express Fee: <strong>₹99 INR</strong><br />
              Couriers: Blue Dart Air, Delhivery Express<br />
              Estimated Timeline: <strong>3 to 5 Business Days</strong>
            </p>
          </div>

          <div className="p-6 bg-[#EFEAE2]/60 border border-[#E7E1D8] space-y-2">
            <Globe className="w-6 h-6 text-[#B89A69]" />
            <h3 className="font-serif text-lg text-[#171717]">International Priority</h3>
            <p className="text-xs text-[#77736D] leading-relaxed">
              International Paid Transit Fee: <strong>$15 USD / ₹1,299 INR</strong><br />
              Courier: DHL Express Worldwide<br />
              Estimated Timeline: <strong>7 to 10 Business Days</strong>
            </p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-[#77736D] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              1. Paid Shipping Mandate
            </h2>
            <p>
              To maintain our uncompromising standard of insured, climate-controlled, and tamper-sealed transport for fine jewelry, <strong>shipping is strictly paid</strong> and calculated transparently during checkout. Free shipping is never applied by default.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              2. Order Verification &amp; Dispatch Timeline
            </h2>
            <p>
              Orders are dispatched solely upon 100% verified online payment. All items undergo secondary quality certification at our central atelier within 24 to 48 hours before handover to our priority logistics courier.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              3. Tamper-Proof Packaging &amp; Insurance
            </h2>
            <p>
              Every consignment is enclosed in our serialized, tamper-evident security pouch. If the exterior seal appears breached or damaged upon arrival, clients are advised to refuse acceptance and alert our concierge immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              4. Real-Time Tracking
            </h2>
            <p>
              Upon handover to the courier, an automated dispatch notice featuring your tracking number (AWB) is generated. You may follow your consignment directly on our <a href="/track-order" className="text-[#B89A69] underline">Track Order page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
