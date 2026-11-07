'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Send } from 'lucide-react';

export default function FloatingChatBubble() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setSent(true);
    setMsg('');
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <aside aria-label="Customer Concierge" className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 z-40">
      {/* Floating Circular Trigger matching AUrate recording exactly */}
      <button
        onClick={() => setOpen(!open)}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#24332C] hover:bg-[#19241F] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Open concierge chat"
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />
          </div>
        )}
      </button>

      {/* Flyout Concierge Card */}
      {open && (
        <div className="absolute bottom-14 sm:bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white border border-[#EAE5DE] shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="pb-3 border-b border-[#EAE5DE] mb-3">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#708579] font-medium block">
              Maison Concierge
            </span>
            <h4 className="font-serif text-lg text-[#181818] font-normal mt-0.5">
              Need assistance with an order?
            </h4>
            <p className="text-xs text-[#77736D] mt-1">
              Ask about sizing, couple touch bracelets, or order delivery status.
            </p>
          </div>

          {sent ? (
            <div className="p-4 bg-[#EEF3F0] text-[#24332C] text-xs text-center font-medium">
              Thank you! Our concierge team will connect shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="How can we assist your ELVORA experience today?..."
                rows={3}
                required
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] p-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#24332C] resize-none"
              />
              <div className="flex items-center justify-between">
                <Link
                  href="/track-order"
                  className="text-[11px] uppercase tracking-wider text-[#708579] hover:underline"
                >
                  Track Consignment
                </Link>
                <button
                  type="submit"
                  className="bg-[#24332C] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#19241F] transition-colors flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </aside>
  );
}

