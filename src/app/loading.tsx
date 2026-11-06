import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-[#FAF8F5] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#EAE5DE] border-t-[#24332C] rounded-full animate-spin mx-auto" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#708579] font-medium block">
          Loading ELVORA...
        </span>
      </div>
    </div>
  );
}

