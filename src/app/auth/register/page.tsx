'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { registerCustomer } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setLoading(true);
    await registerCustomer(email, name, phone);
    setLoading(false);
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16 lg:py-24">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
            Private Client Registry
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light">
            Create Your Account
          </h1>
          <p className="text-xs text-[#77736D]">
            Begin your journey with curated jewelry releases and priority delivery.
          </p>
        </div>

        <div className="bg-white border border-[#EAE5DE] p-8 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rhea Kapoor"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rhea@example.com"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#181818] font-medium mb-1.5">
                Choose Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] px-3.5 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#24332C] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#19241F] transition-all duration-300 shadow-xs"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#EAE5DE] text-center text-xs text-[#77736D]">
            Already hold an account?{' '}
            <Link href="/auth/login" className="text-[#24332C] hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
