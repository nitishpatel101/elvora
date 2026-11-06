'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { Search, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState('');
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
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Shipment Dispatch Tracker
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light">
            Track Your Consignment
          </h1>
          <p className="text-xs text-[#77736D]">
            Enter your order reference (e.g. ELV-89421) to check fulfillment &amp; courier milestones.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#F8F6F2] border border-[#E7E1D8] p-6 shadow-xs mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#77736D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. ELV-123456)"
                className="w-full bg-[#EFEAE2]/60 border border-[#E7E1D8] pl-9 pr-3 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69] font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#171717] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B89A69] transition-colors disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-8">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="bg-[#F8F6F2] border border-[#E7E1D8] shadow-sm divide-y divide-[#E7E1D8]">
            <div className="p-6 bg-[#EFEAE2]/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                  Order Reference
                </span>
                <span className="font-mono text-base font-bold text-[#171717]">{order.id}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                  Current Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {order.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                  Destination
                </span>
                <span className="text-xs text-[#171717] font-medium">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </span>
              </div>
            </div>

            {/* Courier Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#171717] font-medium">
                <Truck className="w-4 h-4 text-[#B89A69]" />
                <span>Courier Waybill Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#EFEAE2]/50 p-4 border border-[#E7E1D8]">
                <div>
                  <span className="text-[#77736D] block">Logistics Provider:</span>
                  <span className="font-semibold text-[#171717]">
                    {order.trackingCourier || 'Blue Dart Express (Air Cargo)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#77736D] block">Tracking Number / AWB:</span>
                  <span className="font-mono font-semibold text-[#171717]">
                    {order.trackingNumber || 'AWB-ELV-' + order.id.replace('ELV-', '') + '-EXP'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#77736D] leading-relaxed">
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
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F2] py-20 text-center">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
