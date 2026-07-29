"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Upload, Check, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function WriteReviewModal({ isOpen, onClose, productName = "GARMENT", onSubmitSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [size, setSize] = useState("M");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagePreviews.length > 3) {
      error("Image Limit", "You can upload up to 3 photos.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      error("Validation Error", "Please enter your name.");
      return;
    }
    if (!title.trim()) {
      error("Validation Error", "Please enter a review title.");
      return;
    }
    if (!review.trim() || review.trim().length < 10) {
      error("Validation Error", "Review text must be at least 10 characters.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const newReviewObj = {
        id: `rev-${Date.now()}`,
        name: name.trim(),
        rating,
        title: title.trim(),
        text: review.trim(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        verified: true,
        size,
        helpfulCount: 0,
        images: imagePreviews,
      };

      setSubmitting(false);
      success("Review Submitted", "Thank you! Your verified review has been posted.");
      if (onSubmitSuccess) onSubmitSuccess(newReviewObj);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 bg-[#090909]/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 font-sans select-none relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-1">
                VERIFIED REVIEW
              </span>
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                Review {productName}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Star Rating Selector */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#8E8A85] font-bold block">
                Overall Rating
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                    aria-label={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? "fill-[#C8A45D] text-[#C8A45D]"
                          : "text-[#2A2A2A]"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#C8A45D] ml-2 font-mono">
                  {rating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Customer Name & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#8E8A85] font-bold block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander R."
                  required
                  className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#8E8A85] font-bold block mb-1">
                  Purchased Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#8E8A85] font-bold block mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exceptional fit and fabric weight"
                required
                className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
              />
            </div>

            {/* Review Body */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs uppercase tracking-wider text-[#8E8A85] font-bold block">
                  Review Details *
                </label>
                <span className="text-[10px] text-[#8E8A85] font-mono">
                  {review.length} / 500 chars
                </span>
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value.slice(0, 500))}
                placeholder="Share your thoughts regarding fit, drape, texture, and construction..."
                rows={4}
                required
                className="w-full p-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] text-xs text-[#F8F6F3] outline-none resize-none"
              />
            </div>

            {/* Photo Upload Zone */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#8E8A85] font-bold block mb-1">
                Add Customer Photos (Optional, max 3)
              </label>
              
              <div className="flex items-center gap-3">
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-[8px] overflow-hidden border border-[#2A2A2A]">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-[#090909]/80 text-rose-400 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {imagePreviews.length < 3 && (
                  <label className="w-16 h-16 rounded-[8px] border border-dashed border-[#2A2A2A] hover:border-[#C8A45D] bg-[#090909] flex flex-col items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer">
                    <ImageIcon className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] uppercase font-bold">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[46px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Submit Verified Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
