'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('admin@elvora.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await loginAdmin(password, email);
    setLoading(false);

    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid administrative credentials. Access restricted.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181818] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white border border-[#EAE5DE] p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="text-center space-y-2 pb-5 border-b border-[#EAE5DE]">
          <div className="w-12 h-12 rounded-full bg-[#EEF3F0] border border-[#24332C]/15 flex items-center justify-center mx-auto text-[#24332C]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#708579] font-medium block">
            Executive Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light">
            ELVORA Product Management
          </h1>
          <p className="text-xs text-[#77736D]">
            Secure administrative control for catalogue curation and inventory.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#181818] font-medium mb-1.5">
              Admin Identification
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#181818] font-medium mb-1.5">
              Administrative Passkey
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure passkey"
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#24332C] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-colors disabled:opacity-60 shadow-xs"
          >
            <span>{loading ? 'Verifying Authorization...' : 'Access Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#EAE5DE] text-center text-xs text-[#77736D] space-y-2">
          <p>Protected by cryptographic server session.</p>
          <p className="text-[11px] text-[#708579]">
            Default passkey: <code className="bg-[#EEF3F0] text-[#24332C] px-1.5 py-0.5 rounded font-mono">elvora2026</code>
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#708579] hover:text-[#24332C] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
