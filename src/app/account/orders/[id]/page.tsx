'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { ArrowLeft, Truck, ShieldCheck } from 'lucide-react';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { format } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setOrder(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 text-center text-xs text-[#77736D]">
        Retrieving order records...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#181818]">Order not found</h1>
        <Link
          href="/account/orders"
          className="text-xs uppercase tracking-wider text-[#24332C] underline font-semibold"
        >
          Return to orders
        </Link>
      </div>
    );
  }

  const steps = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIdx = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#708579] hover:text-[#24332C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                Order Dossier
              </span>
              <h1 className="font-serif text-3xl text-[#181818] font-light">
                {order.id}
              </h1>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
              <span>{order.status}</span>
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white border border-[#EAE5DE] p-6 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            {steps.map((st, idx) => {
              const isPastOrCurrent = currentStepIdx >= idx || (order.status === 'PAID' && idx === 0);
              return (
                <div key={st} className="space-y-2">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-colors ${
                      isPastOrCurrent
                        ? 'bg-[#24332C] text-[#FAF8F5]'
                        : 'bg-[#EAE5DE] text-[#77736D]'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider block font-medium ${
                      isPastOrCurrent ? 'text-[#181818]' : 'text-[#77736D]'
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div className="mt-6 pt-4 border-t border-[#EAE5DE] flex items-center justify-between text-xs">
              <span className="text-[#77736D]">
                Courier: <strong>{order.trackingCourier || 'Blue Dart Express'}</strong>
              </span>
              <span className="font-mono text-[#181818]">
                Tracking: <strong>{order.trackingNumber}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="bg-white border border-[#EAE5DE] p-6 space-y-4 shadow-xs">
          <h2 className="text-xs uppercase tracking-wider text-[#181818] font-medium">
            Pieces in this Consignment
          </h2>

          <div className="divide-y divide-[#EAE5DE]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-[#FAF8F5] border border-[#EAE5DE] overflow-hidden shrink-0">
                    <Image
                      src={item.productImage || '/images/products/touch-distance-bracelet/hero.jpg'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm text-[#181818]">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-[#77736D]">
                      Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif text-sm font-medium text-[#181818]">
                    {format(item.priceAtPurchase * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#EAE5DE] space-y-2 text-xs">
            <div className="flex justify-between text-[#77736D]">
              <span>Subtotal</span>
              <span className="font-medium text-[#181818]">{format(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#77736D]">
              <span>Paid Insured Shipping</span>
              <span className="font-medium text-[#181818]">{format(order.shippingCharge)}</span>
            </div>
            <div className="pt-2 border-t border-[#EAE5DE] flex justify-between text-sm font-semibold text-[#181818]">
              <span>Total Settled</span>
              <span className="font-serif text-lg text-[#181818]">{format(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Verification */}
        <div className="bg-white border border-[#EAE5DE] p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#77736D] shadow-xs">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#181818] font-medium mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#708579]" />
              <span>Consignment Destination</span>
            </h3>
            <p className="font-medium text-[#181818]">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#181818] font-medium mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#708579]" />
              <span>Payment Integrity</span>
            </h3>
            <p>Method: Online Payment ({order.paymentGateway})</p>
            <p>Transaction ID: <span className="font-mono text-[#181818]">{order.paymentId || 'Verified Capture'}</span></p>
            <p>Settlement Currency: {order.currency}</p>
            <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
