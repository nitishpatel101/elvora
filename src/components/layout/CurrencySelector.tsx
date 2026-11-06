'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { Currency } from '@/types';
import { ChevronDown } from 'lucide-react';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCurrency = (c: Currency) => {
    setCurrency(c);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs tracking-wider uppercase text-[#171717] hover:text-[#B89A69] transition-colors py-1 px-2 border border-[#E7E1D8] rounded-none bg-transparent"
        aria-label="Select currency"
      >
        <span className="font-medium">{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-[#F8F6F2] border border-[#E7E1D8] shadow-lg z-50 py-1 text-xs">
          <button
            onClick={() => selectCurrency('INR')}
            className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#EFEAE2] transition-colors ${
              currency === 'INR' ? 'font-semibold text-[#B89A69]' : 'text-[#171717]'
            }`}
          >
            <span>₹ INR (India)</span>
            {currency === 'INR' && <span className="text-[10px] text-[#B89A69]">●</span>}
          </button>
          <button
            onClick={() => selectCurrency('USD')}
            className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#EFEAE2] transition-colors ${
              currency === 'USD' ? 'font-semibold text-[#B89A69]' : 'text-[#171717]'
            }`}
          >
            <span>$ USD (Global)</span>
            {currency === 'USD' && <span className="text-[10px] text-[#B89A69]">●</span>}
          </button>
        </div>
      )}
    </div>
  );
}

