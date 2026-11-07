import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { Product, Order, Category, StoreSettings, Review } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured && supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const STORE_SETTINGS_FILE = path.join(DATA_DIR, 'store-settings.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const HERO_SLIDES_FILE = path.join(DATA_DIR, 'hero_slides.json');
const STORIES_FILE = path.join(DATA_DIR, 'stories.json');
const OCCASIONS_FILE = path.join(DATA_DIR, 'occasions.json');

// Memory cache fallback for serverless deployments
const inMemoryStore = new Map<string, string>();

export async function safeReadFile(primaryPath: string): Promise<string> {
  const filename = path.basename(primaryPath);
  if (inMemoryStore.has(filename)) {
    return inMemoryStore.get(filename)!;
  }

  // Try /tmp directory first (serverless runtime persistence)
  try {
    const tmpPath = path.join('/tmp', filename);
    const data = await fs.readFile(tmpPath, 'utf-8');
    if (data) {
      inMemoryStore.set(filename, data);
      return data;
    }
  } catch {}

  const raw = await fs.readFile(primaryPath, 'utf-8');
  inMemoryStore.set(filename, raw);
  return raw;
}

export async function safeWriteFile(primaryPath: string, content: string): Promise<void> {
  const filename = path.basename(primaryPath);
  inMemoryStore.set(filename, content);

  try {
    await fs.writeFile(primaryPath, content, 'utf-8');
  } catch {
    // If running in read-only serverless environment (e.g. Vercel)
    try {
      const tmpPath = path.join('/tmp', filename);
      await fs.writeFile(tmpPath, content, 'utf-8');
    } catch {
      // Memory store is already updated as fallback
    }
  }
}

// --- PRODUCT REPOSITORY ---

export async function getAllProducts(includeUnpublished = false): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('products').select('*');
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) {
      return data.map(mapSupabaseProductToModel);
    }
  }

  // Fallback to local persistent JSON store
  try {
    const raw = await safeReadFile(PRODUCTS_FILE);
    const products: Product[] = JSON.parse(raw);
    if (includeUnpublished) return products;
    return products.filter((p) => p.isPublished);
  } catch (err) {
    console.error('Failed to read products file:', err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!error && data) return mapSupabaseProductToModel(data);
  }

  const products = await getAllProducts(true);
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) return mapSupabaseProductToModel(data);
  }

  const products = await getAllProducts(true);
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  if (isSupabaseConfigured && supabase) {
    const dbPayload = mapModelToSupabaseProduct(product);
    const { data, error } = await supabase
      .from('products')
      .upsert(dbPayload)
      .select()
      .single();
    if (error) {
      console.error('Supabase upsert error:', error);
      throw new Error(error.message);
    }
    return mapSupabaseProductToModel(data);
  }

  // Persistent JSON Store
  const raw = await safeReadFile(PRODUCTS_FILE);
  const products: Product[] = JSON.parse(raw);
  const existingIdx = products.findIndex((p) => p.id === product.id);

  if (existingIdx >= 0) {
    products[existingIdx] = { ...product, updatedAt: new Date().toISOString() };
  } else {
    products.unshift({
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await safeWriteFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    // Soft delete to protect historical order integrity
    const { error } = await supabase
      .from('products')
      .update({ is_published: false })
      .eq('id', id);
    return !error;
  }

  const raw = await safeReadFile(PRODUCTS_FILE);
  const products: Product[] = JSON.parse(raw);
  // Soft-delete or filter out if no orders reference it
  const updatedProducts = products.map((p) => (p.id === id ? { ...p, isPublished: false } : p));
  await safeWriteFile(PRODUCTS_FILE, JSON.stringify(updatedProducts, null, 2));
  return true;
}

// --- ORDER REPOSITORY ---

export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return data.map(mapSupabaseOrderToModel);
    }
  }

  try {
    const raw = await safeReadFile(ORDERS_FILE);
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function saveOrder(order: Order): Promise<Order> {
  if (isSupabaseConfigured && supabase) {
    const dbPayload = mapModelToSupabaseOrder(order);
    const { data, error } = await supabase
      .from('orders')
      .upsert(dbPayload)
      .select()
      .single();
    if (error) {
      console.error('Supabase saveOrder error:', error);
      throw new Error(error.message);
    }
    return mapSupabaseOrderToModel(data);
  }

  const orders = await getAllOrders();
  const existingIdx = orders.findIndex((o) => o.id === order.id);
  if (existingIdx >= 0) {
    orders[existingIdx] = { ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.unshift(order);
  }
  await safeWriteFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  return order;
}

// --- CATEGORIES ---

export async function getCategories(): Promise<Category[]> {
  try {
    const raw = await safeReadFile(CATEGORIES_FILE);
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// --- STORE SETTINGS ---

export async function getStoreSettings(): Promise<StoreSettings> {
  const defaultSettings: StoreSettings = {
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
    supportPhone: '+91 63866 45203',
    upiId: 'elvora@upi',
    payeeName: 'ELVORA Luxury Jewels',
    upiQrImage: '/images/qr/upi-qr.jpg',
  };

  try {
    const raw = await safeReadFile(STORE_SETTINGS_FILE);
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export async function saveStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated: StoreSettings = { ...current, ...settings };
  await safeWriteFile(STORE_SETTINGS_FILE, JSON.stringify(updated, null, 2));
  return updated;
}

// --- HELPER MAPPERS ---
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapSupabaseProductToModel(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    description: p.description,
    category: p.category,
    categorySlug: p.category_slug,
    colours: p.colours || [],
    inStock: p.in_stock,
    stock: p.stock,
    isFeatured: p.is_featured,
    isBestSeller: p.is_best_seller,
    isNewArrival: p.is_new_arrival,
    isPublished: p.is_published,
    images: p.images || [],
    variants: p.variants || [],
    details: p.details || {},
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

function mapModelToSupabaseProduct(p: Product): any {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    original_price: p.originalPrice || null,
    description: p.description,
    category: p.category,
    category_slug: p.categorySlug,
    colours: p.colours,
    in_stock: p.inStock,
    stock: p.stock,
    is_featured: p.isFeatured,
    is_best_seller: p.isBestSeller,
    is_new_arrival: p.isNewArrival || false,
    is_published: p.isPublished,
    images: p.images,
    variants: p.variants || [],
    details: p.details || {},
    updated_at: new Date().toISOString(),
  };
}


function mapSupabaseOrderToModel(o: any): Order {
  return {
    id: o.id,
    customerId: o.customer_id,
    customerEmail: o.customer_email,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    shippingAddress: o.shipping_address,
    items: o.items,
    subtotal: Number(o.subtotal),
    shippingCharge: Number(o.shipping_charge),
    discount: Number(o.discount || 0),
    totalAmount: Number(o.total_amount),
    currency: o.currency,
    status: o.status,
    paymentMethod: o.payment_method || 'UPI_QR',
    paymentGateway: o.payment_gateway || 'MANUAL_UPI',
    paymentId: o.payment_id,
    razorpayOrderId: o.razorpay_order_id,
    upiUtr: o.upi_utr,
    upiScreenshot: o.upi_screenshot,
    paymentSubmittedAt: o.payment_submitted_at,
    verifiedBy: o.verified_by,
    verifiedAt: o.verified_at,
    rejectionReason: o.rejection_reason,
    trackingNumber: o.tracking_number,
    trackingCourier: o.tracking_courier,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}

function mapModelToSupabaseOrder(o: Order): any {
  return {
    id: o.id,
    customer_id: o.customerId || null,
    customer_email: o.customerEmail,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    shipping_address: o.shippingAddress,
    items: o.items,
    subtotal: o.subtotal,
    shipping_charge: o.shippingCharge,
    discount: o.discount,
    total_amount: o.totalAmount,
    currency: o.currency,
    status: o.status,
    payment_method: o.paymentMethod,
    payment_gateway: o.paymentGateway,
    payment_id: o.paymentId || null,
    razorpay_order_id: o.razorpayOrderId || null,
    upi_utr: o.upiUtr || null,
    upi_screenshot: o.upiScreenshot || null,
    payment_submitted_at: o.paymentSubmittedAt || null,
    verified_by: o.verifiedBy || null,
    verified_at: o.verifiedAt || null,
    rejection_reason: o.rejectionReason || null,
    tracking_number: o.trackingNumber || null,
    tracking_courier: o.trackingCourier || null,
    updated_at: new Date().toISOString(),
  };
}

export async function getAllReviews(productId?: string): Promise<Review[]> {
  try {
    const raw = await safeReadFile(REVIEWS_FILE);
    const reviews: Review[] = JSON.parse(raw);
    if (productId) {
      return reviews.filter(r => !r.productId || r.productId === productId);
    }
    return reviews;
  } catch (err) {
    console.error('Failed to read reviews:', err);
    return [];
  }
}

export async function saveReview(newReview: Review): Promise<Review> {
  const reviews = await getAllReviews();
  const updated = [newReview, ...reviews];
  await safeWriteFile(REVIEWS_FILE, JSON.stringify(updated, null, 2));
  return newReview;
}

// --- HERO CAROUSEL SLIDES REPOSITORY ---

export async function getHeroSlides(): Promise<any[]> {
  try {
    const raw = await safeReadFile(HERO_SLIDES_FILE);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read hero slides:', err);
  }
  try {
    const fallbackRaw = await fs.readFile(HERO_SLIDES_FILE, 'utf-8');
    return JSON.parse(fallbackRaw);
  } catch {
    return [];
  }
}

export async function saveHeroSlides(slides: any[]): Promise<any[]> {
  await safeWriteFile(HERO_SLIDES_FILE, JSON.stringify(slides, null, 2));
  return slides;
}

// --- STORY CIRCLES REPOSITORY ---

export async function getStories(): Promise<any[]> {
  try {
    const raw = await safeReadFile(STORIES_FILE);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read stories:', err);
    return [];
  }
}

export async function saveStories(stories: any[]): Promise<any[]> {
  await safeWriteFile(STORIES_FILE, JSON.stringify(stories, null, 2));
  return stories;
}

// --- OCCASIONS REPOSITORY ---

export async function getOccasions(): Promise<any[]> {
  try {
    const raw = await safeReadFile(OCCASIONS_FILE);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read occasions:', err);
    return [];
  }
}

export async function saveOccasions(occasions: any[]): Promise<any[]> {
  await safeWriteFile(OCCASIONS_FILE, JSON.stringify(occasions, null, 2));
  return occasions;
}



