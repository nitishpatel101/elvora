'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Play, Heart, Share2, Sparkles, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

interface ReelItem {
  id: string;
  title: string;
  price: string;
  originalPrice: string;
  discount: string;
  slug: string;
  video: string;
  poster: string;
  tag: string;
  likes: string;
  badge: string;
}

const REELS: ReelItem[] = [
  {
    id: 'r-1',
    title: 'Birthday Currency Note Keepsake',
    price: 'Rs. 650.00',
    originalPrice: 'Rs. 1,299.00',
    discount: '50% OFF',
    slug: 'birthday-currency-note',
    video: '/videos/reel-1.mp4',
    poster: '/images/giftify/products/birthday-currency-note.jpg',
    tag: 'Comment "Birthday" to get link',
    likes: '14.8k',
    badge: 'Trending Birthday',
  },
  {
    id: 'r-2',
    title: 'Long Distance Touch Vibration Bracelet',
    price: 'Rs. 6,999.00',
    originalPrice: 'Rs. 12,999.00',
    discount: '46% OFF',
    slug: 'touch-distance-couple-bracelet',
    video: '/videos/reel-2.mp4',
    poster: '/images/giftify/products/touch-vibration-bracelet.jpg',
    tag: 'Comment "Long Distance" for link',
    likes: '48.2k',
    badge: 'Couple Bestseller',
  },
  {
    id: 'r-3',
    title: 'Customised Dairy Milk Silk Keepsake',
    price: 'Rs. 499.00',
    originalPrice: 'Rs. 899.00',
    discount: '44% OFF',
    slug: 'personalized-wooden-engraving-gift',
    video: '/videos/reel-3.mp4',
    poster: '/images/giftify/products/wooden-engraving-gift.jpg',
    tag: 'Happy Wedding Anniversary',
    likes: '22.4k',
    badge: 'Anniversary Special',
  },
  {
    id: 'r-4',
    title: 'Rotating 3D Crystal Photo Lamp',
    price: 'Rs. 2,999.00',
    originalPrice: 'Rs. 4,999.00',
    discount: '40% OFF',
    slug: '3d-crystal-photo-cube',
    video: '/videos/reel-4.mp4',
    poster: '/images/giftify/products/3d-crystal-photo-cube.jpg',
    tag: 'Illuminated 3D Crystal Keepsake',
    likes: '31.1k',
    badge: 'Glow Keepsake',
  },
];

export default function ShopFromVideos() {
  const [activeModalReelIndex, setActiveModalReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const toggleModalPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
        setIsPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleModalMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
      setIsMuted(modalVideoRef.current.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openReelModal = (index: number) => {
    setActiveModalReelIndex(index);
    setIsPlaying(true);
  };

  const nextReel = () => {
    if (activeModalReelIndex !== null) {
      setActiveModalReelIndex((activeModalReelIndex + 1) % REELS.length);
      setIsPlaying(true);
    }
  };

  const prevReel = () => {
    if (activeModalReelIndex !== null) {
      setActiveModalReelIndex((activeModalReelIndex - 1 + REELS.length) % REELS.length);
      setIsPlaying(true);
    }
  };

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-stone-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#F5C400]/20 text-stone-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C400] fill-[#F5C400]" />
            Watch In Action
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Shop From Videos
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Real unboxing and glowing moments from our happy customers
          </p>
        </div>

        {/* 4 Video Reels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
          {REELS.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => openReelModal(idx)}
              className="relative aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-stone-200 bg-black"
            >
              {/* Autoplaying Looping HTML5 Video */}
              <video
                src={reel.video}
                poster={reel.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Darkening Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40 group-hover:from-black/90 transition-colors pointer-events-none" />

              {/* Top Tag: "Comment ... for link" */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <span className="bg-black/70 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20 truncate max-w-[80%]">
                  {reel.tag}
                </span>

                <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Product Info Card */}
              <div className="absolute bottom-3 inset-x-2.5 sm:inset-x-3 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-xl z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="text-[11px] sm:text-xs font-bold text-stone-900 line-clamp-1 leading-tight">
                    {reel.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                      {reel.price}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through hidden sm:inline">
                      {reel.originalPrice}
                    </span>
                  </div>

                  <span className="bg-[#F5C400] text-black text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
                    View
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Instagram / TikTok Style Video Reel Modal */}
      {activeModalReelIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          {/* Close Modal Button */}
          <button
            onClick={() => setActiveModalReelIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 text-white/80 hover:text-white p-2.5 bg-black/60 rounded-full hover:bg-black transition-colors"
            aria-label="Close video"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevReel}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white items-center justify-center transition-colors"
            aria-label="Previous reel"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextReel}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 text-white items-center justify-center transition-colors"
            aria-label="Next reel"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Reel Phone Container */}
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border border-stone-800 flex flex-col justify-between">
            {/* Active Video Player */}
            <video
              ref={modalVideoRef}
              src={REELS[activeModalReelIndex].video}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onClick={toggleModalPlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Top Bar with Brand and Controls */}
            <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F5C400] text-black font-extrabold flex items-center justify-center text-xs">
                  🎁
                </div>
                <div className="text-white">
                  <span className="text-xs font-bold block leading-tight">ELVORA Official</span>
                  <span className="text-[10px] text-stone-300">Live Demonstration</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleModalMute}
                  className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                  aria-label="Toggle sound"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Center Play/Pause Indicator if paused */}
            {!isPlaying && (
              <div
                onClick={toggleModalPlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center text-white">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Right Action Buttons (Like, Share) */}
            <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
              <button
                onClick={(e) => toggleLike(REELS[activeModalReelIndex].id, e)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart
                    className={`w-5 h-5 ${likedReels[REELS[activeModalReelIndex].id]
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-white'
                      }`}
                  />
                </div>
                <span className="text-[10px] font-semibold">
                  {likedReels[REELS[activeModalReelIndex].id]
                    ? 'Liked'
                    : REELS[activeModalReelIndex].likes}
                </span>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: REELS[activeModalReelIndex].title,
                      url: window.location.href,
                    });
                  }
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-semibold">Share</span>
              </button>
            </div>

            {/* Bottom Pinned Product Details & Direct CTA */}
            <div className="relative z-20 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 mb-3">
                <span className="inline-block bg-[#F5C400] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase mb-1">
                  {REELS[activeModalReelIndex].badge}
                </span>
                <h3 className="text-white text-sm font-bold truncate">
                  {REELS[activeModalReelIndex].title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white text-base font-extrabold">
                    {REELS[activeModalReelIndex].price}
                  </span>
                  <span className="text-stone-400 text-xs line-through">
                    {REELS[activeModalReelIndex].originalPrice}
                  </span>
                  <span className="text-emerald-400 text-xs font-bold">
                    {REELS[activeModalReelIndex].discount}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/product/${REELS[activeModalReelIndex].slug}`}
                  onClick={() => setActiveModalReelIndex(null)}
                  className="flex-1 bg-[#F5C400] hover:bg-[#FFD747] text-black font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <span>⚡ BUY NOW</span>
                </Link>

                <a
                  href={`https://wa.me/916386645203?text=Hi%20ELVORA,%20I%20want%20to%20order%20the%20${encodeURIComponent(
                    REELS[activeModalReelIndex].title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white p-3 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label="Order on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
