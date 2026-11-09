'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalInr, clearCart, isLoaded } = useCart();
  const { currency, format } = useCurrency();
  const { customer } = useAuth();

  const [formData, setFormData] = useState({
    fullName: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Free shipping logic for India
  const isDomestic = formData.country.toLowerCase() === 'india' || !formData.country;
  const shippingInr = isDomestic ? 0 : 1299;
  const grandTotalInr = subtotalInr + shippingInr;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);

    if (name === 'pincode') {
      const pin = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, pincode: pin }));

      if (pin.length === 6) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await res.json();
          if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            setFormData((prev) => ({
              ...prev,
              city: po.District || po.Block || prev.city,
              state: po.State || prev.state,
            }));
          }
        } catch {
          // Fallback to manual entry
        }
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.pincode) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Call backend to create payment order & validate prices server-side
      const createRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            selectedVariant: i.selectedVariant,
            selectedColour: i.selectedColour,
          })),
          shippingAddress: formData,
          currency,
        }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      // Clear shopping bag upon successful order creation
      clearCart();

      // Navigate to the dedicated UPI QR payment and UTR submission screen
      router.push(`/checkout/pay/${orderData.orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error during checkout initialization';
      setError(msg);
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#24332C]" />
        <p className="text-xs text-stone-500 mt-3 font-medium">Loading checkout details...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20">
        <div className="max-w-md mx-auto text-center p-8 bg-[#FFFFFF] border border-[#EAE5DE] shadow-sm">
          <h1 className="font-serif text-2xl text-[#181818] font-light">Your bag is empty</h1>
          <p className="text-xs text-[#5C5852] mt-2 font-light">
            Please select jewellery creations before proceeding to checkout.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-block bg-[#24332C] text-white text-xs uppercase tracking-wider px-6 py-3 hover:bg-[#19241F] transition-colors"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#708579] font-medium block">
            End-to-End Encrypted
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-1 tracking-tight">
            Secure Online Checkout
          </h1>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Delivery Address & Payment Method */}
            <div className="lg:col-span-7 space-y-8">
              {/* Delivery Details */}
              <div className="bg-[#FFFFFF] border border-[#E8DCCD] p-6 space-y-4 shadow-2xs">
                <h2 className="font-serif text-xl text-[#111111] font-light pb-3 border-b border-[#E8DCCD]">
                  Delivery Destination
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. ananya@example.com (optional)"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      Street Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="House / Apartment / Suite, Road"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      Apartment / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Near Oberoi Tower, 4th Floor"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai / New Delhi"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] mb-1 font-medium">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                    >
                      <option value="India">India (FREE Express Courier - ₹0)</option>
                      <option value="United States">United States ($15 DHL Express)</option>
                      <option value="United Kingdom">United Kingdom ($15 DHL Express)</option>
                      <option value="United Arab Emirates">United Arab Emirates ($15 DHL)</option>
                      <option value="Singapore">Singapore ($15 DHL Express)</option>
                      <option value="Canada">Canada ($15 DHL Express)</option>
                      <option value="Australia">Australia ($15 DHL Express)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Total */}
            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E8DCCD] p-6 space-y-6 shadow-2xs">
              <h2 className="font-serif text-xl text-[#111111] font-light pb-3 border-b border-[#E8DCCD]">
                Review Your Curations
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedVariant || 'default'}`}
                    className="flex gap-3 items-center"
                  >
                    <div className="relative w-16 h-16 bg-[#F8F5F0] border border-[#E8DCCD] overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif text-[#111111] truncate font-light">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#6B655D]">
                        Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                      </p>
                    </div>
                    <div className="text-xs font-serif text-[#111111]">
                      {format(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#E8DCCD] space-y-2.5 text-xs font-light">
                <div className="flex justify-between text-[#6B655D]">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-medium">{format(subtotalInr)}</span>
                </div>

                <div className="flex justify-between text-[#6B655D]">
                  <div>
                    <span>Shipping</span>
                    <span className="block text-[10px] text-emerald-700 font-medium">
                      {isDomestic ? 'FREE Insured Express Delivery Across India' : 'International DHL Air'}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-bold">{isDomestic ? 'FREE' : format(shippingInr)}</span>
                </div>

                {currency === 'USD' && (
                  <div className="p-2.5 bg-[#F8F5F0] border border-[#E8DCCD] text-[11px] text-[#6B655D]">
                    <span className="font-medium text-[#111111]">Currency Settlement Notice:</span> Displayed in USD ($). Razorpay gateway processes transaction securely in Indian Rupee standard equivalent ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotalInr)}) without hidden markup.
                  </div>
                )}

                <div className="pt-3 border-t border-[#EAE5DE] flex justify-between items-baseline text-base font-light text-[#181818]">
                  <span>Total Payable</span>
                  <span className="font-serif text-2xl font-medium text-[#181818]">{format(grandTotalInr)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#24332C] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-all duration-300 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#A3B2A9]" />
                    <span>Generating UPI Payment Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to UPI QR Payment ({format(grandTotalInr)})</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-center text-[#5C5852] tracking-wider uppercase font-light">
                By clicking Authorize, you agree to ELVORA&rsquo;s Terms &amp; Paid Shipping Policy.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
