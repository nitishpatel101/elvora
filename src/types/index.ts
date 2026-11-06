export type Currency = 'INR' | 'USD';

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  priceModifier?: number;
  inStock: boolean;
  stock: number;
}

export interface ProductDetails {
  material?: string;
  finish?: string;
  dimensions?: string;
  weight?: string;
  chainType?: string;
  chainLength?: string;
  clasp?: string;
  waterResistance?: string;
  stone?: string;
  packaging?: string;
  care?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  price: number; // Stored in INR
  originalPrice?: number;
  description: string;
  category: string;
  categorySlug: string;
  colours: string[];
  inStock: boolean;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival?: boolean;
  isPublished: boolean;
  images: string[];
  variants?: ProductVariant[];
  details?: ProductDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
  selectedColour?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
  product: Product;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type OrderStatus =
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  priceAtPurchase: number;
  quantity: number;
  selectedVariant?: string;
  selectedColour?: string;
}

export interface Order {
  id: string; // e.g. ELV-89421
  customerId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  totalAmount: number;
  currency: Currency;
  status: OrderStatus;
  paymentMethod: 'ONLINE';
  paymentGateway: 'RAZORPAY';
  paymentId?: string;
  razorpayOrderId?: string;
  trackingNumber?: string;
  trackingCourier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
}

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: ShippingAddress[];
  createdAt: string;
}

