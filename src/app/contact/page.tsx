'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            Client Relations
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#171717] font-light">
            Contact Concierge
          </h1>
          <p className="text-xs sm:text-sm text-[#77736D]">
            Our advisory team is at your disposal for bespoke sizing, shipment inquiries, and styling counsel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-[#EFEAE2]/60 border border-[#E7E1D8] p-8 space-y-8">
            <h2 className="font-serif text-2xl text-[#171717] font-light">
              Maison Headquarters
            </h2>

            <div className="space-y-6 text-xs text-[#77736D]">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-[#B89A69] shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#171717] font-medium block">
                    Address
                  </span>
                  <p className="mt-1 leading-relaxed">
                    ELVORA Haute Joaillerie Atelier<br />
                    Bandra-Kurla Complex (BKC)<br />
                    Mumbai, Maharashtra 400051, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-[#B89A69] shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#171717] font-medium block">
                    Electronic Mail
                  </span>
                  <p className="mt-1">concierge@elvora.com</p>
                  <p className="text-[11px] text-[#A39E96]">Replies typically within 4 business hours</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-[#B89A69] shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#171717] font-medium block">
                    Client Hotline
                  </span>
                  <p className="mt-1 font-mono">+91 (022) 8942-0199</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-[#B89A69] shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#171717] font-medium block">
                    Atelier Hours
                  </span>
                  <p className="mt-1">Monday &ndash; Saturday: 10:00 AM &ndash; 7:00 PM IST</p>
                  <p>Sunday: Reserved for private appointments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#F8F6F2] border border-[#E7E1D8] p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#B89A69] mx-auto stroke-1" />
                <h3 className="font-serif text-2xl text-[#171717]">Message Received</h3>
                <p className="text-xs text-[#77736D] max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A dedicated ELVORA concierge officer will review your request and reply shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#171717] text-white text-xs uppercase tracking-wider px-6 py-2.5 hover:bg-[#B89A69] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-serif text-2xl text-[#171717] font-light mb-6">
                  Transmit an Inquiry
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Sen"
                      className="w-full bg-[#EFEAE2]/60 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maya@domain.com"
                      className="w-full bg-[#EFEAE2]/60 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                    Subject / Order Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Sizing Advice for Touch Distance Bracelet"
                    className="w-full bg-[#EFEAE2]/60 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share how we may assist you..."
                    className="w-full bg-[#EFEAE2]/60 border border-[#E7E1D8] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#B89A69]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#171717] text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#B89A69] transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
