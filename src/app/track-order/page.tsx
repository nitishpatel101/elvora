'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/types';
import { Search, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${idToFetch.trim()}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error('Order not found. Please verify your Order Reference.');
      }
      setOrder(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to look up order';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A65] font-medium block">
            SHIPMENT DISPATCH TRACKER
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-light tracking-tight">
            Track Your Consignment
          </h1>
          <p className="text-xs text-[#6B655D] font-light">
            Enter your order reference (e.g. ELV-89421) to check fulfillment &amp; courier milestones.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#FFFFFF] border border-[#E8DCCD] p-6 shadow-2xs mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6B655D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. ELV-123456)"
                className="w-full bg-[#F8F5F0] border border-[#E8DCCD] pl-9 pr-3 py-3 text-xs text-[#111111] focus:outline-none focus:border-[#B69A65] font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#111111] text-white px-7 py-3 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#B69A65] transition-colors disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-8 font-light">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="bg-[#FFFFFF] border border-[#E8DCCD] shadow-2xs divide-y divide-[#E8DCCD]">
            <div className="p-6 bg-[#F8F5F0]/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B655D] block font-medium">
                  Order Reference
                </span>
                <span className="font-mono text-base font-bold text-[#111111]">{order.id}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B655D] block font-medium">
                  Current Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {order.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B655D] block font-medium">
                  Destination
                </span>
                <span className="text-xs text-[#111111] font-light">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </span>
              </div>
            </div>

            {/* Courier Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#111111] font-medium">
                <Truck className="w-4 h-4 text-[#B69A65]" />
                <span>Courier Waybill Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8F5F0] p-4 border border-[#E8DCCD] font-light">
                <div>
                  <span className="text-[#6B655D] block">Logistics Provider:</span>
                  <span className="font-medium text-[#111111]">
                    {order.trackingCourier || 'Blue Dart Express (Air Cargo)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B655D] block">Tracking Number / AWB:</span>
                  <span className="font-mono font-medium text-[#111111]">
                    {order.trackingNumber || 'AWB-ELV-' + order.id.replace('ELV-', '') + '-EXP'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6B655D] leading-relaxed font-light">
                Your package is dispatched with tamper-evident security tape and insured priority handling. Expected delivery within 3-5 business days from verified payment date.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F5F0] py-20 text-center font-light">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
