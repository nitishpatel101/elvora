'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Copy,
  Check,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  RefreshCw,
  AlertCircle,
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

  // Submission Form State
  const [utr, setUtr] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch Order & Settings
  const fetchData = useCallback(async (silent = false) => {
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
  }, [orderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-poll status when payment has been submitted to detect admin verification in real-time
  useEffect(() => {
    if (order?.status !== 'PAYMENT_SUBMITTED') return;

    const interval = setInterval(() => {
      fetchData(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.status, fetchData]);

  const handleCopyUpiId = () => {
    const upi = settings?.upiId || 'elvora@upi';
    navigator.clipboard.writeText(upi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Please upload an image file (JPEG, PNG, WebP).');
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
    if (!utr.trim()) {
      setSubmitError('Please enter the 12-digit UPI transaction reference (UTR) number.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utr: utr.trim(),
          screenshotUrl: screenshotUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment details');
      }

      await fetchData(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting payment';
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
          <p className="text-xs tracking-widest uppercase text-[#5C5852]">Loading Order Payment Screen...</p>
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

  const upiId = settings?.upiId || 'elvora@upi';
  const payeeName = settings?.payeeName || 'ELVORA Luxury Jewels';
  const qrImage = settings?.upiQrImage || '/images/qr/upi-qr.jpg';

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Ribbon */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF3F0] border border-[#D5E0D9] text-[10px] tracking-[0.24em] uppercase text-[#24332C] font-medium">
            <span>ELVORA MANUAL UPI SETTLEMENT</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light">
            {isConfirmed
              ? 'Order Confirmed & Verified'
              : isSubmitted
              ? 'Payment Verification in Progress'
              : 'Complete Your UPI Payment'}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs text-[#5C5852] pt-1">
            <span>Order Reference: <strong className="text-[#181818] font-mono">{order.id}</strong></span>
            <span>&bull;</span>
            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* STATUS BANNER */}
        {isConfirmed ? (
          <div className="bg-[#EEF3F0] border border-[#D5E0D9] p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-[#24332C] text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-[#181818]">Payment Verified by Boutique Concierge</h2>
            <p className="text-xs text-[#5C5852] max-w-lg mx-auto leading-relaxed">
              Your payment has been reconciled with our receiving bank account and your order is officially confirmed. Our master artisans are now preparing your pieces for express dispatch.
            </p>
            {order.verifiedAt && (
              <span className="text-[10px] uppercase tracking-wider text-[#708579] block">
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
          <div className="bg-[#FFFBF0] border border-[#F0E6D2] p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-[#B69A65] text-white rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl text-[#181818]">Payment Submitted &bull; Awaiting Bank Verification</h2>
            <p className="text-xs text-[#5C5852] max-w-lg mx-auto leading-relaxed">
              We have received your transaction reference <strong className="font-mono text-[#181818]">{order.upiUtr}</strong>. The store owner will verify the incoming credit directly in our bank account before confirming.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={async () => {
                  setIsRefreshing(true);
                  await fetchData(true);
                  setTimeout(() => setIsRefreshing(false), 800);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#24332C] font-semibold border border-[#D5E0D9] bg-white px-4 py-2 hover:bg-[#EEF3F0] transition-colors"
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
            <h2 className="font-serif text-xl text-red-900">Payment Verification Unsuccessful</h2>
            <p className="text-xs text-red-700 max-w-lg mx-auto leading-relaxed">
              Reason: {order.rejectionReason || 'The submitted UTR number could not be matched with incoming bank credits.'}
            </p>
            <p className="text-[11px] text-[#5C5852]">
              Please check your banking app, ensure the transfer was completed to the correct UPI ID, and submit the valid 12-digit UTR below.
            </p>
          </div>
        ) : null}

        {/* MAIN PAYMENT GRID */}
        {!isConfirmed && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: QR Code & UPI Credentials */}
            <div className="md:col-span-6 bg-white border border-[#EAE5DE] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="text-center pb-4 border-b border-[#EAE5DE]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                  EXACT ORDER AMOUNT PAYABLE
                </span>
                <div className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-1">
                  &#8377;{order.totalAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#5C5852] mt-1 font-light">
                  Subtotal: &#8377;{order.subtotal.toLocaleString('en-IN')} + Paid Express Air: &#8377;{order.shippingCharge}
                </div>
              </div>

              {/* QR Image Container */}
              <div className="relative aspect-square w-64 max-w-full mx-auto bg-[#F8F5F0] border-2 border-[#181818] p-3 shadow-sm">
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

              {/* Payee Info & Copy UPI ID Button */}
              <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium">
                    Verified Payee:
                  </span>
                  <span className="text-xs text-[#181818] font-semibold">{payeeName}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#EAE5DE]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block">
                      Official UPI ID:
                    </span>
                    <span className="text-xs font-mono text-[#181818] font-semibold">{upiId}</span>
                  </div>

                  <button
                    onClick={handleCopyUpiId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#24332C] text-white text-[11px] uppercase tracking-wider hover:bg-[#19241F] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Compatible UPI Apps */}
              <div className="text-center pt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#708579] block mb-2 font-medium">
                  Scan using any UPI App:
                </span>
                <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#181818] flex-wrap">
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">Google Pay</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">PhonePe</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">Paytm</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">BHIM UPI</span>
                  <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DE]">CRED</span>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Submission Form */}
            <div className="md:col-span-6 space-y-6">
              {/* Payment Submission Box */}
              <div className="bg-white border border-[#EAE5DE] p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                    STEP 2 OF 2
                  </span>
                  <h3 className="font-serif text-xl text-[#181818] font-light mt-0.5">
                    Submit Payment Details
                  </h3>
                  <p className="text-xs text-[#5C5852] mt-1 font-light leading-relaxed">
                    Once you complete the payment on your UPI app, enter the 12-digit transaction reference number (UTR) generated by your bank.
                  </p>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  {/* UTR Input */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                      UPI Reference / UTR Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={utr}
                      onChange={(e) => {
                        setUtr(e.target.value);
                        setSubmitError(null);
                      }}
                      placeholder="e.g. 431289102456"
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-sm font-mono text-[#181818] focus:outline-none focus:border-[#24332C]"
                    />
                    <span className="text-[10px] text-[#708579] mt-1 block">
                      Found in your UPI payment receipt under &ldquo;UPI Ref ID&rdquo; or &ldquo;UTR&rdquo;.
                    </span>
                  </div>

                  {/* Screenshot Upload (Optional) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                      Upload Payment Screenshot (Optional)
                    </label>
                    <div className="border border-dashed border-[#EAE5DE] bg-[#FAF8F5] p-4 text-center">
                      {screenshotUrl ? (
                        <div className="space-y-2">
                          <div className="relative w-28 h-28 mx-auto border border-[#EAE5DE] bg-white overflow-hidden">
                            <Image
                              src={screenshotUrl}
                              alt="Uploaded Payment Receipt"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setScreenshotUrl('')}
                            className="text-[10px] text-red-700 uppercase tracking-wider hover:underline"
                          >
                            Remove Screenshot
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            id="screenshot-file"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="screenshot-file"
                            className="cursor-pointer inline-flex items-center gap-2 text-xs text-[#24332C] hover:text-[#181818] font-medium"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{uploadingImage ? 'Uploading...' : 'Choose Receipt Image'}</span>
                          </label>
                          <p className="text-[10px] text-[#708579] mt-1">PNG, JPG, WebP up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="w-full bg-[#24332C] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Verification...' : 'Submit Payment Verification'}
                  </button>
                </form>

                {/* Important Notice */}
                <div className="p-3.5 bg-[#EEF3F0]/60 border border-[#D5E0D9] text-[11px] text-[#24332C] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold uppercase text-[10px] tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Real-Time Bank Verification</span>
                  </div>
                  <p className="leading-relaxed">
                    ELVORA maintains strict anti-fraud standards. Orders are confirmed only after the credit is received and verified by our boutique admin.
                  </p>
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

                <div className="pt-2 border-t border-[#EAE5DE] text-xs space-y-1 text-[#5C5852]">
                  <div className="flex justify-between">
                    <span>Delivery Address:</span>
                    <span className="text-[#181818] font-medium text-right max-w-[200px] truncate">
                      {order.shippingAddress.fullName}, {order.shippingAddress.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Method:</span>
                    <span className="text-[#181818] font-medium">Insured Express Air (Paid)</span>
                  </div>
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
                  <div>UTR / Reference: <strong>{order.upiUtr || 'VERIFIED'}</strong></div>
                  <div>Settlement Method: Manual UPI QR</div>
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

