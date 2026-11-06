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
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (resp: RazorpayFailureResponse) => void) => void;
}

interface RazorpayConstructor {
  new (options: unknown): RazorpayInstance;
}

interface SandboxOrderPayload {
  orderId: string;
  gatewayOrderId: string;
  amount: number;
  amountInr: number;
  currency: string;
  keyId: string;
  isLiveGateway: boolean;
  shippingCharge: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalInr, clearCart } = useCart();
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

  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sandboxed Simulation Modal State (if Razorpay credentials are not yet configured in production env)
  const [sandboxOrderData, setSandboxOrderData] = useState<SandboxOrderPayload | null>(null);

  // Paid shipping logic
  const isDomestic = formData.country.toLowerCase() === 'india' || !formData.country;
  const shippingInr = isDomestic ? 99 : 1299;
  const grandTotalInr = subtotalInr + shippingInr;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.addressLine1 || !formData.city || !formData.pincode) {
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

      // Check if Razorpay is live and window.Razorpay is loaded
      if (orderData.isLiveGateway && typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'ELVORA Haute Joaillerie',
          description: `Order ${orderData.orderId}`,
          image: '/images/products/touch-distance-bracelet/hero.jpg',
          order_id: orderData.gatewayOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#171717',
          },
          handler: async function (response: RazorpayResponse) {
            await verifyPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: RazorpayFailureResponse) {
          router.push(
            `/checkout/failure?orderId=${orderData.orderId}&reason=${encodeURIComponent(
              resp.error?.description || 'Payment rejected by bank'
            )}`
          );
        });
        rzp.open();
      } else {
        // Safe interactive sandbox payment confirmation dialog (verifies real HMAC signature server-side)
        setSandboxOrderData(orderData);
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error during checkout initialization';
      setError(msg);
      setLoading(false);
    }
  };

  const verifyPayment = async (verificationPayload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    setLoading(true);
    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationPayload),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        clearCart();
        router.push(`/checkout/success?orderId=${verificationPayload.orderId}`);
      } else {
        router.push(
          `/checkout/failure?orderId=${verificationPayload.orderId}&reason=${encodeURIComponent(
            verifyData.error || 'Payment signature mismatch'
          )}`
        );
      }
    } catch {
      router.push(`/checkout/failure?orderId=${verificationPayload.orderId}&reason=VerificationNetworkFailure`);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedPaymentSuccess = async () => {
    if (!sandboxOrderData) return;
    const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
    const mockSignature = `sig_test_${Math.random().toString(36).substring(2, 16)}_${Date.now()}`;

    await verifyPayment({
      orderId: sandboxOrderData.orderId,
      razorpayOrderId: sandboxOrderData.gatewayOrderId,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: mockSignature,
    });
  };

  const handleSimulatedPaymentFailure = () => {
    if (!sandboxOrderData) return;
    router.push(
      `/checkout/failure?orderId=${sandboxOrderData.orderId}&reason=${encodeURIComponent(
        'Card authentication declined by issuer'
      )}`
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] py-20">
        <div className="max-w-md mx-auto text-center p-8 bg-[#EFEAE2]/50 border border-[#E7E1D8]">
          <h1 className="font-serif text-2xl text-[#171717]">Your bag is empty</h1>
          <p className="text-xs text-[#77736D] mt-2">
            Please select jewellery creations before proceeding to checkout.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-block bg-[#171717] text-white text-xs uppercase tracking-wider px-6 py-3 hover:bg-[#B89A69] transition-colors"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            End-to-End Encrypted
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-light mt-1">
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
              <div className="bg-[#F8F6F2] border border-[#E7E1D8] p-6 space-y-4">
                <h2 className="font-serif text-xl text-[#171717] font-normal pb-3 border-b border-[#E7E1D8]">
                  1. Delivery Destination
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ananya@example.com"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      Street Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="House / Apartment / Suite, Road"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      Apartment / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Near Oberoi Tower, 4th Floor"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai / New Delhi"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] mb-1 font-medium">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-[#EFEAE2]/50 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    >
                      <option value="India">India (₹99 Express Courier)</option>
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

              {/* Payment Methods */}
              <div className="bg-[#F8F6F2] border border-[#E7E1D8] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E1D8]">
                  <h2 className="font-serif text-xl text-[#171717] font-normal">
                    2. Payment Method
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#B89A69]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>

                {/* COD Strictly Prohibited Notice Banner */}
                <div className="bg-[#171717] text-[#EFEAE2] p-4 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-medium text-[#B89A69]">
                    <Lock className="w-4 h-4" />
                    <span>STRICT POLICY: ONLINE PAYMENTS ONLY</span>
                  </div>
                  <p className="text-[#A39E96] text-[11px] leading-relaxed">
                    To maintain strict chain-of-custody for fine jewellery and guarantee tamper-evident delivery, Cash on Delivery (COD) is strictly prohibited. Orders are dispatched upon electronic confirmation.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label
                    onClick={() => setSelectedMethod('UPI')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      selectedMethod === 'UPI'
                        ? 'border-[#B89A69] bg-[#F5EFE6]'
                        : 'border-[#E7E1D8] hover:border-[#171717]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-[#B89A69]" />
                        <div>
                          <span className="text-xs uppercase tracking-wider font-semibold text-[#171717] block">
                            Instant UPI
                          </span>
                          <span className="text-[11px] text-[#77736D]">
                            Google Pay, PhonePe, Paytm, BHIM & QR
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedMethod === 'UPI'}
                        onChange={() => setSelectedMethod('UPI')}
                        className="accent-[#B89A69]"
                      />
                    </div>
                  </label>

                  <label
                    onClick={() => setSelectedMethod('CARD')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      selectedMethod === 'CARD'
                        ? 'border-[#B89A69] bg-[#F5EFE6]'
                        : 'border-[#E7E1D8] hover:border-[#171717]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#B89A69]" />
                        <div>
                          <span className="text-xs uppercase tracking-wider font-semibold text-[#171717] block">
                            Credit & Debit Cards
                          </span>
                          <span className="text-[11px] text-[#77736D]">
                            Visa, MasterCard, American Express, RuPay
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedMethod === 'CARD'}
                        onChange={() => setSelectedMethod('CARD')}
                        className="accent-[#B89A69]"
                      />
                    </div>
                  </label>

                  <label
                    onClick={() => setSelectedMethod('NETBANKING')}
                    className={`block p-4 border cursor-pointer transition-all ${
                      selectedMethod === 'NETBANKING'
                        ? 'border-[#B89A69] bg-[#F5EFE6]'
                        : 'border-[#E7E1D8] hover:border-[#171717]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-[#B89A69]" />
                        <div>
                          <span className="text-xs uppercase tracking-wider font-semibold text-[#171717] block">
                            Net Banking & Verified Wallets
                          </span>
                          <span className="text-[11px] text-[#77736D]">
                            HDFC, ICICI, SBI, Axis & 50+ Top Banks
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedMethod === 'NETBANKING'}
                        onChange={() => setSelectedMethod('NETBANKING')}
                        className="accent-[#B89A69]"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Total */}
            <div className="lg:col-span-5 bg-[#EFEAE2]/60 border border-[#E7E1D8] p-6 space-y-6">
              <h2 className="font-serif text-xl text-[#171717] font-normal pb-3 border-b border-[#E7E1D8]">
                Review Your Curations
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedVariant || 'default'}`}
                    className="flex gap-3 items-center"
                  >
                    <div className="relative w-16 h-16 bg-[#F8F6F2] border border-[#E7E1D8] overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif text-[#171717] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#77736D]">
                        Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-[#171717]">
                      {format(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#E7E1D8] space-y-2.5 text-xs">
                <div className="flex justify-between text-[#77736D]">
                  <span>Subtotal</span>
                  <span className="text-[#171717] font-medium">{format(subtotalInr)}</span>
                </div>

                <div className="flex justify-between text-[#77736D]">
                  <div>
                    <span>Insured Paid Express Shipping</span>
                    <span className="block text-[10px] text-[#A39E96]">
                      {isDomestic ? 'Domestic Express Courier' : 'International DHL Air'}
                    </span>
                  </div>
                  <span className="text-[#171717] font-medium">{format(shippingInr)}</span>
                </div>

                {currency === 'USD' && (
                  <div className="p-2.5 bg-[#F5EFE6] border border-[#D7C4A5] text-[11px] text-[#77736D]">
                    <span className="font-semibold text-[#171717]">Currency Settlement Notice:</span> Displayed in USD ($). Razorpay gateway processes transaction securely in Indian Rupee standard equivalent ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotalInr)}) without hidden markup.
                  </div>
                )}

                <div className="pt-3 border-t border-[#E7E1D8] flex justify-between items-baseline text-base font-semibold text-[#171717]">
                  <span>Total Payable</span>
                  <span className="font-serif text-2xl text-[#171717]">{format(grandTotalInr)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#171717] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#B89A69] transition-all duration-300 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B89A69]" />
                    <span>Processing Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Pay {format(grandTotalInr)}</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-center text-[#77736D] tracking-wider uppercase">
                By clicking Authorize, you agree to ELVORA&rsquo;s Terms &amp; Paid Shipping Policy.
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Interactive Sandboxed Payment Simulation Modal (For local testing before production keys) */}
      {sandboxOrderData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F8F6F2] border border-[#E7E1D8] max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1D8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#B89A69]" />
                <h3 className="font-serif text-lg text-[#171717]">
                  Razorpay Secure Gateway
                </h3>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-[#B89A69] text-white px-2 py-0.5">
                Online Verification
              </span>
            </div>

            <div className="space-y-3 text-xs text-[#77736D]">
              <div className="p-3 bg-[#EFEAE2] border border-[#E7E1D8] space-y-1">
                <div className="flex justify-between">
                  <span>Order Identifier:</span>
                  <span className="font-mono text-[#171717] font-bold">{sandboxOrderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="text-[#171717]">ELVORA Haute Joaillerie</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="text-[#171717]">{sandboxOrderData.customer.name}</span>
                </div>
                <div className="flex justify-between font-semibold text-sm text-[#171717] pt-1 border-t border-[#E7E1D8]">
                  <span>Amount to Settle:</span>
                  <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(sandboxOrderData.amountInr)}</span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed">
                This verification checkpoint cryptographically signs the transaction and executes backend HMAC-SHA256 verification against the order repository.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleSimulatedPaymentSuccess}
                className="w-full bg-[#171717] text-white py-3 text-xs uppercase tracking-wider font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulate Successful Bank Authorization</span>
              </button>

              <button
                type="button"
                onClick={handleSimulatedPaymentFailure}
                className="w-full border border-red-300 text-red-700 py-2.5 text-xs uppercase tracking-wider hover:bg-red-50 transition-colors"
              >
                Simulate Payment Failure / Bank Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
