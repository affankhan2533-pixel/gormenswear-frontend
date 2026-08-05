"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon, Video, Folder, Tag, Search, Plus, Upload,
  Star, Trash2, Edit3, Copy, Download, RefreshCw, X, Check,
  Grid, List, Sparkles, Filter, ShieldCheck, Eye, MoveHorizontal,
  Crop, RotateCw, FlipHorizontal, FlipVertical, CheckCircle2, ArrowUpRight,
  FolderPlus, Layers, Maximize, Camera, Film, FileUp, Compass, Target
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function MediaLibraryModal({
  isOpen = true,
  onClose,
  onSelectAsset,
  context = null, // { title, fieldName, targetModule, href }
  isModal = true,
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const fileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);

  const [assets, setAssets] = useState([]);
  const [folders, setFolders] = useState({});
  const [customFolders, setCustomFolders] = useState(["Hero Images", "Products", "Collections", "Campaigns", "Videos", "Uncategorized"]);
  const [loading, setLoading] = useState(true);

  // Drag & Drop Upload Overlay State
  const [isDragOver, setIsDragOver] = useState(false);

  // Filters & State
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [selectedFileType, setSelectedFileType] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Modals & Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Native Upload Workflow State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [uploadFolder, setUploadFolder] = useState("Hero Images");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Media Assets
  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedFolder !== "All") params.append("folder", selectedFolder);
      if (selectedFileType !== "All") params.append("fileType", selectedFileType.toLowerCase());
      if (showFavoritesOnly) params.append("favorite", "true");

      const res = await fetch(`${baseUrl}/api/media?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setAssets(json.assets || []);
        setFolders(json.folders || {});
        if (json.assets?.length > 0 && !selectedAsset) {
          setSelectedAsset(json.assets[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load media assets:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedFolder, selectedFileType, showFavoritesOnly, selectedAsset]);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, loadMedia]);

  // Handle Native Choose File
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    setUploadFile(file);
    setUploadName(file.name.replace(/\.[^/.]+$/, ""));
    setUploadAlt(file.name.replace(/\.[^/.]+$/, ""));

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadPreviewUrl(event.target.result);
      setShowUploadModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Replace Asset File
  const handleReplaceFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAsset) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const newMediaUrl = event.target.result;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/media/${selectedAsset._id}/replace`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newUrl: newMediaUrl, newFilename: file.name }),
        });
        const json = await res.json();
        if (json.success) {
          success("Asset Replaced", "File replaced across all system references");
          loadMedia();
        } else {
          toastError("Replace Failed", json.error);
        }
      } catch (err) {
        toastError("Replace Failed", err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Asset Function
  const handleDeleteAsset = async (asset, e) => {
    e?.stopPropagation();
    if (!asset) return;

    const realUsages = (asset.usedIn || []).filter(
      (u) => u.label !== "Newly Uploaded Asset" && u.label !== "Storefront Media Catalog"
    );

    if (realUsages.length > 0) {
      alert(`Cannot delete asset '${asset.filename}'. It is currently used in active website sections (${realUsages.map((u) => u.label).join(", ")}).`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete media asset '${asset.filename}'?`)) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/media/${asset._id}?force=true`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        success("Asset Deleted", `'${asset.filename}' deleted successfully.`);
        if (selectedAsset?._id === asset._id) setSelectedAsset(null);
        loadMedia();
      } else {
        toastError("Delete Failed", json.error);
      }
    } catch (err) {
      toastError("Delete Failed", err.message);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Submit Native File Upload
  const handleNativeUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile && !uploadPreviewUrl) return;

    setIsUploading(true);
    setUploadProgress(20);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      let json;

      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("filename", uploadName.trim() ? `${uploadName.trim()}.${uploadFile.name.split(".").pop()}` : uploadFile.name);
        formData.append("folder", uploadFolder);
        formData.append("altText", uploadAlt.trim() || uploadName.trim());

        const res = await fetch(`${baseUrl}/api/media/upload-file`, {
          method: "POST",
          body: formData,
        });
        json = await res.json();
      } else {
        const finalMediaUrl = uploadPreviewUrl || `/images/lookbook/${uploadName.toLowerCase().replace(/\s+/g, "-")}.webp`;
        const res = await fetch(`${baseUrl}/api/media/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: `${uploadName.trim()}.webp`,
            url: finalMediaUrl,
            folder: uploadFolder,
            altText: uploadAlt.trim() || uploadName.trim(),
            fileType: "image",
          }),
        });
        json = await res.json();
      }

      clearInterval(timer);
      setUploadProgress(100);

      if (json.success) {
        success("File Uploaded & Processed", `'${uploadName}' added to ${uploadFolder}`);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setShowUploadModal(false);
          setUploadFile(null);
          setUploadPreviewUrl("");
          loadMedia();
        }, 400);
      } else {
        setIsUploading(false);
        toastError("Upload Failed", json.error);
      }
    } catch (err) {
      clearInterval(timer);
      setIsUploading(false);
      toastError("Upload Failed", err.message);
    }
  };

  // CONTEXT-AWARE ASSET SELECTION & ASSIGNMENT WORKFLOW
  const handleChooseAsset = async (asset) => {
    if (!asset) return;

    if (context && context.title) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        await fetch(`${baseUrl}/api/media/${asset._id}/assign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: context.title,
            href: context.href || "/admin/theme",
          }),
        });
      } catch (e) {}
    }

    if (onSelectAsset) {
      onSelectAsset({
        mediaId: asset._id,
        url: asset.url,
        altText: asset.altText,
        filename: asset.filename,
      });
      if (onClose) onClose();
    }
  };

  if (!isOpen) return null;

  const content = (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-[#111] border border-[#1E1E1E] flex flex-col overflow-hidden shadow-2xl relative ${
        isModal ? "rounded-[20px] max-w-6xl w-full h-[750px]" : "rounded-[16px] w-full min-h-[750px]"
      }`}
    >
      {/* Hidden Native File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleReplaceFileSelected}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Full-Screen Drag & Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 space-y-4 border-2 border-dashed border-[#C8A45D] animate-in fade-in duration-150">
          <Upload className="w-12 h-12 text-[#C8A45D] animate-bounce" />
          <h2 className="text-lg font-bold text-[#F0EDE8]">Drop files anywhere to upload to Media Library</h2>
          <p className="text-xs text-[#777]">Supports WebP, AVIF, PNG, JPEG, SVG, MP4</p>
        </div>
      )}

      {/* CONTEXT-AWARE ASSIGNMENT BANNER */}
      {context && (
        <div className="bg-[#C8A45D] text-[#0D0D0D] px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Context Assignment Mode: Assigning asset to {context.targetModule || "Page"} ({context.title})</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">Field: {context.fieldName || "Media"}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="p-4 bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#C8A45D]" />
          <div>
            <h2 className="text-sm font-bold text-[#F0EDE8]">Enterprise Media Library & Digital Asset Manager</h2>
            <p className="text-[11px] text-[#777]">Production-ready asset manager — 100% native device uploads without manual URLs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer shadow-sm"
          >
            <FileUp className="w-4 h-4" />
            <span>Choose File from Device</span>
          </button>

          {isModal && onClose && (
            <button type="button" onClick={onClose} className="p-1.5 text-[#666] hover:text-[#FFF]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Body Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT FOLDER SIDEBAR (3 Cols) */}
        <div className="lg:col-span-3 bg-[#131313] border-r border-[#1E1E1E] p-3 space-y-4 flex flex-col text-xs">
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] text-[#C8A45D] font-bold uppercase">Media Folders</span>
            </div>

            <div className="space-y-1">
              {["All", ...customFolders].map((f) => {
                const count = f === "All" ? assets.length : folders[f] || 0;
                const isActive = selectedFolder === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFolder(f)}
                    className={`w-full px-2.5 py-2 rounded-[8px] flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                      isActive ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#888] hover:bg-[#1C1C1C] hover:text-[#E8E4DF]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5" />
                      <span>{f}</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER MEDIA CATALOG (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col bg-[#0F0F0F] overflow-hidden border-r border-[#1E1E1E]">
          {/* Dropzone & Search Bar */}
          <div className="p-3 bg-[#141414] border-b border-[#1E1E1E] flex flex-col gap-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-[#181818] border-2 border-dashed border-[#2A2A2A] hover:border-[#C8A45D] rounded-[10px] text-center cursor-pointer transition-colors group"
            >
              <FileUp className="w-5 h-5 mx-auto text-[#777] group-hover:text-[#C8A45D] transition-colors" />
              <p className="text-xs font-bold text-[#E8E4DF] mt-1">Click to Choose File or Drag & Drop Here</p>
              <p className="text-[10px] text-[#666]">Supports Photo Gallery, Camera, Videos, PNG, WebP, AVIF</p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assets by name, tag, folder..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-[6px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
                />
              </div>

              <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-[6px] p-0.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${viewMode === "grid" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777]"}`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${viewMode === "list" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777]"}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid / List Asset Display */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
            {assets.length === 0 ? (
              <div className="py-20 text-center text-[#666] space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-[#444]" />
                <p className="text-xs">No media assets found in this folder.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {assets.map((asset) => {
                  const isSelected = selectedAsset?._id === asset._id;
                  return (
                    <div
                      key={asset._id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`group relative bg-[#161616] border rounded-[12px] overflow-hidden cursor-pointer transition-all aspect-square flex flex-col ${
                        isSelected ? "border-[#C8A45D] ring-2 ring-[#C8A45D]/30" : "border-[#222] hover:border-[#333]"
                      }`}
                    >
                      <div className="flex-1 bg-[#0A0A0A] flex items-center justify-center overflow-hidden relative">
                        {asset.fileType === "video" ? (
                          <div className="flex flex-col items-center justify-center text-[#C8A45D]">
                            <Video className="w-8 h-8" />
                            <span className="text-[9px] font-bold mt-1">MP4 VIDEO</span>
                          </div>
                        ) : (
                          <img
                            src={asset.url}
                            alt={asset.altText}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Quick Delete Overlay Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAsset(asset, e)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-950/80 hover:bg-rose-600 border border-rose-500/40 text-rose-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-2 bg-[#121212] border-t border-[#1E1E1E] flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#E8E4DF] truncate max-w-[100px]">{asset.filename}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {assets.map((asset) => (
                  <div
                    key={asset._id}
                    onClick={() => setSelectedAsset(asset)}
                    className="p-2.5 bg-[#161616] border border-[#222] hover:border-[#C8A45D] rounded-[10px] flex items-center justify-between cursor-pointer text-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#0E0E0E] overflow-hidden flex items-center justify-center">
                        {asset.fileType === "video" ? <Video className="w-4 h-4 text-[#C8A45D]" /> : <img src={asset.url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-bold text-[#E8E4DF]">{asset.filename}</div>
                        <span className="text-[10px] text-[#666]">{asset.folder} • {(asset.size / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteAsset(asset, e)}
                        className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChooseAsset(asset)}
                        className="px-3 py-1 bg-[#C8A45D] text-[#0D0D0D] font-bold text-[11px] rounded"
                      >
                        Use Asset
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ASSET DETAILS, USAGE TRACKER & DELETE BUTTON (3 Cols) */}
        <div className="lg:col-span-3 bg-[#111] p-4 flex flex-col h-full overflow-y-auto space-y-4 text-xs scrollbar-none">
          {!selectedAsset ? (
            <div className="py-20 text-center text-[#666]">Select an asset to view details & delete</div>
          ) : (
            <>
              {/* Asset Preview */}
              <div className="h-44 bg-[#0A0A0A] border border-[#222] rounded-[12px] overflow-hidden flex items-center justify-center relative">
                {selectedAsset.fileType === "video" ? (
                  <video src={selectedAsset.url} controls className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.altText}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Asset Title & Use Asset Button */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#E8E4DF] truncate">{selectedAsset.filename}</h3>
                  <button
                    type="button"
                    onClick={() => handleChooseAsset(selectedAsset)}
                    className="px-4 py-1.5 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] font-bold text-xs rounded-[6px] transition-colors cursor-pointer shadow-sm"
                  >
                    Use Asset
                  </button>
                </div>

                {/* REAL SYSTEM USAGE TRACKER */}
                <div className="p-3 bg-[#141414] border border-[#222] rounded-[10px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#C8A45D] font-bold uppercase">Real System Usage Tracker</span>
                    <span className="text-[10px] text-[#777] font-mono">Used in {selectedAsset.usageCount || 0} locations</span>
                  </div>

                  <div className="space-y-1">
                    {(selectedAsset.usedIn || []).map((loc, i) => (
                      <div
                        key={i}
                        onClick={() => router.push(loc.href)}
                        className="p-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#262626] rounded flex items-center justify-between text-[11px] text-[#E8E4DF] cursor-pointer"
                      >
                        <span className="font-semibold">{loc.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-[#C8A45D]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* REPLACE FILE & DELETE ASSET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-[#222]">
                  <button
                    type="button"
                    onClick={() => replaceFileInputRef.current?.click()}
                    className="w-full py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-[#C8A45D] font-bold text-xs rounded flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Choose Replacement File</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteAsset(selectedAsset, e)}
                    className="w-full py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Asset</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* TRUE NATIVE UPLOAD PROGRESS MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleNativeUploadSubmit} className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
                <FileUp className="w-4 h-4 text-[#C8A45D]" />
                Upload Device File to Media Library
              </h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-[#666]">✕</button>
            </div>

            {uploadPreviewUrl && (
              <div className="h-40 bg-[#0A0A0A] border border-[#222] rounded-[12px] overflow-hidden flex items-center justify-center">
                {uploadFile?.type?.startsWith("video") ? (
                  <video src={uploadPreviewUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={uploadPreviewUrl} alt="" className="w-full h-full object-contain" />
                )}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#888] font-semibold block mb-1">Asset Title / Name *</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Mayfair Double Breasted Suit"
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-[#E8E4DF]"
                />
              </div>

              <div>
                <label className="text-[#888] font-semibold block mb-1">Target Folder</label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-[#E8E4DF]"
                >
                  {customFolders.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-mono text-[#C8A45D]">
                    <span>Uploading & Compressing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1C1C1C] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C8A45D] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsUploading(false);
                  setShowUploadModal(false);
                }}
                className="w-1/2 py-2 bg-[#1C1C1C] text-[#888] text-xs rounded-[8px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="w-1/2 py-2 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded-[8px] flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? "Processing..." : "Confirm & Upload"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  if (!isModal) return content;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl">
        {content}
      </div>
    </div>
  );
}
