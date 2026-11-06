'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { ArrowLeft, Package, ExternalLink } from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const { customer, isCustomerLoggedIn } = useAuth();
  const { format } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCustomerLoggedIn) {
      router.push('/auth/login');
      return;
    }

    if (customer?.email) {
      fetch(`/api/orders?email=${encodeURIComponent(customer.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .finally(() => setLoading(false));
    }
  }, [customer, isCustomerLoggedIn, router]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#708579] hover:text-[#24332C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-3">
            Your Order Archive
          </h1>
        </div>

        {loading ? (
          <p className="text-xs text-[#77736D] py-12 text-center">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#EAE5DE] p-8 space-y-4">
            <Package className="w-12 h-12 text-[#708579] mx-auto stroke-1" />
            <h2 className="font-serif text-xl text-[#181818]">No orders found</h2>
            <p className="text-xs text-[#77736D]">
              When you acquire pieces from ELVORA, they will appear here with full tracking history.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#24332C] text-white text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-[#19241F] transition-colors shadow-xs"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-[#EAE5DE] p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-[#181818]">
                      {ord.id}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 font-medium ${
                        ord.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#77736D]">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                  </p>
                  <p className="text-xs text-[#77736D]">
                    Shipping: {ord.shippingAddress.city}, {ord.shippingAddress.country}
                  </p>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-6">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#77736D] block">
                      Amount Paid
                    </span>
                    <span className="font-serif text-xl text-[#181818]">
                      {format(ord.totalAmount)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/account/orders/${ord.id}`}
                      className="text-xs uppercase tracking-wider bg-[#24332C] text-white px-4 py-2.5 hover:bg-[#19241F] transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/track-order?orderId=${ord.id}`}
                      className="text-xs uppercase tracking-wider border border-[#EAE5DE] text-[#181818] p-2.5 hover:border-[#24332C] hover:text-[#24332C] transition-colors"
                      title="Track Shipment"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
