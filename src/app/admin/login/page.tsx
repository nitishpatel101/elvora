'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, AlertCircle, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#171717] text-[#EFEAE2] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#242220] border border-[#3E3933] p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2 pb-4 border-b border-[#3E3933]">
          <div className="w-12 h-12 rounded-full bg-[#171717] border border-[#B89A69]/40 flex items-center justify-center mx-auto text-[#B89A69]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89A69] font-medium block">
            Executive Portal
          </span>
          <h1 className="font-serif text-2xl text-white font-light">
            ELVORA Product Management
          </h1>
          <p className="text-[11px] text-[#A39E96]">
            Secure administrative control for catalogue curation and inventory.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A39E96] font-medium mb-1">
              Admin Identification
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#171717] border border-[#3E3933] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B89A69]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A39E96] font-medium mb-1">
              Administrative Passkey
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              className="w-full bg-[#171717] border border-[#3E3933] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B89A69]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B89A69] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#9F8354] transition-colors disabled:opacity-60"
          >
            <span>{loading ? 'Verifying Authorization...' : 'Access Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#3E3933] text-center text-[11px] text-[#77736D] space-y-1">
          <p>Protected by cryptographic server session.</p>
          <p className="text-[#A39E96]">Default initial access passkey: <code className="text-[#B89A69]">elvora2026</code></p>
        </div>
      </div>
    </div>
  );
}
