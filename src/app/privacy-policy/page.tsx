import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 pb-6 border-b border-[#E7E1D8]">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Maison Disclosures
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#77736D]">Last revised: November 2026</p>
        </div>

        <div className="prose prose-stone text-xs sm:text-sm text-[#77736D] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">1. Overview & Commitment</h2>
            <p>
              ELVORA (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) treats the confidentiality of our esteemed clientele with uncompromising reverence. This Privacy Policy governs the collection, processing, and protection of personal data gathered when accessing our portal, interacting with our digital concierge, or acquiring our curated jewellery pieces.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">2. Data Collected</h2>
            <p>
              We collect information strictly necessary to fulfill your orders and safeguard transactions:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Client Identity: Full name, electronic mail address, telephone contact.</li>
              <li>Delivery Particulars: Recipient address, city, state, postal code, country.</li>
              <li>Transaction Telemetry: Payment order IDs and cryptographic signatures provided by verified gateways. <em>ELVORA never retains or stores raw credit or debit card primary account numbers.</em></li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">3. Electronic Payments &amp; Security</h2>
            <p>
              All payment settlements are executed via accredited, PCI-DSS Level 1 compliant financial gateways (including Razorpay). Transactions use 256-bit Secure Socket Layer (SSL) encryption with HMAC-SHA256 signature verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">4. Contacting the Privacy Officer</h2>
            <p>
              Inquiries regarding personal records may be addressed directly to: <span className="font-mono text-[#171717]">privacy@elvora.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

