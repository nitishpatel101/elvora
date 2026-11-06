'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Lock, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotalInr, shippingInr, grandTotalInr } =
    useCart();
  const { format } = useCurrency();

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#708579] font-medium block">
            REVIEW SELECTIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-1 tracking-tight">
            Your Shopping Bag
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] border border-[#EAE5DE] max-w-md mx-auto p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#EEF3F0] flex items-center justify-center mx-auto text-[#24332C]">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <h2 className="font-serif text-xl text-[#181818] font-light">Your bag is currently empty</h2>
            <p className="text-xs text-[#5C5852] font-light">
              Select from our illuminated couple bracelets, statement necklaces, and fine earrings.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#24332C] text-white text-xs uppercase tracking-[0.2em] px-6 py-3 hover:bg-[#19241F] transition-colors"
              >
                <span>Discover Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Items Table */}
            <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#EAE5DE] p-6 divide-y divide-[#EAE5DE] shadow-2xs">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant || 'default'}`}
                  className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative w-24 h-24 bg-[#FAF8F5] border border-[#EAE5DE] overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-serif text-base text-[#181818] hover:text-[#24332C] transition-colors block font-light"
                      >
                        {item.product.name}
                      </Link>
                      {item.selectedVariant && (
                        <p className="text-xs text-[#5C5852] font-light">{item.selectedVariant}</p>
                      )}
                      <p className="text-xs font-serif text-[#181818]">
                        Unit Price: {format(item.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#EAE5DE] bg-[#FFFFFF]">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.selectedVariant)
                        }
                        className="p-2 text-xs text-[#5C5852] hover:text-[#181818]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-medium text-[#181818]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.selectedVariant)
                        }
                        className="p-2 text-xs text-[#5C5852] hover:text-[#181818]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="font-serif text-base text-[#181818] font-light block">
                        {format(item.product.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                      className="text-[#8A857D] hover:text-red-600 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#EAE5DE] p-6 space-y-6 shadow-2xs">
              <h2 className="font-serif text-xl text-[#181818] font-light pb-3 border-b border-[#EAE5DE]">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs font-light">
                <div className="flex justify-between text-[#5C5852]">
                  <span>Bag Subtotal</span>
                  <span className="text-[#181818] font-medium">{format(subtotalInr)}</span>
                </div>

                <div className="flex justify-between text-[#5C5852]">
                  <div>
                    <span>Standard Express Shipping</span>
                    <span className="block text-[10px] text-[#8A857D]">Paid insured courier</span>
                  </div>
                  <span className="text-[#181818] font-medium">{format(shippingInr)}</span>
                </div>

                <div className="pt-3 border-t border-[#EAE5DE] flex justify-between items-baseline text-sm font-light text-[#181818]">
                  <span>Total Payable</span>
                  <span className="font-serif text-xl font-medium text-[#181818]">{format(grandTotalInr)}</span>
                </div>
              </div>

              {/* Strict Online Payment Policy Notice */}
              <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3 text-[11px] text-[#5C5852] space-y-1">
                <div className="flex items-center gap-1.5 text-[#181818] font-medium">
                  <Lock className="w-3.5 h-3.5 text-[#24332C]" />
                  <span>Online Payments Exclusively</span>
                </div>
                <p className="font-light">
                  Cash on Delivery (COD) is strictly prohibited. Orders are dispatched upon verified electronic settlement.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-[#24332C] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-all duration-300"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-xs uppercase tracking-[0.16em] text-[#5C5852] hover:text-[#181818] transition-colors py-2"
                >
                  &larr; Continue Exploring Vault
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
