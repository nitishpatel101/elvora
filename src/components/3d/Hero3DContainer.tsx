'use client';

import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Lazy-load Canvas only on client to protect SSR performance
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const HeroJewelryScene = dynamic(
  () => import('./HeroJewelryScene'),
  { ssr: false }
);

export default function Hero3DContainer() {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    // Check if WebGL is supported and user hasn't requested reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement('canvas');
        return Boolean(
          window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    })();

    if (hasWebGL && !prefersReducedMotion) {
      setCanRender3D(true);
    }
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[550px] flex items-center justify-center">
      {canRender3D ? (
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-[#D7C4A5] animate-pulse opacity-40" />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 1.5]} // Performance optimization: Cap max DPR at 1.5 for buttery smooth frame rate
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <HeroJewelryScene />
          </Canvas>
        </Suspense>
      ) : (
        // Luxury Fallback Visual for devices without WebGL or reduced motion
        <div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center p-8">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[#E7E1D8] p-4 flex items-center justify-center bg-radial from-[#F5EFE6] to-transparent">
            <Image
              src="/images/products/touch-distance-bracelet/hero.jpg"
              alt="ELVORA Signature Piece"
              width={400}
              height={400}
              priority
              className="object-cover rounded-full shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Subtle Luxury Interaction Indicator */}
      {canRender3D && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] tracking-[0.25em] uppercase text-[#77736D] opacity-60">
          Interactive 3D • Drag to Orbit
        </div>
      )}
    </div>
  );
}
