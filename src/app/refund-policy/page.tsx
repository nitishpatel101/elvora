import React from 'react';
import { RotateCcw, ShieldCheck, AlertCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 pb-6 border-b border-[#E7E1D8]">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Quality Assurance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light">
            Return &amp; Refund Policy
          </h1>
          <p className="text-xs text-[#77736D]">Honoring Client Confidence with Integrity</p>
        </div>

        <div className="text-xs sm:text-sm text-[#77736D] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              1. 7-Day Authenticity &amp; Defect Warranty
            </h2>
            <p>
              In the unlikely event that your piece arrives damaged or exhibits a manufacturing flaw, ELVORA offers a replacement within <strong>7 calendar days</strong> of confirmed delivery date.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              2. Eligibility Criteria
            </h2>
            <p>
              To qualify for replacement or exchange:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The jewellery piece must remain unused and unworn.</li>
              <li>All original packaging—including the signature velvet presentation box, protective velvet bags, and serialized Certificate of Authenticity—must accompany the return.</li>
              <li>Proof of purchase (Order ID and registered client email) must be provided.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              3. Refund Disbursement
            </h2>
            <p>
              When a refund is approved by our inspection atelier, the reimbursement is issued exclusively back to the <strong>original electronic payment instrument</strong> (original UPI account, debit/credit card, or net banking source) within 5-7 banking days. Because Cash on Delivery is strictly prohibited, cash refunds are never issued.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg text-[#171717] font-normal">
              4. Return Initiation Procedure
            </h2>
            <p>
              To initiate a review, please transmit an electronic message to <span className="font-mono text-[#171717]">returns@elvora.com</span> with your Order Identifier and photographic documentation of the defect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
