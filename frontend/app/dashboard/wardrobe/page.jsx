"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shirt,
  Search,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Filter,
  Tag,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "outerwear", label: "Outerwear" },
  { id: "dresses", label: "Dresses" },
  { id: "shoes", label: "Shoes" },
  { id: "accessories", label: "Accessories" },
];

export default function WardrobePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "all") queryParams.set("category", selectedCategory);
      if (searchTerm.trim()) queryParams.set("search", searchTerm.trim());

      const res = await fetch(`/api/wardrobe?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load wardrobe:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/wardrobe/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-4 sm:p-6 lg:p-10 text-[#1C1917] relative pb-28">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
              Your Wardrobe
            </h1>
            <p className="text-xs text-[#78716C] mt-0.5">
              {items.length} {items.length === 1 ? "piece" : "pieces"} in your smart closet
            </p>
          </div>

          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center gap-2 bg-[#B8860B] hover:bg-[#8C6212] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs"
          >
            <Plus size={16} />
            Add Garment
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search garments by name, color, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E7E5E4] rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#B8860B] transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#B8860B] text-white shadow-xs"
                      : "bg-white text-[#57534E] border border-[#E7E5E4] hover:border-[#B8860B] hover:text-[#1C1917]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl p-2.5 border border-[#E7E5E4] animate-pulse space-y-2"
              >
                <div className="w-full aspect-[4/5] bg-[#E7E5E4]/50 rounded-lg" />
                <div className="h-3.5 bg-[#E7E5E4]/60 rounded w-3/4" />
                <div className="h-2.5 bg-[#E7E5E4]/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 text-center border border-[#E7E5E4] shadow-xs flex flex-col items-center max-w-lg mx-auto my-8"
          >
            <div className="w-16 h-16 bg-[#B8860B]/10 rounded-full flex items-center justify-center text-[#B8860B] mb-4">
              <Shirt size={32} />
            </div>
            <h2 className="text-xl font-bold mb-1.5">No clothing items found</h2>
            <p className="text-[#57534E] mb-6 max-w-sm text-xs sm:text-sm">
              {searchTerm || selectedCategory !== "all"
                ? "No pieces match your search or category filter. Try selecting 'All Items'."
                : "Your digital wardrobe is empty. Add your shirts, trousers, jackets, and shoes to start getting outfit recommendations!"}
            </p>

            <Link
              href="/dashboard/upload"
              className="inline-flex items-center justify-center gap-2 bg-[#B8860B] hover:bg-[#8C6212] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs"
            >
              <Plus size={16} />
              Add Your First Item
            </Link>
          </motion.div>
        ) : (
          /* Live Wardrobe Items Grid */
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl overflow-hidden border border-[#E7E5E4] shadow-2xs hover:shadow-md transition-all group flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full bg-[#FAF8F5] overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Chip */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold text-[#1C1917] shadow-2xs uppercase tracking-wider">
                      {item.category}
                    </span>

                    {/* Delete Trigger */}
                    <button
                      onClick={() => setDeleteId(item.id)}
                      title="Delete item"
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-md transition-colors shadow-2xs opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Item Details */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-xs text-[#1C1917] truncate" title={item.name}>
                        {item.name}
                      </h3>
                      {item.subcategory && (
                        <p className="text-[11px] text-[#A8A29E] capitalize truncate">
                          {item.subcategory}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E7E5E4]/60 text-[11px]">
                      {/* Color Tag */}
                      <span className="inline-flex items-center gap-1.5 text-[#57534E] font-medium truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: item.color_hex }}
                        />
                        <span className="truncate">{item.color_name || "Color"}</span>
                      </span>

                      {/* Season Badge */}
                      <span className="text-[#8C6212] font-semibold capitalize bg-[#B8860B]/10 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                        {item.season || "All"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#E7E5E4] space-y-4"
            >
              <h3 className="text-lg font-bold text-[#1C1917]">Remove clothing item?</h3>
              <p className="text-sm text-[#57534E]">
                This will permanently delete this piece from your wardrobe and recommendation pool.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#E7E5E4] text-[#57534E] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteId)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Delete Piece"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Add Button */}
      <Link
        href="/dashboard/upload"
        title="Add Clothing Piece"
        className="fixed bottom-6 right-6 bg-[#B8860B] text-white p-4 rounded-full shadow-[0_4px_25px_rgba(184,134,11,0.4)] hover:bg-[#8C6212] hover:scale-105 transition-all z-40 flex items-center justify-center"
      >
        <Plus size={26} />
      </Link>
    </div>
  );
}
