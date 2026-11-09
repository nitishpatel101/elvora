'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import CustomerReviewsSection from '@/components/reviews/CustomerReviewsSection';
import {
  ShoppingBag,
  Zap,
  Truck,
  Sparkles,
  ChevronDown,
  Star,
  Heart,
  X,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.953.562 3.828 1.625 5.438L2 22l4.672-1.625A9.97 9.97 0 0 0 12.031 22C17.562 22 22 17.531 22 12.031 22 6.5 17.531 2 12.031 2zm5.781 14.156c-.25.688-1.406 1.344-1.969 1.406-.531.063-1.188.094-1.906-.156-.469-.156-1.063-.375-1.844-.719-3.25-1.406-5.375-4.688-5.531-4.906-.156-.219-1.281-1.719-1.281-3.281 0-1.563.813-2.313 1.094-2.625.281-.313.625-.406.844-.406.219 0 .438 0 .625.031.219.031.469-.063.719.563.281.688.938 2.281 1.031 2.469.094.188.156.406.031.625-.094.219-.188.344-.344.531-.156.188-.344.406-.469.563-.156.156-.313.344-.125.656.188.313.844 1.375 1.813 2.25 1.25 1.125 2.313 1.469 2.625 1.625.313.156.5.125.688-.094.188-.219.813-.938 1.031-1.281.219-.344.438-.281.719-.188.281.094 1.813.844 2.125 1 .313.156.531.25.625.375.094.125.094.75-.156 1.438z" />
  </svg>
);

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.name || 'Standard'
  );
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [showIncentive, setShowIncentive] = useState(true);

  // Direct Address & Express Checkout Modal State (No Cart)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);

  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Coupon Code State (LOVE300 = Flat ₹300 OFF)
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('LOVE300'); // Auto-applied by default for user delight!
  const [couponError, setCouponError] = useState<string | null>(null);

  const couponDiscount = appliedCoupon ? 300 : 0;
  const payablePrice = Math.max(0, product.price - couponDiscount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const valid = ['LOVE300', 'ELVORA300', 'SAVE300'];
    if (valid.includes(code)) {
      setAppliedCoupon(code);
      setCouponCode(code);
      setCouponError(null);
    } else {
      setCouponError('Invalid code. Use "LOVE300" for Flat ₹300 OFF.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const inWish = isInWishlist(product.id);

  const savingsAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariant);
    router.push('/cart');
  };

  const handleBuyNow = () => {
    setAddressError(null);
    if (whatsappPhone && !addressData.phone) {
      setAddressData((prev) => ({ ...prev, phone: whatsappPhone }));
    }
    setIsAddressModalOpen(true);
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setAddressData((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      setIsLookingUpPin(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setAddressData((prev) => ({
            ...prev,
            city: po.District || po.Block || prev.city,
            state: po.State || prev.state,
          }));
        }
      } catch {
        // Fallback to manual entry
      } finally {
        setIsLookingUpPin(false);
      }
    }
  };

  const handleDirectAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    const cleanPhone = addressData.phone.replace(/\D/g, '');
    if (!addressData.fullName.trim()) {
      setAddressError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setAddressError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!addressData.addressLine1.trim()) {
      setAddressError('Please enter your street/house/flat address.');
      return;
    }
    if (!addressData.pincode.trim() || addressData.pincode.length < 6) {
      setAddressError('Please enter a valid 6-digit delivery PIN code.');
      return;
    }
    if (!addressData.city.trim()) {
      setAddressError('Please enter your city.');
      return;
    }
    if (!addressData.state.trim()) {
      setAddressError('Please enter your state.');
      return;
    }

    setAddressLoading(true);

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              quantity: 1,
              selectedVariant: selectedVariant,
              selectedColour: product.colours?.[0] || 'Default',
            },
          ],
          shippingAddress: {
            fullName: addressData.fullName.trim(),
            phone: cleanPhone,
            email: addressData.email.trim() || `${cleanPhone}@customer.elvora.com`,
            addressLine1: addressData.addressLine1.trim(),
            addressLine2: addressData.addressLine2.trim(),
            city: addressData.city.trim(),
            state: addressData.state.trim(),
            pincode: addressData.pincode.trim(),
            country: 'India',
          },
          couponCode: appliedCoupon || undefined,
          discount: couponDiscount,
          currency: 'INR',
          paymentMethod: 'UPI_QR',
          paymentGateway: 'MANUAL_UPI',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.orderId) {
        throw new Error(data.error || 'Failed to initialize order');
      }

      // Navigate directly to the dedicated UPI QR payment screen
      router.push(`/checkout/pay/${data.orderId}`);
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : 'Error creating order. Please try again.');
      setAddressLoading(false);
    }
  };

  const whatsappOrderUrl = `https://wa.me/916386645203?text=Hi%20ELVORA,%20I%20want%20to%20order%20*${encodeURIComponent(
    product.name
  )}*%20(${selectedVariant})%20priced%20at%20₹${product.price}.`;

  return (
    <div className="space-y-16">
      {/* Primary 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Gallery Column */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Purchase & Information Column (Giftify D2C Style) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand Tag */}
            <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold block">
              ELVORA
            </span>

            {/* Product Title with Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h1>
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
                className="p-2.5 rounded-full border border-stone-200 hover:border-black shrink-0 transition-colors shadow-2xs"
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-red-500 text-red-500' : 'text-stone-700 stroke-[1.6]'}`} />
              </button>
            </div>

            {/* Price Row matching Giftify */}
            <div className="flex items-baseline gap-3 pt-1">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base sm:text-lg text-stone-400 line-through font-normal">
                  Rs. {product.originalPrice.toLocaleString('en-IN')}.00
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Rs. {product.price.toLocaleString('en-IN')}.00
              </span>
              {savingsAmount > 0 && (
                <span className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sale
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 font-normal">
              Shipping calculated at checkout.
            </p>

            {/* Reviews Stars & Live Viewers */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#F5C400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-[#F5C400]" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-700">
                  44 reviews
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>🔥 29 people viewing right now</span>
              </div>
            </div>

            {/* Expected Delivery & Countdown */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <Truck className="w-4 h-4 text-[#F5C400]" />
                <span>Expected Delivery: 3-5 Business Days across India</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <span>⚡</span>
                <span>Order within <strong>03h 24m</strong> for Dispatch Tomorrow!</span>
              </p>
            </div>

            {/* Variant Pill Selectors matching Giftify frame 025 & 030 */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-4 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  Select Model / Variant:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.name)}
                      className={`text-xs px-4 py-2 rounded-full font-semibold transition-all ${
                        selectedVariant === v.name
                          ? 'bg-black text-white shadow-md'
                          : 'bg-white text-stone-800 border border-stone-300 hover:border-black'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Updates Input */}
            <div className="pt-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Whatsapp Number For Order Updates
              </label>
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden focus-within:border-black bg-stone-50">
                <span className="px-3 text-xs text-stone-500 font-mono">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full text-xs py-2.5 pr-3 bg-transparent focus:outline-none text-stone-900"
                />
              </div>
            </div>

            {/* Floating Incentive Pill */}
            {showIncentive && savingsAmount > 0 && (
              <div className="bg-stone-900 text-white rounded-full px-4 py-2 flex items-center justify-between text-xs font-medium shadow-lg animate-fade-in">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5C400]" />
                  Save ₹{savingsAmount.toLocaleString('en-IN')}.00 off the original price
                </span>
                <button
                  onClick={() => setShowIncentive(false)}
                  className="text-stone-400 hover:text-white ml-2 text-sm"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Action Buttons: Buy Now & Order on WhatsApp */}
            <div className="pt-4 space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-[#111111] hover:bg-black text-white py-3.5 px-6 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-[#F5C400]" />
                <span>Buy Now &bull; ₹{product.price.toLocaleString('en-IN')}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-800 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">Order on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quote / Highlight from Frame 026 */}
            <div className="pt-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                Engraved with Jane Austen&apos;s quote, <span className="font-semibold text-stone-900">&ldquo;My heart is, and always will be yours&rdquo;</span> on the backside.
              </p>
            </div>

            {/* Product Details & Care Accordion */}
            <div className="pt-4 divide-y divide-stone-200 text-xs">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                className="w-full py-3 flex items-center justify-between text-left font-bold text-stone-900"
              >
                <span>Product Specifications</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'details' && (
                <div className="py-3 text-stone-600 space-y-2 leading-relaxed">
                  <p>{product.description}</p>
                  {product.details && Object.entries(product.details).map(([k, v]) => (
                    <p key={k}>
                      <strong className="capitalize text-stone-800">{k}:</strong> {v}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Customer Reviews & Stories */}
      <CustomerReviewsSection
        productId={product.id}
        productName={product.name}
      />

      {/* Related Products Recommendation Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-stone-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#F5C400] font-bold block">
              MORE GIFTING IDEAS
            </span>
            <h2 className="text-2xl sm:text-3xl text-stone-900 font-extrabold mt-1">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* Floating Gift Assistant / Save Incentive Pill (Giftify Frame 036) */}
      {showIncentive && savingsAmount > 0 && (
        <div className="fixed bottom-6 right-4 sm:right-8 z-40 flex flex-col items-end gap-2 animate-bounce-subtle pointer-events-auto">
          {/* Question bubble */}
          <div className="bg-stone-900 text-white text-[11px] sm:text-xs font-semibold py-1.5 px-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-1.5">
            <span>💭</span>
            <span>Is this a good gift for anniversaries?</span>
          </div>

          {/* Action pill */}
          <div className="bg-white text-stone-900 border border-stone-200 rounded-full pl-3 pr-2 py-1.5 shadow-2xl flex items-center gap-2 text-xs font-extrabold hover:border-[#F5C400] transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#111111] text-[#F5C400] flex items-center justify-center text-[10px]">
              ✨
            </span>
            <span>Save ₹{savingsAmount.toLocaleString('en-IN')}.00 off original price</span>
            <button
              onClick={() => setShowIncentive(false)}
              className="text-stone-400 hover:text-black p-1 text-sm leading-none ml-1 cursor-pointer"
              aria-label="Dismiss incentive"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Sticky Mobile Buy Now Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-11 h-11 bg-white border border-stone-200 rounded-lg overflow-hidden shrink-0">
            <Image
              src={product.images[0] || '/images/giftify/products/touch-vibration-bracelet.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">
              {product.name}
            </h4>
            <span className="text-xs font-extrabold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="bg-black text-white py-2.5 px-5 rounded-lg text-xs uppercase font-bold shrink-0 shadow active:scale-95 flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-[#F5C400]" />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Direct Express Order & Delivery Address Modal (Instant Checkout, No Cart) */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => !addressLoading && setIsAddressModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#111111] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F5C400]/20 flex items-center justify-center text-[#F5C400]">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide uppercase">
                    Delivery Address
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    Instant Checkout &bull; Free Express Delivery across India
                  </p>
                </div>
              </div>

              <button
                onClick={() => !addressLoading && setIsAddressModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary Mini Card */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                <Image
                  src={product.images[0] || '/images/giftify/products/touch-vibration-bracelet.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-semibold text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded-md truncate">
                    {selectedVariant}
                  </span>
                  <span className="text-xs font-extrabold text-stone-900">
                    ₹{product.price.toLocaleString('en-IN')}.00
                  </span>
                </div>
                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <span>✓</span> Free Express Delivery Across India (3-5 Days)
                </p>
              </div>
            </div>

            {/* Address Form */}
            <form onSubmit={handleDirectAddressSubmit} className="p-5 space-y-3.5 max-h-[68vh] overflow-y-auto">
              {addressError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={addressData.fullName}
                  onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-black focus:outline-none bg-stone-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden focus-within:border-black bg-stone-50/50">
                    <span className="px-3 text-xs text-stone-500 font-mono font-medium">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit number"
                      className="w-full text-xs py-2.5 pr-3 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={addressData.email}
                    onChange={(e) => setAddressData({ ...addressData, email: e.target.value })}
                    placeholder="For order receipt"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-black focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  House / Flat No. & Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressData.addressLine1}
                  onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                  placeholder="Flat 402, Building Name, MG Road"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-black focus:outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Area / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressData.addressLine2}
                  onChange={(e) => setAddressData({ ...addressData, addressLine2: e.target.value })}
                  placeholder="Near City Mall, Sector 15"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-black focus:outline-none bg-stone-50/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    PIN Code * {isLookingUpPin && <span className="text-[9px] text-[#F5C400]">⏳</span>}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressData.pincode}
                    onChange={handlePincodeChange}
                    placeholder="PIN Code"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:border-black focus:outline-none bg-stone-50/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    placeholder="City"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:border-black focus:outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.state}
                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                    placeholder="State"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:border-black focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Coupon Code Section: Flat ₹300 OFF */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#F5C400]" />
                    Coupon Code (Flat ₹300 OFF)
                  </span>
                  {appliedCoupon && (
                    <span className="text-[11px] font-extrabold text-emerald-700">
                      -₹300.00 SAVED
                    </span>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span className="font-mono font-bold text-emerald-800">
                        {appliedCoupon}
                      </span>
                      <span className="text-emerald-700 font-medium">applied (-₹300)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-stone-400 hover:text-red-600 text-xs font-bold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        placeholder="Enter coupon code (e.g. LOVE300)"
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300 focus:border-black focus:outline-none uppercase font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-800 active:scale-95 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick 1-Click Apply */}
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('LOVE300')}
                      className="mt-2 text-[11px] text-stone-700 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-lg px-2.5 py-1 flex items-center gap-1.5 transition-colors text-left cursor-pointer"
                    >
                      <span>🏷️</span>
                      <span>Tap to apply <strong className="text-stone-900 font-bold">LOVE300</strong> for Flat ₹300 OFF!</span>
                    </button>

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium mt-1">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-3 bg-stone-100/70 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Product Price:</span>
                  <span>Rs. {product.price.toLocaleString('en-IN')}.00</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon}):</span>
                    <span>- Rs. 300.00</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Express Delivery:</span>
                  <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Payable:</span>
                  <span className="text-base text-stone-950 font-black">
                    Rs. {payablePrice.toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>

              {/* Payment Guarantee Notice */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Instant UPI QR Payment
                  </span>
                  <span className="text-emerald-700 text-[11px] uppercase tracking-wider font-extrabold">
                    100% Verified
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Google Pay, PhonePe, Paytm, BHIM, UPI ID & Cards supported with instant order confirmation.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="w-full bg-[#111111] hover:bg-black text-white py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 disabled:opacity-60 cursor-pointer"
                >
                  {addressLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F5C400]" />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#F5C400]" />
                      <span>Proceed to Pay ₹{payablePrice.toLocaleString('en-IN')} (UPI / QR)</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-stone-400 text-center mt-2">
                  🔒 Encrypted connection &bull; Free express delivery &bull; No cart required
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
