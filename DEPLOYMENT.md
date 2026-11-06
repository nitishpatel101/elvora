# ELVORA Haute Joaillerie — Production Deployment & Operator Guide

This document outlines the deployment, configuration, and administrative operation of the **ELVORA** luxury jewellery e-commerce platform.

---

## 1. System Architecture

- **Frontend & App Framework**: Next.js 15 (App Router, Turbopack, React 19, TypeScript)
- **Styling & Aesthetics**: Tailwind CSS v4 with custom luxury ivory/gold design tokens
- **Interactive 3D Engine**: Three.js, React Three Fiber, Drei (Client-side lazy-loaded, GPU-optimized with fallback)
- **State Management**: React Context (Currency persistence, Cart, Wishlist, Auth)
- **Database & Data Layer**: Dual-mode repository
  - **Local / Default**: File-backed persistent JSON database in `/data` for zero-configuration local runs
  - **Production**: Supabase PostgreSQL database with Row Level Security (RLS)
- **Payment Processing**: Razorpay API integration with HMAC-SHA256 signature verification & webhook idempotency. **Cash on Delivery (COD) is strictly prohibited.**
- **Deployment Target**: Vercel / Node.js production server

---

## 2. Environment Variables

Create `.env.local` or configure the following environment variables in your deployment dashboard (e.g., Vercel):

```env
# Application Host
NEXT_PUBLIC_APP_URL=https://elvora.com

# Executive Admin Authentication (Product Management Only)
ADMIN_EMAIL=admin@elvora.com
ADMIN_PASSWORD=elvora2026

# Payment Gateway (Razorpay Online Payments)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Database & Storage (Supabase PostgreSQL - Optional, activates cloud DB)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Note on Sandbox Mode**: When `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are not set or left blank, the application automatically runs in an interactive security sandbox. This allows testing the full end-to-end checkout flow and HMAC verification without executing real credit card debits.

---

## 3. Database Migration (Supabase PostgreSQL)

If you wish to use Supabase instead of the embedded local persistent engine:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run the SQL script.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your environment variables.
5. The application will automatically detect Supabase and route all product and order operations to your cloud PostgreSQL database.

---

## 4. Product-Only Admin Portal

The administrative portal is strictly designed for **Product Management** without extraneous CRM or marketing bloat.

### Accessing the Portal
- **URL**: `http://localhost:3000/admin/login` (or `https://your-domain.com/admin/login`)
- **Default Email**: `admin@elvora.com`
- **Default Passkey**: `elvora2026` (configurable via `ADMIN_PASSWORD` in `.env.local`)

### Capabilities
1. **Product Listing**: View all products with thumbnail, SKU slug, price, stock count, and live/draft status.
2. **Add New Creation** (`/admin/products/new`):
   - Upload multiple photographs from your computer or provide image URLs.
   - Specify name, tagline, selling price (INR), original price (for discount badge calculation), and category.
   - Enter specifications (materials, finish, clasp, presentation case).
   - Set stock count, featured toggle, and publication status.
   - **Immediate Sync**: Once saved, the piece appears dynamically across the shop page, category filters, and homepage without modifying code.
3. **Edit Product** (`/admin/products/[id]/edit`): Modify prices, stock counts, photographs, and descriptions at any time.
4. **Safe Deletion / Unpublishing**: Unpublishes the piece from public clients while preserving past order records.

---

## 5. Payment Security & COD Prohibition Rules

1. **No Cash on Delivery**: Cash on Delivery (COD) is strictly prohibited. There are no COD buttons or pay-later options.
2. **Paid Shipping**: Shipping is strictly paid. Free shipping is never granted by default.
   - Domestic Express (India): ₹99 INR
   - International Express: $15 USD / ₹1,299 INR
3. **Server-Side Price Validation**: Product prices are retrieved directly from the database during order initialization (`/api/payment/create-order`). Client-side price tampering is impossible.
4. **Cryptographic Signature Verification**: Payments must pass server-side HMAC-SHA256 signature verification (`/api/payment/verify`) before an order receives the `PAID` status.
5. **Idempotency Protection**: Duplicate payment webhooks or double-click payment confirmations are detected and safely deduplicated.

---

## 6. Currency System

- **Supported Currencies**: INR (₹) and USD ($).
- **Base Storage**: All product prices are stored in INR in the database.
- **Conversion**: Converted dynamically using reliable exchange rates with clean rounding.
- **Settlement Notice**: Checkout clearly informs international clients that displayed USD amounts are settled transparently in Indian Rupee gateway standard without undisclosed surcharges.

---

## 7. Running the Project Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build

# Start production server
npm start
```

Access the boutique at `http://localhost:3000`.

