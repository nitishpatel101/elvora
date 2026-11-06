-- ELVORA LUXURY JEWELLERY - SUPABASE SCHEMA & SECURITY POLICIES
-- Run this script in the Supabase SQL Editor if connecting a Supabase project.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PAYMENT_PENDING',
        'PAID',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= price),
    description TEXT NOT NULL,
    category VARCHAR(150) NOT NULL,
    category_slug VARCHAR(100) NOT NULL,
    colours TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT TRUE,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    images TEXT[] NOT NULL DEFAULT '{}',
    variants JSONB DEFAULT '[]'::jsonb,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. ELV-XXXXXX
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_charge NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status order_status DEFAULT 'PAYMENT_PENDING',
    payment_method VARCHAR(50) DEFAULT 'ONLINE',
    payment_gateway VARCHAR(50) DEFAULT 'RAZORPAY',
    payment_id VARCHAR(150),
    razorpay_order_id VARCHAR(150),
    tracking_number VARCHAR(100),
    tracking_courier VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SHIPPING SETTINGS TABLE
CREATE TABLE IF NOT EXISTS shipping_settings (
    id SERIAL PRIMARY KEY,
    domestic_shipping_inr NUMERIC(10,2) DEFAULT 99.00,
    international_shipping_inr NUMERIC(10,2) DEFAULT 1299.00,
    international_shipping_usd NUMERIC(10,2) DEFAULT 15.00,
    domestic_courier VARCHAR(150) DEFAULT 'Blue Dart Express & Delhivery Luxury Courier',
    international_courier VARCHAR(150) DEFAULT 'DHL Express International',
    domestic_estimated_days VARCHAR(50) DEFAULT '3 - 5 Business Days',
    international_estimated_days VARCHAR(50) DEFAULT '7 - 10 Business Days',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read published products
CREATE POLICY "Public can view published products"
    ON products FOR SELECT
    USING (is_published = true);

-- Products: Service role / Admin can do everything
CREATE POLICY "Admin full access to products"
    ON products FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Categories: Public read
CREATE POLICY "Public can view categories"
    ON categories FOR SELECT
    USING (true);

-- Orders: Customers can view only their own orders
CREATE POLICY "Customers can view their own orders"
    ON orders FOR SELECT
    USING (customer_id = auth.uid() OR customer_email = auth.jwt() ->> 'email');

-- Shipping settings: Public read
CREATE POLICY "Public can view shipping settings"
    ON shipping_settings FOR SELECT
    USING (true);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

