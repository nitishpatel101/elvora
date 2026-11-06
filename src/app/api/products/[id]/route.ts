import { NextResponse } from 'next/server';
import { getProductById, saveProduct, deleteProduct } from '@/lib/db';
import { Product } from '@/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();

    const updated: Product = {
      ...existing,
      ...body,
      id: existing.id, // prevent altering the primary ID
      price: Number(body.price ?? existing.price),
      originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : undefined) : existing.originalPrice,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      inStock: body.inStock !== undefined ? body.inStock : (Number(body.stock ?? existing.stock) > 0),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProduct(updated);
    return NextResponse.json(saved);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true, message: 'Product unpublished and archived successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
