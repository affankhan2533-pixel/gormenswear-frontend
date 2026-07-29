"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Save, Eye, EyeOff, Sparkles, Check, ArrowRight } from "lucide-react";
import MediaLibraryModal from "@/components/admin/media/MediaLibraryModal";
import { useToast } from "@/context/ToastContext";

export default function ClientSectionEditDrawer({
  isOpen = false,
  section = null,
  onClose,
  onSectionSaved,
}) {
  const { success, error: toastError } = useToast();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // Merchant-friendly form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [mediaId, setMediaId] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (section) {
      const s = section.settings || {};
      setTitle(s.heading || s.title || "");
      setSubtitle(s.subheading || s.subtitle || s.description || "");
      setBgImage(s.bgImage || s.image || "/images/lookbook/gor-lookbook-1.webp");
      setMediaId(s.mediaId || "");
      setButtonText(s.ctaText || s.buttonText || "");
      setButtonLink(s.ctaLink || s.buttonLink || "/shop");
      setIsEnabled(section.enabled !== false);
    }
  }, [section]);

  if (!isOpen || !section) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const updatedSettings = {
        ...(section.settings || {}),
        heading: title,
        title: title,
        subheading: subtitle,
        subtitle: subtitle,
        bgImage: bgImage,
        image: bgImage,
        mediaId: mediaId,
        ctaText: buttonText,
        buttonText: buttonText,
        ctaLink: buttonLink,
        buttonLink: buttonLink,
      };

      const res = await fetch(`${baseUrl}/api/theme/section-update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: section.id,
          enabled: isEnabled,
          settings: updatedSettings,
        }),
      });

      const json = await res.json();
      if (json.success) {
        success("Section Saved", `'${section.name}' updated on live storefront.`);
        if (onSectionSaved) onSectionSaved(json.theme);
        onClose();
      } else {
        toastError("Save Failed", json.error);
      }
    } catch (err) {
      toastError("Save Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end">
      <div className="bg-[#111] border-l border-[#1E1E1E] w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#E8E4DF]">{section.name}</h2>
              <span className="px-2 py-0.5 bg-[#C8A45D]/15 text-[#C8A45D] text-[10px] font-bold rounded">
                Client Mode
              </span>
            </div>
            <p className="text-[11px] text-[#777]">Customize content and media for this website section</p>
          </div>

          <button type="button" onClick={onClose} className="p-1.5 text-[#666] hover:text-[#FFF]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Client Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs scrollbar-none">
          {/* Section Visibility Toggle */}
          <div className="p-3 bg-[#161616] border border-[#222] rounded-[12px] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#E8E4DF]">Section Visibility</div>
              <div className="text-[10px] text-[#666]">Show or hide this section on your live homepage</div>
            </div>
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`px-3 py-1.5 rounded-[6px] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                isEnabled ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" : "bg-rose-500/15 border border-rose-500/30 text-rose-400"
              }`}
            >
              {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isEnabled ? "Visible" : "Hidden"}</span>
            </button>
          </div>

          {/* Title Field */}
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1">Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SAVILE ROW TAILORING"
              className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-[8px] text-xs text-[#E8E4DF] focus:border-[#C8A45D]"
            />
          </div>

          {/* Subtitle / Description Field */}
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1">Subtitle / Description</label>
            <textarea
              rows={3}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Redefining luxury menswear through precision tailoring..."
              className="w-full px-3 py-2 bg-[#161616] border border-[#262626] rounded-[8px] text-xs text-[#E8E4DF] focus:border-[#C8A45D]"
            />
          </div>

          {/* Section Image Media Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#888] block">Section Background / Image</label>
            {bgImage ? (
              <div className="relative h-40 bg-[#0A0A0A] border border-[#262626] rounded-[10px] overflow-hidden group">
                <img src={bgImage} alt="Section Media" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-[#C8A45D] transition-opacity"
                >
                  Change Image from Media Library
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="w-full py-2.5 px-3 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-[#C8A45D] font-bold text-xs rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{bgImage ? "Choose Different Image" : "Choose Image from Media Library"}</span>
            </button>
          </div>

          {/* CTA Button Fields */}
          <div className="p-3.5 bg-[#141414] border border-[#222] rounded-[12px] space-y-3">
            <span className="text-[10px] text-[#C8A45D] font-bold uppercase block">Call to Action Button</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#777] font-semibold block mb-1">Button Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. EXPLORE COLLECTION"
                  className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded text-xs text-[#E8E4DF]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#777] font-semibold block mb-1">Button Link</label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="e.g. /shop"
                  className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded text-xs text-[#E8E4DF]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-[#141414] border-t border-[#1E1E1E] flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-2.5 bg-[#1C1C1C] text-[#888] font-semibold text-xs rounded-[8px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-2/3 py-2.5 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] font-bold text-xs rounded-[8px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Section Changes"}</span>
          </button>
        </div>
      </div>

      {/* Context-Aware Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        context={{
          title: section.name,
          fieldName: "Section Image",
          targetModule: "Website Manager",
          href: "/admin/website",
        }}
        onSelectAsset={(asset) => {
          setBgImage(asset.url);
          setMediaId(asset.mediaId);
          setShowMediaPicker(false);
        }}
        isModal={true}
      />
    </div>
  );
}
