import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#708579] font-medium block">
            THE MAISON STORY
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#181818] font-light leading-tight tracking-tight">
            Crafting Tangible Bonds Across Endless Horizons
          </h1>
          <div className="w-16 h-px bg-[#24332C] mx-auto pt-2" />
        </div>

        {/* Hero Image Showcase */}
        <div className="relative aspect-16/9 w-full bg-[#FFFFFF] border border-[#EAE5DE] overflow-hidden shadow-xs">
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
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#708579] block font-medium">
              Chapter I &bull; The Genesis
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light">
              A New Language of Devotion
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed font-light">
              ELVORA was born from a singular question: How can fine jewellery evolve beyond static ornamentation to actively connect two lives?
            </p>
            <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed font-light">
              By combining timeless celestial symbolism with tactile synchronization technology, we created the Touch Distance Couple Bracelet—a modern talisman where a touch on one wrist illuminates the other with glowing warmth, whether separated by a few rooms or ten thousand miles.
            </p>
          </div>

          <div className="relative aspect-square bg-[#FFFFFF] border border-[#EAE5DE] overflow-hidden">
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
          <div className="relative aspect-square bg-[#FFFFFF] border border-[#EAE5DE] overflow-hidden md:order-1 order-2">
            <Image
              src="/images/products/heart-sword-pendant-necklace/hero.jpg"
              alt="Heart Sword Pendant Necklace in Signature Box"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 md:order-2 order-1">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#708579] block font-medium">
              Chapter II &bull; Material Integrity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#181818] font-light">
              Thoughtful Design &amp; Craft
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed font-light">
              Every creation is machined from premium 316L hypoallergenic surgical stainless steel, finished with 18K champagne gold via Physical Vapor Deposition (PVD). This aerospace-grade finish resists tarnish, moisture, and daily wear without fading.
            </p>
            <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed font-light">
              From hand-selected natural quartz to vivid laboratory-grown ruby crystals, we demand rigorous purity and refined presentation.
            </p>
          </div>
        </div>

        {/* Values Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-[#FFFFFF] border border-[#EAE5DE]">
          <div className="text-center space-y-2">
            <Sparkles className="w-5 h-5 text-[#24332C] mx-auto stroke-[1.4]" />
            <h3 className="font-serif text-base text-[#181818] font-light">Celestial Design</h3>
            <p className="text-xs text-[#5C5852] font-light">Sun, moon, and wave motifs balanced in harmonious geometry.</p>
          </div>
          <div className="text-center space-y-2">
            <Shield className="w-5 h-5 text-[#24332C] mx-auto stroke-[1.4]" />
            <h3 className="font-serif text-base text-[#181818] font-light">Enduring Quality</h3>
            <p className="text-xs text-[#5C5852] font-light">Water-resistant, tarnish-proof, and designed for perpetual wear.</p>
          </div>
          <div className="text-center space-y-2">
            <HeartHandshake className="w-5 h-5 text-[#24332C] mx-auto stroke-[1.4]" />
            <h3 className="font-serif text-base text-[#181818] font-light">Direct Atelier Care</h3>
            <p className="text-xs text-[#5C5852] font-light">Personalized concierge advisory and insured door-to-door dispatch.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#24332C] text-white py-4 px-8 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#19241F] transition-colors"
          >
            <span>Explore the Atelier Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
