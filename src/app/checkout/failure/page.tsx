'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw, Headphones, ShieldAlert } from 'lucide-react';

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason');

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
          <XCircle className="w-9 h-9 stroke-[1.5]" />
        </div>

        <span className="text-[10px] tracking-[0.3em] uppercase text-red-600 font-medium block">
          Transaction Unconfirmed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light">
          Payment Was Not Completed
        </h1>

        <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed">
          The payment authorization could not be verified by the banking gateway.
          {reason && (
            <span className="block mt-2 font-mono text-red-700 bg-red-50 p-2 border border-red-100 text-xs">
              Reason: {reason}
            </span>
          )}
        </p>

        {/* Security Rule Assurance */}
        <div className="p-4 bg-[#EFEAE2]/60 border border-[#E7E1D8] text-[11px] text-[#77736D] text-left space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
            <ShieldAlert className="w-4 h-4 text-[#B89A69]" />
            <span>ELVORA Payment Integrity Policy:</span>
          </div>
          <p>
            Orders are confirmed strictly upon positive electronic settlement. Because this transaction was not verified, no debit has been finalized by ELVORA, and no order has been marked as confirmed.
          </p>
          {orderId && (
            <p className="text-[#A39E96]">
              Unconfirmed Order Reference: <span className="font-mono">{orderId}</span>
            </p>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 bg-[#171717] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B89A69] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-[#171717] text-[#171717] py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium hover:border-[#B89A69] hover:text-[#B89A69] transition-colors"
          >
            <Headphones className="w-4 h-4" />
            <span>Contact Concierge</span>
          </Link>
        </div>

        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#77736D] hover:text-[#171717] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Jewellery Vault</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F2] py-20 text-center">Loading status...</div>}>
      <FailureContent />
    </Suspense>
  );
}
