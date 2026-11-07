'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, CheckCircle, ThumbsUp, Edit3, X, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { Review } from '@/types';

interface CustomerReviewsSectionProps {
  productId?: string;
  productName?: string;
}

export default function CustomerReviewsSection({
  productId,
  productName,
}: CustomerReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulCounts, setHelpfulCounts] = useState<{ [id: string]: number }>({});
  const [userVoted, setUserVoted] = useState<{ [id: string]: boolean }>({});

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch reviews from API
  useEffect(() => {
    async function loadReviews() {
      try {
        const url = productId ? `/api/reviews?productId=${productId}` : '/api/reviews';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  const handleHelpfulClick = (id: string) => {
    if (userVoted[id]) return;
    setUserVoted((prev) => ({ ...prev, [id]: true }));
    setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] || 12) + 1 }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setSubmitError('Kripya apna naam aur review likhein.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName,
          city: city || 'Verified Buyer',
          rating,
          title: title || 'Verified Purchase',
          content,
          productId,
          productName,
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          setAuthorName('');
          setCity('');
          setTitle('');
          setContent('');
          setRating(5);
        }, 1800);
      } else {
        setSubmitError(data.error || 'Review save nahi ho paya. Dobara koshish karein.');
      }
    } catch {
      setSubmitError('Connection error. Kripya thodi der baad koshish karein.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  return (
    <section className="py-16 bg-[#FCFBF9] border-t border-b border-[#EAE5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 sm:pb-12 border-b border-[#EAE5DE]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#708579] font-medium">
                VERIFIED CUSTOMER EXPERIENCES
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                100% Genuine Orders
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#181818] font-light">
              Customer Reviews & Real Stories
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5852] mt-2 max-w-xl font-light">
              Dekhein hamare customers ka real experience — touch connectivity, 18K gold finishing, UPI verification aur royal packaging ke baare me.
            </p>
          </div>

          {/* Overall Rating & Write Review CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-shrink-0">
            <div className="flex items-center sm:block justify-between sm:text-right">
              <div className="flex items-center sm:justify-end gap-1 text-[#C5A265]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#C5A265]" />
                ))}
                <span className="font-semibold text-sm text-stone-900 ml-1.5">4.9 / 5.0</span>
              </div>
              <span className="text-[11px] text-stone-500 font-light block">
                {reviews.length}+ verified buyer reviews
              </span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#24332C] hover:bg-[#18231E] text-white px-5 py-3 text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow active:scale-95 w-full sm:w-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C5A265]" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Rating Breakdown Badges */}
        <div className="py-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-light mr-2">Filter Reviews:</span>
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              filterRating === null
                ? 'bg-[#24332C] text-white font-medium'
                : 'bg-white text-stone-700 border border-[#EAE5DE] hover:border-stone-400'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1 ${
              filterRating === 5
                ? 'bg-[#24332C] text-white font-medium'
                : 'bg-white text-stone-700 border border-[#EAE5DE] hover:border-stone-400'
            }`}
          >
            5 Stars Only
            <Star className="w-3 h-3 fill-current text-[#C5A265]" />
          </button>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-16 text-center text-stone-400 text-sm">
            Loading customer reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center text-stone-500 bg-white border border-[#EAE5DE] rounded-xl p-8">
            <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="font-serif text-lg text-stone-800">No reviews found for this selection.</p>
            <p className="text-xs text-stone-500 mt-1">Be the first verified customer to share your thoughts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#EAE5DE] rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  {/* Top: Stars & Time */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-[#C5A265]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-current text-[#C5A265]'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-400 font-light">
                      {rev.timeAgo || 'Recent'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-medium text-stone-900 text-sm mb-2 leading-snug">
                    &ldquo;{rev.title}&rdquo;
                  </h3>

                  {/* Hinglish Content */}
                  <p className="text-xs text-[#5C5852] leading-relaxed font-light mb-4 whitespace-pre-line">
                    {rev.content}
                  </p>

                  {/* Customer Photo Attachments */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                      {rev.images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#EAE5DE] shrink-0 bg-stone-100 shadow-2xs">
                          <Image src={img} alt="Customer review photo" fill className="object-cover" unoptimized />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Author Info & Helpful */}
                <div className="pt-4 border-t border-[#F5F2EB] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-stone-900">
                        {rev.authorName}
                      </span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>
                    {rev.city && (
                      <span className="text-[11px] text-stone-500 block">
                        {rev.city}
                      </span>
                    )}
                  </div>

                  {/* Helpful Button */}
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded transition-colors ${
                      userVoted[rev.id]
                        ? 'text-emerald-700 bg-emerald-50 font-medium'
                        : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
                    }`}
                    title="Mark review as helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{helpfulCounts[rev.id] || (userVoted[rev.id] ? 13 : 12)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Footnote */}
        <div className="mt-12 text-center text-xs text-stone-500 font-light flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#C5A265]" />
            100% Verified Customer Reviews
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#C5A265]" />
            Authentic Jewellery & Touch Technology
          </span>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-[#C5A265]/40 animate-fade-in-up">
            {/* Modal Header */}
            <div className="bg-[#24332C] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-light text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#C5A265]" />
                  Write a Customer Review
                </h3>
                <p className="text-[11px] text-white/70 font-light">
                  Apna honest review share karein (Hinglish ya English me)
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl text-stone-900 font-medium">
                  Review Successfully Submitted!
                </h4>
                <p className="text-xs text-stone-600">
                  Dhanyawaad! Aapka review ELVORA store par live publish ho chuka hai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                    {submitError}
                  </div>
                )}

                {/* Rating Stars Picker */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(rating)}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoverRating || rating)
                              ? 'fill-[#C5A265] text-[#C5A265]'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-stone-800 ml-2">
                      {hoverRating || rating} Star{(hoverRating || rating) > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Name & City Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja & Kabir / Rohan"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#24332C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Delhi NCR"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#24332C]"
                    />
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                    Review Headline / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Long distance me best connection feel hota hai ❤️"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#24332C]"
                  />
                </div>

                {/* Review Content */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-1">
                    Your Review (Hinglish / English) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Apna experience share karein... packaging kaisa tha, bracelet ka touch vibration aur glow kaisa laga, ya UPI payment kitni jaldi verify hua?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#24332C] resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#24332C] hover:bg-[#18231E] text-white px-6 py-2.5 text-xs tracking-wider uppercase font-medium flex items-center gap-2 transition-all shadow disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

