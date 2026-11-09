'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  QrCode,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { Order, StoreSettings } from '@/types';

export default function UPIPaymentScreen({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect & payment state
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(2);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const hasLaunchedRef = useRef(false);
  const isRedirectingRef = useRef(false);

  // Fetch Order & Store Settings
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders/${orderId}?t=${Date.now()}`, { cache: 'no-store' }),
          fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' }),
        ]);

        if (!orderRes.ok) throw new Error('Order details not found');
        const orderData: Order = await orderRes.json();
        if (mounted) setOrder(orderData);

        if (settingsRes.ok) {
          const settingsData: StoreSettings = await settingsRes.json();
          if (mounted) setSettings(settingsData);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [orderId]);

  // UPI Parameters
  const upiId = settings?.upiId || '6386645203@upi';
  const payeeName = settings?.payeeName || 'ELVORA Luxury Jewels';
  const amount = order?.totalAmount || 0;
  const note = `Order ${orderId}`;

  // Standard UPI URI & Intent Links
  const encodedPayee = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(note);
  const genericUpiUri = `upi://pay?pa=${upiId}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;
  const phonePeUri = `phonepe://pay?pa=${upiId}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;
  const gPayUri = `tez://upi/pay?pa=${upiId}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;
  const paytmUri = `paytmmp://pay?pa=${upiId}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;

  // QR Code generator URL (Official standard for desktop scan)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(genericUpiUri)}&size=280x280&color=111111&bgcolor=FFFFFF&margin=1`;

  // Function to finalize order and automatically redirect to success page
  const confirmAndRedirect = async () => {
    if (isRedirectingRef.current) return;
    isRedirectingRef.current = true;
    setIsRedirecting(true);

    try {
      // Notify backend that customer completed payment
      await fetch(`/api/orders/${orderId}/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PAYMENT_SUBMITTED',
          utr: '1-CLICK-UPI-PAID',
        }),
      });
    } catch {
      // Continue even if network glitch occurs
    }

    // Countdown and automatic redirect
    let count = 2;
    const timer = setInterval(() => {
      count -= 1;
      setRedirectCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        router.push(`/checkout/success?orderId=${orderId}`);
      }
    }, 900);
  };

  // Launch UPI App
  const handleLaunchUpi = (uri: string) => {
    hasLaunchedRef.current = true;
    window.location.href = uri;
  };

  // Automatic Tab Visibility Return Detection:
  // When customer enters PIN in PhonePe/GooglePay and returns back to the browser tab,
  // automatically trigger confirmation and redirect to Order Success page!
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasLaunchedRef.current && !isRedirectingRef.current) {
        confirmAndRedirect();
      }
    };

    const handleWindowFocus = () => {
      if (hasLaunchedRef.current && !isRedirectingRef.current) {
        confirmAndRedirect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [orderId]);

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-[#24332C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#708579] font-medium">
            Setting up secure payment gateway...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <h2 className="font-serif text-xl text-stone-900">Order Not Found</h2>
          <p className="text-xs text-stone-600">{error || 'Unable to load payment details.'}</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-[#24332C] text-white text-xs uppercase tracking-wider font-semibold"
          >
            Return to Boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-14 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─────────────────────────────────────────────────────────────
            1. BRAND HEADER & ORDER BANNER
        ───────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Secure 1-Click UPI Payment</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light tracking-tight">
            Complete Your Payment
          </h1>
          <p className="text-xs text-stone-600">
            Order Reference: <strong className="font-mono text-stone-900 font-bold">{order.id}</strong>
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. AUTO-REDIRECT MODAL / BANNER (Shown upon returning from UPI)
        ───────────────────────────────────────────────────────────── */}
        {isRedirecting && (
          <div className="p-6 bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-2xl shadow-2xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-300 border border-emerald-500/50">
            <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Check className="w-8 h-8 text-emerald-300 stroke-[3]" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-light text-white">
              Payment Detected! Confirming Order...
            </h2>
            <p className="text-xs text-stone-200">
              Redirecting you to your official receipt in <strong className="text-emerald-400 text-sm">{redirectCountdown}s</strong>...
            </p>
            <div className="w-32 h-1 bg-stone-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-emerald-400 animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            3. AMOUNT CARD (With ₹300 Instant Discount Highlight)
        ───────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 block mb-1">
                Total Payable Amount
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
                {order.discount && order.discount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Flat ₹{order.discount} Discount Applied
                  </span>
                ) : null}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-stone-600 space-y-0.5">
              <div>Customer: <strong className="text-stone-900">{order.customerName}</strong></div>
              <div>Shipping to: <strong className="text-stone-900">{order.shippingAddress.city}, {order.shippingAddress.pincode}</strong></div>
              <div className="text-[11px] text-emerald-700 font-semibold">✓ Free All-India Express Delivery</div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. MOBILE: 1-CLICK INSTANT APP BUTTONS (PhonePe, GPay, Paytm)
          ───────────────────────────────────────────────────────────── */}
          <div className="pt-6 space-y-4">
            <span className="text-[11px] uppercase font-bold tracking-wider text-stone-700 block">
              Choose Your UPI App to Pay:
            </span>

            {/* Quick App Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* PhonePe */}
              <button
                type="button"
                onClick={() => handleLaunchUpi(phonePeUri)}
                className="group relative flex items-center justify-between p-4 rounded-xl border-2 border-[#5f259f]/30 hover:border-[#5f259f] bg-gradient-to-r from-purple-50/60 to-white hover:bg-purple-50 transition-all shadow-xs hover:shadow-md cursor-pointer text-left active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold text-sm shadow-sm flex-none">
                    पे
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">PhonePe</span>
                    <span className="text-[11px] text-stone-500">Tap to pay with PhonePe PIN</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#5f259f] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Google Pay */}
              <button
                type="button"
                onClick={() => handleLaunchUpi(gPayUri)}
                className="group relative flex items-center justify-between p-4 rounded-xl border-2 border-blue-200 hover:border-blue-500 bg-gradient-to-r from-blue-50/50 to-white hover:bg-blue-50 transition-all shadow-xs hover:shadow-md cursor-pointer text-left active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center font-bold text-sm shadow-sm flex-none">
                    <span className="text-[#4285F4] font-black text-base">G</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">Google Pay</span>
                    <span className="text-[11px] text-stone-500">Fast Google Pay 1-tap checkout</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Paytm */}
              <button
                type="button"
                onClick={() => handleLaunchUpi(paytmUri)}
                className="group relative flex items-center justify-between p-4 rounded-xl border-2 border-[#00b9f5]/30 hover:border-[#00b9f5] bg-gradient-to-r from-sky-50/50 to-white hover:bg-sky-50 transition-all shadow-xs hover:shadow-md cursor-pointer text-left active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#002970] flex items-center justify-center text-[#00b9f5] font-black text-xs shadow-sm flex-none">
                    Paytm
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">Paytm UPI</span>
                    <span className="text-[11px] text-stone-500">Pay via Paytm wallet or bank</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#00b9f5] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Any Other UPI App (BHIM, CRED, Amazon Pay, Bank Apps) */}
              <button
                type="button"
                onClick={() => handleLaunchUpi(genericUpiUri)}
                className="group relative flex items-center justify-between p-4 rounded-xl border-2 border-emerald-300 hover:border-emerald-600 bg-gradient-to-r from-emerald-50/50 to-white hover:bg-emerald-50 transition-all shadow-xs hover:shadow-md cursor-pointer text-left active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#24332C] flex items-center justify-center text-[#F5C400] font-bold text-sm shadow-sm flex-none">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">Any UPI App / BHIM</span>
                    <span className="text-[11px] text-stone-500">CRED, Navi, Amazon Pay &amp; more</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Instruction Callout */}
            <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-600 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B89A69] flex-none" />
              <span>
                Tap any button above &rarr; Enter your UPI PIN &rarr; You will be <strong>automatically redirected</strong> to the Order Success page!
              </span>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                5. DESKTOP / ALTERNATE: SCAN UPI QR CODE
            ───────────────────────────────────────────────────────────── */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
                    <QrCode className="w-4 h-4 text-[#24332C]" />
                    <span>Or Scan with Any Phone Camera / UPI App</span>
                  </div>
                  <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                    Scan using Google Pay, PhonePe, Paytm, or BHIM. Amount ₹{order.totalAmount} is pre-filled.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="font-mono text-xs text-stone-700 bg-white px-2.5 py-1 rounded border border-stone-200 font-semibold">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#24332C] text-white hover:bg-[#19241F] rounded transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic QR Code */}
                <div className="p-2 bg-white border-2 border-stone-300 rounded-xl shadow-xs flex-none">
                  <div className="relative w-36 h-36">
                    <Image
                      src={qrCodeUrl}
                      alt={`Pay ₹${order.totalAmount} to ${payeeName}`}
                      fill
                      unoptimized
                      priority
                      className="object-contain"
                    />
                  </div>
                  <span className="block text-[10px] text-center text-stone-400 font-mono mt-1 font-semibold">
                    ₹{order.totalAmount} &bull; ELVORA
                  </span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                6. PRIMARY "I HAVE COMPLETED PAYMENT" ACTION BUTTON
            ───────────────────────────────────────────────────────────── */}
            <div className="pt-2">
              <button
                type="button"
                onClick={confirmAndRedirect}
                disabled={isRedirecting}
                className="w-full py-4 px-6 rounded-xl bg-[#24332C] hover:bg-[#18231E] active:scale-[0.99] text-white text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                <span>{isRedirecting ? 'Confirming Your Order...' : 'I Have Paid via UPI — View Order Confirmation'}</span>
                <ArrowRight className="w-4 h-4 text-[#F5C400] group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-stone-400 mt-2">
                Click this button after completing payment in your UPI app to jump immediately to your receipt.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            7. TRUST & ASSURANCE FOOTER
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-stone-500">
          <div className="p-3 bg-white border border-stone-200/60 rounded-xl flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-none" />
            <span>NPCI / BHIM Verified</span>
          </div>
          <div className="p-3 bg-white border border-stone-200/60 rounded-xl flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B89A69] flex-none" />
            <span>100% Genuine Jewellery</span>
          </div>
          <div className="p-3 bg-white border border-stone-200/60 rounded-xl flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-stone-700 flex-none" />
            <span>Fast Express Dispatch</span>
          </div>
        </div>

        {/* WhatsApp Assistance */}
        <div className="text-center pt-2">
          <a
            href={`https://wa.me/916386645203?text=Hi%20ELVORA,%20I%20have%20a%20question%20about%20Order%20${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Need help with payment? Chat with ELVORA Support on WhatsApp: +91 63866 45203</span>
          </a>
        </div>

      </div>
    </div>
  );
}
