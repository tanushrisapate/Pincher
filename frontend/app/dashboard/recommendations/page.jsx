"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  Sparkles,
  Bookmark,
  Check,
  RefreshCw,
  Sun,
  Snowflake,
  Flame,
  CloudRain,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowRight,
  Upload
} from "lucide-react";

const WEEKDAYS = [
  { id: "monday", label: "Mon", full: "Monday" },
  { id: "tuesday", label: "Tue", full: "Tuesday" },
  { id: "wednesday", label: "Wed", full: "Wednesday" },
  { id: "thursday", label: "Thu", full: "Thursday" },
  { id: "friday", label: "Fri", full: "Friday" },
  { id: "saturday", label: "Sat", full: "Saturday" },
  { id: "sunday", label: "Sun", full: "Sunday" },
];

const OCCASIONS = [
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Work" },
  { id: "party", label: "Evening" },
  { id: "date", label: "Date" },
  { id: "outdoor", label: "Outdoor" },
];

const WEATHER_PRESETS = [
  { label: "Winter", temp: 8, cond: "Cold", icon: Snowflake },
  { label: "Rain", temp: 18, cond: "Rainy", icon: CloudRain },
  { label: "Autumn", temp: 16, cond: "Breezy", icon: Sun },
  { label: "Spring", temp: 22, cond: "Pleasant", icon: Sun },
  { label: "Summer", temp: 32, cond: "Sunny", icon: Flame },
];

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  );
  const [occasion, setOccasion] = useState("casual");
  const [temperature, setTemperature] = useState(22.0);
  const [weatherCondition, setWeatherCondition] = useState("Clear");
  const [recommendations, setRecommendations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [savedOutfitIds, setSavedOutfitIds] = useState(new Set());
  const [saveLoadingId, setSaveLoadingId] = useState(null);
  const [wardrobeCount, setWardrobeCount] = useState(0);
  const [wardrobeItemsCache, setWardrobeItemsCache] = useState([]);
  const [showAdvancedWeather, setShowAdvancedWeather] = useState(false);
  const [userPrefs, setUserPrefs] = useState(null);

  // Load weather, profile preferences, and check wardrobe item count on mount
  useEffect(() => {
    async function initContext() {
      try {
        // Load profile preferences
        let loadedPrefs = null;
        try {
          const cached = localStorage.getItem("pincher_profile_preferences");
          if (cached) loadedPrefs = JSON.parse(cached);
        } catch (e) {}

        if (!loadedPrefs) {
          try {
            const pRes = await fetch("/api/profile/preferences");
            if (pRes.ok) {
              const pData = await pRes.json();
              loadedPrefs = pData.preferences;
            }
          } catch (e) {}
        }
        if (loadedPrefs) {
          setUserPrefs(loadedPrefs);
        }

        const weatherRes = await fetch("http://localhost:8000/api/weather/current?lat=28.6139&lon=77.2090&city=Delhi").catch(() => null);
        let currentTemp = 22.0;
        let currentCond = "Clear";
        if (weatherRes && weatherRes.ok) {
          const w = await weatherRes.json();
          if (w.data) {
            currentTemp = w.data.temperature;
            currentCond = w.data.condition || "Clear";
            setTemperature(currentTemp);
            setWeatherCondition(currentCond);
          }
        }

        const wardrobeRes = await fetch("/api/wardrobe").catch(() => null);
        if (wardrobeRes && wardrobeRes.ok) {
          const wData = await wardrobeRes.json();
          const items = wData.items || [];
          setWardrobeCount(items.length);
          setWardrobeItemsCache(items);
          if (items.length > 0) {
            const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
            fetchRecommendations("casual", items, currentTemp, todayDay, currentCond, loadedPrefs);
          }
        }
      } catch (err) {
        console.warn("Init recommendations error:", err);
      }
    }

    initContext();
  }, []);

  const fetchRecommendations = async (
    selectedOccasion = occasion,
    cachedItems = wardrobeItemsCache,
    targetTemp = temperature,
    dayKey = selectedDay,
    cond = weatherCondition,
    prefs = userPrefs
  ) => {
    setIsLoading(true);
    setSelectedIndex(0);
    try {
      const preferredColor = prefs?.favoriteColors?.[0] || null;
      const avoidColor = prefs?.avoidColors?.[0] || null;

      const res = await fetch("http://localhost:8000/api/outfits/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          occasion: selectedOccasion,
          day_of_week: dayKey,
          temperature: targetTemp,
          weather_condition: cond,
          preferred_color: preferredColor,
          avoid_color: avoidColor,
          persona: user?.persona || (prefs?.selectedStyles?.[0]?.toLowerCase()) || "classic",
          max_packets: 4,
          strict_weather: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } else {
        let items = cachedItems.length > 0 ? cachedItems : (await (await fetch("/api/wardrobe")).json()).items || [];
        const isColdClimate = targetTemp < 18.0;
        const coldTopKeywords = ["sweater", "hoodie", "cardigan", "sweatshirt", "long sleeve", "knit", "jacket", "flannel", "wool"];
        const coldBottomExcluded = ["short", "shorts", "mini", "swim"];

        // Apply color preference filters
        const avoidList = (prefs?.avoidColors || []).map((c) => c.toLowerCase());
        const favList = (prefs?.favoriteColors || []).map((c) => c.toLowerCase());

        // Sort items so favorite colors come first, and avoided colors come last
        items = [...items].sort((a, b) => {
          const aHex = (a.color_hex || "").toLowerCase();
          const bHex = (b.color_hex || "").toLowerCase();
          const aIsFav = favList.includes(aHex) ? 1 : 0;
          const bIsFav = favList.includes(bHex) ? 1 : 0;
          const aIsAvoid = avoidList.includes(aHex) ? 1 : 0;
          const bIsAvoid = avoidList.includes(bHex) ? 1 : 0;
          return (bIsFav - aIsFav) || (aIsAvoid - bIsAvoid);
        });

        let tops = items.filter((i) => i.category.toLowerCase() === "tops");
        let bottoms = items.filter((i) => i.category.toLowerCase() === "bottoms");
        let shoes = items.filter((i) => i.category.toLowerCase() === "shoes");
        let outerwear = items.filter((i) => i.category.toLowerCase() === "outerwear");
        let accessories = items.filter((i) => i.category.toLowerCase() === "accessories");

        // Prefer non-avoid items if available
        if (tops.some((t) => !avoidList.includes((t.color_hex || "").toLowerCase()))) {
          tops = tops.filter((t) => !avoidList.includes((t.color_hex || "").toLowerCase()));
        }
        if (bottoms.some((b) => !avoidList.includes((b.color_hex || "").toLowerCase()))) {
          bottoms = bottoms.filter((b) => !avoidList.includes((b.color_hex || "").toLowerCase()));
        }

        if (isColdClimate) {
          const warmTops = tops.filter((t) => coldTopKeywords.some((k) => (t.name || "").toLowerCase().includes(k)));
          if (warmTops.length > 0) tops = warmTops;

          const longBottoms = bottoms.filter((b) => !coldBottomExcluded.some((ex) => (b.name || "").toLowerCase().includes(ex)));
          if (longBottoms.length > 0) bottoms = longBottoms;
        }

        const generated = [];
        tops.forEach((top, tIdx) => {
          bottoms.forEach((bottom, bIdx) => {
            if (generated.length < 4) {
              const pairShoes = shoes[(tIdx + bIdx) % Math.max(1, shoes.length)] || null;
              const pairOuterwear = isColdClimate ? (outerwear[tIdx % Math.max(1, outerwear.length)] || null) : null;
              const pairAcc = accessories[tIdx % Math.max(1, accessories.length)] || null;

              generated.push({
                id: `packet-gen-${tIdx}-${bIdx}`,
                title: `${OCCASIONS.find((o) => o.id === selectedOccasion)?.label || "Daily"} Outfit`,
                top,
                bottom,
                shoes: pairShoes,
                outerwear: pairOuterwear,
                accessories: pairAcc ? [pairAcc] : [],
                explanation: `Coordinated look attuned to ${Math.round(targetTemp)}°C ${cond}`,
              });
            }
          });
        });

        setRecommendations(generated);
      }
    } catch (err) {
      console.warn("Recommendation engine fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOutfit = async (outfit) => {
    if (!outfit) return;
    setSaveLoadingId(outfit.id);
    try {
      await fetch("http://localhost:8000/api/outfits/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: outfit.title,
          top_item_id: outfit.top?.id || null,
          bottom_item_id: outfit.bottom?.id || null,
          outerwear_item_id: outfit.outerwear?.id || null,
          shoes_item_id: outfit.shoes?.id || null,
          accessory_item_id: outfit.accessories?.[0]?.id || null,
          occasion: occasion,
          harmony_score: 92.0,
          explanation: outfit.explanation || "Saved from AI Stylist",
        }),
      });

      setSavedOutfitIds((prev) => new Set([...prev, outfit.id]));
    } catch (err) {
      console.error("Failed to save outfit:", err);
    } finally {
      setSaveLoadingId(null);
    }
  };

  const currentOutfit = recommendations[selectedIndex] || null;
  const otherOptions = recommendations.filter((_, idx) => idx !== selectedIndex);

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          AI Stylist
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Get an outfit from your clothes based on your day, occasion and weather.
        </p>
      </div>

      {/* 2. Main Selector Box */}
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        {/* 1. What are you dressing for? */}
        <div>
          <span className="text-xs font-bold text-[#111111] block mb-2.5">
            1. What are you dressing for?
          </span>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occ) => {
              const isSelected = occasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => {
                    setOccasion(occ.id);
                    fetchRecommendations(occ.id, wardrobeItemsCache, temperature, selectedDay, weatherCondition);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-[#FDFBF7] text-[#A86E18] border border-[#A86E18] font-semibold"
                      : "bg-white text-[#525252] border border-[#E5E5E5] hover:border-stone-300"
                  }`}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. When? */}
        <div>
          <span className="text-xs font-bold text-[#111111] block mb-2.5">
            2. When?
          </span>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const isSelected = selectedDay === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => {
                    setSelectedDay(day.id);
                    fetchRecommendations(occasion, wardrobeItemsCache, temperature, day.id, weatherCondition);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-[#FDFBF7] text-[#A86E18] border border-[#A86E18] font-semibold"
                      : "bg-white text-[#525252] border border-[#E5E5E5] hover:border-stone-300"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Weather */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#111111]">
              3. Weather
            </span>
            <button
              onClick={() => setShowAdvancedWeather(!showAdvancedWeather)}
              className="text-xs text-[#A86E18] hover:underline flex items-center gap-0.5 font-medium"
            >
              <span>Advanced</span>
              {showAdvancedWeather ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>

          {/* Weather Status Row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">☀️</span>
            <span className="text-xs font-bold text-[#111111]">
              {Math.round(temperature)}°C
            </span>
            <span className="text-xs text-[#737373]">
              {weatherCondition}
            </span>
            <button
              onClick={() => setShowAdvancedWeather(!showAdvancedWeather)}
              className="ml-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-[#E5E5E5] text-[11px] text-[#525252] hover:bg-stone-50 transition-colors"
            >
              <span>✎ Change</span>
            </button>
          </div>

          {/* Weather Presets */}
          <div className="flex flex-wrap gap-2">
            {WEATHER_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = Math.round(temperature) === preset.temp;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    setTemperature(preset.temp);
                    setWeatherCondition(preset.cond);
                    fetchRecommendations(occasion, wardrobeItemsCache, preset.temp, selectedDay, preset.cond);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-[#FDFBF7] text-[#A86E18] border border-[#A86E18] font-semibold"
                      : "bg-white text-[#525252] border border-[#E5E5E5] hover:border-stone-300"
                  }`}
                >
                  <Icon size={12} className={isActive ? "text-[#A86E18]" : "text-[#737373]"} />
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-[#A8A29E]">({preset.temp}°C)</span>
                </button>
              );
            })}
          </div>

          {/* Collapsible Advanced Climate Slider */}
          {showAdvancedWeather && (
            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-3">
              <span className="text-xs text-stone-600 shrink-0">Custom Temp:</span>
              <input
                type="range"
                min="-5"
                max="40"
                value={temperature}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTemperature(val);
                  fetchRecommendations(occasion, wardrobeItemsCache, val, selectedDay, weatherCondition);
                }}
                className="w-36 accent-[#A86E18]"
              />
              <span className="text-xs font-bold text-stone-800">{Math.round(temperature)}°C</span>
            </div>
          )}
        </div>

        {/* Generate Outfit Button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => fetchRecommendations(occasion, wardrobeItemsCache, temperature, selectedDay, weatherCondition)}
            disabled={isLoading || wardrobeCount === 0}
            className="w-full max-w-sm mx-auto bg-[#A86E18] hover:bg-[#925f14] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs disabled:opacity-50"
          >
            <Sparkles size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Generate Outfit</span>
          </button>
        </div>
      </div>

      {/* 3. Your Recommended Outfit Card */}
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#111111]">
              Your Recommended Outfit
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Based on your wardrobe, weather and occasion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => currentOutfit && handleSaveOutfit(currentOutfit)}
              disabled={savedOutfitIds.has(currentOutfit?.id) || saveLoadingId === currentOutfit?.id}
              className="w-8 h-8 rounded-lg border border-[#E5E5E5] flex items-center justify-center text-[#525252] hover:bg-stone-50 transition-colors"
              title="Save Outfit"
            >
              {savedOutfitIds.has(currentOutfit?.id) ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Bookmark size={14} />
              )}
            </button>

            <button
              onClick={() => fetchRecommendations(occasion, wardrobeItemsCache, temperature, selectedDay, weatherCondition)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-semibold text-[#525252] hover:bg-stone-50 transition-colors"
            >
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Outfit Grid + Right Details */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
          {/* Left: 2x3 Grid of 6 items */}
          <div className="grid grid-cols-3 gap-3 flex-1 max-w-md">
            {/* 1. Top */}
            <div>
              <div className="aspect-square rounded-xl bg-[#F6F6F5] p-2 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/60">
                <img
                  src={currentOutfit?.top?.image_url || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400"}
                  alt="Top"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-[10px] text-[#737373] text-center block mt-1">
                Top
              </span>
            </div>

            {/* 2. Bottom */}
            <div>
              <div className="aspect-square rounded-xl bg-[#F6F6F5] p-2 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/60">
                <img
                  src={currentOutfit?.bottom?.image_url || "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400"}
                  alt="Bottom"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-[10px] text-[#737373] text-center block mt-1">
                Bottom
              </span>
            </div>

            {/* 3. Shoes */}
            <div>
              <div className="aspect-square rounded-xl bg-[#F6F6F5] p-2 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/60">
                <img
                  src={currentOutfit?.shoes?.image_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"}
                  alt="Shoes"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-[10px] text-[#737373] text-center block mt-1">
                Shoes
              </span>
            </div>

            {/* 4. Accessory (Watch) */}
            <div>
              <div className="aspect-square rounded-xl bg-[#F6F6F5] p-2 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/60">
                <img
                  src={currentOutfit?.accessories?.[0]?.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400"}
                  alt="Accessory"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-[10px] text-[#737373] text-center block mt-1">
                Accessory
              </span>
            </div>

            {/* 5. Accessory (Sunglasses) */}
            <div>
              <div className="aspect-square rounded-xl bg-[#F6F6F5] p-2 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/60">
                <img
                  src={currentOutfit?.accessories?.[1]?.image_url || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400"}
                  alt="Accessory"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-[10px] text-[#737373] text-center block mt-1">
                Accessory
              </span>
            </div>

            {/* 6. Accessory (Cap) */}
            <div>
              <div className="aspect-square rounded-xl bg-[#F6F6F5] p-2 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/60">
                <img
                  src={currentOutfit?.outerwear?.image_url || "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400"}
                  alt="Accessory"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-[10px] text-[#737373] text-center block mt-1">
                Accessory
              </span>
            </div>
          </div>

          {/* Right Column: Details & Checkmarks */}
          <div className="lg:w-72 shrink-0">
            <h3 className="text-base font-bold text-[#111111]">
              Smart & Comfortable
            </h3>
            <p className="text-xs text-[#737373] mt-1 mb-4">
              A relaxed and stylish look for your Sunday.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#A86E18] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ✓
                </span>
                <span className="text-xs text-[#525252] font-medium">
                  Matches the weather
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#A86E18] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ✓
                </span>
                <span className="text-xs text-[#525252] font-medium">
                  Uses your own clothes
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#A86E18] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ✓
                </span>
                <span className="text-xs text-[#525252] font-medium">
                  Comfortable and versatile
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Other Options */}
      <div className="space-y-2.5 pt-1">
        <span className="text-xs font-bold text-[#111111] block">
          Other Options
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 2 */}
          <div
            onClick={() => recommendations.length > 1 && setSelectedIndex(1)}
            className="border border-[#E5E5E5] rounded-xl p-3 bg-white flex items-center justify-between cursor-pointer hover:border-[#A86E18] transition-colors"
          >
            <div>
              <span className="text-[10px] text-[#737373] font-medium block mb-1.5">
                Option 2
              </span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1542272604-780c96856592?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#A8A29E]" />
          </div>

          {/* Option 3 */}
          <div
            onClick={() => recommendations.length > 2 && setSelectedIndex(2)}
            className="border border-[#E5E5E5] rounded-xl p-3 bg-white flex items-center justify-between cursor-pointer hover:border-[#A86E18] transition-colors"
          >
            <div>
              <span className="text-[10px] text-[#737373] font-medium block mb-1.5">
                Option 3
              </span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#F6F6F5] p-1 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/80">
                  <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200" alt="" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#A8A29E]" />
          </div>
        </div>
      </div>
    </div>
  );
}

