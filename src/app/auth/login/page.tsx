'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginCustomer } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await loginCustomer(email);
    setLoading(false);
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Private Client Access
          </span>
          <h1 className="font-serif text-3xl text-[#171717] font-light">
            Welcome to ELVORA
          </h1>
          <p className="text-xs text-[#77736D]">
            Access your order archive, private wishlist, and tailored privileges.
          </p>
        </div>

        <div className="bg-[#F8F6F2] border border-[#E7E1D8] p-8 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full bg-[#EFEAE2]/60 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#EFEAE2]/60 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#171717] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#B89A69] transition-all duration-300"
            >
              <span>{loading ? 'Authenticating...' : 'Enter Maison'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#E7E1D8] text-center space-y-3">
            <p className="text-xs text-[#77736D]">
              New to ELVORA?{' '}
              <Link href="/auth/register" className="text-[#B89A69] hover:underline font-medium">
                Register an Account
              </Link>
            </p>

            <div>
              <Link
                href="/admin/login"
                className="text-[11px] text-[#A39E96] hover:text-[#B89A69] transition-colors inline-flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Admin & Staff Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

