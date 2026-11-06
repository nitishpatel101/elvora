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
    <div className="min-h-screen bg-[#F8F5F0] py-16 lg:py-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
          <XCircle className="w-9 h-9 stroke-[1.5]" />
        </div>

        <span className="text-[10px] tracking-[0.3em] uppercase text-red-600 font-medium block">
          TRANSACTION UNCONFIRMED
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-light tracking-tight">
          Payment Was Not Completed
        </h1>

        <p className="text-xs sm:text-sm text-[#6B655D] leading-relaxed font-light">
          The payment authorization could not be verified by the banking gateway.
          {reason && (
            <span className="block mt-2 font-mono text-red-700 bg-red-50 p-2.5 border border-red-100 text-xs">
              Reason: {reason}
            </span>
          )}
        </p>

        {/* Security Rule Assurance */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E8DCCD] text-[11px] text-[#6B655D] text-left space-y-2 shadow-2xs font-light">
          <div className="flex items-center gap-1.5 font-medium text-[#111111]">
            <ShieldAlert className="w-4 h-4 text-[#B69A65]" />
            <span>ELVORA Payment Integrity Policy:</span>
          </div>
          <p>
            Orders are confirmed strictly upon positive electronic settlement. Because this transaction was not verified, no debit has been finalized by ELVORA, and no order has been marked as confirmed.
          </p>
          {orderId && (
            <p className="text-[#8C867E]">
              Unconfirmed Order Reference: <span className="font-mono text-[#111111] font-medium">{orderId}</span>
            </p>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white py-3.5 px-6 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#B69A65] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-[#111111] text-[#111111] py-3.5 px-6 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#111111] hover:text-[#FFFFFF] transition-colors"
          >
            <Headphones className="w-4 h-4" />
            <span>Contact Concierge</span>
          </Link>
        </div>

        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#6B655D] hover:text-[#111111] transition-colors"
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
    <Suspense fallback={<div className="min-h-screen bg-[#F8F5F0] py-20 text-center font-light">Loading status...</div>}>
      <FailureContent />
    </Suspense>
  );
}
