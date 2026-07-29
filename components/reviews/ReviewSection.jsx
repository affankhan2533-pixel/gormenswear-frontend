"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Filter,
  ArrowUpDown,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import WriteReviewModal from "./WriteReviewModal";
import { useToast } from "@/context/ToastContext";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Marcus Vance",
    rating: 5,
    title: "Masterpiece construction and fabric drape",
    text: "The weight and hand-feel of this piece exceeded expectations. The silhouette falls perfectly across the shoulders with clean, crisp lines.",
    date: "Jan 18, 2026",
    verified: true,
    size: "Size L",
    helpfulCount: 24,
    images: ["/images/hero/hero-main.jpg"],
  },
  {
    id: "rev-2",
    name: "Julian Thorne",
    rating: 5,
    title: "Modern streetwear luxury at its finest",
    text: "Versatile styling options. Pairs effortlessly with tailored trousers or relaxed denim. Truly high-end craftsmanship.",
    date: "Jan 12, 2026",
    verified: true,
    size: "Size M",
    helpfulCount: 18,
    images: [],
  },
  {
    id: "rev-3",
    name: "Dominic Sterling",
    rating: 4,
    title: "Exceptional quality, slightly relaxed fit",
    text: "Sublime fabric texture and precise stitching. Fits slightly oversized so consider sizing down if you prefer a slim fit.",
    date: "Dec 29, 2025",
    verified: true,
    size: "Size L",
    helpfulCount: 11,
    images: [],
  },
];

export default function ReviewSection({ productName = "GARMENT" }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [starFilter, setStarFilter] = useState(0); // 0 = All
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [withPhotosOnly, setWithPhotosOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // "recent", "highest", "lowest", "helpful"

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [votedReviews, setVotedReviews] = useState({});

  const { success } = useToast();

  // Load session votes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gor_voted_reviews");
      if (stored) setVotedReviews(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Handle Helpful Vote
  const handleVoteHelpful = (reviewId) => {
    if (votedReviews[reviewId]) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );

    const updatedVotes = { ...votedReviews, [reviewId]: true };
    setVotedReviews(updatedVotes);

    try {
      localStorage.setItem("gor_voted_reviews", JSON.stringify(updatedVotes));
    } catch (e) {}

    success("Vote Counted", "Thank you for your feedback.");
  };

  // Handle Add New Review
  const handleAddNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Filter & Sort Logic
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (starFilter > 0) {
      result = result.filter((r) => r.rating === starFilter);
    }

    if (verifiedOnly) {
      result = result.filter((r) => r.verified);
    }

    if (withPhotosOnly) {
      result = result.filter((r) => r.images && r.images.length > 0);
    }

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "helpful") {
      result.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }

    return result;
  }, [reviews, starFilter, verifiedOnly, withPhotosOnly, sortBy]);

  // Calculate Breakdown Statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: "5.0", count: 0, recommend: "100%", dist: [0, 0, 0, 0, 0] };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / total).toFixed(1);

    const counts = [5, 4, 3, 2, 1].map((star) =>
      reviews.filter((r) => r.rating === star).length
    );
    const dist = counts.map((c) => Math.round((c / total) * 100));

    const positive = reviews.filter((r) => r.rating >= 4).length;
    const recommend = `${Math.round((positive / total) * 100)}%`;

    return { avg, count: total, recommend, dist };
  }, [reviews]);

  return (
    <section className="py-16 border-t border-[#2A2A2A] select-none">
      
      {/* Section Title & Write Review Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
            CUSTOMER REVIEWS & FEEDBACK
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
            Verified Customer Reviews
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-[44px] px-6 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors cursor-pointer shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* ── 1. RATING SUMMARY DASHBOARD ── */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-6 sm:p-8 mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
        {/* Rating Average & Stars */}
        <div className="lg:col-span-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#2A2A2A] pb-6 lg:pb-0 lg:pr-8">
          <div className="font-editorial text-6xl font-normal text-[#F8F6F3] leading-none mb-2">
            {stats.avg}
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-[#C8A45D] text-[#C8A45D]" />
            ))}
          </div>
          <span className="font-sans text-xs text-[#8E8A85] block">
            Based on {stats.count} Verified Customer Reviews
          </span>
          <span className="font-sans text-xs text-[#C8A45D] font-bold block mt-1">
            {stats.recommend} of customers recommend this piece
          </span>
        </div>

        {/* Rating Distribution Bars */}
        <div className="lg:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((star, idx) => (
            <div key={star} className="flex items-center gap-3 font-sans text-xs">
              <span className="w-8 text-[#8E8A85] font-bold text-right">{star} ★</span>
              <div className="flex-1 h-2 bg-[#090909] rounded-full overflow-hidden border border-[#2A2A2A]">
                <div
                  className="h-full bg-[#C8A45D] rounded-full transition-all duration-500"
                  style={{ width: `${stats.dist[idx]}%` }}
                />
              </div>
              <span className="w-10 text-[#8E8A85] text-right font-mono">{stats.dist[idx]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. FILTER & SORT TOOLBAR ── */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Star Rating Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStarFilter(0)}
            className={`px-3.5 py-1.5 rounded-[8px] text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              starFilter === 0
                ? "bg-[#C8A45D] text-[#090909]"
                : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] hover:text-[#F8F6F3]"
            }`}
          >
            All ({stats.count})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStarFilter(star)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-sans font-bold transition-colors cursor-pointer ${
                starFilter === star
                  ? "bg-[#C8A45D] text-[#090909]"
                  : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] hover:text-[#F8F6F3]"
              }`}
            >
              {star} ★
            </button>
          ))}
        </div>

        {/* Sort & Checkbox Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="flex items-center gap-1.5 text-xs text-[#8E8A85] cursor-pointer">
            <input
              type="checkbox"
              checked={withPhotosOnly}
              onChange={(e) => setWithPhotosOnly(e.target.checked)}
              className="accent-[#C8A45D]"
            />
            <span>With Photos</span>
          </label>

          <div className="flex items-center gap-1.5 bg-[#090909] border border-[#2A2A2A] rounded-[8px] px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C8A45D]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-sans text-[#F8F6F3] outline-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. CUSTOMER REVIEWS CARDS LIST ── */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-[#151515] border border-[#2A2A2A] rounded-[16px]">
          <p className="text-xs text-[#8E8A85]">No reviews match your selected filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 space-y-4 shadow-md"
            >
              {/* Card Header (Avatar + Name + Rating + Verified Badge) */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#090909] border border-[#C8A45D]/40 text-[#C8A45D] font-sans text-xs font-bold flex items-center justify-center shadow-inner">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">{rev.name}</h4>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-[10px] text-[#8E8A85] block">{rev.date} • {rev.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? "fill-[#C8A45D] text-[#C8A45D]" : "text-[#2A2A2A]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h5 className="font-editorial text-lg text-[#F8F6F3] mb-1">{rev.title}</h5>
                <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed">
                  {rev.text}
                </p>
              </div>

              {/* Photos Gallery */}
              {rev.images && rev.images.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {rev.images.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveLightboxImage(imgUrl)}
                      className="relative w-16 h-16 rounded-[8px] overflow-hidden border border-[#2A2A2A] hover:border-[#C8A45D] transition-colors cursor-pointer group"
                    >
                      <img src={imgUrl} alt="Customer Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-[#090909]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIcon className="w-4 h-4 text-[#F8F6F3]" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Card Footer (Helpful Vote Button) */}
              <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleVoteHelpful(rev.id)}
                  disabled={votedReviews[rev.id]}
                  className={`inline-flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-[6px] border transition-colors cursor-pointer ${
                    votedReviews[rev.id]
                      ? "bg-[#C8A45D]/10 border-[#C8A45D] text-[#C8A45D] cursor-default"
                      : "bg-[#090909] border-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3]"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── 4. LIGHTBOX IMAGE MODAL ── */}
      {activeLightboxImage && (
        <div className="fixed inset-0 z-[240] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full max-h-[85vh] flex items-center justify-center">
            <img src={activeLightboxImage} alt="Enlarged Review Photo" className="max-w-full max-h-[80vh] object-contain rounded-[14px] shadow-2xl border border-[#2A2A2A]" />
            <button
              type="button"
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-[#151515] border border-[#2A2A2A] text-[#F8F6F3] rounded-full cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        productName={productName}
        onSubmitSuccess={handleAddNewReview}
      />
    </section>
  );
}
