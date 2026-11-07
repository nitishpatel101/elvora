// Comprehensive Full System Audit for ELVORA
import assert from 'node:assert';

const BASE = 'http://localhost:3000';

async function runAudit() {
  console.log('=====================================================');
  console.log('   ELVORA COMPLETE SYSTEM & DEPLOYMENT READINESS AUDIT');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. STOREFRONT PAGES
  await check('Homepage (/) returns 200 and renders ELVORA branding', async () => {
    const res = await fetch(`${BASE}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('ELVORA'), 'Must contain ELVORA brand name');
  });

  await check('Shop Catalogue (/shop) returns 200 with all products', async () => {
    const res = await fetch(`${BASE}/shop`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('Touch Distance Couple Bracelet'));
  });

  await check('Category route (/shop/couple-bracelets) returns 200', async () => {
    const res = await fetch(`${BASE}/shop/couple-bracelets`);
    assert.strictEqual(res.status, 200);
  });

  await check('Individual Product page (/product/touch-distance-couple-bracelet) returns 200 and has Buy Now button', async () => {
    const res = await fetch(`${BASE}/product/touch-distance-couple-bracelet`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('Buy Now'), 'Must have Buy Now button text');
  });

  await check('Cart page (/cart) returns 200', async () => {
    const res = await fetch(`${BASE}/cart`);
    assert.strictEqual(res.status, 200);
  });

  await check('Checkout page (/checkout) returns 200', async () => {
    const res = await fetch(`${BASE}/checkout`);
    assert.strictEqual(res.status, 200);
  });

  await check('Track Order page (/track-order) returns 200', async () => {
    const res = await fetch(`${BASE}/track-order`);
    assert.strictEqual(res.status, 200);
  });

  await check('Wishlist page (/wishlist) returns 200', async () => {
    const res = await fetch(`${BASE}/wishlist`);
    assert.strictEqual(res.status, 200);
  });

  // 2. ADMIN PORTAL PAGES
  await check('Admin Login (/admin/login) returns 200', async () => {
    const res = await fetch(`${BASE}/admin/login`);
    assert.strictEqual(res.status, 200);
  });

  await check('Admin Dashboard (/admin) returns 200', async () => {
    const res = await fetch(`${BASE}/admin`);
    assert.strictEqual(res.status, 200);
  });

  await check('Admin New Product page (/admin/products/new) returns 200', async () => {
    const res = await fetch(`${BASE}/admin/products/new`);
    assert.strictEqual(res.status, 200);
  });

  // 3. BRAND & LEGAL PAGES
  const legalPages = ['/about', '/contact', '/shipping-policy', '/refund-policy', '/privacy-policy', '/terms'];
  for (const page of legalPages) {
    await check(`Legal/Brand page (${page}) returns 200`, async () => {
      const res = await fetch(`${BASE}${page}`);
      assert.strictEqual(res.status, 200);
    });
  }

  // 4. SEO & CRAWLERS
  await check('Robots.txt (/robots.txt) returns 200', async () => {
    const res = await fetch(`${BASE}/robots.txt`);
    assert.strictEqual(res.status, 200);
  });

  await check('Sitemap.xml (/sitemap.xml) returns 200', async () => {
    const res = await fetch(`${BASE}/sitemap.xml`);
    assert.strictEqual(res.status, 200);
  });

  // 5. APIS & LIFECYCLE
  await check('Products API returns all active items', async () => {
    const res = await fetch(`${BASE}/api/products`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data) && data.length >= 6);
  });

  await check('Settings API returns full store & UPI config', async () => {
    const res = await fetch(`${BASE}/api/settings`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.upiId && data.payeeName && data.upiQrImage);
  });

  await check('Dynamic uploads route returns 200 for uploaded image', async () => {
    const res = await fetch(`${BASE}/images/uploads/1794020845494_Connected_Moments_in_Paris.png`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'image/png');
  });

  // 6. COMPLETE ORDER & VERIFICATION LIFECYCLE
  let testOrderId = '';
  await check('Create order via UPI QR payment without requiring email', async () => {
    const res = await fetch(`${BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'elv-prod-01', quantity: 1 }],
        shippingAddress: {
          fullName: 'Kavita Iyer',
          phone: '+91 98111 22334',
          addressLine1: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          country: 'India',
        },
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.orderId.startsWith('ELV-'));
    testOrderId = data.orderId;
  });

  await check('Customer pay screen (/checkout/pay/[orderId]) loads 200 OK', async () => {
    const res = await fetch(`${BASE}/checkout/pay/${testOrderId}`);
    assert.strictEqual(res.status, 200);
  });

  await check('Customer submits payment screenshot -> moves to PAYMENT_SUBMITTED', async () => {
    const res = await fetch(`${BASE}/api/orders/${testOrderId}/submit-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        screenshotUrl: '/images/uploads/1794020845494_Connected_Moments_in_Paris.png',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'PAYMENT_SUBMITTED');
  });

  await check('Store admin verifies payment credit -> confirms order as PAID', async () => {
    const res = await fetch(`${BASE}/api/admin/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: testOrderId,
        verifiedBy: 'ELVORA Executive Admin',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'PAID');
  });

  await check('Store admin updates courier tracking info via PATCH', async () => {
    const res = await fetch(`${BASE}/api/orders/${testOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'SHIPPED',
        trackingCourier: 'BlueDart Air Express',
        trackingNumber: 'BLUEDART-894210',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'SHIPPED');
    assert.strictEqual(data.trackingNumber, 'BLUEDART-894210');
  });

  console.log(`\n=====================================================`);
  console.log(`   AUDIT FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=====================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch((e) => {
  console.error('Fatal audit error:', e);
  process.exit(1);
});
