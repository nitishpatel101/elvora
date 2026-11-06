import { NextResponse } from 'next/server';
import { getAllProducts, saveProduct } from '@/lib/db';
import { Product } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestseller');
    const search = searchParams.get('search');
    const admin = searchParams.get('admin');

    // Admin can view unpublished products too
    const products = await getAllProducts(admin === 'true');

    let filtered = products;

    if (category) {
      filtered = filtered.filter(
        (p) => p.categorySlug.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    if (bestSeller === 'true') {
      filtered = filtered.filter((p) => p.isBestSeller);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json(filtered);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required fields' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const newProduct: Product = {
      id: body.id || 'elv-' + Math.random().toString(36).substring(2, 9),
      slug,
      name: body.name,
      tagline: body.tagline || '',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      description: body.description || '',
      category: body.category,
      categorySlug:
        body.categorySlug ||
        body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      colours: body.colours || [],
      inStock: body.inStock !== false && (Number(body.stock) || 0) > 0,
      stock: Number(body.stock) || 0,
      isFeatured: Boolean(body.isFeatured),
      isBestSeller: Boolean(body.isBestSeller),
      isNewArrival: Boolean(body.isNewArrival),
      isPublished: body.isPublished !== false,
      images: body.images && body.images.length > 0 ? body.images : ['/images/products/touch-distance-bracelet/hero.jpg'],
      variants: body.variants || [],
      details: body.details || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProduct(newProduct);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

