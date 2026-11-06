// ELVORA Luxury E-Commerce End-to-End Automated Test Suite
import assert from 'assert';

const BASE = 'http://localhost:3000';

console.log('--- STARTING ELVORA END-TO-END VALIDATION SUITE ---');

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // TEST 1: Homepage loads correctly
  await test('1. Homepage returns 200 OK with luxury meta and ELVORA brand', async () => {
    const res = await fetch(`${BASE}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('ELVORA'), 'HTML must contain brand name ELVORA');
    assert(html.includes('Haute Joaillerie') || html.includes('Luxury Jewellery') || html.includes('Fine Jewellery'), 'HTML must contain luxury positioning');
    assert(html.includes('application/ld+json'), 'Homepage must contain Schema.org JSON-LD');
  });

  // TEST 2: All six initial products are returned by database API
  await test('2. All six products loaded dynamically from database', async () => {
    const res = await fetch(`${BASE}/api/products`);
    assert.strictEqual(res.status, 200);
    const products = await res.json();
    assert(Array.isArray(products), 'Products must be an array');
    assert(products.length >= 6, `Expected at least 6 products, found ${products.length}`);
  });

  // TEST 3 & 4: Exact product names and exact specified prices
  await test('3 & 4. Verify exact initial catalog prices and specifications', async () => {
    const res = await fetch(`${BASE}/api/products`);
    const products = await res.json();

    const expected = [
      { name: 'Touch Distance Couple Bracelet', price: 1399, cat: 'Couple Bracelets' },
      { name: 'Beaded Couple Bracelet', price: 1699, cat: 'Couple Bracelets' },
      { name: 'Sun & Moon Chain Bracelet', price: 1199, cat: 'Couple Bracelets' },
      { name: 'Sun & Moon Rope Bracelet', price: 1299, cat: 'Couple Bracelets' },
      { name: 'Heart Sword Pendant Necklace', price: 499, cat: 'Necklaces' },
      { name: 'Golden Lantern Pearl Earrings', price: 399, cat: 'Earrings' },
    ];

    for (const exp of expected) {
      const match = products.find((p) => p.name === exp.name);
      assert(match, `Product "${exp.name}" must exist in catalog`);
      assert.strictEqual(match.price, exp.price, `Price for ${exp.name} must be ₹${exp.price}, got ₹${match.price}`);
      assert.strictEqual(match.category, exp.cat, `Category for ${exp.name} must be ${exp.cat}, got ${match.category}`);
      assert(match.images.length >= 3, `${exp.name} must have at least 3 high-res images`);
    }
  });

  // TEST 5: Verify product images exist on disk and serve 200 OK
  await test('5. Product images are served with 200 OK', async () => {
    const res = await fetch(`${BASE}/api/products`);
    const products = await res.json();
    for (const p of products) {
      for (const img of p.images) {
        const imgRes = await fetch(`${BASE}${img}`);
        assert.strictEqual(imgRes.status, 200, `Image ${img} returned HTTP ${imgRes.status}`);
      }
    }
  });

  // TEST 6: Search works
  await test('6. Search API filters products correctly', async () => {
    const res = await fetch(`${BASE}/api/products?search=Lantern`);
    const results = await res.json();
    assert(results.length >= 1, 'Search for "Lantern" must return Golden Lantern Pearl Earrings');
    assert.strictEqual(results[0].name, 'Golden Lantern Pearl Earrings');
  });

  // TEST 7: Category filter works
  await test('7. Category filtering works correctly', async () => {
    const res = await fetch(`${BASE}/api/products?category=necklaces`);
    const results = await res.json();
    assert(results.length >= 1, 'Category necklaces must return at least 1 piece');
    assert.strictEqual(results[0].category, 'Necklaces');
  });

  // TEST 8: Individual Product Detail page loads
  await test('8. Individual Product Details route loads dynamically', async () => {
    const res = await fetch(`${BASE}/product/touch-distance-couple-bracelet`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('Touch Distance Couple Bracelet'));
    assert(html.includes('1,399'));
  });

  // TEST 9: Checkout validates customer information
  await test('9. Checkout rejects incomplete delivery information', async () => {
    const res = await fetch(`${BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'elv-prod-01', quantity: 1 }],
        shippingAddress: { fullName: '' }, // Missing mandatory fields
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert(data.error, 'Must return error message for incomplete address');
  });

  // TEST 10: Server validates pricing and calculates paid shipping
  await test('10. Server calculates subtotal and strictly enforces paid shipping', async () => {
    const res = await fetch(`${BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'elv-prod-01', quantity: 1 }], // ₹1,399
        shippingAddress: {
          fullName: 'Ananya Birla',
          email: 'ananya@example.com',
          phone: '+91 99999 11111',
          addressLine1: 'Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400026',
          country: 'India',
        },
        currency: 'INR',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.orderId.startsWith('ELV-'), 'Must return unique ELV- order ID');
    assert.strictEqual(data.shippingCharge, 99, 'Domestic shipping must be paid ₹99');
    assert.strictEqual(data.amountInr, 1399 + 99, 'Total payable must be ₹1,498');
  });

  // TEST 11: Payment verification security (failed signature does NOT confirm order)
  await test('11. Fraudulent/invalid payment signature is rejected', async () => {
    // Create an order first
    const createRes = await fetch(`${BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'elv-prod-06', quantity: 1 }],
        shippingAddress: {
          fullName: 'Test Client',
          email: 'test@example.com',
          phone: '+91 99999 22222',
          addressLine1: 'Marine Drive',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400020',
          country: 'India',
        },
      }),
    });
    const orderData = await createRes.json();

    // Attempt verification with invalid signature
    const verifyRes = await fetch(`${BASE}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData.orderId,
        razorpayOrderId: orderData.gatewayOrderId,
        razorpayPaymentId: 'pay_fraud123',
        razorpaySignature: 'bad_sig', // Invalid signature
      }),
    });

    assert.strictEqual(verifyRes.status, 403, 'Must return 403 Forbidden for bad signature');
  });

  // TEST 12: Successful verified payment confirms order as PAID
  await test('12. Cryptographically valid payment confirms order as PAID', async () => {
    const createRes = await fetch(`${BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'elv-prod-05', quantity: 1 }], // ₹499
        shippingAddress: {
          fullName: 'Siddharth Roy',
          email: 'siddharth@example.com',
          phone: '+91 98888 33333',
          addressLine1: 'Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500033',
          country: 'India',
        },
      }),
    });
    const orderData = await createRes.json();

    const verifyRes = await fetch(`${BASE}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData.orderId,
        razorpayOrderId: orderData.gatewayOrderId,
        razorpayPaymentId: 'pay_valid_' + Date.now(),
        razorpaySignature: 'sig_test_valid_cryptographic_signature_token_32chars',
      }),
    });

    assert.strictEqual(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.status, 'PAID', 'Verified order must have PAID status');

    // Retrieve order to confirm state in repository
    const getRes = await fetch(`${BASE}/api/orders/${orderData.orderId}`);
    const confirmedOrder = await getRes.json();
    assert.strictEqual(confirmedOrder.status, 'PAID');
    assert.strictEqual(confirmedOrder.paymentMethod, 'ONLINE');
  });

  // TEST 13: Duplicate payment protection (Idempotency)
  await test('13. Duplicate payment callbacks do not create duplicate orders', async () => {
    const createRes = await fetch(`${BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'elv-prod-06', quantity: 1 }],
        shippingAddress: {
          fullName: 'Kavita Das',
          email: 'kavita@example.com',
          phone: '+91 97777 44444',
          addressLine1: 'Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          country: 'India',
        },
      }),
    });
    const orderData = await createRes.json();

    const paymentId = 'pay_dup_test_' + Date.now();
    const payload = {
      orderId: orderData.orderId,
      razorpayOrderId: orderData.gatewayOrderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: 'sig_test_valid_cryptographic_signature_token_32chars',
    };

    // First call
    const res1 = await fetch(`${BASE}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data1 = await res1.json();
    assert.strictEqual(data1.status, 'PAID');

    // Second duplicate call with exact same payment ID
    const res2 = await fetch(`${BASE}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data2 = await res2.json();
    assert(data2.alreadyProcessed, 'Duplicate callback must report alreadyProcessed');
  });

  // TEST 14: Admin Authentication
  await test('14. Admin authentication succeeds with valid passkey', async () => {
    const res = await fetch(`${BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@elvora.com', password: 'elvora2026' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.admin.role, 'super_admin');
  });

  // TEST 15: Admin can add a new product dynamically without editing code
  let createdProductId = '';
  await test('15. Admin can add a new product dynamically to database', async () => {
    const newProductPayload = {
      name: 'Aurora Borealis Opal Choker',
      tagline: 'Iridescent Australian opal encased in 18K champagne gold',
      price: 2499,
      originalPrice: 3199,
      description: 'An ethereal choker necklace featuring genuine fire opal with celestial iridescence.',
      category: 'Necklaces',
      colours: ['Gold', 'Opal'],
      stock: 20,
      isFeatured: true,
      isPublished: true,
      images: ['/images/products/heart-sword-pendant-necklace/hero.jpg'],
    };

    const res = await fetch(`${BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductPayload),
    });

    assert.strictEqual(res.status, 201);
    const saved = await res.json();
    assert(saved.id, 'Must return created product ID');
    createdProductId = saved.id;
    assert.strictEqual(saved.name, 'Aurora Borealis Opal Choker');
  });

  // TEST 16: New product appears automatically on shop and category
  await test('16. Dynamically created product appears immediately in shop catalogue', async () => {
    const res = await fetch(`${BASE}/api/products`);
    const products = await res.json();
    const found = products.find((p) => p.name === 'Aurora Borealis Opal Choker');
    assert(found, 'New product must appear in catalogue automatically');
    assert.strictEqual(found.price, 2499);
  });

  // TEST 17: Admin can edit a product
  await test('17. Admin can edit product price and stock dynamically', async () => {
    assert(createdProductId, 'Must have created product ID from previous step');
    const updateRes = await fetch(`${BASE}/api/products/${createdProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: 2299, // Updated price
        stock: 18,
      }),
    });
    assert.strictEqual(updateRes.status, 200);
    const updated = await updateRes.json();
    assert.strictEqual(updated.price, 2299);
    assert.strictEqual(updated.stock, 18);
  });

  // TEST 18: Admin can delete/unpublish product safely
  await test('18. Admin safe deletion archives product without breaking database', async () => {
    assert(createdProductId);
    const delRes = await fetch(`${BASE}/api/products/${createdProductId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(delRes.status, 200);

    // Verify it is unpublished for public clients
    const publicRes = await fetch(`${BASE}/api/products`);
    const publicProducts = await publicRes.json();
    const found = publicProducts.find((p) => p.id === createdProductId);
    assert(!found, 'Unpublished product must not appear to public buyers');

    // Clean up temporary test product from file storage
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const productsPath = path.resolve('data/products.json');
      const raw = await fs.readFile(productsPath, 'utf-8');
      const all = JSON.parse(raw);
      const cleaned = all.filter((p) => p.id !== createdProductId);
      await fs.writeFile(productsPath, JSON.stringify(cleaned, null, 2), 'utf-8');
    } catch (e) {
      // Ignored if file cleanup not supported in environment
    }
  });

  // TEST 19: All 23 Pages return HTTP 200
  await test('19. All required pages return HTTP 200 OK', async () => {
    const pages = [
      '/',
      '/shop',
      '/shop/couple-bracelets',
      '/shop/necklaces',
      '/shop/earrings',
      '/product/touch-distance-couple-bracelet',
      '/wishlist',
      '/cart',
      '/checkout',
      '/checkout/success',
      '/checkout/failure',
      '/auth/login',
      '/auth/register',
      '/account',
      '/account/orders',
      '/track-order',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms',
      '/shipping-policy',
      '/refund-policy',
      '/admin/login',
      '/sitemap.xml',
      '/robots.txt',
    ];

    for (const page of pages) {
      const res = await fetch(`${BASE}${page}`);
      assert.strictEqual(res.status, 200, `Page ${page} returned status ${res.status}`);
    }
  });

  console.log(`\n--- TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal error in test suite:', e);
  process.exit(1);
});

