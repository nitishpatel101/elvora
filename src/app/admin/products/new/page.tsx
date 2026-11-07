'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const { isAdminLoggedIn, isAuthInitialized } = useAuth();

  useEffect(() => {
    if (isAuthInitialized && !isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, isAuthInitialized, router]);

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-8 h-8 border-2 border-[#D79648] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
            Catalogue Expansion
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light mt-1">
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
