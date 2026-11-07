'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, CheckCircle, ShoppingBag } from 'lucide-react';

interface RecentSale {
  id: string;
  customerName: string;
  city: string;
  productName: string;
  productSlug: string;
  productImage: string;
  price: string;
  timeAgo: string;
}

const SALES_DATA: RecentSale[] = [
  {
    id: 's-1',
    customerName: 'Rohan Sharma',
    city: 'Mumbai',
    productName: 'Touch Distance Couple Bracelet',
    productSlug: 'touch-distance-couple-bracelet',
    productImage: 'https://images.unsplash.com/photo-1611591475155-42ac219803a6?auto=format&fit=crop&w=400&q=80',
    price: '₹1,399',
    timeAgo: 'Just 1 minute ago',
  },
  {
    id: 's-2',
    customerName: 'Pooja & Kabir',
    city: 'Delhi NCR',
    productName: 'Touch Distance Couple Bracelet',
    productSlug: 'touch-distance-couple-bracelet',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    price: '₹1,399',
    timeAgo: 'Just 2 minutes ago',
  },
  {
    id: 's-3',
    customerName: 'Sneha Patil',
    city: 'Pune',
    productName: 'Aura Sun & Moon Couple Bands',
    productSlug: 'aura-sun-moon-couple-bands',
    productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
    price: '₹1,699',
    timeAgo: '3 minutes ago',
  },
  {
    id: 's-4',
    customerName: 'Ananya & Dhruv',
    city: 'Bengaluru',
    productName: 'Touch Distance Couple Bracelet',
    productSlug: 'touch-distance-couple-bracelet',
    productImage: 'https://images.unsplash.com/photo-1611591475155-42ac219803a6?auto=format&fit=crop&w=400&q=80',
    price: '₹1,399',
    timeAgo: 'Just 4 minutes ago',
  },
  {
    id: 's-5',
    customerName: 'Vikramaditya S.',
    city: 'Jaipur',
    productName: 'Solitaire Eternal Diamond Ring',
    productSlug: 'solitaire-eternal-diamond-ring',
    productImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80',
    price: '₹1,899',
    timeAgo: 'Just 6 minutes ago',
  },
  {
    id: 's-6',
    customerName: 'Meera & Siddharth',
    city: 'Hyderabad',
    productName: 'Constellation Diamond Huggies',
    productSlug: 'constellation-diamond-huggies',
    productImage: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=400&q=80',
    price: '₹1,499',
    timeAgo: 'Just 8 minutes ago',
  },
];

export default function RecentSalesPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closedByUser, setClosedByUser] = useState(false);

  useEffect(() => {
    // Initial delay before first popup appears
    const initialTimer = setTimeout(() => {
      if (!closedByUser) setVisible(true);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, [closedByUser]);

  useEffect(() => {
    if (closedByUser) return;

    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    if (visible) {
      // Stay visible for 6 seconds
      hideTimer = setTimeout(() => {
        setVisible(false);
      }, 6000);
    } else {
      // Re-appear with next item after 10 seconds
      nextTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SALES_DATA.length);
        setVisible(true);
      }, 10000);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [visible, closedByUser]);

  if (closedByUser || !visible) return null;

  const current = SALES_DATA[currentIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-4 left-3 sm:left-4 z-40 max-w-sm w-[calc(100vw-1.5rem)] sm:w-auto animate-fade-in-up transition-all duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md border border-[#C5A265]/30 rounded-xl shadow-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 relative hover:shadow-xl hover:border-[#C5A265] transition-all group">
        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            setClosedByUser(true);
          }}
          aria-label="Dismiss notification"
          className="absolute top-1 right-1 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Product Thumbnail */}
        <Link
          href={`/product/${current.productSlug}`}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200"
        >
          <Image
            src={current.productImage}
            alt={current.productName}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </Link>

        {/* Content */}
        <Link href={`/product/${current.productSlug}`} className="flex-1 min-w-0 pr-3 sm:pr-4">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-emerald-800 flex items-center gap-1 truncate">
              <CheckCircle className="w-3 h-3 text-emerald-600 inline shrink-0" />
              <span>Verified Order • <span className="text-stone-500">{current.timeAgo}</span></span>
            </span>
          </div>

          <p className="text-[11px] sm:text-xs font-semibold text-stone-900 truncate">
            {current.customerName} <span className="font-normal text-stone-500">from {current.city}</span>
          </p>

          <p className="text-[10px] sm:text-[11px] text-stone-600 truncate mt-0.5 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-[#C5A265] flex-shrink-0" />
            <span className="truncate">{current.productName}</span>
            <span className="font-semibold text-stone-900 flex-shrink-0">({current.price})</span>
          </p>
        </Link>
      </div>
    </div>
  );
}

