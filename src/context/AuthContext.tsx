'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CustomerUser, AdminUser } from '@/types';

interface AuthContextType {
  customer: CustomerUser | null;
  admin: AdminUser | null;
  isCustomerLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  loginCustomer: (email: string, name?: string) => Promise<boolean>;
  registerCustomer: (email: string, name: string, phone: string) => Promise<boolean>;
  logoutCustomer: () => void;
  loginAdmin: (password: string, email?: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    try {
      const savedCustomer = localStorage.getItem('elvora_customer');
      if (savedCustomer) setCustomer(JSON.parse(savedCustomer));

      const savedAdmin = localStorage.getItem('elvora_admin_session');
      if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
    } catch (e) {
      console.warn('Failed to restore auth sessions', e);
    }
  }, []);

  const loginCustomer = async (email: string, name?: string) => {
    const user: CustomerUser = {
      id: 'cust-' + Math.random().toString(36).substring(2, 9),
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    setCustomer(user);
    localStorage.setItem('elvora_customer', JSON.stringify(user));
    return true;
  };

  const registerCustomer = async (email: string, name: string, phone: string) => {
    const user: CustomerUser = {
      id: 'cust-' + Math.random().toString(36).substring(2, 9),
      email,
      name,
      phone,
      createdAt: new Date().toISOString(),
    };
    setCustomer(user);
    localStorage.setItem('elvora_customer', JSON.stringify(user));
    return true;
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('elvora_customer');
  };

  const loginAdmin = async (password: string, email = 'admin@elvora.com') => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.admin);
        localStorage.setItem('elvora_admin_session', JSON.stringify(data.admin));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('elvora_admin_session');
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        admin,
        isCustomerLoggedIn: Boolean(customer),
        isAdminLoggedIn: Boolean(admin),
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

