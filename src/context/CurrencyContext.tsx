'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Currency } from '@/types';
import { formatPrice, convertPrice, USD_EXCHANGE_RATE } from '@/lib/currency';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountInInr: number) => string;
  convert: (amountInInr: number) => number;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('INR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('elvora_currency') as Currency;
      if (saved === 'INR' || saved === 'USD') {
        setCurrencyState(saved);
      } else {
        // Simple heuristic: if timezone is India/Kolkata default to INR, else default to INR as brand base
        setCurrencyState('INR');
      }
    } catch {
      setCurrencyState('INR');
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('elvora_currency', c);
    } catch (e) {
      console.warn('Could not persist currency preference', e);
    }
  };

  const format = (amountInInr: number) => {
    return formatPrice(amountInInr, currency);
  };

  const convert = (amountInInr: number) => {
    return convertPrice(amountInInr, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        convert,
        rate: USD_EXCHANGE_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}
