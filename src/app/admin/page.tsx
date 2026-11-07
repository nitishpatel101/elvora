'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Product, Order, StoreSettings, OrderStatus } from '@/types';
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
  Check,
  Upload,
  Eye,
  RefreshCw,
  Megaphone,
  Image as ImageIcon,
  Truck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isAdminLoggedIn, logoutAdmin } = useAuth();
  const { format } = useCurrency();

  // Navigation Tabs: Added 'banners' tab
  const [activeTab, setActiveTab] = useState<'payments' | 'products' | 'banners' | 'orders' | 'settings'>('payments');

  // Product Catalogue State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick Product Image Management Modal
  const [managingImagesProduct, setManagingImagesProduct] = useState<Product | null>(null);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [imageActionSuccess, setImageActionSuccess] = useState<string | null>(null);

  // Orders & Payment Verification State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'SUBMITTED' | 'PAID' | 'REJECTED'>('SUBMITTED');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  // Order Fulfillment & Tracking Modal
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [trackingCourier, setTrackingCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<OrderStatus>('CONFIRMED');
  const [savingTracking, setSavingTracking] = useState(false);

  // Store Settings (Banners, UPI, Brand) State
  const [settings, setSettings] = useState<StoreSettings>({
    announcementText: 'BLACK FRIDAY SALE • 30% OFF • USE CODE: ELVORA30',
    announcementSubText: 'FREE EXPRESS SHIPPING ON ORDERS ₹99+',
    announcementVisible: true,
    heroHeading: '30% OFF',
    heroSubheading: 'BLACK FRIDAY SALE',
    heroButtonText: 'SHOP NOW',
    heroLink: '/shop',
    heroImage: '/images/hero/hero-couple-tight.png',
    brandTagline: 'Haute Joaillerie',
    supportEmail: 'concierge@elvora.com',
    supportPhone: '+91 98765 43210',
    upiId: 'elvora@upi',
    payeeName: 'ELVORA Luxury Jewels',
    upiQrImage: '/images/qr/upi-qr.jpg',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

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
      if (data && data.upiId) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
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

  // Save Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  // Quick Product Image Upload
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!managingImagesProduct) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProductImage(true);
    setImageActionSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Failed to upload photo');
      }

      const updatedImages = [...managingImagesProduct.images, uploadData.url];
      await updateProductImages(managingImagesProduct.id, updatedImages);
      setImageActionSuccess('Photo uploaded and added to product!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingProductImage(false);
    }
  };

  // Add Product Image by URL
  const handleAddProductImageUrl = async () => {
    if (!managingImagesProduct || !newImageUrlInput.trim()) return;
    const updatedImages = [...managingImagesProduct.images, newImageUrlInput.trim()];
    await updateProductImages(managingImagesProduct.id, updatedImages);
    setNewImageUrlInput('');
    setImageActionSuccess('Image URL added!');
  };

  // Delete Product Image
  const handleDeleteProductImage = async (imgIndex: number) => {
    if (!managingImagesProduct) return;
    if (managingImagesProduct.images.length <= 1) {
      alert('A product must retain at least one photograph.');
      return;
    }
    const updatedImages = managingImagesProduct.images.filter((_, idx) => idx !== imgIndex);
    await updateProductImages(managingImagesProduct.id, updatedImages);
    setImageActionSuccess('Photo deleted from product!');
  };

  // Set Product Image as Cover
  const handleSetCoverProductImage = async (imgIndex: number) => {
    if (!managingImagesProduct) return;
    const targetImg = managingImagesProduct.images[imgIndex];
    const remaining = managingImagesProduct.images.filter((_, idx) => idx !== imgIndex);
    const updatedImages = [targetImg, ...remaining];
    await updateProductImages(managingImagesProduct.id, updatedImages);
    setImageActionSuccess('Set as primary cover image!');
  };

  // Update Product Images in Database
  const updateProductImages = async (productId: string, updatedImages: string[]) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: updatedImages }),
    });

    if (res.ok) {
      const updatedProd: Product = await res.json();
      setManagingImagesProduct(updatedProd);
      setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProd : p)));
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

    const reason = rejectionReasonInput.trim() || 'Bank credit not received or receipt unverified';
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

  // Save Order Tracking & Status
  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingOrder) return;

    setSavingTracking(true);
    try {
      const res = await fetch(`/api/orders/${trackingOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: trackingStatus,
          trackingCourier: trackingCourier.trim() || undefined,
          trackingNumber: trackingNumber.trim() || undefined,
        }),
      });

      if (res.ok) {
        await fetchOrders();
        setTrackingOrder(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update tracking');
      }
    } finally {
      setSavingTracking(false);
    }
  };

  // QR Upload
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

  // Hero Banner Upload
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const updated = { ...settings, heroImage: data.url };
        setSettings(updated);
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      }
    } finally {
      setUploadingHero(false);
    }
  };

  if (!isAdminLoggedIn) return null;

  // Key Metrics
  const pendingSubmissions = orders.filter((o) => o.status === 'PAYMENT_SUBMITTED');
  const paidOrders = orders.filter((o) => o.status === 'PAID' || o.status === 'CONFIRMED' || o.status === 'SHIPPED' || o.status === 'DELIVERED');
  const totalVerifiedRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const liveProductsCount = products.filter((p) => p.isPublished).length;

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
  const filteredOrders = orders.filter((o) => {
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
                fetchSettings();
              }}
              className="inline-flex items-center gap-1.5 border border-[#E7E1D8] bg-white text-[#77736D] px-3 py-2 text-xs uppercase tracking-wider hover:text-[#181818] transition-colors shadow-2xs"
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
              className="inline-flex items-center gap-1.5 border border-[#E7E1D8] bg-white text-[#77736D] px-3.5 py-2 text-xs uppercase tracking-wider hover:text-red-700 transition-colors shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* METRICS & OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E7E1D8] p-4.5 shadow-2xs">
            <div className="flex items-center justify-between text-[#708579]">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Total Verified Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-serif text-2xl font-light text-[#181818] mt-2">
              &#8377;{totalVerifiedRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
              {paidOrders.length} Paid &bull; Confirmed Orders
            </span>
          </div>

          <div
            onClick={() => setActiveTab('payments')}
            className="bg-white border border-[#E7E1D8] p-4.5 shadow-2xs cursor-pointer hover:border-[#B89A69] transition-colors"
          >
            <div className="flex items-center justify-between text-[#708579]">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Pending Verification</span>
              <Clock className="w-4 h-4 text-[#B89A69]" />
            </div>
            <div className="font-serif text-2xl font-light text-[#181818] mt-2">
              {pendingSubmissions.length}
            </div>
            <span className="text-[10px] text-[#8C6B28] font-medium mt-0.5 block">
              {pendingSubmissions.length > 0 ? 'Action required in Bank account' : 'All payments settled'}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white border border-[#E7E1D8] p-4.5 shadow-2xs cursor-pointer hover:border-[#181818] transition-colors"
          >
            <div className="flex items-center justify-between text-[#708579]">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Total Orders Placed</span>
              <Package className="w-4 h-4 text-[#24332C]" />
            </div>
            <div className="font-serif text-2xl font-light text-[#181818] mt-2">
              {orders.length}
            </div>
            <span className="text-[10px] text-[#77736D] font-medium mt-0.5 block">
              All domestic &amp; international
            </span>
          </div>

          <div
            onClick={() => setActiveTab('products')}
            className="bg-white border border-[#E7E1D8] p-4.5 shadow-2xs cursor-pointer hover:border-[#181818] transition-colors"
          >
            <div className="flex items-center justify-between text-[#708579]">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Active Products</span>
              <Sparkles className="w-4 h-4 text-[#B89A69]" />
            </div>
            <div className="font-serif text-2xl font-light text-[#181818] mt-2">
              {liveProductsCount} / {products.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
              Live in Online Boutique
            </span>
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
              <span className="bg-[#B69A65] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold animate-pulse">
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
            onClick={() => setActiveTab('banners')}
            className={`pb-3 px-2 text-xs uppercase tracking-[0.2em] font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'banners'
                ? 'text-[#24332C] border-b-2 border-[#24332C]'
                : 'text-[#77736D] hover:text-[#181818]'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Banners &amp; Announcements</span>
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
            <span>All Orders &amp; Shipments ({orders.length})</span>
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
              <div className="flex items-center gap-2 flex-wrap">
                {(['SUBMITTED', 'PAID', 'REJECTED', 'ALL'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPaymentFilter(filter)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                      paymentFilter === filter
                        ? 'bg-[#24332C] text-white'
                        : 'bg-white text-[#77736D] border border-[#E7E1D8] hover:text-[#181818]'
                    }`}
                  >
                    {filter === 'SUBMITTED' ? `Pending Verification (${pendingSubmissions.length})` : filter}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-[#77736D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order ID, name, email..."
                  className="w-full bg-[#F8F6F2] border border-[#E7E1D8] pl-9 pr-3 py-1.5 text-xs text-[#171717] focus:outline-none focus:border-[#24332C]"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#E7E1D8] shadow-xs overflow-hidden">
              {ordersLoading ? (
                <div className="p-12 text-center text-xs text-[#77736D]">
                  Loading order records...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <CreditCard className="w-10 h-10 text-[#77736D] mx-auto stroke-1" />
                  <h3 className="font-serif text-lg text-[#171717]">No orders matching filter</h3>
                  <p className="text-xs text-[#77736D]">
                    {paymentFilter === 'SUBMITTED'
                      ? 'No pending customer payments awaiting bank verification.'
                      : 'Try resetting the search filter.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFEAE2] text-[#77736D] uppercase text-[10px] tracking-wider border-b border-[#E7E1D8]">
                      <tr>
                        <th className="py-3 px-4">Order ID &amp; Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Customer Screenshot</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Verification Actions</th>
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
                              <span className="font-mono font-bold text-[#181818] block">{ord.id}</span>
                              <span className="text-[10px] text-[#708579]">
                                {new Date(ord.createdAt).toLocaleString()}
                              </span>
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

                            {/* Screenshot Thumbnail */}
                            <td className="py-3.5 px-4">
                              {ord.upiScreenshot ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewScreenshot(ord.upiScreenshot || null)}
                                  className="group relative block w-14 h-14 border border-[#E7E1D8] bg-[#FAF8F5] overflow-hidden hover:border-[#24332C] transition-all"
                                  title="Click to view full screenshot"
                                >
                                  <Image
                                    src={ord.upiScreenshot}
                                    alt="Receipt Screenshot"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </button>
                              ) : (
                                <span className="text-[10px] text-[#A39E96]">None attached</span>
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
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 uppercase tracking-wider font-semibold animate-pulse">
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

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              {isOrdPaid ? (
                                <div className="text-[10px] text-emerald-700 font-medium">
                                  Verified by {ord.verifiedBy || 'Store Owner'}
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => handleVerifyPayment(ord.id)}
                                    disabled={verifyingId === ord.id}
                                    className="bg-[#24332C] text-white px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold hover:bg-[#19241F] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                                  >
                                    {verifyingId === ord.id ? 'Verifying...' : 'Verify Payment'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setRejectingId(ord.id);
                                      setRejectionReasonInput('');
                                    }}
                                    disabled={verifyingId === ord.id}
                                    className="border border-red-300 text-red-700 px-2.5 py-1.5 text-[11px] uppercase tracking-wider hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
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
        {/* TAB 2: PRODUCT CATALOGUE SECTION WITH IMAGE MANAGER */}
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
                <span>
                  Total Products: <strong className="text-[#171717]">{products.length}</strong>
                </span>
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-1.5 bg-[#24332C] text-white px-4 py-2 text-xs uppercase tracking-wider font-medium hover:bg-[#19241F] shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[#E7E1D8] shadow-xs overflow-hidden">
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
                        <th className="py-3 px-4">Primary Image</th>
                        <th className="py-3 px-4">Name &amp; Slug</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Selling Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Photos</th>
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
                                unoptimized
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

                          <td className="py-3 px-4 font-semibold text-[#181818]">
                            {format(prod.price)}
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-emerald-700">{prod.stock} units</span>
                          </td>

                          {/* Quick Photo Manager Button */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => {
                                setManagingImagesProduct(prod);
                                setImageActionSuccess(null);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#D5E0D9] bg-[#FAF8F5] text-[#24332C] hover:bg-[#EEF3F0] transition-colors text-[11px] font-semibold"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-[#B89A69]" />
                              <span>{prod.images.length} Photos</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                href={`/product/${prod.slug}`}
                                target="_blank"
                                className="p-1.5 text-[#77736D] hover:text-[#171717]"
                                title="Preview on Storefront"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>

                              <Link
                                href={`/admin/products/${prod.id}/edit`}
                                className="p-1.5 text-[#77736D] hover:text-[#24332C]"
                                title="Edit Product Details & Details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>

                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                disabled={deletingId === prod.id}
                                className="p-1.5 text-[#77736D] hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                                title="Delete Product"
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
        {/* TAB 3: BANNERS & ANNOUNCEMENTS EDITOR (NEW FEATURE) */}
        {/* ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-8">
            {settingsSaved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Store banners and announcement bar updated successfully! Changes are live across the website.</span>
              </div>
            )}

            {/* Announcement Bar Customizer */}
            <div className="bg-white border border-[#E7E1D8] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E7E1D8]">
                <Megaphone className="w-5 h-5 text-[#24332C]" />
                <div>
                  <h3 className="font-serif text-xl text-[#181818] font-light">
                    Header Announcement Bar
                  </h3>
                  <p className="text-xs text-[#708579]">
                    The top green promotional bar shown at the very top of every page.
                  </p>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block mb-2">
                  Live Preview:
                </span>
                <div className="bg-[#24332C] text-[#FAF8F5] text-[11px] tracking-[0.2em] uppercase py-2 px-4 flex items-center justify-between font-medium">
                  <span className="hidden sm:inline text-[#A3B2A9]">
                    {settings.announcementSubText || 'FREE EXPRESS SHIPPING ON ORDERS ₹99+'}
                  </span>
                  <span className="flex-1 text-center truncate px-2 font-semibold tracking-[0.22em]">
                    {settings.announcementText || 'BLACK FRIDAY SALE • 30% OFF • USE CODE: ELVORA30'}
                  </span>
                  <span className="text-[#A3B2A9] text-xs">&times;</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Main Promotional Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText || ''}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    placeholder="e.g. BLACK FRIDAY SALE • 30% OFF • USE CODE: ELVORA30"
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Left Sub-text (e.g. Shipping Offer)
                  </label>
                  <input
                    type="text"
                    value={settings.announcementSubText || ''}
                    onChange={(e) => setSettings({ ...settings, announcementSubText: e.target.value })}
                    placeholder="e.g. FREE EXPRESS SHIPPING ON ORDERS ₹99+"
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="announcementVisibleCheck"
                  checked={settings.announcementVisible ?? true}
                  onChange={(e) => setSettings({ ...settings, announcementVisible: e.target.checked })}
                  className="w-4 h-4 text-[#24332C] focus:ring-0 rounded-none cursor-pointer"
                />
                <label htmlFor="announcementVisibleCheck" className="text-xs text-[#181818] font-medium cursor-pointer">
                  Display Announcement Bar across all website pages
                </label>
              </div>
            </div>

            {/* Homepage Hero Banner Customizer */}
            <div className="bg-white border border-[#E7E1D8] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E7E1D8]">
                <ImageIcon className="w-5 h-5 text-[#B89A69]" />
                <div>
                  <h3 className="font-serif text-xl text-[#181818] font-light">
                    Homepage Editorial Hero Banner
                  </h3>
                  <p className="text-xs text-[#708579]">
                    Change the main banner image, headline, discount offer, and button link on the homepage.
                  </p>
                </div>
              </div>

              {/* Hero Banner Preview */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block mb-2">
                  Hero Preview:
                </span>
                <div className="relative w-full aspect-[2.6/1] max-h-72 bg-[#181818] overflow-hidden border border-[#181818] shadow-sm">
                  <Image
                    src={settings.heroImage || '/images/hero/hero-couple-tight.png'}
                    alt="Hero Banner"
                    fill
                    unoptimized
                    className="object-cover object-[center_35%]"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-white/95 mb-1 drop-shadow-md">
                      {settings.heroSubheading || 'BLACK FRIDAY SALE'}
                    </span>
                    <h2 className="font-sans text-2xl sm:text-4xl font-light text-white tracking-[0.06em] mb-2 drop-shadow-lg">
                      {settings.heroHeading || '30% OFF'}
                    </h2>
                    <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-white pb-0.5 border-b-2 border-white">
                      {settings.heroButtonText || 'SHOP NOW'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Hero Subtitle (Small Top Line)
                  </label>
                  <input
                    type="text"
                    value={settings.heroSubheading || ''}
                    onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
                    placeholder="e.g. BLACK FRIDAY SALE or FESTIVE COLLECTION"
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Hero Main Heading / Offer
                  </label>
                  <input
                    type="text"
                    value={settings.heroHeading || ''}
                    onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                    placeholder="e.g. 30% OFF or THE TOUCH OF LOVE"
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.heroButtonText || ''}
                    onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                    placeholder="e.g. SHOP NOW"
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                    Action Button Destination URL
                  </label>
                  <input
                    type="text"
                    value={settings.heroLink || ''}
                    onChange={(e) => setSettings({ ...settings, heroLink: e.target.value })}
                    placeholder="e.g. /shop or /shop/couple-bracelets"
                    className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C]"
                  />
                </div>
              </div>

              {/* Replace Hero Image */}
              <div className="pt-2">
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                  Replace Hero Banner Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    id="replace-hero-file"
                    onChange={handleHeroUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="replace-hero-file"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-[#24332C] text-white text-xs uppercase tracking-wider hover:bg-[#19241F] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingHero ? 'Uploading Banner...' : 'Upload New Hero Image'}</span>
                  </label>
                  <span className="text-xs text-[#708579]">
                    Recommended size: 2400x900px or wide cinematic crop
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-[#E7E1D8]">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="bg-[#24332C] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {settingsSaving ? 'Saving Changes...' : 'Save & Publish Banners'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ALL ORDERS & FULFILLMENT TRACKING */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E1D8] shadow-xs overflow-hidden">
              <div className="p-4 bg-[#EFEAE2]/60 border-b border-[#E7E1D8] flex justify-between items-center">
                <span className="text-xs font-semibold text-[#181818] uppercase tracking-wider">
                  Customer Orders Registry ({orders.length})
                </span>
                <span className="text-[11px] text-[#708579]">
                  Click on any order to update shipping courier &amp; tracking number
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFEAE2] text-[#77736D] uppercase text-[10px] tracking-wider border-b border-[#E7E1D8]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tracking AWB</th>
                      <th className="py-3 px-4 text-right">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E1D8]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#EFEAE2]/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#181818]">
                          {ord.id}
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
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                              ord.status === 'PAID' || ord.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'SHIPPED'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'PAYMENT_SUBMITTED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-200 text-stone-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#77736D]">
                          {ord.trackingNumber ? (
                            <span className="text-[#24332C] font-semibold">
                              {ord.trackingCourier}: {ord.trackingNumber}
                            </span>
                          ) : (
                            'Pending Dispatch'
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setTrackingOrder(ord);
                              setTrackingStatus(ord.status);
                              setTrackingCourier(ord.trackingCourier || 'BlueDart Express');
                              setTrackingNumber(ord.trackingNumber || '');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D5E0D9] bg-[#FAF8F5] text-[#24332C] hover:bg-[#EEF3F0] transition-colors text-[11px] font-semibold cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#B89A69]" />
                            <span>Update Courier</span>
                          </button>
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
        {/* TAB 5: UPI & STORE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#E7E1D8] p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                PAYMENT INFRASTRUCTURE
              </span>
              <h3 className="font-serif text-2xl text-[#181818] font-light mt-1">
                Store Owner UPI &amp; Account Settings
              </h3>
              <p className="text-xs text-[#5C5852] mt-1 font-light leading-relaxed">
                Configure your official receiving UPI details and QR code displayed to customers during checkout.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>UPI configuration saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
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
                      unoptimized
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

              <div className="pt-4 border-t border-[#E7E1D8]">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="bg-[#24332C] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {settingsSaving ? 'Saving Configuration...' : 'Save UPI Settings'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: PRODUCT IMAGE MANAGER (EDIT / DELETE / ADD IMAGES) */}
      {/* ======================================================== */}
      {managingImagesProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E1D8] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-[#E7E1D8] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block">
                  Product Image Management
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#181818] font-light mt-0.5">
                  {managingImagesProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setManagingImagesProduct(null)}
                className="text-[#77736D] hover:text-[#181818] p-1 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {imageActionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{imageActionSuccess}</span>
              </div>
            )}

            {/* Current Images Gallery */}
            <div>
              <span className="text-xs uppercase tracking-wider text-[#181818] font-semibold block mb-3">
                Current Photographs ({managingImagesProduct.images.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {managingImagesProduct.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group border border-[#E7E1D8] bg-[#FAF8F5] p-2 space-y-2">
                    <div className="relative aspect-square w-full bg-white overflow-hidden">
                      <Image src={imgUrl} alt="Product view" fill unoptimized className="object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-[#24332C] text-white text-[9px] uppercase tracking-widest px-1.5 py-0.5 font-bold">
                          Cover
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {idx !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleSetCoverProductImage(idx)}
                          className="text-[10px] text-[#24332C] hover:underline font-semibold"
                        >
                          Make Cover
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#708579]">Primary</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteProductImage(idx)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete this photograph"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload or Add by URL */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E1D8] space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#181818] font-semibold block">
                Add New Photograph
              </span>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    id="add-product-image-file"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="add-product-image-file"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-[#24332C] text-white text-xs uppercase tracking-wider hover:bg-[#19241F] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingProductImage ? 'Uploading...' : 'Upload from Device'}</span>
                  </label>
                </div>

                <span className="text-xs text-[#708579] text-center sm:text-left">or add by URL:</span>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="https://... or /images/..."
                    className="flex-1 bg-white border border-[#E7E1D8] px-3 py-1.5 text-xs text-[#181818] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddProductImageUrl}
                    className="bg-[#181818] text-white px-3 py-1.5 text-xs uppercase font-medium hover:bg-black"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setManagingImagesProduct(null)}
                className="bg-[#24332C] text-white px-6 py-2.5 text-xs uppercase tracking-wider hover:bg-[#19241F]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ORDER FULFILLMENT & COURIER TRACKING */}
      {/* ======================================================== */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E1D8] max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E7E1D8] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#708579] font-medium block">
                  Shipment Dispatch
                </span>
                <h3 className="font-serif text-xl text-[#181818] font-light">
                  Order {trackingOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="text-[#77736D] hover:text-[#181818] text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                  Order Status
                </label>
                <select
                  value={trackingStatus}
                  onChange={(e) => setTrackingStatus(e.target.value as OrderStatus)}
                  className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3 py-2 text-xs text-[#181818] focus:outline-none"
                >
                  <option value="PAID">PAID</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING (Under Casting)</option>
                  <option value="SHIPPED">SHIPPED (In Transit)</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                  Courier Partner Name
                </label>
                <input
                  type="text"
                  value={trackingCourier}
                  onChange={(e) => setTrackingCourier(e.target.value)}
                  placeholder="e.g. BlueDart Express, Delhivery, DTDC Air"
                  className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3 py-2 text-xs text-[#181818] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                  Tracking Number / Air Waybill (AWB)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-894210"
                  className="w-full bg-[#FAF8F5] border border-[#E7E1D8] px-3 py-2 text-xs font-mono text-[#181818] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#E7E1D8]">
                <button
                  type="button"
                  onClick={() => setTrackingOrder(null)}
                  className="px-4 py-2 border border-[#E7E1D8] text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTracking}
                  className="bg-[#24332C] text-white px-5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#19241F]"
                >
                  {savingTracking ? 'Saving...' : 'Save Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: PAYMENT SCREENSHOT FULLSCREEN PREVIEW */}
      {/* ======================================================== */}
      {previewScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewScreenshot(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-white p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE5DE]">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#181818]">
                Customer Payment Receipt Screenshot
              </span>
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="text-[#77736D] hover:text-[#181818] text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <div className="relative aspect-3/4 max-h-[75vh] w-full bg-[#FAF8F5]">
              <Image
                src={previewScreenshot}
                alt="Payment Receipt"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: PAYMENT REJECTION REASON */}
      {/* ======================================================== */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E1D8] max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-xl text-red-900">
              Reject Payment &bull; {rejectingId}
            </h3>
            <p className="text-xs text-[#5C5852] leading-relaxed">
              Please enter the rejection reason. This reason will be displayed to the customer on their payment screen so they can rectify and re-submit:
            </p>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Credit not received in bank account / Amount mismatch / Incorrect screenshot"
              className="w-full bg-[#FAF8F5] border border-[#E7E1D8] p-3 text-xs text-[#181818] focus:outline-none focus:border-red-700"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 border border-[#E7E1D8] text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                className="bg-red-700 text-white px-5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-red-800"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
