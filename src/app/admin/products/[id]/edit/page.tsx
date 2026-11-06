'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isAdminLoggedIn } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
      return;
    }

    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setProduct(data);
        }
      })
      .finally(() => setLoading(false));
  }, [id, isAdminLoggedIn, router]);

  if (!isAdminLoggedIn) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] py-20 text-center text-xs text-[#77736D]">
        Retrieving product dossier...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#171717]">Product not found</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-xs uppercase tracking-wider text-[#B89A69] underline"
        >
          Return to Admin Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A69] font-semibold block">
            Product Modification
          </span>
          <h1 className="font-serif text-3xl text-[#171717] font-light mt-1">
            Edit Creation: {product.name}
          </h1>
          <p className="text-xs text-[#77736D] mt-1 font-mono">
            ID: {product.id} • Slug: {product.slug}
          </p>
        </div>

        <ProductForm initialData={product} isEditing={true} />
      </div>
    </div>
  );
}

