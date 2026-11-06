import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
          404 &bull; Page Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#181818] font-light">
          The piece you seek could not be found.
        </h1>
        <p className="text-xs text-[#77736D] leading-relaxed max-w-sm mx-auto">
          The page or creation you are looking for may have been relocated or archived in the maison vault.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#24332C] text-white px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors shadow-xs"
          >
            <span>Return to Boutique</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

