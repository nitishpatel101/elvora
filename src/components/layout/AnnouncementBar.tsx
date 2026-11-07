'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface AnnouncementBarProps {
  initialText?: string;
}

export default function AnnouncementBar({
  initialText = 'BLACK FRIDAY SALE • 30% OFF • USE CODE: ELVORA30',
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);
  const [announcementText, setAnnouncementText] = useState(initialText);
  const [subText, setSubText] = useState('FREE EXPRESS SHIPPING ON ORDERS ₹99+');
  const { currency, setCurrency } = useCurrency();
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.announcementVisible === false) {
            setVisible(false);
          }
          if (data.announcementText) {
            setAnnouncementText(data.announcementText);
          }
          if (data.announcementSubText) {
            setSubText(data.announcementSubText);
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full text-xs font-sans">
      {/* Tier 1: Dark Forest Green Promotional Bar */}
      <div className="bg-[#24332C] text-[#FAF8F5] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-2 px-4 relative font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-[10px] tracking-[0.2em] text-[#A3B2A9]">
            {subText}
          </div>
          <div className="flex-1 text-center truncate px-2 font-semibold tracking-[0.22em]">
            {announcementText}
          </div>
          <button
            onClick={() => setVisible(false)}
            aria-label="Close announcement"
            className="text-[#A3B2A9] hover:text-[#FFFFFF] transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tier 2: AUrate Neutral Sub-Bar */}
      <div className="bg-[#EFECE6] border-b border-[#E2DDD5] text-[#24332C] text-[10px] sm:text-[11px] tracking-[0.16em] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-[10px] uppercase text-[#708579] tracking-wider">
            Fine Jewellery &bull; Ethical Craft
          </div>
          <div className="text-center font-medium tracking-[0.2em] uppercase text-[10px] sm:text-[11px]">
            Lifetime Warranty &bull; Free Returns
          </div>
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#24332C] hover:opacity-80 transition-opacity"
            >
              <span>{currency === 'INR' ? 'IN (₹)' : 'US ($)'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#EAE5DE] shadow-md py-1 z-50 min-w-[90px]">
                <button
                  onClick={() => {
                    setCurrency('INR');
                    setCurrencyDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider ${
                    currency === 'INR' ? 'bg-[#EEF3F0] font-bold text-[#24332C]' : 'text-[#181818] hover:bg-[#FAF8F5]'
                  }`}
                >
                  IN (₹)
                </button>
                <button
                  onClick={() => {
                    setCurrency('USD');
                    setCurrencyDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider ${
                    currency === 'USD' ? 'bg-[#EEF3F0] font-bold text-[#24332C]' : 'text-[#181818] hover:bg-[#FAF8F5]'
                  }`}
                >
                  US ($)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
