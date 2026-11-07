'use client';

import React, { useEffect, useState, use } from 'react';
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
} from 'lucide-react';
import { Order, StoreSettings } from '@/types';

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

  // Screenshot Upload & Form State
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch Order & Settings
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [orderRes, settingsRes] = await Promise.all([
        fetch(`/api/orders/${orderId}`),
        fetch('/api/settings'),
      ]);

      if (!orderRes.ok) {
        throw new Error('Order not found');
      }

      const orderData = await orderRes.json();
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

  // Auto-poll status when payment screenshot is submitted to detect admin verification in real-time
  useEffect(() => {
    if (order?.status !== 'PAYMENT_SUBMITTED') return;

    const interval = setInterval(() => {
      fetchData(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.status]);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setUploadingImage(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload screenshot');
      }

      setScreenshotUrl(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      setSubmitError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotUrl) {
      setSubmitError('Please select and upload your payment screenshot first.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshotUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment screenshot');
      }

      await fetchData(true);
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
              ? 'Payment Screenshot Submitted'
              : 'Scan QR Code & Pay'}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs text-[#5C5852] pt-1">
            <span>Order Reference: <strong className="text-[#181818] font-mono">{order.id}</strong></span>
            <span>&bull;</span>
            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* STATUS BANNER */}
        {isConfirmed ? (
          <div className="bg-[#EEF3F0] border border-[#D5E0D9] p-6 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-[#24332C] text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-[#181818]">Payment Verified &bull; Order Confirmed!</h2>
            <p className="text-xs text-[#5C5852] max-w-lg mx-auto leading-relaxed">
              Your payment receipt has been verified with our receiving bank account. Our artisans are now preparing your pieces for insured express dispatch.
            </p>
            {order.verifiedAt && (
              <span className="text-[10px] uppercase tracking-wider text-[#708579] block font-mono">
                Verified on {new Date(order.verifiedAt).toLocaleString()}
              </span>
            )}
            <div className="pt-2 flex justify-center gap-4">
              <Link
                href={`/track-order?orderId=${order.id}`}
                className="bg-[#24332C] text-white text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-[#19241F] transition-colors"
              >
                Track Shipment
              </Link>
              <Link
                href="/shop"
                className="border border-[#181818] text-[#181818] text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-[#181818] hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : isSubmitted ? (
          <div className="bg-[#FFFBF0] border border-[#F0E6D2] p-6 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-[#B69A65] text-white rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-[#181818]">Payment Screenshot Submitted</h2>
            <p className="text-xs text-[#5C5852] max-w-lg mx-auto leading-relaxed">
              We have received your payment screenshot. The boutique owner is verifying the transfer directly in our receiving bank account. This page will update automatically once confirmed!
            </p>

            {order.upiScreenshot && (
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#708579] block mb-1">
                  Submitted Receipt:
                </span>
                <div className="relative w-28 h-28 mx-auto border border-[#EAE5DE] bg-white overflow-hidden shadow-2xs">
                  <Image
                    src={order.upiScreenshot}
                    alt="Submitted Receipt"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-3">
              <button
                onClick={async () => {
                  setIsRefreshing(true);
                  await fetchData(true);
                  setTimeout(() => setIsRefreshing(false), 800);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#24332C] font-semibold border border-[#D5E0D9] bg-white px-4 py-2 hover:bg-[#EEF3F0] transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Check Verification Status</span>
              </button>
            </div>
          </div>
        ) : isRejected ? (
          <div className="bg-red-50 border border-red-200 p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-red-700 text-white rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-red-900">Payment Verification Issue</h2>
            <p className="text-xs text-red-700 max-w-lg mx-auto leading-relaxed">
              {order.rejectionReason || 'The payment screenshot could not be verified with our bank credit.'}
            </p>
            <p className="text-[11px] text-[#5C5852]">
              Please ensure you made the transfer using the QR code below, and upload the clear payment screenshot.
            </p>
          </div>
        ) : null}

        {/* MAIN PAYMENT GRID (ONLY IF NOT CONFIRMED) */}
        {!isConfirmed && (
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

              {/* QR Image Container - ONLY QR CODE AS REQUESTED */}
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

            {/* Right Column: SUPER EASY SCREENSHOT UPLOAD ONLY */}
            <div className="md:col-span-6 space-y-6">
              <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                    STEP 2
                  </span>
                  <h3 className="font-serif text-xl text-[#181818] font-light mt-0.5">
                    Upload Payment Screenshot
                  </h3>
                  <p className="text-xs text-[#5C5852] mt-1 font-light leading-relaxed">
                    After completing payment in your UPI app, simply take a screenshot of the payment receipt and upload it here.
                  </p>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-5">
                  {/* Big Friendly Screenshot Upload Target */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="payment-screenshot-input"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />

                    {screenshotUrl ? (
                      <div className="border-2 border-[#24332C] bg-[#EEF3F0]/40 p-4 text-center space-y-3">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-[#24332C] font-semibold">
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>Screenshot Uploaded Successfully</span>
                        </div>

                        <div className="relative w-36 h-36 mx-auto border border-[#EAE5DE] bg-white overflow-hidden shadow-xs">
                          <Image
                            src={screenshotUrl}
                            alt="Uploaded Payment Screenshot"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="payment-screenshot-input"
                            className="cursor-pointer text-xs text-[#24332C] hover:text-[#181818] font-medium underline inline-block"
                          >
                            Change / Replace Screenshot
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="payment-screenshot-input"
                        className="border-2 border-dashed border-[#D5E0D9] bg-[#FAF8F5] p-8 text-center cursor-pointer hover:border-[#24332C] hover:bg-[#EEF3F0]/30 transition-all flex flex-col items-center justify-center space-y-3 block"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#EEF3F0] text-[#24332C] flex items-center justify-center">
                          {uploadingImage ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          ) : (
                            <Camera className="w-6 h-6" />
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#181818] block">
                            {uploadingImage ? 'Uploading Screenshot...' : 'Tap to Upload Payment Screenshot'}
                          </span>
                          <span className="text-[11px] text-[#708579] font-light mt-0.5 block">
                            Select from your phone gallery or files (PNG, JPG, WebP)
                          </span>
                        </div>
                      </label>
                    )}
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Big Single Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage || !screenshotUrl}
                    className="w-full bg-[#24332C] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Verification...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Submit Payment Screenshot</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="p-3 bg-[#FAF8F5] border border-[#EAE5DE] text-[11px] text-[#5C5852] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#24332C] shrink-0" />
                  <span>Your order is held safely and confirmed as soon as payment is verified.</span>
                </div>
              </div>

              {/* Order Items Preview */}
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

        {/* If confirmed, show order summary card */}
        {isConfirmed && (
          <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl text-[#181818] font-light pb-3 border-b border-[#EAE5DE]">
              Order Summary &bull; {order.id}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block">
                  Delivery Destination:
                </span>
                <p className="text-[#181818] font-medium mt-1">
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
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block">
                  Payment Verification Record:
                </span>
                <div className="mt-1 space-y-1 font-mono text-[11px] text-[#181818]">
                  <div>Settlement Method: Manual UPI QR Code</div>
                  <div>Verified By: {order.verifiedBy || 'Store Admin'}</div>
                  <div>Status: <span className="text-emerald-700 font-bold">PAID &bull; CONFIRMED</span></div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#EAE5DE] pt-4 border-t border-[#EAE5DE]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-[#F8F5F0] border border-[#EAE5DE] overflow-hidden">
                      <Image
                        src={item.productImage || '/images/products/touch-distance-bracelet/hero.jpg'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[#181818]">{item.productName}</div>
                      <div className="text-[11px] text-[#708579]">Qty: {item.quantity}</div>
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
        )}
      </div>
    </div>
  );
}
