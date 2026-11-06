'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import {
  Upload,
  Trash2,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    tagline: initialData?.tagline || '',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Couple Bracelets',
    colours: initialData?.colours?.join(', ') || 'Gold, Black',
    stock: initialData?.stock !== undefined ? initialData.stock : 25,
    isFeatured: initialData?.isFeatured ?? true,
    isBestSeller: initialData?.isBestSeller ?? false,
    isPublished: initialData?.isPublished ?? true,
    material: initialData?.details?.material || '',
    finish: initialData?.details?.finish || '',
    clasp: initialData?.details?.clasp || '',
    packaging: initialData?.details?.packaging || '',
  });

  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : ['/images/products/touch-distance-bracelet/hero.jpg']
  );

  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Upload failed');
      }

      setImages((prev) => [...prev, json.url]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload error';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (images.length === 0) {
      setError('Please add at least one product photograph.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        colours: formData.colours
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        images,
        details: {
          material: formData.material,
          finish: formData.finish,
          clasp: formData.clasp,
          packaging: formData.packaging,
        },
      };

      const url = isEditing && initialData ? `/api/products/${initialData.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to save product');
      }

      setSuccess(
        isEditing
          ? 'Product catalogue records updated successfully.'
          : 'New luxury piece published to catalogue.'
      );

      setTimeout(() => {
        router.push('/admin');
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE5DE] gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#708579] hover:text-[#24332C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Vault</span>
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-[#24332C] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors disabled:opacity-60 shadow-xs"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEditing ? 'Update Product' : 'Save & Publish Product'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Essential Product Data */}
        <div className="lg:col-span-8 space-y-6 bg-white border border-[#EAE5DE] p-6 shadow-xs">
          <h2 className="font-serif text-lg text-[#181818] pb-3 border-b border-[#EAE5DE]">
            Core Information
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Celestial Orbit Rose Gold Bangle"
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                URL Slug (Optional, auto-generated)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="celestial-orbit-bangle"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                Tagline / Highlight
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                placeholder="Micro-pave diamonds with magnetic clasp"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                Selling Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="1499"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] font-semibold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                Original Comparison Price (INR ₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="1999"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
              Product Description *
            </label>
            <textarea
              rows={4}
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed luxury description of materials, aesthetics, and emotive significance..."
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
            />
          </div>

          {/* Specifications */}
          <div className="pt-4 border-t border-[#EAE5DE] space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#181818] font-semibold">
              Specifications &amp; Packaging
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#77736D] mb-1">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="316L Stainless Steel & 18K Gold PVD"
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#77736D] mb-1">
                  Finish
                </label>
                <input
                  type="text"
                  name="finish"
                  value={formData.finish}
                  onChange={handleInputChange}
                  placeholder="High Luster Mirror Polish"
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#77736D] mb-1">
                  Clasp / Closure
                </label>
                <input
                  type="text"
                  name="clasp"
                  value={formData.clasp}
                  onChange={handleInputChange}
                  placeholder="Magnetic Snap with Mechanical Catch"
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#77736D] mb-1">
                  Packaging Case
                </label>
                <input
                  type="text"
                  name="packaging"
                  value={formData.packaging}
                  onChange={handleInputChange}
                  placeholder="Signature ELVORA Presentation Box"
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Imagery, Classification, Stock, Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Classification & Inventory */}
          <div className="bg-white border border-[#EAE5DE] p-6 space-y-4 shadow-xs">
            <h2 className="font-serif text-lg text-[#181818] pb-3 border-b border-[#EAE5DE]">
              Catalogue Taxonomy
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              >
                <option value="Couple Bracelets">Couple Bracelets</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Rings">Rings</option>
                <option value="Fine Chains">Fine Chains</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                Colours (Comma separated)
              </label>
              <input
                type="text"
                name="colours"
                value={formData.colours}
                onChange={handleInputChange}
                placeholder="Gold, Black, Rose Gold"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181818] font-medium mb-1">
                Inventory Stock Units *
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] font-semibold transition-colors"
              />
            </div>

            {/* Visibility Toggles */}
            <div className="pt-3 border-t border-[#EAE5DE] space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#181818]">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="accent-[#24332C] w-4 h-4"
                />
                <span>Publish on Boutique (Visible to clients)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#181818]">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="accent-[#24332C] w-4 h-4"
                />
                <span>Feature in Homepage Highlights</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#181818]">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleInputChange}
                  className="accent-[#24332C] w-4 h-4"
                />
                <span>Tag as Bestseller</span>
              </label>
            </div>
          </div>

          {/* Image Gallery Uploader */}
          <div className="bg-white border border-[#EAE5DE] p-6 space-y-4 shadow-xs">
            <h2 className="font-serif text-lg text-[#181818] pb-3 border-b border-[#EAE5DE]">
              Product Photographs ({images.length})
            </h2>

            {/* Existing images list */}
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-[#FAF8F5] border border-[#EAE5DE] overflow-hidden group"
                >
                  <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[#24332C] text-white text-[8px] uppercase tracking-wider px-1.5 py-0.5 font-medium">
                        Hero
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload File */}
            <div className="pt-2">
              <label className="block w-full border border-dashed border-[#24332C]/40 p-4 text-center cursor-pointer hover:bg-[#EEF3F0]/40 transition-colors">
                <Upload className="w-5 h-5 text-[#24332C] mx-auto mb-1" />
                <span className="text-xs uppercase tracking-wider text-[#181818] block font-medium">
                  {uploading ? 'Uploading image...' : 'Upload Image File'}
                </span>
                <span className="text-[10px] text-[#708579]">PNG, JPG, WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Or Add Image by URL */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] text-[#77736D] block">Or add via image path / URL:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="/images/products/..."
                  className="flex-1 bg-[#FAF8F5] border border-[#EAE5DE] px-2.5 py-1.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="bg-[#24332C] text-white text-xs px-3.5 py-1.5 hover:bg-[#19241F] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
