'use client';

import React, { useState, useEffect } from 'react';
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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    // 50px swipe threshold
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation & body scroll lock for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, images.length]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4">
      {/* Thumbnails (vertical on desktop, horizontal on mobile) */}
      <div className="flex lg:flex-col gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-y-auto max-h-[580px] pb-2 lg:pb-0 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative w-14 h-14 sm:w-20 sm:h-20 shrink-0 bg-[#FFFFFF] border transition-all duration-200 overflow-hidden ${
              selectedIndex === idx
                ? 'border-[#24332C] ring-1 ring-[#24332C]'
                : 'border-[#E8DCCD] opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 aspect-square bg-[#FFFFFF] border border-[#E8DCCD] overflow-hidden group select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
            unoptimized
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
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#111111] hover:bg-white hover:text-[#24332C] shadow-md transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#111111] hover:bg-white hover:text-[#24332C] shadow-md transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Mobile Swipe / Counter Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full pointer-events-none">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Lightbox Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          aria-label="Expand view"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#111111] hover:text-[#24332C] shadow-sm transition-all sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close enlarged view"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer border border-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows inside Lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image & Counter Container */}
          <div
            className="relative w-full max-w-4xl aspect-square max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={`${productName} enlarged`}
              fill
              sizes="(max-width: 1200px) 95vw, 1200px"
              className="object-contain"
              unoptimized
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-xs text-white text-xs font-medium px-3.5 py-1.5 rounded-full border border-white/20">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
