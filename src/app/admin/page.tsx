'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Product, Order, StoreSettings } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Package,
  CreditCard,
  Settings,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Upload,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isAdminLoggedIn, logoutAdmin } = useAuth();
  const { format } = useCurrency();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'payments' | 'orders' | 'settings'>('payments');

  // Product Catalogue State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Orders & Payment Verification State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'SUBMITTED' | 'PAID' | 'REJECTED'>('SUBMITTED');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Store Settings State
  const [settings, setSettings] = useState<StoreSettings>({
    upiId: 'elvora@upi',
    payeeName: 'ELVORA Luxury Jewels',
    upiQrImage: '/images/qr/upi-qr.jpg',
    supportEmail: 'concierge@elvora.com',
    supportPhone: '+91 98765 43210',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders?admin=true');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && data.upiId) setSettings(data);
    } catch {
      // fallback to initial
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
    fetchOrders();
    fetchSettings();
  }, [isAdminLoggedIn, router]);

  // Product Delete
  const handleDeleteProduct = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?\n\nThis will safely unpublish and archive the product while preserving historical customer orders.`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchProducts();
    } finally {
      setDeletingId(null);
    }
  };

  // Verify Payment Action
  const handleVerifyPayment = async (orderId: string) => {
    const confirmVerify = window.confirm(
      `Confirm Payment for Order ${orderId}?\n\nPlease confirm that you have verified the actual credit in your receiving bank account.`
    );
    if (!confirmVerify) return;

    setVerifyingId(orderId);
    try {
      const res = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          verifiedBy: admin?.email || 'admin@elvora.com',
        }),
      });

      if (res.ok) {
        await fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Verification failed');
      }
    } finally {
      setVerifyingId(null);
    }
  };

  // Reject Payment Action
  const handleRejectPayment = async () => {
    if (!rejectingId) return;

    const reason = rejectionReasonInput.trim() || 'Bank credit not received or UTR mismatch';
    setVerifyingId(rejectingId);
    try {
      const res = await fetch('/api/admin/reject-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: rejectingId,
          reason,
        }),
      });

      if (res.ok) {
        setRejectingId(null);
        setRejectionReasonInput('');
        await fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Rejection failed');
      }
    } finally {
      setVerifyingId(null);
    }
  };

  // Save Settings Action
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } finally {
      setSettingsSaving(false);
    }
  };

  // Upload new QR Image
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const updated = { ...settings, upiQrImage: data.url };
        setSettings(updated);
        // Persist immediately
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      }
    } finally {
      setUploadingQr(false);
    }
  };

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  if (!isAdminLoggedIn) return null;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  // Filtered Orders for Verification
  const pendingSubmissions = orders.filter((o) => o.status === 'PAYMENT_SUBMITTED');
  const paidOrders = orders.filter((o) => o.status === 'PAID' || o.status === 'CONFIRMED');
  const rejectedOrders = orders.filter((o) => o.status === 'PAYMENT_REJECTED');

  const filteredOrders = orders.filter((o) => {
    // Tab / Filter condition
    if (paymentFilter === 'SUBMITTED' && o.status !== 'PAYMENT_SUBMITTED') return false;
    if (paymentFilter === 'PAID' && o.status !== 'PAID' && o.status !== 'CONFIRMED') return false;
    if (paymentFilter === 'REJECTED' && o.status !== 'PAYMENT_REJECTED') return false;

    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
      (o.upiUtr && o.upiUtr.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E1D8] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center text-[#B89A69]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                ADMINISTRATIVE PORTAL &bull; {admin?.email || 'Authenticated'}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light">
                ELVORA Store Administration
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchOrders();
                fetchProducts();
              }}
              className="inline-flex items-center gap-1.5 border border-[#E7E1D8] bg-white text-[#77736D] px-3 py-2 text-xs uppercase tracking-wider hover:text-[#181818] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                router.push('/admin/login');
              }}
              className="inline-flex items-center gap-1.5 border border-[#E7E1D8] bg-white text-[#77736D] px-3.5 py-2 text-xs uppercase tracking-wider hover:text-red-700 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-[#E7E1D8] space-x-2 sm:space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 px-2 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'payments'
                ? 'text-[#24332C] border-b-2 border-[#24332C]'
                : 'text-[#77736D] hover:text-[#181818]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Verification</span>
            {pendingSubmissions.length > 0 && (
              <span className="bg-[#B69A65] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {pendingSubmissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-[#24332C] border-b-2 border-[#24332C]'
                : 'text-[#77736D] hover:text-[#181818]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalogue ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-2 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-[#24332C] border-b-2 border-[#24332C]'
                : 'text-[#77736D] hover:text-[#181818]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>All Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-2 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-[#24332C] border-b-2 border-[#24332C]'
                : 'text-[#77736D] hover:text-[#181818]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>UPI &amp; Store Settings</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PAYMENT VERIFICATION SECTION */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#EFEAE2]/60 p-4 border border-[#E7E1D8]">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setPaymentFilter('SUBMITTED')}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                    paymentFilter === 'SUBMITTED'
                      ? 'bg-[#24332C] text-white shadow-xs'
                      : 'bg-white text-[#77736D] border border-[#E7E1D8] hover:text-[#181818]'
                  }`}
                >
                  Pending Verification ({pendingSubmissions.length})
                </button>

                <button
                  onClick={() => setPaymentFilter('PAID')}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                    paymentFilter === 'PAID'
                      ? 'bg-[#24332C] text-white shadow-xs'
                      : 'bg-white text-[#77736D] border border-[#E7E1D8] hover:text-[#181818]'
                  }`}
                >
                  Verified &bull; Paid ({paidOrders.length})
                </button>

                <button
                  onClick={() => setPaymentFilter('REJECTED')}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                    paymentFilter === 'REJECTED'
                      ? 'bg-[#24332C] text-white shadow-xs'
                      : 'bg-white text-[#77736D] border border-[#E7E1D8] hover:text-[#181818]'
                  }`}
                >
                  Rejected ({rejectedOrders.length})
                </button>

                <button
                  onClick={() => setPaymentFilter('ALL')}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                    paymentFilter === 'ALL'
                      ? 'bg-[#24332C] text-white shadow-xs'
                      : 'bg-white text-[#77736D] border border-[#E7E1D8] hover:text-[#181818]'
                  }`}
                >
                  All ({orders.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-[#77736D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, UTR or Name..."
                  className="w-full bg-[#F8F6F2] border border-[#E7E1D8] pl-9 pr-3 py-1.5 text-xs text-[#171717] focus:outline-none focus:border-[#24332C]"
                />
              </div>
            </div>

            {/* Verification Table */}
            <div className="bg-[#F8F6F2] border border-[#E7E1D8] shadow-xs overflow-hidden">
              {ordersLoading ? (
                <div className="p-12 text-center text-xs text-[#77736D]">
                  Loading payment submissions...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <CreditCard className="w-10 h-10 text-[#77736D] mx-auto stroke-1" />
                  <h3 className="font-serif text-lg text-[#171717]">
                    {paymentFilter === 'SUBMITTED'
                      ? 'No Pending Payments'
                      : 'No Matching Orders'}
                  </h3>
                  <p className="text-xs text-[#77736D]">
                    {paymentFilter === 'SUBMITTED'
                      ? 'All customer UPI payments have been verified or no new UTRs submitted yet.'
                      : 'Try adjusting your search query or filter selection.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFEAE2] text-[#77736D] uppercase text-[10px] tracking-wider border-b border-[#E7E1D8]">
                      <tr>
                        <th className="py-3 px-4">Order ID &amp; Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Amount (INR)</th>
                        <th className="py-3 px-4">UTR / Reference</th>
                        <th className="py-3 px-4">Screenshot</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Verification Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E1D8]">
                      {filteredOrders.map((ord) => {
                        const isOrdPaid = ord.status === 'PAID' || ord.status === 'CONFIRMED';
                        const isOrdSubmitted = ord.status === 'PAYMENT_SUBMITTED';
                        const isOrdRejected = ord.status === 'PAYMENT_REJECTED';

                        return (
                          <tr key={ord.id} className="hover:bg-[#EFEAE2]/30 transition-colors">
                            {/* Order ID & Date */}
                            <td className="py-3.5 px-4">
                              <div className="font-mono font-bold text-[#181818]">{ord.id}</div>
                              <div className="text-[10px] text-[#77736D]">
                                {new Date(ord.createdAt).toLocaleDateString()}{' '}
                                {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            {/* Customer Details */}
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-[#181818]">{ord.customerName}</div>
                              <div className="text-[10px] text-[#77736D]">{ord.customerEmail || '—'}</div>
                              <div className="text-[10px] text-[#77736D]">{ord.customerPhone}</div>
                            </td>

                            {/* Amount */}
                            <td className="py-3.5 px-4">
                              <div className="font-serif text-sm font-semibold text-[#181818]">
                                &#8377;{ord.totalAmount.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-[#77736D]">
                                Items: &#8377;{ord.subtotal} + Ship: &#8377;{ord.shippingCharge}
                              </div>
                            </td>

                            {/* UTR / Reference */}
                            <td className="py-3.5 px-4">
                              {ord.upiUtr ? (
                                <div className="inline-flex items-center gap-1.5 bg-white border border-[#E7E1D8] px-2 py-1">
                                  <span className="font-mono text-xs font-semibold text-[#181818]">
                                    {ord.upiUtr}
                                  </span>
                                  <button
                                    onClick={() => handleCopyUtr(ord.upiUtr!)}
                                    className="text-[#77736D] hover:text-[#181818]"
                                    title="Copy UTR"
                                  >
                                    {copiedUtr === ord.upiUtr ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-[#A39E96] italic">
                                  Not submitted yet
                                </span>
                              )}
                            </td>

                            {/* Screenshot */}
                            <td className="py-3.5 px-4">
                              {ord.upiScreenshot ? (
                                <button
                                  onClick={() => setPreviewScreenshot(ord.upiScreenshot!)}
                                  className="relative w-12 h-12 bg-white border border-[#E7E1D8] group overflow-hidden block"
                                  title="Click to view full screenshot"
                                >
                                  <Image
                                    src={ord.upiScreenshot}
                                    alt="Payment Receipt"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </button>
                              ) : (
                                <span className="text-[10px] text-[#A39E96]">None</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              {isOrdPaid ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase tracking-wider font-semibold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  PAID
                                </span>
                              ) : isOrdSubmitted ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 uppercase tracking-wider font-semibold">
                                  <Clock className="w-3 h-3" />
                                  SUBMITTED
                                </span>
                              ) : isOrdRejected ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-red-800 bg-red-50 px-2 py-0.5 border border-red-200 uppercase tracking-wider font-semibold">
                                  <XCircle className="w-3 h-3" />
                                  REJECTED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 border border-stone-200 uppercase tracking-wider">
                                  PENDING
                                </span>
                              )}
                            </td>

                            {/* Verification Actions */}
                            <td className="py-3.5 px-4 text-right">
                              {isOrdPaid ? (
                                <div className="text-[10px] text-emerald-700 font-medium">
                                  Verified by {ord.verifiedBy || 'Admin'}
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => handleVerifyPayment(ord.id)}
                                    disabled={verifyingId === ord.id}
                                    className="bg-[#24332C] text-white px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold hover:bg-[#19241F] transition-colors disabled:opacity-50"
                                  >
                                    {verifyingId === ord.id ? 'Verifying...' : 'Verify Payment'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setRejectingId(ord.id);
                                      setRejectionReasonInput('');
                                    }}
                                    disabled={verifyingId === ord.id}
                                    className="border border-red-300 text-red-700 px-2.5 py-1.5 text-[11px] uppercase tracking-wider hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCT CATALOGUE SECTION (EXISTING) */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#EFEAE2]/60 p-4 border border-[#E7E1D8]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#77736D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter products by name or category..."
                  className="w-full bg-[#F8F6F2] border border-[#E7E1D8] pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#24332C]"
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-[#77736D]">
                <span>Total Products: <strong className="text-[#171717]">{products.length}</strong></span>
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-1.5 bg-[#24332C] text-white px-4 py-2 text-xs uppercase tracking-wider font-medium hover:bg-[#19241F]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </Link>
              </div>
            </div>

            <div className="bg-[#F8F6F2] border border-[#E7E1D8] shadow-xs overflow-hidden">
              {productsLoading ? (
                <div className="p-12 text-center text-xs text-[#77736D]">
                  Loading product catalogue...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <Package className="w-10 h-10 text-[#77736D] mx-auto stroke-1" />
                  <h3 className="font-serif text-lg text-[#171717]">No products found</h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFEAE2] text-[#77736D] uppercase text-[10px] tracking-wider border-b border-[#E7E1D8]">
                      <tr>
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Name &amp; Slug</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Selling Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E1D8]">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#EFEAE2]/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="relative w-12 h-12 bg-[#EFEAE2] border border-[#E7E1D8] overflow-hidden">
                              <Image
                                src={prod.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
                                alt={prod.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-[#171717]">{prod.name}</div>
                            <div className="text-[10px] text-[#A39E96] font-mono">{prod.slug}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="bg-[#EFEAE2] text-[#171717] px-2 py-0.5 text-[10px] uppercase tracking-wider">
                              {prod.category}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#181818]">
                              {format(prod.price)}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-emerald-700">{prod.stock} units</span>
                          </td>

                          <td className="py-3 px-4">
                            {prod.isPublished ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" />
                                Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-stone-700 bg-stone-100 px-2 py-0.5 border border-stone-200 uppercase tracking-wider">
                                <XCircle className="w-3 h-3" />
                                Draft
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                href={`/product/${prod.slug}`}
                                target="_blank"
                                className="p-1.5 text-[#77736D] hover:text-[#171717]"
                                title="Preview on Boutique"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>

                              <Link
                                href={`/admin/products/${prod.id}/edit`}
                                className="p-1.5 text-[#77736D] hover:text-[#24332C]"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>

                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                disabled={deletingId === prod.id}
                                className="p-1.5 text-[#77736D] hover:text-red-700 transition-colors disabled:opacity-50"
                                title="Unpublish & Archive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ALL ORDERS SECTION */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-[#F8F6F2] border border-[#E7E1D8] shadow-xs overflow-hidden">
              <div className="p-4 bg-[#EFEAE2] border-b border-[#E7E1D8] flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#181818]">
                  Complete Order Ledger ({orders.length})
                </span>
                <span className="text-xs text-[#77736D]">
                  Strictly Paid Shipping Enforced
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFEAE2]/60 text-[#77736D] uppercase text-[10px] tracking-wider border-b border-[#E7E1D8]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E1D8]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#EFEAE2]/20">
                        <td className="py-3 px-4 font-mono font-bold text-[#181818]">
                          <Link href={`/checkout/pay/${ord.id}`} className="hover:underline text-[#24332C]">
                            {ord.id}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-[#77736D]">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#181818]">{ord.customerName}</div>
                          <div className="text-[10px] text-[#77736D]">{ord.customerEmail || '—'}</div>
                        </td>
                        <td className="py-3 px-4">{ord.items.length} item(s)</td>
                        <td className="py-3 px-4 font-semibold text-[#181818]">
                          &#8377;{ord.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                            ord.status === 'PAID' || ord.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'PAYMENT_SUBMITTED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono">
                          {ord.upiUtr ? `UTR: ${ord.upiUtr}` : 'Awaiting transfer'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STORE & UPI SETTINGS SECTION */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white border border-[#E7E1D8] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                MERCHANT CONFIGURATION
              </span>
              <h2 className="font-serif text-2xl text-[#181818] font-light mt-0.5">
                UPI QR Code &amp; Payee Settings
              </h2>
              <p className="text-xs text-[#5C5852] mt-1 font-light leading-relaxed">
                Configure your official UPI ID, payee display name, and uploaded QR code. Customers will scan this exact QR code and pay to this UPI ID on the checkout payment screen.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Payee Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                  Verified Payee Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.payeeName}
                  onChange={(e) => setSettings({ ...settings, payeeName: e.target.value })}
                  placeholder="e.g. ELVORA Luxury Jewels"
                  className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                />
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                  Merchant UPI ID (VPA)
                </label>
                <input
                  type="text"
                  required
                  value={settings.upiId}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="e.g. yourname@upi or yourname@okhdfcbank"
                  className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs font-mono text-[#181818] focus:outline-none focus:border-[#24332C]"
                />
              </div>

              {/* QR Code Upload / Replace */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                  Official UPI QR Code Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#FAF8F5] border border-[#E7E1D8]">
                  <div className="relative w-36 h-36 bg-white border border-[#181818] p-2 shrink-0">
                    <Image
                      src={settings.upiQrImage || '/images/qr/upi-qr.jpg'}
                      alt="Store Owner UPI QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-medium text-[#181818] block">Replace QR Image</span>
                    <p className="text-[11px] text-[#5C5852] leading-relaxed">
                      Upload your official QR code generated from Google Pay for Business, PhonePe Merchant, Paytm Business or your bank.
                    </p>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="replace-qr-file"
                        onChange={handleQrUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="replace-qr-file"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#24332C] text-white text-xs uppercase tracking-wider hover:bg-[#19241F] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingQr ? 'Uploading QR...' : 'Upload New QR'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Concierge Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Concierge Support Phone
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>
              </div>

              {settingsSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Store settings updated and applied to checkout successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={settingsSaving || uploadingQr}
                className="w-full bg-[#24332C] text-white py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors disabled:opacity-50"
              >
                {settingsSaving ? 'Saving Settings...' : 'Save Store & UPI Settings'}
              </button>
            </form>
          </div>
        )}

        {/* Screenshot Preview Modal */}
        {previewScreenshot && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-4 border border-[#E7E1D8] space-y-3 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D8]">
                <h4 className="font-serif text-sm text-[#181818]">Customer Payment Screenshot</h4>
                <button
                  onClick={() => setPreviewScreenshot(null)}
                  className="text-[#77736D] hover:text-[#181818] text-xs uppercase tracking-wider font-semibold"
                >
                  Close &times;
                </button>
              </div>
              <div className="relative aspect-3/4 max-h-[70vh] w-full bg-[#F8F5F0]">
                <Image
                  src={previewScreenshot}
                  alt="Customer Payment Receipt"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reject Reason Modal */}
        {rejectingId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-6 border border-[#E7E1D8] space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D8]">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-serif text-base text-[#181818]">Reject Payment Submission</h4>
                </div>
                <button
                  onClick={() => setRejectingId(null)}
                  className="text-[#77736D] hover:text-[#181818]"
                >
                  &times;
                </button>
              </div>

              <p className="text-xs text-[#5C5852] leading-relaxed">
                Order <strong className="font-mono text-[#181818]">{rejectingId}</strong> will be marked as <strong className="text-red-700">PAYMENT_REJECTED</strong>. The customer will be informed to review and re-submit a valid UTR.
              </p>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                  Rejection Reason:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="e.g. UTR number not found in receiving bank statement. Please verify and re-enter."
                  className="w-full bg-[#FAF8F5] border border-[#E7E1D8] p-2 text-xs text-[#181818] focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 border border-[#E7E1D8] text-xs uppercase tracking-wider text-[#77736D] hover:text-[#181818]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectPayment}
                  disabled={verifyingId === rejectingId}
                  className="px-4 py-2 bg-red-700 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-800 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
