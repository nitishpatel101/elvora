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
        <div className="w-screen max-w-md bg-[#F8F6F2] border-l border-[#E7E1D8] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#E7E1D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B89A69]" />
              <h2 className="font-serif text-lg tracking-[0.1em] uppercase text-[#171717]">
                Your Shopping Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-[#77736D] hover:text-[#171717] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#77736D]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-lg text-[#171717]">Your bag is currently empty</h3>
                <p className="text-xs text-[#77736D] max-w-xs mx-auto">
                  Explore our curated celestial couple bracelets, diamond-cut pendants, and fine jewelry.
                </p>
                <div className="pt-4">
                  <Link
                    href="/shop"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="inline-block bg-[#171717] text-white text-xs uppercase tracking-[0.2em] px-6 py-3 hover:bg-[#B89A69] transition-colors"
                  >
                    Explore Catalogue
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant || 'default'}`}
                  className="flex gap-4 pb-6 border-b border-[#E7E1D8] last:border-b-0"
                >
                  <div className="w-20 h-20 bg-[#EFEAE2] relative shrink-0 overflow-hidden border border-[#E7E1D8]">
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
                          className="font-serif text-sm text-[#171717] hover:text-[#B89A69] transition-colors truncate"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                          className="text-[#77736D] hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#77736D] truncate mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}

                      <div className="text-xs font-medium text-[#171717] mt-1">
                        {format(item.product.price)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E7E1D8] bg-[#F8F6F2]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariant)}
                          className="p-1.5 text-[#77736D] hover:text-[#171717] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-[#171717]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariant)}
                          className="p-1.5 text-[#77736D] hover:text-[#171717] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#171717]">
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
            <div className="p-6 bg-[#EFEAE2]/60 border-t border-[#E7E1D8] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#77736D]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#171717]">{format(subtotalInr)}</span>
                </div>
                <div className="flex justify-between text-[#77736D]">
                  <span>Paid Express Shipping</span>
                  <span className="font-medium text-[#171717]">{format(shippingInr)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#171717] pt-2 border-t border-[#E7E1D8]">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base text-[#171717]">{format(grandTotalInr)}</span>
                </div>
              </div>

              <div className="bg-[#F8F6F2] p-2.5 border border-[#E7E1D8] flex items-center gap-2 text-[11px] text-[#77736D]">
                <ShieldCheck className="w-4 h-4 text-[#B89A69] shrink-0" />
                <span>Online payment only. Paid delivery with live tracking.</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full bg-[#171717] text-white py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#B89A69] transition-all duration-300"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full block text-center py-2 text-xs uppercase tracking-[0.16em] text-[#77736D] hover:text-[#171717] transition-colors"
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

