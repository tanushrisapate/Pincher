"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { classifyClothingImage, extractDominantColor } from "@/app/lib/clothingClassifier";

const CATEGORIES = [
  { id: "tops", label: "Tops", icon: "👕", desc: "Shirts, T-shirts, Polos, Hoodies" },
  { id: "bottoms", label: "Bottoms", icon: "👖", desc: "Jeans, Trousers, Chinos, Shorts" },
  { id: "outerwear", label: "Outerwear", icon: "🧥", desc: "Jackets, Coats, Blazers, Overcoats" },
  { id: "dresses", label: "Dresses", icon: "👗", desc: "Casual & Formal Dresses, Jumpsuits" },
  { id: "shoes", label: "Shoes", icon: "👟", desc: "Sneakers, Boots, Loafers, Oxfords" },
  { id: "accessories", label: "Accessories", icon: "👜", desc: "Bags, Belts, Watches, Hats" },
];

const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "All"];
const STYLES = ["Casual", "Formal", "Smart Casual", "Streetwear", "Minimalist", "Classic", "Sporty"];
const OCCASIONS = ["Daily", "Work", "Party", "Date Night", "Outdoor", "Gym", "Formal Event"];

const QUICK_COLORS = [
  { hex: "#111111", name: "Jet Black" },
  { hex: "#27272A", name: "Charcoal Black" },
  { hex: "#64748B", name: "Slate Grey" },
  { hex: "#FFFFFF", name: "Pure White" },
  { hex: "#F5EBE0", name: "Cream / Off-White" },
  { hex: "#C19A6B", name: "Camel / Tan" },
  { hex: "#8B4513", name: "Saddle Brown" },
  { hex: "#B8860B", name: "Dark Goldenrod" },
  { hex: "#D4AF37", name: "Champagne Gold" },
  { hex: "#1E293B", name: "Navy Blue" },
  { hex: "#1E3A8A", name: "Royal Blue" },
  { hex: "#722F37", name: "Burgundy Wine" },
  { hex: "#15803D", name: "Emerald Green" },
  { hex: "#556B2F", name: "Olive Green" },
];

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDetection, setAiDetection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    color_hex: "#111111",
    color_name: "Jet Black",
    season: "All",
    occasion: "Daily",
    styles: ["Casual"],
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    setErrorMessage("");
    setIsAnalyzing(true);
    setAiDetection(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      setImagePreview(dataUrl);

      const tempImg = new Image();
      tempImg.onload = async () => {
        // 1. Precision Dominant Color Extraction
        const colorResult = extractDominantColor(tempImg);

        // 2. AI DeepFashion2 Inference
        const aiResult = await classifyClothingImage(dataUrl);

        setAiDetection(aiResult);

        // Formulate smart garment title
        const formattedCategory = aiResult.category.charAt(0).toUpperCase() + aiResult.category.slice(1);
        const suggestedTitle = `${colorResult.name} ${formattedCategory}`;

        setFormData((prev) => ({
          ...prev,
          name: prev.name || suggestedTitle,
          category: aiResult.category,
          color_hex: colorResult.hex,
          color_name: colorResult.name,
        }));

        setIsAnalyzing(false);
      };
      tempImg.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const toggleStyle = (style) => {
    setFormData((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      setErrorMessage("Please upload an image of your clothing piece.");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Please enter an item name.");
      return;
    }
    if (!formData.category) {
      setErrorMessage("Please select a category.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          subcategory: formData.subcategory || null,
          color_hex: formData.color_hex,
          color_name: formData.color_name,
          season: formData.season.toLowerCase(),
          occasion: formData.occasion.toLowerCase(),
          image_url: imagePreview,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save item to wardrobe");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/wardrobe");
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-4 sm:p-6 lg:p-10 text-[#1C1917] pb-24">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <Link
            href="/dashboard/wardrobe"
            className="text-[#8C6212] hover:text-[#B8860B] text-sm font-semibold mb-4 inline-flex items-center gap-1 transition-colors"
          >
            ← Back to Wardrobe
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-[#1C1917]">
            Add to Your Wardrobe ✨
          </h1>
          <p className="text-[#57534E] mt-2">
            Upload a photo of your clothing item. Our AI will automatically detect its category, exact color, and styling attributes.
          </p>
        </header>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E7E5E4]">
          {/* Image Upload Zone */}
          <div
            className={`relative w-full min-h-[260px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all ${
              dragActive
                ? "border-[#B8860B] bg-[#FAF8F5]"
                : imagePreview
                ? "border-[#D4AF37]/50 bg-[#FAF8F5]/30"
                : "border-[#D1D5DB] hover:border-[#B8860B] hover:bg-[#FAF8F5]"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative w-full flex flex-col items-center justify-center py-2">
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white mb-4 bg-stone-100">
                  <img
                    src={imagePreview}
                    alt="Uploaded garment"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setAiDetection(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="flex items-center gap-2 text-sm text-[#8C6212] font-semibold bg-[#B8860B]/10 px-4 py-2 rounded-full animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" /> DeepFashion2 AI Analyzing Garment...
                  </div>
                ) : aiDetection ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-wrap items-center justify-center gap-2.5"
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      AI Detected: {aiDetection.category.toUpperCase()} ({aiDetection.confidence}%)
                    </span>
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#1C1917] bg-white border border-[#E7E5E4] px-3 py-1.5 rounded-full shadow-xs">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: formData.color_hex }}
                      />
                      Extracted: <strong>{formData.color_name}</strong>
                    </span>
                  </motion.div>
                ) : null}
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 bg-gradient-to-tr from-[#B8860B]/15 to-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-4 text-[#B8860B]">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold text-[#1C1917]">
                  Drop your clothing photo here
                </p>
                <p className="text-sm text-[#A8A29E] mt-1">or click to browse from device</p>
              </>
            )}
          </div>

          {/* Interactive Category Selector Pills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#1C1917]">
                Category <span className="text-red-500">*</span>
              </label>
              {aiDetection && (
                <span className="text-xs text-[#8C6212] font-semibold flex items-center gap-1 bg-[#B8860B]/10 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Tap any card to switch category
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat.id;
                const isAiSuggested = aiDetection?.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`relative p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#B8860B] bg-[#FAF8F5] ring-2 ring-[#B8860B]/20 shadow-sm"
                        : "border-[#E7E5E4] bg-white hover:border-[#D4AF37] hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-2xl">{cat.icon}</span>
                      {isAiSuggested && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          AI Pick
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1C1917]">{cat.label}</div>
                      <div className="text-[11px] text-[#78716C] truncate">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#1C1917]">Item Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Jet Black Silk Shirt, Classic Oxford Shoes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all placeholder:text-[#A8A29E]"
                required
              />
            </div>

            {/* Subcategory / Type */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#1C1917]">Sub-Type (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Oxford Shoes, Denim Jacket, Chinos"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all placeholder:text-[#A8A29E]"
              />
            </div>

            {/* Color Palette & Custom Dropper */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#1C1917]">
                  Garment Color: <strong className="text-[#8C6212]">{formData.color_name}</strong>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: formData.color_hex }}
                  />
                  <code className="text-xs text-[#78716C] bg-stone-100 px-2 py-0.5 rounded font-mono">
                    {formData.color_hex}
                  </code>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    onClick={() => setFormData({ ...formData, color_hex: c.hex, color_name: c.name })}
                    className={`w-9 h-9 rounded-full transition-all border border-black/15 flex items-center justify-center ${
                      formData.color_hex.toUpperCase() === c.hex.toUpperCase()
                        ? "ring-2 ring-offset-2 ring-[#B8860B] scale-110 shadow-sm"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {formData.color_hex.toUpperCase() === c.hex.toUpperCase() && (
                      <Check className={`w-4 h-4 ${c.hex === "#FFFFFF" || c.hex === "#F5EBE0" ? "text-black" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1C1917]">Season</label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all text-[#1C1917]"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1C1917]">Occasion</label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all text-[#1C1917]"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Style Persona Tags */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#1C1917]">Style Persona Tags</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    type="button"
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      formData.styles.includes(style)
                        ? "bg-[#B8860B] text-white shadow-xs"
                        : "bg-white text-[#57534E] border border-[#E7E5E4] hover:border-[#D4AF37]"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-[#E7E5E4]">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess || !imagePreview || !formData.name || !formData.category}
              className={`w-full py-4 rounded-xl text-white font-bold text-base transition-all flex items-center justify-center gap-2 ${
                isSuccess
                  ? "bg-[#22C55E]"
                  : "bg-[#B8860B] hover:bg-[#8C6212] shadow-[0_8px_25px_rgba(184,134,11,0.25)] hover:shadow-[0_8px_30px_rgba(184,134,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSuccess ? (
                <>
                  <Check className="w-5 h-5" /> Saved to Wardrobe!
                </>
              ) : (
                "Save to Wardrobe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
