'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { format } = useCurrency();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Fire celebratory luxury gold & white confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#B69A65', '#E8DCCD', '#111111', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setOrder(data);
          }
        });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-[#FFFFFF] border border-[#B69A65]/40 flex items-center justify-center mx-auto text-[#B69A65] shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
          </div>

          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A65] font-medium block">
            PAYMENT VERIFIED &amp; CONFIRMED
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-light tracking-tight">
            Thank You for Your Patronage
          </h1>

          <p className="text-xs sm:text-sm text-[#6B655D] max-w-md mx-auto leading-relaxed font-light">
            Your payment was securely verified. We are preparing your creations in our signature presentation box for expedited insured dispatch.
          </p>
        </div>

        {order ? (
          <div className="bg-[#FFFFFF] border border-[#E8DCCD] shadow-2xs divide-y divide-[#E8DCCD]">
            {/* Order Details Header */}
            <div className="p-6 bg-[#F8F5F0]/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B655D] block font-medium">
                  Order Reference
                </span>
                <span className="font-mono text-base font-bold text-[#111111]">
                  {order.id}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B655D] block font-medium">
                  Payment Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {order.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B655D] block font-medium">
                  Transaction Reference
                </span>
                <span className="font-mono text-xs text-[#6B655D]">
                  {order.paymentId || 'Verified Electronic Capture'}
                </span>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-[#111111] font-medium">
                Purchased Pieces ({order.items.length})
              </h3>

              <div className="divide-y divide-[#E8DCCD]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-[#F8F5F0] border border-[#E8DCCD] overflow-hidden shrink-0">
                        <Image
                          src={item.productImage || '/images/products/touch-distance-bracelet/hero.jpg'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm text-[#111111] font-light">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-[#6B655D]">
                          Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-sm font-medium text-[#111111]">
                        {format(item.priceAtPurchase * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 bg-[#F8F5F0]/40 space-y-2 text-xs font-light">
              <div className="flex justify-between text-[#6B655D]">
                <span>Item Subtotal</span>
                <span className="font-medium text-[#111111]">{format(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#6B655D]">
                <span>Paid Insured Shipping</span>
                <span className="font-medium text-[#111111]">{format(order.shippingCharge)}</span>
              </div>

              <div className="pt-2 border-t border-[#E8DCCD] flex justify-between text-sm font-light text-[#111111]">
                <span>Total Amount Paid</span>
                <span className="font-serif text-lg font-medium text-[#111111]">{format(order.totalAmount)}</span>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="p-6 space-y-2 text-xs text-[#6B655D] font-light">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#111111] font-medium">
                <Truck className="w-4 h-4 text-[#B69A65]" />
                <span>Shipping Address</span>
              </div>
              <p className="text-[#111111] font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-1 text-[#8C867E]">Contact: {order.shippingAddress.phone} • {order.shippingAddress.email}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-[#E8DCCD] p-8 shadow-sm">
            <Package className="w-10 h-10 mx-auto text-[#B69A65] mb-3 stroke-[1.4]" />
            <h3 className="font-serif text-lg text-[#111111] font-light">Order Confirmed</h3>
            <p className="text-xs text-[#6B655D] mt-1 font-light">
              Reference: <span className="font-mono text-[#111111] font-medium">{orderId || 'Recent Order'}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/track-order?orderId=${orderId || ''}`}
            className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white py-3.5 px-6 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#B69A65] transition-colors"
          >
            <span>Track Order Status</span>
            <ExternalLink className="w-4 h-4" />
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border border-[#111111] text-[#111111] py-3.5 px-6 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#111111] hover:text-[#FFFFFF] transition-colors"
          >
            <span>Return to Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F5F0] py-20 text-center font-light">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
