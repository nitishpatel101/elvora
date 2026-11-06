'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotalInr,
    shippingInr,
    grandTotalInr,
  } = useCart();
  const { format } = useCurrency();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EAE5DE] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE5DE] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#24332C]" />
              <h2 className="font-serif text-lg tracking-[0.1em] uppercase text-[#181818] font-light">
                Your Shopping Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-[#5C5852] hover:text-[#181818] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#EEF3F0] flex items-center justify-center text-[#24332C]">
                  <ShoppingBag className="w-6 h-6 stroke-[1.4]" />
                </div>
                <h3 className="font-serif text-lg text-[#181818] font-light">Your bag is currently empty</h3>
                <p className="text-xs text-[#5C5852] max-w-xs mx-auto font-light leading-relaxed">
                  Discover our celestial couple bracelets, sculpted pendants, and keepsake jewelry.
                </p>
                <div className="pt-4">
                  <Link
                    href="/shop"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="inline-block bg-[#24332C] text-[#FFFFFF] text-xs uppercase tracking-[0.2em] px-6 py-3 hover:bg-[#19241F] transition-colors"
                  >
                    Explore Catalogue
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant || 'default'}`}
                  className="flex gap-4 pb-6 border-b border-[#EAE5DE] last:border-b-0"
                >
                  <div className="w-20 h-20 bg-[#FFFFFF] relative shrink-0 overflow-hidden border border-[#EAE5DE]">
                    <Image
                      src={item.product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-serif text-sm text-[#181818] hover:text-[#24332C] transition-colors truncate font-light"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                          className="text-[#8A857D] hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#5C5852] truncate mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}

                      <div className="text-xs font-serif text-[#181818] mt-1">
                        {format(item.product.price)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#EAE5DE] bg-[#FFFFFF]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariant)}
                          className="p-1.5 text-[#5C5852] hover:text-[#181818] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-[#181818]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariant)}
                          className="p-1.5 text-[#5C5852] hover:text-[#181818] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-serif text-[#181818]">
                        {format(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Call to Action */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FFFFFF] border-t border-[#EAE5DE] space-y-4">
              <div className="space-y-2 text-xs font-light">
                <div className="flex justify-between text-[#5C5852]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#181818]">{format(subtotalInr)}</span>
                </div>
                <div className="flex justify-between text-[#5C5852]">
                  <span>Paid Express Shipping</span>
                  <span className="font-medium text-[#181818]">{format(shippingInr)}</span>
                </div>
                <div className="flex justify-between text-sm font-light text-[#181818] pt-2 border-t border-[#EAE5DE]">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base font-medium text-[#181818]">{format(grandTotalInr)}</span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] flex items-center gap-2 text-[10px] text-[#5C5852]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#24332C] shrink-0" />
                <span>Strictly online payments only. Paid delivery with live tracking.</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full bg-[#24332C] text-[#FFFFFF] py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-all duration-300"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full block text-center py-2 text-xs uppercase tracking-[0.16em] text-[#5C5852] hover:text-[#181818] transition-colors"
                >
                  View Full Bag Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
