import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, saveReview } from '@/lib/db';
import { Review } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = await getAllReviews(productId);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorName, city, rating, title, content, productId, productName } = body;

    if (!authorName || !content || !rating) {
      return NextResponse.json(
        { success: false, error: 'Author name, rating, and review content are required.' },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: productId || undefined,
      productName: productName || undefined,
      authorName: authorName.trim(),
      city: city?.trim() || 'Verified Customer',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      title: (title || 'Verified Purchase Review').trim(),
      content: content.trim(),
      verified: true,
      timeAgo: 'Just now',
      createdAt: new Date().toISOString(),
    };

    const saved = await saveReview(newReview);
    return NextResponse.json({ success: true, review: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post review' },
      { status: 500 }
    );
  }
}

