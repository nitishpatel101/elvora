'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const activeImage = images[selectedIndex] || '/images/products/touch-distance-bracelet/hero.jpg';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails (vertical on desktop, horizontal on mobile) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[580px] pb-2 lg:pb-0 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 bg-[#FFFFFF] border transition-all duration-200 overflow-hidden ${
              selectedIndex === idx
                ? 'border-[#B69A65] ring-1 ring-[#B69A65]'
                : 'border-[#E8DCCD] opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-square bg-[#FFFFFF] border border-[#E8DCCD] overflow-hidden group select-none">
        <div
          className="relative w-full h-full cursor-zoom-in"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={activeImage}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-transform duration-200 ${
              isZooming ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZooming
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Navigation Arrows for Mobile / Tablet */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-[#111111] hover:bg-white hover:text-[#B69A65] shadow-xs transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-[#111111] hover:bg-white hover:text-[#B69A65] shadow-xs transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Lightbox Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          aria-label="Expand view"
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/85 hover:bg-white text-[#111111] hover:text-[#B69A65] shadow-xs transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Counter indicator */}
        <div className="absolute bottom-3 left-3 bg-[#111111]/80 text-[#F8F5F0] text-[10px] tracking-wider px-2 py-1 font-light backdrop-blur-xs">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111]/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen view"
            className="absolute top-6 right-6 text-white hover:text-[#B69A65] p-2 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-[80vh] flex items-center justify-center">
            <Image
              src={activeImage}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-[#B69A65] p-3"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-[#B69A65] p-3"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
