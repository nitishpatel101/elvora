'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  RefreshCw,
  AlertCircle,
  Camera,
  Check,
  Sparkles,
} from 'lucide-react';
import { Order, StoreSettings } from '@/types';

// Web Audio API chime to announce live payment approval
const playVerificationChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Pleasant 3-note luxury chime chord: E5 -> G#5 -> B5
    const chord = [
      { freq: 659.25, start: 0, dur: 0.5 },
      { freq: 830.61, start: 0.12, dur: 0.5 },
      { freq: 987.77, start: 0.24, dur: 0.7 },
    ];

    chord.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    });
  } catch {
    // Ignore audio errors if audio context blocked by browser gesture policies
  }
};

export default function UPIPaymentScreen({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File selection & submission state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live approval notification banner
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const lastKnownStatusRef = useRef<string | null>(null);

  // Fetch Order & Settings
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [orderRes, settingsRes] = await Promise.all([
        fetch(`/api/orders/${orderId}?t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' }),
      ]);

      if (!orderRes.ok) {
        throw new Error('Order not found');
      }

      const orderData: Order = await orderRes.json();

      // Check if status transitioned to PAID / CONFIRMED from pending or submitted
      if (
        (orderData.status === 'PAID' || orderData.status === 'CONFIRMED') &&
        lastKnownStatusRef.current &&
        lastKnownStatusRef.current !== 'PAID' &&
        lastKnownStatusRef.current !== 'CONFIRMED'
      ) {
        // Trigger live verification notification & sound!
        playVerificationChime();
        setShowNotificationToast(true);
        if (typeof document !== 'undefined') {
          document.title = '✓ Payment Verified! | ELVORA';
        }
      }

      lastKnownStatusRef.current = orderData.status;
      setOrder(orderData);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load order';
      setError(msg);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderId]);

  // Real-time polling when waiting for admin approval (every 2.5 seconds)
  useEffect(() => {
    if (order?.status !== 'PAYMENT_SUBMITTED') return;

    const interval = setInterval(() => {
      fetchData(true);
    }, 2500);

    return () => clearInterval(interval);
  }, [order?.status]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setSelectedFile(file);
    setSubmitError(null);

    // Instant local preview
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
  };

  // Submit payment screenshot (Uploads file & saves order status in ONE action)
  const handleSubmitPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If user clicked submit button before picking an image, open file picker!
    if (!selectedFile && !screenshotUrl) {
      fileInputRef.current?.click();
      setSubmitError('Please select your payment screenshot first.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      let finalUrl = screenshotUrl;

      // 1. Upload screenshot image if not already uploaded
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || 'Failed to upload screenshot image');
        }

        finalUrl = uploadData.url;
        setScreenshotUrl(finalUrl);
      }

      // 2. Submit payment verification against order
      const res = await fetch(`/api/orders/${orderId}/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshotUrl: finalUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment screenshot');
      }

      // 3. Immediately switch state to PAYMENT_SUBMITTED (Wait state)
      lastKnownStatusRef.current = 'PAYMENT_SUBMITTED';
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'PAYMENT_SUBMITTED',
              upiScreenshot: finalUrl,
              paymentSubmittedAt: new Date().toISOString(),
            }
          : null
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting screenshot';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#24332C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs tracking-widest uppercase text-[#5C5852]">Loading Payment Screen...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 px-4">
        <div className="max-w-md mx-auto bg-white p-8 border border-[#EAE5DE] text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-600 mx-auto stroke-1" />
          <h1 className="font-serif text-2xl text-[#181818]">Order Not Found</h1>
          <p className="text-xs text-[#5C5852]">{error || 'The requested order could not be located.'}</p>
          <Link
            href="/shop"
            className="inline-block bg-[#24332C] text-white text-xs uppercase tracking-wider px-6 py-3 hover:bg-[#19241F]"
          >
            Return to Boutique
          </Link>
        </div>
      </div>
    );
  }

  const isConfirmed = order.status === 'PAID' || order.status === 'CONFIRMED';
  const isSubmitted = order.status === 'PAYMENT_SUBMITTED';
  const isRejected = order.status === 'PAYMENT_REJECTED';
  const qrImage = settings?.upiQrImage || '/images/qr/upi-qr.jpg';

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 lg:py-16">
      {/* LIVE VERIFICATION NOTIFICATION POPUP */}
      {showNotificationToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg bg-[#24332C] text-white p-5 border-2 border-[#B89A69] shadow-2xl animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B89A69] text-[#181818] flex items-center justify-center font-bold shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#B89A69] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>PAYMENT VERIFIED &bull; ORDER CONFIRMED</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-0.5">
                  Aapka payment verify ho gaya hai!
                </h3>
                <p className="text-xs text-[#EAE5DE] mt-1 leading-relaxed">
                  Store owner has confirmed bank credit for order <strong className="font-mono text-white">{order.id}</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="text-[#EAE5DE] hover:text-white text-lg leading-none p-1"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Ribbon */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF3F0] border border-[#D5E0D9] text-[10px] tracking-[0.24em] uppercase text-[#24332C] font-medium">
            <span>ELVORA SECURE UPI PAYMENT</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light">
            {isConfirmed
              ? 'Order Confirmed & Verified'
              : isSubmitted
              ? 'Payment Under Verification'
              : 'Scan QR Code & Pay'}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs text-[#5C5852] pt-1">
            <span>
              Order Reference: <strong className="text-[#181818] font-mono">{order.id}</strong>
            </span>
            <span>&bull;</span>
            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* =========================================================================
            STATE 1: PAYMENT SUBMITTED -> "PLEASE WAIT" VERIFICATION SCREEN
            (NO "SUCCESSFUL" BANNER HERE - ONLY PATIENT WAIT STATE AS REQUESTED)
        ========================================================================= */}
        {isSubmitted && (
          <div className="bg-white border-2 border-[#D5E0D9] p-8 sm:p-10 shadow-sm space-y-8 text-center max-w-2xl mx-auto">
            {/* Animated Pulsing Waiting Radar */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-[#B89A69]/20 animate-ping" />
              <div className="relative w-20 h-20 bg-[#FAF8F5] border-2 border-[#B89A69] rounded-full flex items-center justify-center text-[#B89A69]">
                <Clock className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF9EE] border border-[#F0DFBD] text-[11px] font-semibold text-[#8C6B28] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#8C6B28] animate-pulse" />
                <span>Verification In Progress &bull; Please Wait</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light">
                Payment Screenshot Submitted
              </h2>

              <p className="text-xs sm:text-sm text-[#5C5852] max-w-lg mx-auto leading-relaxed pt-1">
                Aapka payment screenshot submit ho gaya hai. Store owner abhi aapka bank credit verify kar rahe hain. 
                Jaise hi verify hoga, <strong>aapko yahan turant payment verified notification mil jayegi</strong>.
              </p>
            </div>

            {/* Submitted Payment Summary Card */}
            <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-5 text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-[#EAE5DE]">
                <span className="text-[#708579] uppercase tracking-wider text-[10px] font-medium">Order Reference:</span>
                <span className="font-mono font-bold text-[#181818]">{order.id}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-[#EAE5DE]">
                <span className="text-[#708579] uppercase tracking-wider text-[10px] font-medium">Total Payable Amount:</span>
                <span className="font-serif font-bold text-base text-[#181818]">
                  &#8377;{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-[#EAE5DE]">
                <span className="text-[#708579] uppercase tracking-wider text-[10px] font-medium">Status:</span>
                <span className="px-2 py-0.5 bg-[#FFF9EE] text-[#8C6B28] font-semibold text-[10px] uppercase border border-[#F0DFBD]">
                  Awaiting Store Approval
                </span>
              </div>

              {order.upiScreenshot && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#708579] block mb-2 font-medium">
                    Your Uploaded Screenshot:
                  </span>
                  <div className="relative w-36 h-36 border border-[#D5E0D9] bg-white overflow-hidden shadow-2xs">
                    <Image
                      src={order.upiScreenshot}
                      alt="Submitted Screenshot Receipt"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Polling Status & Manual Check */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#708579]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Checking bank verification live every 2 seconds...</span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setIsRefreshing(true);
                  await fetchData(true);
                  setTimeout(() => setIsRefreshing(false), 600);
                }}
                className="inline-flex items-center gap-2 text-xs text-[#24332C] font-semibold border border-[#D5E0D9] bg-white px-5 py-2.5 hover:bg-[#EEF3F0] transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Check Verification Status Now</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: PAYMENT VERIFIED & ORDER CONFIRMED
            (APPEARS IMMEDIATELY WHEN STORE OWNER APPROVES PAYMENT)
        ========================================================================= */}
        {isConfirmed && (
          <div className="space-y-8">
            <div className="bg-[#EEF3F0] border-2 border-[#24332C] p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-[#24332C] text-[#B89A69] rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#24332C] font-bold block">
                  PAYMENT VERIFIED
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light">
                  Order Confirmed &bull; Preparing for Dispatch
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5852] max-w-lg mx-auto leading-relaxed pt-1">
                  Aapka payment store owner dwara verify kar liya gaya hai. Our master artisans are now casting and preparing your jewellery for insured express air dispatch.
                </p>
              </div>

              {order.verifiedAt && (
                <div className="inline-block text-[11px] uppercase tracking-wider text-[#24332C] font-mono bg-white border border-[#D5E0D9] px-3 py-1">
                  Verified by {order.verifiedBy || 'Store Owner'} on {new Date(order.verifiedAt).toLocaleString()}
                </div>
              )}

              <div className="pt-3 flex flex-wrap justify-center gap-4">
                <Link
                  href={`/track-order?orderId=${order.id}`}
                  className="bg-[#24332C] text-white text-xs uppercase tracking-wider px-6 py-3 hover:bg-[#19241F] transition-colors"
                >
                  Track Express Shipment
                </Link>
                <Link
                  href="/shop"
                  className="border border-[#181818] text-[#181818] text-xs uppercase tracking-wider px-6 py-3 hover:bg-[#181818] hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Confirmed Order Details Card */}
            <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8 space-y-6 shadow-xs">
              <h3 className="font-serif text-xl text-[#181818] font-light pb-3 border-b border-[#EAE5DE]">
                Order Details &bull; {order.id}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block">
                    Delivery Address:
                  </span>
                  <p className="text-[#181818] font-medium mt-1 leading-relaxed">
                    {order.shippingAddress.fullName}
                    <br />
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    <br />
                    {order.shippingAddress.country}
                    <br />
                    Phone: {order.shippingAddress.phone}
                    {order.shippingAddress.email ? <><br />Email: {order.shippingAddress.email}</> : null}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block">
                    Payment Verification Record:
                  </span>
                  <div className="mt-1 space-y-1.5 font-mono text-[11px] text-[#181818] bg-[#FAF8F5] p-3 border border-[#EAE5DE]">
                    <div>Payment Method: Manual Store Owner UPI QR</div>
                    <div>Status: <span className="text-emerald-700 font-bold">PAID &bull; CONFIRMED</span></div>
                    <div>Verified By: {order.verifiedBy || 'Store Owner'}</div>
                    {order.verifiedAt && <div>Verified At: {new Date(order.verifiedAt).toLocaleTimeString()}</div>}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#EAE5DE] pt-4 border-t border-[#EAE5DE]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-[#F8F5F0] border border-[#EAE5DE] overflow-hidden shrink-0">
                        <Image
                          src={item.productImage || '/images/products/touch-distance-bracelet/hero.jpg'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-[#181818]">{item.productName}</div>
                        <div className="text-[11px] text-[#708579]">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="font-semibold text-[#181818]">
                      &#8377;{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#EAE5DE] flex justify-between items-center text-sm">
                <span className="font-semibold text-[#181818]">Total Paid:</span>
                <span className="font-serif text-xl text-[#181818] font-bold">
                  &#8377;{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 3: PAYMENT REJECTED NOTICE (IF REJECTED BY ADMIN)
        ========================================================================= */}
        {isRejected && (
          <div className="bg-red-50 border border-red-200 p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-red-700 text-white rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-red-900">Payment Verification Issue</h2>
            <p className="text-xs text-red-700 max-w-lg mx-auto leading-relaxed">
              {order.rejectionReason || 'The payment screenshot could not be verified with our receiving bank account credit.'}
            </p>
            <p className="text-[11px] text-[#5C5852]">
              Please check your payment app, ensure the full amount was transferred, and upload the clear payment screenshot below.
            </p>
          </div>
        )}

        {/* =========================================================================
            STATE 4: PAYMENT SUBMISSION FORM (ONLY DISPLAYED IF PENDING OR REJECTED)
            (HIDDEN AS SOON AS SCREENSHOT IS SUBMITTED)
        ========================================================================= */}
        {!isSubmitted && !isConfirmed && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: ONLY THE QR CODE */}
            <div className="md:col-span-6 bg-white border border-[#EAE5DE] p-6 sm:p-8 space-y-6 shadow-xs text-center">
              {/* Exact Amount Header */}
              <div className="pb-4 border-b border-[#EAE5DE]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                  AMOUNT TO PAY
                </span>
                <div className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-1">
                  &#8377;{order.totalAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#5C5852] mt-1 font-light">
                  Subtotal: &#8377;{order.subtotal.toLocaleString('en-IN')} + Insured Express Air: &#8377;{order.shippingCharge}
                </div>
              </div>

              {/* QR Image Container - ONLY QR CODE */}
              <div className="relative aspect-square w-72 max-w-full mx-auto bg-white border-2 border-[#181818] p-3 shadow-sm">
                <div className="relative w-full h-full">
                  <Image
                    src={qrImage}
                    alt="ELVORA Official UPI QR Code"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Compatible UPI Apps Row */}
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#708579] block mb-2 font-medium">
                  Scan with any UPI Application:
                </span>
                <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#181818] flex-wrap">
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">Google Pay</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">PhonePe</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">Paytm</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">BHIM</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">CRED</span>
                </div>
              </div>
            </div>

            {/* Right Column: SCREENSHOT UPLOAD & SUBMIT */}
            <div className="md:col-span-6 space-y-6">
              <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                    STEP 2
                  </span>
                  <h3 className="font-serif text-xl text-[#181818] font-light mt-0.5">
                    Submit Payment Screenshot
                  </h3>
                  <p className="text-xs text-[#5C5852] mt-1 font-light leading-relaxed">
                    Payment complete karne ke baad, bas receipt ka screenshot attach karein aur submit par click karein.
                  </p>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-5">
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    id="payment-screenshot-input"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Screenshot Selection Box */}
                  {localPreview || screenshotUrl ? (
                    <div className="border-2 border-[#24332C] bg-[#FAF8F5] p-4 text-center space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-[#24332C] font-semibold">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Screenshot Selected &bull; Ready to Submit</span>
                      </div>

                      <div className="relative w-36 h-36 mx-auto border border-[#EAE5DE] bg-white overflow-hidden shadow-xs">
                        <Image
                          src={localPreview || screenshotUrl}
                          alt="Selected Payment Screenshot"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-pointer text-xs text-[#24332C] hover:text-[#181818] font-medium underline inline-block"
                        >
                          Change / Replace Screenshot
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D5E0D9] bg-[#FAF8F5] p-8 text-center cursor-pointer hover:border-[#24332C] hover:bg-[#EEF3F0]/40 transition-all flex flex-col items-center justify-center space-y-3 select-none"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#EEF3F0] text-[#24332C] flex items-center justify-center">
                        <Camera className="w-6 h-6" />
                      </div>

                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#181818] block">
                          Tap to Select Payment Screenshot
                        </span>
                        <span className="text-[11px] text-[#708579] font-light mt-0.5 block">
                          Phone gallery ya files se screenshot select karein (JPG, PNG, WebP)
                        </span>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Big Single Submit Button (Always responsive, never dead) */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#24332C] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Screenshot...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>
                          {selectedFile || screenshotUrl
                            ? 'Submit Screenshot for Verification'
                            : 'Select & Submit Screenshot'}
                        </span>
                      </>
                    )}
                  </button>
                </form>

                <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE] text-[11px] text-[#5C5852] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#24332C] shrink-0" />
                  <span>Screenshot submit karne ke baad store owner turant verify karenge.</span>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="bg-white border border-[#EAE5DE] p-6 space-y-3 shadow-xs">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#181818]">
                  Order Items ({order.items.length})
                </h4>
                <div className="divide-y divide-[#EAE5DE] max-h-48 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-[#F8F5F0] border border-[#EAE5DE] overflow-hidden shrink-0">
                          <Image
                            src={item.productImage || '/images/products/touch-distance-bracelet/hero.jpg'}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-[#181818]">{item.productName}</div>
                          <div className="text-[10px] text-[#708579]">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="font-semibold text-[#181818]">
                        &#8377;{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
