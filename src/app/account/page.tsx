'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { User, Package, Heart, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { customer, isCustomerLoggedIn, logoutCustomer } = useAuth();
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

  if (!isCustomerLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E7E1D8] mb-10">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
              Private Client Cabinet
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light mt-1">
              Welcome, {customer?.name || 'Valued Client'}
            </h1>
            <p className="text-xs text-[#77736D] mt-1">{customer?.email}</p>
          </div>

          <button
            onClick={() => {
              logoutCustomer();
              router.push('/');
            }}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#77736D] hover:text-red-700 transition-colors mt-4 md:mt-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Quick Navigation Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#EFEAE2]/60 border border-[#E7E1D8] p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#F8F6F2] flex items-center justify-center text-[#B89A69]">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#171717]">Order History</h3>
              <p className="text-xs text-[#77736D]">
                Track order progress, view payment receipts and shipping waybills.
              </p>
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#B89A69] font-semibold hover:underline"
              >
                <span>View All Orders ({orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#EFEAE2]/60 border border-[#E7E1D8] p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#F8F6F2] flex items-center justify-center text-[#B89A69]">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#171717]">Saved Registry</h3>
              <p className="text-xs text-[#77736D]">
                Review saved couple pieces and bespoke jewelry for future acquisition.
              </p>
              <Link
                href="/wishlist"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#B89A69] font-semibold hover:underline"
              >
                <span>Access Wishlist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="lg:col-span-8 bg-[#F8F6F2] border border-[#E7E1D8] p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E1D8]">
              <h2 className="font-serif text-xl text-[#171717] font-normal">
                Recent Acquisitions
              </h2>
              <Link
                href="/account/orders"
                className="text-xs uppercase tracking-wider text-[#77736D] hover:text-[#171717]"
              >
                View Full Archive
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-[#77736D] py-6 text-center">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-xs text-[#77736D]">
                  You have not placed any orders yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#171717] text-white text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-[#B89A69] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#EFEAE2]/40 border border-[#E7E1D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-[#171717]">
                          {ord.id}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium ${
                            ord.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#77736D] mt-1">
                        {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} •{' '}
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-serif text-base text-[#171717] font-medium">
                        {format(ord.totalAmount)}
                      </span>
                      <Link
                        href={`/account/orders/${ord.id}`}
                        className="text-xs uppercase tracking-wider bg-[#171717] text-white px-4 py-2 hover:bg-[#B89A69] transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

