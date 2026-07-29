"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Folder,
  Image as ImageIcon,
  Film,
  FileText,
  Search,
  Grid,
  List,
  Trash2,
  Copy,
  Check,
  Eye,
  Plus,
  X,
  HardDrive,
  FolderPlus,
  Edit2,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

const INITIAL_MEDIA = [
  { id: "m1", name: "hero-main.jpg", type: "image", url: "/images/hero/hero-main.jpg", size: "1.8 MB", dimensions: "1920x1080", folder: "Hero Banners", date: "Jan 24, 2026" },
  { id: "m2", name: "gor-codset-burgundy-alo.webp", type: "image", url: "/images/products/gor-codset-burgundy-alo.webp", size: "420 KB", dimensions: "1200x1600", folder: "Products", date: "Jan 22, 2026" },
  { id: "m3", name: "gor-codset-beige-prada.webp", type: "image", url: "/images/products/gor-codset-beige-prada.webp", size: "380 KB", dimensions: "1200x1600", folder: "Products", date: "Jan 20, 2026" },
  { id: "m4", name: "gor-lookbook-1.webp", type: "image", url: "/images/lookbook/gor-lookbook-1.webp", size: "890 KB", dimensions: "1440x1800", folder: "Lookbook", date: "Jan 18, 2026" },
  { id: "m5", name: "lookbook-video-teaser.mp4", type: "video", url: "/video/lookbook.mp4", size: "14.2 MB", dimensions: "1080p", folder: "Videos", date: "Jan 15, 2026" },
  { id: "m6", name: "size-specification-guide.pdf", type: "document", url: "/docs/size-guide.pdf", size: "1.1 MB", dimensions: "PDF", folder: "Documents", date: "Jan 10, 2026" },
];

export default function MediaLibrary({ isPickerMode = false, onSelectMedia }) {
  const [mediaList, setMediaList] = useState(INITIAL_MEDIA);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [activePreview, setActivePreview] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const { success, error } = useToast();

  // Folders list
  const folders = useMemo(() => {
    return ["Hero Banners", "Products", "Lookbook", "Videos", "Documents"];
  }, []);

  // Filtered Media List
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFolder = selectedFolder === "all" || item.folder === selectedFolder;
      const matchType = fileTypeFilter === "all" || item.type === fileTypeFilter;
      return matchSearch && matchFolder && matchType;
    });
  }, [mediaList, searchQuery, selectedFolder, fileTypeFilter]);

  // Handle Drag & Drop Upload
  const handleDropUpload = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files || []);
    if (files.length === 0) return;

    const newMediaItems = files.map((file, idx) => {
      const isImg = file.type.startsWith("image/");
      const isVid = file.type.startsWith("video/");
      return {
        id: `m-${Date.now()}-${idx}`,
        name: file.name,
        type: isImg ? "image" : isVid ? "video" : "document",
        url: isImg ? URL.createObjectURL(file) : "/images/hero/hero-main.jpg",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dimensions: isImg ? "1200x1600" : "File",
        folder: isImg ? "Products" : isVid ? "Videos" : "Documents",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    });

    setMediaList((prev) => [...newMediaItems, ...prev]);
    success("Files Uploaded", `${files.length} file(s) added to Media Library.`);
  };

  // Select item toggle
  const toggleSelectItem = (id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedItemIds.length === 0) return;
    setMediaList((prev) => prev.filter((item) => !selectedItemIds.includes(item.id)));
    success("Media Deleted", `${selectedItemIds.length} item(s) removed.`);
    setSelectedItemIds([]);
  };

  // Copy Image URL
  const handleCopyUrl = (url, id) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      success("URL Copied", "Media URL copied to clipboard.");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* ── 1. HEADER CONTROL BAR ── */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-1">
              DIGITAL ASSET MANAGER
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F8F6F3]">
              Media Library & Files
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <label className="h-10 px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md">
              <Upload className="w-4 h-4" />
              <span>Upload Assets</span>
              <input type="file" multiple onChange={handleDropUpload} className="hidden" />
            </label>

            {selectedItemIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="h-10 px-4 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedItemIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets by name..."
                className="w-full h-9 pl-9 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
              />
            </div>

            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="h-9 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
            >
              <option value="all">All Folders</option>
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* View Mode & Type Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
              {["all", "image", "video", "document"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFileTypeFilter(t)}
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded ${
                    fileTypeFilter === t ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. DRAG & DROP UPLOAD ZONE ── */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropUpload}
        className="p-8 border-2 border-dashed border-[#2A2A2A] hover:border-[#C8A45D] rounded-[18px] bg-[#151515]/60 text-center space-y-2 transition-colors cursor-pointer"
      >
        <Upload className="w-8 h-8 text-[#C8A45D] mx-auto animate-bounce" />
        <h4 className="font-editorial text-lg text-[#F8F6F3]">Drag & Drop Assets Here</h4>
        <p className="text-xs text-[#8E8A85]">Supports WebP, JPG, PNG, MP4, and PDF files up to 25MB.</p>
      </div>

      {/* ── 3. MEDIA ASSETS GRID / LIST VIEW ── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`group bg-[#151515] border rounded-[14px] p-2.5 space-y-2 relative transition-all shadow-md ${
                  isSelected ? "border-[#C8A45D] bg-[#C8A45D]/5" : "border-[#2A2A2A] hover:border-[#C8A45D]/40"
                }`}
              >
                {/* Select Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleSelectItem(item.id)}
                  className="absolute top-4 left-4 z-20 text-[#C8A45D] cursor-pointer"
                >
                  {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-[#8E8A85]" />}
                </button>

                {/* Preview Thumbnail */}
                <div
                  onClick={() => (isPickerMode && onSelectMedia ? onSelectMedia(item) : setActivePreview(item))}
                  className="block relative aspect-[4/3] w-full overflow-hidden bg-[#090909] rounded-[10px] cursor-pointer"
                >
                  {item.type === "image" ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : item.type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-amber-400">
                      <Film className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-blue-400">
                      <FileText className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-[#F8F6F3] truncate">{item.name}</h5>
                  <div className="flex justify-between items-center text-[9.5px] text-[#8E8A85] font-mono">
                    <span>{item.size}</span>
                    <span>{item.dimensions}</span>
                  </div>
                </div>

                {/* Quick Actions overlay */}
                <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    title="Copy URL"
                    className="p-1 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreview(item)}
                    title="Preview"
                    className="p-1 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                <th className="py-3 px-4 font-bold">Select</th>
                <th className="py-3 px-4 font-bold">Asset</th>
                <th className="py-3 px-4 font-bold">Folder</th>
                <th className="py-3 px-4 font-bold">Size</th>
                <th className="py-3 px-4 font-bold">Dimensions</th>
                <th className="py-3 px-4 font-bold">Date Added</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredMedia.map((item) => (
                <tr key={item.id} className="hover:bg-[#090909]/60 transition-colors">
                  <td className="py-3 px-4">
                    <button type="button" onClick={() => toggleSelectItem(item.id)} className="text-[#C8A45D] cursor-pointer">
                      {selectedItemIds.includes(item.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-[#8E8A85]" />}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#090909] overflow-hidden border border-[#2A2A2A] shrink-0">
                      {item.type === "image" ? <img src={item.url} alt={item.name} className="w-full h-full object-cover" /> : <Film className="w-4 h-4 m-2 text-amber-400" />}
                    </div>
                    <span className="truncate max-w-xs">{item.name}</span>
                  </td>
                  <td className="py-3 px-4 text-[#8E8A85]">{item.folder}</td>
                  <td className="py-3 px-4 font-mono text-[#8E8A85]">{item.size}</td>
                  <td className="py-3 px-4 font-mono text-[#8E8A85]">{item.dimensions}</td>
                  <td className="py-3 px-4 text-[#8E8A85]">{item.date}</td>
                  <td className="py-3 px-4 text-right">
                    <button type="button" onClick={() => handleCopyUrl(item.url, item.id)} className="p-1 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer">
                      <Copy className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 4. LIGHTBOX ASSET PREVIEW MODAL ── */}
      {activePreview && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h4 className="font-editorial text-xl text-[#F8F6F3]">{activePreview.name}</h4>
              <button type="button" onClick={() => setActivePreview(null)} className="p-1 text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-[#090909] rounded-[12px] overflow-hidden flex items-center justify-center border border-[#2A2A2A]">
              {activePreview.type === "image" ? (
                <img src={activePreview.url} alt={activePreview.name} className="max-h-full object-contain" />
              ) : (
                <div className="text-center space-y-2 text-[#C8A45D]">
                  <Film className="w-12 h-12 mx-auto" />
                  <span className="text-xs uppercase font-bold block">{activePreview.name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-[#8E8A85] pt-2">
              <span>Size: {activePreview.size}</span>
              <span>Dimensions: {activePreview.dimensions}</span>
              <span>Folder: {activePreview.folder}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
