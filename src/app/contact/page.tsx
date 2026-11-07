'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.953.562 3.828 1.625 5.438L2 22l4.672-1.625A9.97 9.97 0 0 0 12.031 22C17.562 22 22 17.531 22 12.031 22 6.5 17.531 2 12.031 2zm5.781 14.156c-.25.688-1.406 1.344-1.969 1.406-.531.063-1.188.094-1.906-.156-.469-.156-1.063-.375-1.844-.719-3.25-1.406-5.375-4.688-5.531-4.906-.156-.219-1.281-1.719-1.281-3.281 0-1.563.813-2.313 1.094-2.625.281-.313.625-.406.844-.406.219 0 .438 0 .625.031.219.031.469-.063.719.563.281.688.938 2.281 1.031 2.469.094.188.156.406.031.625-.094.219-.188.344-.344.531-.156.188-.344.406-.469.563-.156.156-.313.344-.125.656.188.313.844 1.375 1.813 2.25 1.25 1.125 2.313 1.469 2.625 1.625.313.156.5.125.688-.094.188-.219.813-.938 1.031-1.281.219-.344.438-.281.719-.188.281.094 1.813.844 2.125 1 .313.156.531.25.625.375.094.125.094.75-.156 1.438z" />
  </svg>
);

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappNumber = '6386645203';
  const whatsappFormatted = '+91 63866 45203';
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=Hi%20ELVORA%20Concierge,%20I%20need%20help%20with%20an%20order/inquiry.`;

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-12 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#708579] font-medium block">
            CLIENT RELATIONS &bull; 24/7 ASSISTANCE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#181818] font-light tracking-tight">
            Contact Concierge
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5852] font-light leading-relaxed">
            Hamari concierge team aapki madad ke liye hamesha uplabdh hai. WhatsApp, call ya message ke zariye turant judiye.
          </p>
        </div>

        {/* Highlighted WhatsApp Support Hero Banner */}
        <div className="bg-[#24332C] text-white p-6 sm:p-8 rounded-xl shadow-lg border border-[#3A4E44] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0 text-[#25D366]">
              <WhatsAppIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A3B2A9]">
                  Instant WhatsApp Support
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300">Online Now</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-white font-light">
                Chat with ELVORA on WhatsApp
              </h2>
              <p className="text-xs text-white/70 mt-1 font-light">
                Order status, touch bracelets sizing, UPI payment verification &bull; Typically replies in under 5 minutes.
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3.5 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-md hover:shadow-xl active:scale-95 shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Chat on WhatsApp ({whatsappFormatted})</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E8DCCD] p-6 sm:p-8 space-y-6 shadow-2xs">
            <h2 className="font-serif text-2xl text-[#111111] font-light">
              Maison Headquarters
            </h2>

            <div className="space-y-6 text-xs text-[#6B655D] font-light">
              {/* WhatsApp Support Row */}
              <div className="flex gap-4 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-900 font-semibold block">
                    WhatsApp Helpline (Instant)
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 font-mono text-sm text-[#24332C] font-semibold hover:underline block"
                  >
                    {whatsappFormatted}
                  </a>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Click to open direct chat</p>
                </div>
              </div>

              {/* Phone Hotline */}
              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-[#B69A65] shrink-0 stroke-[1.4]" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#111111] font-medium block">
                    Customer Hotline
                  </span>
                  <a
                    href={`tel:+91${whatsappNumber}`}
                    className="mt-1 font-mono text-[#111111] hover:text-[#24332C] block font-medium"
                  >
                    {whatsappFormatted}
                  </a>
                  <p className="text-[11px] text-[#8C867E]">Voice calls accepted 10 AM &ndash; 7 PM IST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-[#B69A65] shrink-0 stroke-[1.4]" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#111111] font-medium block">
                    Electronic Mail
                  </span>
                  <a
                    href="mailto:concierge@elvora.com"
                    className="mt-1 font-mono text-[#111111] hover:underline block"
                  >
                    concierge@elvora.com
                  </a>
                  <p className="text-[11px] text-[#8C867E]">Replies typically within 4 business hours</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-[#B69A65] shrink-0 stroke-[1.4]" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#111111] font-medium block">
                    Atelier Location
                  </span>
                  <p className="mt-1 leading-relaxed">
                    ELVORA Haute Joaillerie Atelier<br />
                    Bandra-Kurla Complex (BKC)<br />
                    Mumbai, Maharashtra 400051, India
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-[#B69A65] shrink-0 stroke-[1.4]" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#111111] font-medium block">
                    Operating Hours
                  </span>
                  <p className="mt-1">Monday &ndash; Saturday: 10:00 AM &ndash; 7:00 PM IST</p>
                  <p className="text-[#25D366] font-medium mt-0.5">WhatsApp Support: 7 Days Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8DCCD] p-6 sm:p-8 shadow-2xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#24332C] mx-auto stroke-1" />
                <h3 className="font-serif text-2xl text-[#111111] font-light">Message Received</h3>
                <p className="text-xs text-[#6B655D] max-w-sm mx-auto leading-relaxed font-light">
                  Thank you for reaching out. A dedicated ELVORA concierge officer will review your request and reply shortly.
                </p>
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-wider px-5 py-2.5 rounded font-medium hover:bg-[#20BD5A] transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Need instant reply? Message on WhatsApp</span>
                  </a>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-stone-500 hover:underline"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
                  <h2 className="font-serif text-xl sm:text-2xl text-[#111111] font-light">
                    Transmit an Inquiry
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400">
                    Form Submission
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#111111] font-medium mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Sen"
                      className="w-full bg-[#F8F5F0] border border-[#E8DCCD] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#111111] font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maya@domain.com"
                      className="w-full bg-[#F8F5F0] border border-[#E8DCCD] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#24332C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-medium mb-1">
                    Subject / Order Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Sizing Advice / Order Verification for Touch Distance Bracelet"
                    className="w-full bg-[#F8F5F0] border border-[#E8DCCD] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#24332C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#111111] font-medium mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share how we may assist you..."
                    className="w-full bg-[#F8F5F0] border border-[#E8DCCD] px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#24332C] resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#24332C] text-white py-3 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#18231E] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#25D366] hover:underline flex items-center gap-1.5 font-medium"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Or chat instantly on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
