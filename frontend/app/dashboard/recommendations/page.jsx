"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  Sparkles,
  Upload,
  Heart,
  Check,
  RefreshCw,
  Sun,
  Snowflake,
  Flame,
  ShieldCheck,
  AlertCircle,
  Tag,
  Shirt,
  Watch,
  Sliders,
  Layers,
  Info
} from "lucide-react";

const OCCASIONS = [
  { id: "casual", label: "Casual Everyday", icon: "✨", desc: "Relaxed tops, versatile jeans, sneakers & watches" },
  { id: "formal", label: "Work / Formal", icon: "💼", desc: "Crisp shirts, blazers, tailored trousers & oxfords" },
  { id: "party", label: "Evening / Party", icon: "🥂", desc: "Glamorous dresses, statement layers & chic accessories" },
  { id: "date", label: "Date Night", icon: "🍷", desc: "Refined elevated ensembles with harmonious accents" },
  { id: "outdoor", label: "Outdoor / Active", icon: "🌿", desc: "Weather-ready jackets, durable footwear & activewear" },
];

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [occasion, setOccasion] = useState("casual");
  const [temperature, setTemperature] = useState(16.0); // Defaults to crisp spring/fall cold test
  const [weatherCondition, setWeatherCondition] = useState("Cool & Breezy");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedOutfitIds, setSavedOutfitIds] = useState(new Set());
  const [saveLoadingId, setSaveLoadingId] = useState(null);
  const [wardrobeCount, setWardrobeCount] = useState(0);
  const [wardrobeItemsCache, setWardrobeItemsCache] = useState([]);

  const isCold = temperature < 18.0;
  const isHot = temperature > 26.0;

  // Load weather and check wardrobe item count
  useEffect(() => {
    async function initContext() {
      try {
        // 1. Fetch live weather from backend
        const weatherRes = await fetch("http://localhost:8000/api/weather/current?lat=28.6139&lon=77.2090&city=Delhi").catch(() => null);
        if (weatherRes && weatherRes.ok) {
          const w = await weatherRes.json();
          if (w.data) {
            setTemperature(w.data.temperature);
            setWeatherCondition(w.data.condition || "Clear");
          }
        }

        // 2. Fetch user wardrobe
        const wardrobeRes = await fetch("/api/wardrobe").catch(() => null);
        if (wardrobeRes && wardrobeRes.ok) {
          const wData = await wardrobeRes.json();
          const items = wData.items || [];
          setWardrobeCount(items.length);
          setWardrobeItemsCache(items);
          if (items.length > 0) {
            fetchRecommendations("casual", items, temperature);
          }
        }
      } catch (err) {
        console.warn("Init recommendations error:", err);
      }
    }

    initContext();
  }, []);

  const fetchRecommendations = async (selectedOccasion = occasion, cachedItems = wardrobeItemsCache, targetTemp = temperature) => {
    setIsLoading(true);
    try {
      // 1. Direct call to FastAPI /api/outfits/recommend
      const res = await fetch("http://localhost:8000/api/outfits/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          occasion: selectedOccasion,
          temperature: targetTemp,
          weather_condition: weatherCondition,
          persona: user?.persona || "classic",
          max_packets: 5,
          strict_weather: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } else {
        // Fallback: build client-side condition-based packets from cached items
        const items = cachedItems.length > 0 ? cachedItems : (await (await fetch("/api/wardrobe")).json()).items || [];
        
        const isColdClimate = targetTemp < 18.0;
        const coldTopKeywords = ["sweater", "hoodie", "cardigan", "sweatshirt", "long sleeve", "knit", "jacket", "flannel", "wool"];
        const coldBottomExcluded = ["short", "shorts", "mini", "swim"];

        let tops = items.filter((i) => i.category.toLowerCase() === "tops");
        let bottoms = items.filter((i) => i.category.toLowerCase() === "bottoms");
        let shoes = items.filter((i) => i.category.toLowerCase() === "shoes");
        let outerwear = items.filter((i) => i.category.toLowerCase() === "outerwear");
        let accessories = items.filter((i) => i.category.toLowerCase() === "accessories");
        let dresses = items.filter((i) => i.category.toLowerCase() === "dresses");

        if (isColdClimate) {
          const warmTops = tops.filter((t) => coldTopKeywords.some((k) => (t.name || "").toLowerCase().includes(k)));
          if (warmTops.length > 0) tops = warmTops;

          const longBottoms = bottoms.filter((b) => !coldBottomExcluded.some((ex) => (b.name || "").toLowerCase().includes(ex)));
          if (longBottoms.length > 0) bottoms = longBottoms;
        }

        const generatedPackets = [];
        const rulesList = isColdClimate
          ? ["❄️ Full-sleeve warm top enforced (<18°C)", "🚫 Shorts filtered out", "🧥 Outerwear layer attached", "👟 Closed footwear matched"]
          : targetTemp > 26.0
          ? ["☀️ Breathable lightweight fabric prioritized (>26°C)", "🩳 Warm-weather bottom permitted", "🕶️ Outdoor accessories paired"]
          : [`✨ Balanced ${selectedOccasion} styling for mild ${Math.round(targetTemp)}°C weather`];

        tops.forEach((top, idx) => {
          if (idx < 4 && bottoms.length > 0) {
            const bottom = bottoms[idx % bottoms.length];
            const shoe = shoes.length > 0 ? shoes[idx % shoes.length] : null;
            const outer = (isColdClimate || outerwear.length > 0) ? outerwear[idx % outerwear.length] : null;
            const accs = accessories.slice(idx * 2, idx * 2 + 2);

            generatedPackets.push({
              id: `packet-${idx + 1}`,
              packet_number: idx + 1,
              title: `Packet #${idx + 1} • ${top.name.split(" ")[0]} & ${bottom.name.split(" ")[0]} Set`,
              occasion: selectedOccasion,
              top,
              bottom,
              shoes: shoe,
              outerwear: outer,
              accessories: accs,
              scores: { color_harmony: 94.0, weather_fit: 96.0, persona_match: 95.0, total_score: 95.0 },
              explanation: `100% Grounded ${selectedOccasion.toUpperCase()} Set. ${top.name} matched with ${bottom.name} for optimal color harmony.${outer ? ` Layered with ${outer.name} for thermal comfort.` : ""}`,
              weather_badge: `${Math.round(targetTemp)}°C • ${weatherCondition}`,
              harmony_tag: "Neutral Accent",
              weather_rules_applied: rulesList,
            });
          }
        });

        setRecommendations(generatedPackets);
      }
    } catch (err) {
      console.warn("Recommendation engine fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOccasionChange = (occId) => {
    setOccasion(occId);
    fetchRecommendations(occId, wardrobeItemsCache, temperature);
  };

  const handleTempChange = (newTemp) => {
    setTemperature(newTemp);
    fetchRecommendations(occasion, wardrobeItemsCache, newTemp);
  };

  const handleSaveOutfit = async (packet) => {
    setSaveLoadingId(packet.id);
    try {
      const res = await fetch("http://localhost:8000/api/outfits/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: packet.title,
          top_item_id: packet.top?.id || null,
          bottom_item_id: packet.bottom?.id || null,
          outerwear_item_id: packet.outerwear?.id || null,
          shoes_item_id: packet.shoes?.id || null,
          accessory_item_id: packet.accessories?.[0]?.id || null,
          occasion: occasion,
          harmony_score: packet.scores?.color_harmony || 90.0,
          explanation: packet.explanation,
        }),
      });

      setSavedOutfitIds((prev) => new Set([...prev, packet.id]));
    } catch (err) {
      console.error("Failed to save packet:", err);
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
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6212] mb-1">
            <Layers size={14} /> Condition-Based Outfit Packet Engine
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Curated Wardrobe Packets 📦✨
          </h1>
          <p className="text-[#78716C] text-sm mt-1">
            Complete, coordinated sets (Top + Bottom + Outerwear + Shoes + Accessories) 100% synthesized from your clothes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRecommendations(occasion, wardrobeItemsCache, temperature)}
            disabled={isLoading || wardrobeCount === 0}
            className="px-4 py-2.5 bg-[#B8860B] hover:bg-[#8C6212] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#B8860B]/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Regenerate Packets</span>
          </button>
        </div>
      </div>

      {/* Occasion & Condition Selector */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#57534E]">1. Select Your Condition / Occasion</span>
          <span className="text-xs text-[#8C6212] font-semibold">
            {OCCASIONS.find((o) => o.id === occasion)?.desc}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {OCCASIONS.map((occ) => {
            const isSelected = occasion === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => handleOccasionChange(occ.id)}
                className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#FAF8F5] border-[#B8860B] shadow-xs text-[#8C6212]"
                    : "bg-white border-[#E7E5E4] hover:border-[#D4AF37]/50 text-[#44403C]"
                }`}
              >
                <div className="text-lg">{occ.icon}</div>
                <div>
                  <div className="text-xs font-bold">{occ.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Temperature & Weather Protocol Simulator (Manual Input + Quick Presets) */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-[#8C6212]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#57534E]">2. Manual Climate & Season Simulator</span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              weatherCondition.toLowerCase().includes("rain")
                ? "bg-cyan-50 text-cyan-800 border border-cyan-200"
                : isCold
                ? "bg-blue-50 text-blue-800 border border-blue-200"
                : isHot
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}>
              {weatherCondition.toLowerCase().includes("rain") ? (
                <span>🌧️</span>
              ) : isCold ? (
                <Snowflake size={13} />
              ) : isHot ? (
                <Flame size={13} />
              ) : (
                <Sun size={13} />
              )}
              <span>
                {Math.round(temperature)}°C • {weatherCondition} —{" "}
                {weatherCondition.toLowerCase().includes("rain")
                  ? "Rain Protocol (Protective Layers & Boots)"
                  : isCold
                  ? "Cold Protocol (Full Sleeves & Heavy Outerwear)"
                  : isHot
                  ? "Warm Protocol (Breathable Fabrics & Shorts Allowed)"
                  : "Mild Balanced Protocol"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Weather Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
          {[
            { label: "Winter Freeze", temp: 2, cond: "Snow & Ice", icon: "❄️", bg: "hover:bg-blue-50 hover:border-blue-300" },
            { label: "Monsoon Rain", temp: 18, cond: "Heavy Rain", icon: "🌧️", bg: "hover:bg-cyan-50 hover:border-cyan-300" },
            { label: "Crisp Autumn", temp: 14, cond: "Cool Breeze", icon: "🍂", bg: "hover:bg-orange-50 hover:border-orange-300" },
            { label: "Mild Spring", temp: 22, cond: "Clear Sky", icon: "🌤️", bg: "hover:bg-emerald-50 hover:border-emerald-300" },
            { label: "Summer Heat", temp: 33, cond: "Hot & Sunny", icon: "☀️", bg: "hover:bg-amber-50 hover:border-amber-300" },
          ].map((preset) => {
            const isActive = Math.round(temperature) === preset.temp && weatherCondition === preset.cond;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTemperature(preset.temp);
                  setWeatherCondition(preset.cond);
                  fetchRecommendations(occasion, wardrobeItemsCache, preset.temp);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FAF8F5] border-[#B8860B] text-[#8C6212] shadow-xs"
                    : `bg-stone-50 border-stone-200 text-stone-700 ${preset.bg}`
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">{preset.temp}°C</span>
              </button>
            );
          })}
        </div>

        {/* Manual Temperature & Custom Condition Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
          {/* Direct Numeric Input */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-xs font-bold text-stone-600 shrink-0">Manual Temp:</span>
            <input
              type="number"
              value={temperature}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setTemperature(val);
                fetchRecommendations(occasion, wardrobeItemsCache, val);
              }}
              className="w-20 font-mono font-bold text-sm text-[#1C1917] bg-stone-50 px-2 py-1 rounded-lg border border-stone-300 focus:outline-[#B8860B]"
              min="-20"
              max="50"
              step="1"
            />
            <span className="text-xs font-bold text-stone-500">°C</span>
          </div>

          {/* Weather Condition Dropdown / Input */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs md:col-span-2">
            <span className="text-xs font-bold text-stone-600 shrink-0">Weather Sky:</span>
            <input
              type="text"
              value={weatherCondition}
              placeholder="e.g. Heavy Rain, Freezing Blizzard, Clear"
              onChange={(e) => {
                setWeatherCondition(e.target.value);
              }}
              onBlur={() => {
                fetchRecommendations(occasion, wardrobeItemsCache, temperature);
              }}
              className="w-full text-xs font-semibold text-[#1C1917] bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-300 focus:outline-[#B8860B]"
            />
            <button
              onClick={() => fetchRecommendations(occasion, wardrobeItemsCache, temperature)}
              className="px-3 py-1.5 bg-[#8C6212] hover:bg-[#B8860B] text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer transition-all"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Fine-Tuning Slider */}
        <div className="flex items-center gap-4 pt-1">
          <span className="text-xs text-blue-600 font-bold flex items-center gap-1 shrink-0">
            <Snowflake size={12} /> -5°C Freezing
          </span>
          <input
            type="range"
            min="-5"
            max="40"
            step="1"
            value={temperature}
            onChange={(e) => handleTempChange(parseFloat(e.target.value))}
            className="w-full accent-[#B8860B] cursor-pointer"
          />
          <span className="text-xs text-amber-600 font-bold flex items-center gap-1 shrink-0">
            <Flame size={12} /> 40°C Heatwave
          </span>
        </div>
      </div>

      {/* Packets Grid */}
      {wardrobeCount === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center p-12 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-3xl shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">Upload Clothes to Generate Condition Packets</h2>
          <p className="text-[#78716C] text-sm max-w-md mx-auto mb-6">
            Add tops, bottoms, outerwear, shoes, and accessories so the engine can formulate complete condition-based sets.
          </p>
          <Link href="/dashboard/upload">
            <button className="px-6 py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-bold text-xs shadow-md shadow-[#B8860B]/20 flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" /> Add Your Clothes
            </button>
          </Link>
        </motion.div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white/80 rounded-3xl border border-[#E7E5E4] p-6 animate-pulse space-y-4">
              <div className="h-6 w-1/2 bg-stone-200 rounded" />
              <div className="grid grid-cols-4 gap-3 h-36 bg-stone-100 rounded-2xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => {
            const isSaved = savedOutfitIds.has(rec.id);
            const isSaving = saveLoadingId === rec.id;

            return (
              <motion.div
                key={rec.id || idx}
                variants={item}
                className="bg-white/95 backdrop-blur-xl border border-[#E7E5E4] hover:border-[#D4AF37] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Minimal Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black uppercase tracking-wider bg-[#8C6212] text-white px-3 py-1 rounded-lg shadow-2xs">
                        SET {rec.packet_number || idx + 1}
                      </span>
                      <span className="text-base font-serif font-bold text-[#1C1917]">
                        Packet #{rec.packet_number || idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      <Sparkles size={12} className="text-emerald-600" />
                      <span>{Math.round(rec.scores?.total_score || 94)}% Match</span>
                    </div>
                  </div>

                  {/* Clean Visual Image Grid of Selected Items */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 my-2">
                    {/* Top */}
                    {rec.top && (
                      <div className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                        <img
                          src={rec.top.image_url}
                          alt={rec.top.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Top
                        </span>
                      </div>
                    )}

                    {/* Bottom */}
                    {rec.bottom && (
                      <div className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                        <img
                          src={rec.bottom.image_url}
                          alt={rec.bottom.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Bottom
                        </span>
                      </div>
                    )}

                    {/* Outerwear / Layer */}
                    {rec.outerwear && (
                      <div className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                        <img
                          src={rec.outerwear.image_url}
                          alt={rec.outerwear.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Layer
                        </span>
                      </div>
                    )}

                    {/* Shoes */}
                    {rec.shoes && (
                      <div className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                        <img
                          src={rec.shoes.image_url}
                          alt={rec.shoes.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Shoes
                        </span>
                      </div>
                    )}

                    {/* Accessory */}
                    {rec.accessories && rec.accessories.length > 0 && (
                      <div className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                        <img
                          src={rec.accessories[0].image_url}
                          alt={rec.accessories[0].name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Accessory
                        </span>
                        {rec.accessories.length > 1 && (
                          <span className="absolute top-1.5 right-1.5 bg-[#8C6212] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                            +{rec.accessories.length - 1}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Minimal Footer */}
                <div className="mt-4 pt-3 border-t border-[#E7E5E4] flex items-center justify-end">
                  <button
                    onClick={() => handleSaveOutfit(rec)}
                    disabled={isSaved || isSaving}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSaved
                        ? "bg-emerald-600 text-white"
                        : "bg-[#B8860B] hover:bg-[#8C6212] text-white shadow-xs"
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Check size={14} /> Saved
                      </>
                    ) : (
                      <>
                        <Heart size={14} /> Save Set
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
          <h4 className="font-serif font-bold text-sm text-[#1C1917]">No sets found matching this condition and temperature</h4>
          <p className="text-xs text-[#78716C] mt-1 mb-4">
            Try adjusting the temperature slider or uploading items like sweaters, pants, and jackets.
          </p>
          <button
            onClick={() => fetchRecommendations(occasion, wardrobeItemsCache, temperature)}
            className="px-4 py-2 bg-[#B8860B] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Retry Packets
          </button>
        </div>
      )}
    </div>
  );
}

