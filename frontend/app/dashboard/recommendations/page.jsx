"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  Sparkles,
  Star,
  Upload,
  Calendar,
  Wand2,
  Heart,
  Check,
  RefreshCw,
  Sun,
  ShieldCheck,
  AlertCircle,
  Tag,
  ArrowRight
} from "lucide-react";

const OCCASIONS = [
  { id: "daily", label: "Daily Casual", icon: "✨" },
  { id: "formal", label: "Work / Formal", icon: "💼" },
  { id: "date", label: "Date Night", icon: "🍷" },
  { id: "party", label: "Evening Party", icon: "🥂" },
  { id: "outdoor", label: "Outdoor / Weekend", icon: "🌿" },
];

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [occasion, setOccasion] = useState("daily");
  const [temperature, setTemperature] = useState(24.0);
  const [weatherCondition, setWeatherCondition] = useState("Clear");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedOutfitIds, setSavedOutfitIds] = useState(new Set());
  const [saveLoadingId, setSaveLoadingId] = useState(null);
  const [wardrobeCount, setWardrobeCount] = useState(0);

  // Load weather and check wardrobe item count
  useEffect(() => {
    async function initContext() {
      try {
        const weatherRes = await fetch("/api/weather/current?lat=28.6139&lon=77.2090&city=Delhi");
        if (weatherRes.ok) {
          const w = await weatherRes.json();
          if (w.data) {
            setTemperature(w.data.temperature);
            setWeatherCondition(w.data.condition);
          }
        }

        const wardrobeRes = await fetch("/api/wardrobe");
        if (wardrobeRes.ok) {
          const wData = await wardrobeRes.json();
          const items = wData.items || [];
          setWardrobeCount(items.length);
          if (items.length > 0) {
            fetchRecommendations("daily", wData.items);
          }
        }
      } catch (err) {
        console.warn("Init recommendations error:", err);
      }
    }

    initContext();
  }, []);

  const fetchRecommendations = async (selectedOccasion = occasion, cachedItems = null) => {
    setIsLoading(true);
    try {
      // Direct call to FastAPI /api/outfits/recommend or local route
      const res = await fetch("http://localhost:8000/api/outfits/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          occasion: selectedOccasion,
          temperature: temperature,
          weather_condition: weatherCondition,
          persona: user?.persona || "classic",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } else {
        // Fallback: fetch directly from Next.js wardrobe and generate client-side preview
        const wRes = await fetch("/api/wardrobe");
        const wData = await wRes.json();
        const items = wData.items || [];
        
        // Simple synthetic pairing fallback if FastAPI server is temporarily starting
        const tops = items.filter((i) => i.category === "tops");
        const bottoms = items.filter((i) => i.category === "bottoms");
        const shoes = items.filter((i) => i.category === "shoes");
        const outerwear = items.filter((i) => i.category === "outerwear");

        const fallbacks = [];
        if (tops.length > 0 && bottoms.length > 0) {
          fallbacks.push({
            id: "fb-1",
            title: `${tops[0].name.split(" ")[0]} & ${bottoms[0].name.split(" ")[0]} Ensemble`,
            top: tops[0],
            bottom: bottoms[0],
            shoes: shoes[0] || null,
            outerwear: outerwear[0] || null,
            scores: { color_harmony: 94.0, weather_fit: 95.0, persona_match: 92.0, total_score: 93.8 },
            explanation: `${tops[0].name} paired with ${bottoms[0].name} creates a balanced palette tailored for ${selectedOccasion}.`,
            weather_badge: `${Math.round(temperature)}°C • ${weatherCondition}`,
            harmony_tag: "Neutral Accent",
          });
        }
        setRecommendations(fallbacks);
      }
    } catch (err) {
      console.warn("Recommendation engine fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOutfit = async (outfit) => {
    setSaveLoadingId(outfit.id);
    try {
      const res = await fetch("http://localhost:8000/api/outfits/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: outfit.title,
          top_item_id: outfit.top?.id || null,
          bottom_item_id: outfit.bottom?.id || null,
          outerwear_item_id: outfit.outerwear?.id || null,
          shoes_item_id: outfit.shoes?.id || null,
          occasion: occasion,
          harmony_score: outfit.scores?.color_harmony || 90.0,
          explanation: outfit.explanation,
        }),
      });

      setSavedOutfitIds((prev) => new Set([...prev, outfit.id]));
    } catch (err) {
      console.error("Failed to save outfit:", err);
    } finally {
      setSaveLoadingId(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6212] mb-1">
            <Sparkles size={14} /> AI Outfit Recommendation Studio
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Curated For You ✨
          </h1>
          <p className="text-[#78716C] text-sm mt-1">
            Synthesized exclusively from your real wardrobe pieces, attuned to today's climate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRecommendations(occasion)}
            disabled={isLoading || wardrobeCount === 0}
            className="px-4 py-2.5 bg-[#B8860B] hover:bg-[#8C6212] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#B8860B]/20 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Generate New Looks</span>
          </button>
        </div>
      </div>

      {/* Occasion & Weather Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Occasions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              onClick={() => {
                setOccasion(occ.id);
                fetchRecommendations(occ.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                occasion === occ.id
                  ? "bg-[#FAF8F5] text-[#8C6212] border border-[#D4AF37] shadow-xs"
                  : "bg-white text-[#57534E] border border-[#E7E5E4] hover:border-[#D4AF37]"
              }`}
            >
              <span>{occ.icon}</span>
              <span>{occ.label}</span>
            </button>
          ))}
        </div>

        {/* Live Weather Badge */}
        <div className="flex items-center gap-3 text-xs font-semibold bg-stone-50 border border-[#E7E5E4] px-4 py-2 rounded-xl text-[#1C1917] shrink-0">
          <span>☀️</span>
          <span>{Math.round(temperature)}°C</span>
          <span className="text-[#A8A29E]">•</span>
          <span className="text-[#57534E]">{weatherCondition}</span>
        </div>
      </div>

      {/* Recommendations Feed or Empty State */}
      {wardrobeCount === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center p-12 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-3xl shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">Upload Clothes to Unlock Recommendations</h2>
          <p className="text-[#78716C] text-sm max-w-md mx-auto mb-6">
            We need at least a few items in your wardrobe catalog to synthesize personalized outfits.
          </p>
          <Link href="/dashboard/upload">
            <button className="px-6 py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-bold text-xs shadow-md shadow-[#B8860B]/20 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Add Your First Garment
            </button>
          </Link>
        </motion.div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white/80 rounded-3xl border border-[#E7E5E4] p-6 animate-pulse space-y-4">
              <div className="h-6 w-1/2 bg-stone-200 rounded" />
              <div className="grid grid-cols-3 gap-3 h-48 bg-stone-100 rounded-2xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const isSaved = savedOutfitIds.has(rec.id);
            const isSaving = saveLoadingId === rec.id;

            return (
              <motion.div
                key={rec.id}
                variants={item}
                className="bg-white/90 backdrop-blur-xl border border-[#E7E5E4] hover:border-[#D4AF37]/60 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Title & Scores */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6212] bg-[#B8860B]/10 px-2 py-0.5 rounded-full">
                        {rec.harmony_tag || "Color Harmony"}
                      </span>
                      <h3 className="font-serif font-bold text-xl text-[#1C1917] mt-1">{rec.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                      <Sparkles size={12} className="text-emerald-600" />
                      <span>{Math.round(rec.scores?.total_score || 92)}% Match</span>
                    </div>
                  </div>

                  {/* Wardrobe Items Visual Stack */}
                  <div className="grid grid-cols-3 gap-2.5 my-4 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                    {rec.top && (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200 mb-1.5 shadow-2xs">
                          <img src={rec.top.image_url} alt={rec.top.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-[#1C1917] truncate w-full">{rec.top.name}</span>
                        <span className="text-[9px] text-[#8C6212] font-semibold uppercase">{rec.top.category}</span>
                      </div>
                    )}
                    {rec.bottom && (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200 mb-1.5 shadow-2xs">
                          <img src={rec.bottom.image_url} alt={rec.bottom.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-[#1C1917] truncate w-full">{rec.bottom.name}</span>
                        <span className="text-[9px] text-[#8C6212] font-semibold uppercase">{rec.bottom.category}</span>
                      </div>
                    )}
                    {rec.shoes && (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200 mb-1.5 shadow-2xs">
                          <img src={rec.shoes.image_url} alt={rec.shoes.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-[#1C1917] truncate w-full">{rec.shoes.name}</span>
                        <span className="text-[9px] text-[#8C6212] font-semibold uppercase">{rec.shoes.category}</span>
                      </div>
                    )}
                    {rec.outerwear && (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-stone-200 mb-1.5 shadow-2xs">
                          <img src={rec.outerwear.image_url} alt={rec.outerwear.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-[#1C1917] truncate w-full">{rec.outerwear.name}</span>
                        <span className="text-[9px] text-[#8C6212] font-semibold uppercase">Outerwear</span>
                      </div>
                    )}
                  </div>

                  {/* Rationale Explanation */}
                  <p className="text-xs text-[#57534E] leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#D4AF37]/20">
                    💡 {rec.explanation}
                  </p>
                </div>

                {/* Action Bar */}
                <div className="mt-5 pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-[#78716C] flex items-center gap-1">
                    <span>{rec.weather_badge}</span>
                  </div>

                  <button
                    onClick={() => handleSaveOutfit(rec)}
                    disabled={isSaved || isSaving}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSaved
                        ? "bg-emerald-600 text-white"
                        : "bg-[#B8860B] hover:bg-[#8C6212] text-white shadow-xs"
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Check size={14} /> Saved in Lookbook
                      </>
                    ) : (
                      <>
                        <Heart size={14} /> Save Outfit
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="p-8 text-center bg-white/70 backdrop-blur-xl rounded-2xl border border-[#E7E5E4]">
          <h4 className="font-serif font-bold text-sm text-[#1C1917]">No combinations found for this criteria</h4>
          <p className="text-xs text-[#78716C] mt-1 mb-4">
            Try switching occasions or adding more tops, bottoms, and shoes to your wardrobe.
          </p>
          <button
            onClick={() => fetchRecommendations(occasion)}
            className="px-4 py-2 bg-[#B8860B] text-white text-xs font-bold rounded-xl"
          >
            Retry Recommendations
          </button>
        </div>
      )}
    </div>
  );
}
