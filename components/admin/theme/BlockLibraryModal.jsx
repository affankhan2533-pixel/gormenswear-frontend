"use client";

import { useState, useEffect } from "react";
import {
  Search, Star, Clock, X, Plus, Sparkles, Layout, Type,
  ShoppingBag, Video, Image as ImageIcon, Flame, MessageSquare,
  HelpCircle, Code, ShieldCheck, Tag, Heart, Mail, MapPin, Grid
} from "lucide-react";

export const BLOCK_CATALOG = [
  // HERO
  {
    id: "hero_banner",
    type: "hero",
    name: "Hero Banner",
    category: "Hero",
    description: "Classic luxury full-width banner with heading, subheading, and primary CTA",
    icon: Layout,
    defaultSettings: {
      heading: "SAVILE ROW TAILORING",
      subheading: "Redefining luxury menswear through precision craftsmanship",
      ctaText: "EXPLORE COLLECTION",
      ctaLink: "/shop",
      bgImage: "/images/lookbook/gor-lookbook-1.webp",
      overlayOpacity: 40,
      heroHeight: "medium",
    },
  },
  {
    id: "split_hero",
    type: "hero",
    name: "Split Hero",
    category: "Hero",
    description: "Dual-column layout featuring editorial image on one side and text on the other",
    icon: Layout,
    defaultSettings: {
      heading: "EDITORIAL SELECTION",
      subheading: "Curated Savile Row suits for private occasions",
      ctaText: "VIEW ATELIER",
      ctaLink: "/collections",
      bgImage: "/images/lookbook/gor-lookbook-2.webp",
      overlayOpacity: 20,
    },
  },
  {
    id: "video_hero",
    type: "hero",
    name: "Video Hero",
    category: "Hero",
    description: "Cinematic full-screen video background with overlay text controls",
    icon: Video,
    defaultSettings: {
      heading: "CINEMATIC SHOWCASE",
      subheading: "Watch the making of our Autumn/Winter capsule line",
      ctaText: "WATCH FILM",
      ctaLink: "/about",
      bgVideo: "https://cdn.gormenswear.com/hero.mp4",
      overlayOpacity: 50,
      heroHeight: "fullscreen",
    },
  },

  // COMMERCE
  {
    id: "featured_products_block",
    type: "featured_products",
    name: "Featured Products",
    category: "Commerce",
    description: "Curated product showcase grid with prices, badges, and quick wishlist",
    icon: ShoppingBag,
    defaultSettings: { title: "SIGNATURE PIECES", subtitle: "Handcrafted atelier menswear", limit: 4, productsPerRow: 4, showPrice: true },
  },
  {
    id: "featured_collections_block",
    type: "collections",
    name: "Featured Collections",
    category: "Commerce",
    description: "Visual category tiles for Savile Tailoring, Urban Casual, and Accessories",
    icon: Grid,
    defaultSettings: { title: "CURATED ATELIER LINE", limit: 3 },
  },
  {
    id: "best_sellers_block",
    type: "featured_products",
    name: "Best Sellers",
    category: "Commerce",
    description: "Highlight top-selling suits, poplin shirts, and cashmere overcoats",
    icon: Flame,
    defaultSettings: { title: "MOST COVETED GARMENTS", limit: 4, showBadge: true },
  },

  // CONTENT
  {
    id: "brand_story_block",
    type: "brand_story",
    name: "Brand Heritage Story",
    category: "Content",
    description: "Rich narrative layout showcasing Mayfair tailoring history and craftsmanship",
    icon: Type,
    defaultSettings: { title: "THE MAYFAIR LEGACY", story: "Founded at the intersection of British tailoring heritage and urban street culture." },
  },

  // MARKETING
  {
    id: "announcement_block",
    type: "announcement",
    name: "Announcement Bar",
    category: "Marketing",
    description: "Sticky notification banner for free shipping or private launch alerts",
    icon: Tag,
    defaultSettings: { text: "COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY OVER ₹15,000", bgColor: "#C8A45D", textColor: "#0D0D0D" },
  },
  {
    id: "newsletter_block",
    type: "newsletter",
    name: "VIP Newsletter",
    category: "Marketing",
    description: "Exclusive club subscription form for private lookbook drops",
    icon: Mail,
    defaultSettings: { title: "JOIN THE PRIVATE ATELIER CLUB", subtitle: "Receive private invitations to private capsule drops.", buttonText: "JOIN CLUB" },
  },

  // UTILITY
  {
    id: "faq_block",
    type: "brand_story",
    name: "FAQ Accordion",
    category: "Utility",
    description: "Help section for sizing, delivery, and return queries",
    icon: HelpCircle,
    defaultSettings: { title: "FREQUENTLY ASKED QUESTIONS", story: "Find answers regarding bespoke sizing and delivery timelines." },
  },
];

export default function BlockLibraryModal({ isOpen, onClose, onSelectBlock }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [recentlyUsed, setRecentlyUsed] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem("gor_block_favorites") || "[]");
      setFavorites(savedFavs);
    } catch (e) {}
  }, []);

  // Keyboard navigation Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleFavorite = (blockId, e) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(blockId)) {
      updated = favorites.filter((id) => id !== blockId);
    } else {
      updated = [...favorites, blockId];
    }
    setFavorites(updated);
    try {
      localStorage.setItem("gor_block_favorites", JSON.stringify(updated));
    } catch (err) {}
  };

  const handleBlockClick = (block) => {
    // Add to recently used
    const updatedRecent = [block.id, ...recentlyUsed.filter((id) => id !== block.id)].slice(0, 5);
    setRecentlyUsed(updatedRecent);

    onSelectBlock(block);
    onClose();
  };

  const CATEGORIES = ["All", "Favorites", "Recently Used", "Hero", "Commerce", "Content", "Marketing", "Utility"];

  const filteredBlocks = BLOCK_CATALOG.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "Favorites") return favorites.includes(b.id);
    if (selectedCategory === "Recently Used") return recentlyUsed.includes(b.id);
    if (selectedCategory !== "All") return b.category === selectedCategory;

    return true;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-[#1E1E1E] rounded-[20px] max-w-4xl w-full h-[680px] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C8A45D]" />
            <div>
              <h2 className="text-sm font-bold text-[#F0EDE8]">Storefront Block Library</h2>
              <p className="text-[11px] text-[#777]">Select a pre-designed luxury section block to add to your layout</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#666] hover:text-[#FFF] rounded-full hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-3.5 bg-[#121212] border-b border-[#1A1A1A] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blocks by name, category, or description..."
              className="w-full pl-9 pr-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-[8px] font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#C8A45D] text-[#0D0D0D]"
                    : "bg-[#181818] hover:bg-[#222] text-[#888] hover:text-[#E8E4DF] border border-[#242424]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blocks Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 scrollbar-none">
          {filteredBlocks.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[#666] space-y-2">
              <Layout className="w-8 h-8 mx-auto text-[#444]" />
              <p className="text-xs">No blocks found matching selected filters.</p>
            </div>
          ) : (
            filteredBlocks.map((b) => {
              const IconComp = b.icon || Layout;
              const isFav = favorites.includes(b.id);
              return (
                <div
                  key={b.id}
                  onClick={() => handleBlockClick(b)}
                  className="group bg-[#151515] hover:bg-[#1A1A1A] border border-[#222] hover:border-[#C8A45D] rounded-[14px] p-4 flex flex-col justify-between space-y-3 transition-all cursor-pointer shadow-md hover:shadow-xl"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-[10px] bg-[#1C1C1C] border border-[#282828] flex items-center justify-center text-[#C8A45D] group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#202020] rounded text-[10px] font-bold text-[#888] uppercase">
                          {b.category}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(b.id, e)}
                          className="p-1 text-[#666] hover:text-amber-400 cursor-pointer"
                          title="Toggle Favorite"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#E8E4DF] group-hover:text-[#C8A45D] transition-colors">
                        {b.name}
                      </h3>
                      <p className="text-[11px] text-[#777] mt-0.5 leading-relaxed">
                        {b.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#202020] flex items-center justify-between text-[10px] font-bold text-[#C8A45D] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Click to Insert Section</span>
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
