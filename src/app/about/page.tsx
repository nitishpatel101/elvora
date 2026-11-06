import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A69] font-medium block">
            The Maison Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#171717] font-light leading-tight">
            Crafting Tangible Bonds Across Endless Horizons
          </h1>
          <div className="w-16 h-px bg-[#B89A69] mx-auto pt-2" />
        </div>

        {/* Hero Image Showcase */}
        <div className="relative aspect-16/9 w-full bg-[#EFEAE2] border border-[#E7E1D8] overflow-hidden shadow-md">
          <Image
            src="/images/products/touch-distance-bracelet/hero.jpg"
            alt="ELVORA Touch Distance Couple Bracelets on Italian Marble"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Narrative Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#77736D] block">
              Chapter I • The Genesis
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
              A New Language of Devotion
            </h2>
            <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed font-light">
              ELVORA was born from a singular question: How can fine jewelry evolve beyond static ornamentation to actively connect two lives?
            </p>
            <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed font-light">
              By combining timeless celestial symbolism with tactile synchronization technology, we created the Touch Distance Couple Bracelet—a modern talisman where a touch on one wrist illuminates the other with glowing warmth, whether separated by a few rooms or ten thousand miles.
            </p>
          </div>

          <div className="relative aspect-square bg-[#EFEAE2] border border-[#E7E1D8] overflow-hidden">
            <Image
              src="/images/brand/story-couple.jpg"
              alt="Couple holding hands wearing ELVORA bracelets"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Narrative Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square bg-[#EFEAE2] border border-[#E7E1D8] overflow-hidden md:order-1 order-2">
            <Image
              src="/images/products/heart-sword-pendant-necklace/hero.jpg"
              alt="Heart Sword Pendant Necklace in Signature Box"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 md:order-2 order-1">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#77736D] block">
              Chapter II • Material Integrity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
              Surgical Precision &amp; Ethical Alchemy
            </h2>
            <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed font-light">
              Every creation is machined from premium 316L hypoallergenic surgical stainless steel, layered with 18K champagne gold via Physical Vapor Deposition (PVD). This aerospace-grade finish resists tarnish, moisture, and daily wear without fading.
            </p>
            <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed font-light">
              From hand-selected natural strawberry quartz to vivid laboratory-grown ruby crystals, we demand rigorous purity and conflict-free provenance.
            </p>
          </div>
        </div>

        {/* Values Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-[#EFEAE2]/60 border border-[#E7E1D8]">
          <div className="text-center space-y-2">
            <Sparkles className="w-6 h-6 text-[#B89A69] mx-auto" />
            <h3 className="font-serif text-base text-[#171717]">Celestial Design</h3>
            <p className="text-xs text-[#77736D]">Sun, moon, and wave motifs balanced in harmonious geometry.</p>
          </div>
          <div className="text-center space-y-2">
            <Shield className="w-6 h-6 text-[#B89A69] mx-auto" />
            <h3 className="font-serif text-base text-[#171717]">Enduring Quality</h3>
            <p className="text-xs text-[#77736D]">Water-resistant, tarnish-proof, and designed for perpetual wear.</p>
          </div>
          <div className="text-center space-y-2">
            <HeartHandshake className="w-6 h-6 text-[#B89A69] mx-auto" />
            <h3 className="font-serif text-base text-[#171717]">Direct Atelier Care</h3>
            <p className="text-xs text-[#77736D]">Personalized concierge advisory and insured door-to-door dispatch.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#171717] text-white py-4 px-8 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B89A69] transition-colors"
          >
            <span>Explore the Atelier Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

