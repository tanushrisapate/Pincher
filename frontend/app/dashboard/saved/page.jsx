"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Bookmark,
  Trash2,
  Sparkles,
  Star,
  Layers,
  Wand2,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function SavedPage() {
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSavedLooks();
  }, []);

  const fetchSavedLooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/outfits/saved");
      if (res.ok) {
        const data = await res.json();
        setSavedOutfits(data.outfits || []);
      }
    } catch (err) {
      console.warn("Error fetching saved outfits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/outfits/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      console.error("Delete outfit error:", err);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await fetch(`/api/outfits/${id}/favorite`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSavedOutfits((prev) =>
          prev.map((o) => (o.id === id ? { ...o, is_favorite: data.is_favorite } : o))
        );
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  const filteredOutfits =
    filter === "favorites"
      ? savedOutfits.filter((o) => o.is_favorite)
      : filter !== "all"
      ? savedOutfits.filter((o) => (o.occasion || "").toLowerCase() === filter)
      : savedOutfits;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6212] mb-1">
            <Heart size={14} className="fill-[#B8860B] text-[#B8860B]" /> Curated Lookbook
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Saved Looks & Ensembles
          </h1>
          <p className="text-[#78716C] text-sm mt-1">
            Your personal collection of saved outfits and styling recipes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/recommendations"
            className="px-4 py-2.5 bg-[#B8860B] hover:bg-[#8C6212] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#B8860B]/20 flex items-center gap-1.5"
          >
            <Wand2 size={14} /> AI Stylist
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: `All Looks (${savedOutfits.length})` },
          { id: "favorites", label: "Favorites" },
          { id: "formal", label: "Formal" },
          { id: "daily", label: "Daily" },
          { id: "date", label: "Date Night" },
          { id: "party", label: "Party" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === tab.id
                ? "bg-[#FAF8F5] text-[#8C6212] border border-[#D4AF37] shadow-xs"
                : "bg-white text-[#57534E] border border-[#E7E5E4] hover:border-[#D4AF37]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Outfits List or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-[#E7E5E4] p-6 animate-pulse space-y-4">
              <div className="h-6 w-2/3 bg-stone-200 rounded" />
              <div className="h-44 bg-stone-100 rounded-2xl" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredOutfits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map((outfit) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-xl border border-[#E7E5E4] hover:border-[#D4AF37]/60 rounded-3xl p-5 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6212] bg-[#B8860B]/10 px-2 py-0.5 rounded-full">
                      {outfit.occasion || "Look"}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1C1917] mt-1 truncate">
                      {outfit.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(outfit.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      outfit.is_favorite
                        ? "text-red-500 bg-red-50"
                        : "text-[#A8A29E] hover:text-red-500 hover:bg-stone-50"
                    }`}
                  >
                    <Heart size={18} className={outfit.is_favorite ? "fill-current" : ""} />
                  </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-3 gap-2 my-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/80">
                  {outfit.top && (
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200">
                      <img src={outfit.top.image_url} alt={outfit.top.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {outfit.bottom && (
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200">
                      <img src={outfit.bottom.image_url} alt={outfit.bottom.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {outfit.shoes && (
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200">
                      <img src={outfit.shoes.image_url} alt={outfit.shoes.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {outfit.outerwear && (
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200">
                      <img src={outfit.outerwear.image_url} alt={outfit.outerwear.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {outfit.explanation && (
                  <p className="text-xs text-[#78716C] leading-relaxed line-clamp-2 mt-2">
                    {outfit.explanation}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-[#E7E5E4] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8C6212] bg-[#B8860B]/10 px-2 py-0.5 rounded-md">
                  {Math.round(outfit.harmony_score || 90)}% Harmony
                </span>

                <button
                  onClick={() => handleDelete(outfit.id)}
                  title="Remove from Lookbook"
                  className="p-1.5 text-[#A8A29E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-3xl shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">No Saved Looks Yet</h2>
          <p className="text-[#78716C] text-sm max-w-md mx-auto mb-6">
            Generate outfit recommendations or assemble looks in the Studio and save your favorites here.
          </p>
          <Link href="/dashboard/recommendations">
            <button className="px-6 py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-bold text-xs shadow-md shadow-[#B8860B]/20">
              Explore AI Recommendations &rarr;
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
