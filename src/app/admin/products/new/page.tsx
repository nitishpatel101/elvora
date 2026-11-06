'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const { isAdminLoggedIn } = useAuth();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, router]);

  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A69] font-semibold block">
            Catalogue Expansion
          </span>
          <h1 className="font-serif text-3xl text-[#171717] font-light mt-1">
            Create &amp; Publish New Creation
          </h1>
          <p className="text-xs text-[#77736D] mt-1">
            New products immediately become visible in the shop catalogue and database upon publishing.
          </p>
        </div>

        <ProductForm isEditing={false} />
      </div>
    </div>
  );
}
