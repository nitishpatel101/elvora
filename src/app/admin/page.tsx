'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Product } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Package,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isAdminLoggedIn, logoutAdmin } = useAuth();
  const { format } = useCurrency();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, [isAdminLoggedIn, router]);

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?\n\nThis will safely unpublish and archive the product while preserving historical customer orders.`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Navigation Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E1D8] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center text-[#B89A69]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
                Administrative Portal &bull; {admin?.email || 'Authenticated'}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light">
                Product Catalogue Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[#171717] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-[#B89A69] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>

            <button
              onClick={() => {
                logoutAdmin();
                router.push('/admin/login');
              }}
              className="inline-flex items-center gap-1.5 border border-[#E7E1D8] text-[#77736D] px-3.5 py-2.5 text-xs uppercase tracking-wider hover:text-red-700 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#EFEAE2]/60 p-4 border border-[#E7E1D8]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#77736D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter products by name or category..."
              className="w-full bg-[#F8F6F2] border border-[#E7E1D8] pl-9 pr-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-[#77736D]">
            <span>Total Products: <strong className="text-[#171717]">{products.length}</strong></span>
            <span>Published: <strong className="text-emerald-700">{products.filter((p) => p.isPublished).length}</strong></span>
            <span>Low Stock (&lt;10): <strong className="text-amber-700">{products.filter((p) => p.stock < 10).length}</strong></span>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-[#F8F6F2] border border-[#E7E1D8] shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#77736D]">
              Loading product catalogue...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Package className="w-10 h-10 text-[#77736D] mx-auto stroke-1" />
              <h3 className="font-serif text-lg text-[#171717]">No products found</h3>
              <p className="text-xs text-[#77736D]">Add a new product or modify your search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EFEAE2] text-[#77736D] uppercase text-[10px] tracking-wider border-b border-[#E7E1D8]">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Name &amp; Slug</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E1D8]">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#EFEAE2]/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 bg-[#EFEAE2] border border-[#E7E1D8] overflow-hidden">
                          <Image
                            src={prod.images[0] || '/images/products/touch-distance-bracelet/hero.jpg'}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-[#171717]">{prod.name}</div>
                        <div className="text-[10px] text-[#A39E96] font-mono">{prod.slug}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-[#EFEAE2] text-[#171717] px-2 py-0.5 text-[10px] uppercase tracking-wider">
                          {prod.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#181818]">
                          {format(prod.price)}
                        </div>
                        {prod.originalPrice && (
                          <div className="text-[10px] text-[#8A857D] line-through">
                            {format(prod.originalPrice)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            prod.stock <= 5
                              ? 'text-red-700'
                              : prod.stock <= 15
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {prod.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-stone-700 bg-stone-100 px-2 py-0.5 border border-stone-200 uppercase tracking-wider">
                            <XCircle className="w-3 h-3" />
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/product/${prod.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#77736D] hover:text-[#171717]"
                            title="Preview on Boutique"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="p-1.5 text-[#77736D] hover:text-[#B89A69]"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            disabled={deletingId === prod.id}
                            className="p-1.5 text-[#77736D] hover:text-red-700 transition-colors disabled:opacity-50"
                            title="Unpublish & Archive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

