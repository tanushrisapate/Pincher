"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import {
  CloudSun,
  Wind,
  Droplets,
  Wand2,
  Plus,
  Heart,
  Lightbulb,
  Shirt,
  Sparkles,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good day");
  const [weather, setWeather] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    savedOutfits: 0,
    categoriesCount: 0,
    dominantColor: "Jet Black",
    dominantColorHex: "#111111",
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-of-day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch Live Data (Weather, Wardrobe Items, Saved Outfits)
  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. Fetch live weather
        const weatherPromise = fetch("/api/weather/current?lat=28.6139&lon=77.2090&city=Delhi")
          .then((r) => r.json())
          .then((d) => (d.success ? d.data : null))
          .catch(() => null);

        // 2. Fetch user wardrobe
        const wardrobePromise = fetch("/api/wardrobe")
          .then((r) => r.json())
          .then((d) => (d.success ? d.items : []))
          .catch(() => []);

        // 3. Fetch saved outfits
        const outfitsPromise = fetch("/api/outfits/saved")
          .then((r) => (r.ok ? r.json() : { outfits: [] }))
          .then((d) => (d.success ? d.outfits : []))
          .catch(() => []);

        const [weatherData, wardrobeItems, savedOutfits] = await Promise.all([
          weatherPromise,
          wardrobePromise,
          outfitsPromise,
        ]);

        if (weatherData) setWeather(weatherData);

        if (wardrobeItems) {
          setRecentItems(wardrobeItems.slice(0, 5));
          
          // Compute category counts
          const cats = new Set(wardrobeItems.map((i) => i.category.toLowerCase()));
          
          // Compute most frequent color
          const colorFrequency = {};
          wardrobeItems.forEach((i) => {
            const name = i.color_name || "Black";
            colorFrequency[name] = (colorFrequency[name] || 0) + 1;
          });
          let topColor = "Obsidian Black";
          let maxCount = 0;
          for (const c in colorFrequency) {
            if (colorFrequency[c] > maxCount) {
              maxCount = colorFrequency[c];
              topColor = c;
            }
          }

          setStats({
            totalItems: wardrobeItems.length,
            savedOutfits: savedOutfits?.length || 0,
            categoriesCount: cats.size,
            dominantColor: topColor,
            dominantColorHex: wardrobeItems[0]?.color_hex || "#111111",
          });
        }
      } catch (err) {
        console.warn("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 26 } },
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Member";

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Hero Welcome & Style Status */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6212] mb-1">
            <Sparkles size={14} /> Haute Wardrobe Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-[#1C1917]">
            {greeting}, {firstName}
          </h1>
          <p className="text-[#78716C] text-sm md:text-base mt-1">
            Your personalized wardrobe portfolio and weather-attuned recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/recommendations"
            className="px-4 py-2.5 bg-[#B8860B] hover:bg-[#8C6212] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#B8860B]/20 flex items-center gap-1.5"
          >
            <Wand2 size={14} /> Get Styled for Today
          </Link>
          <Link
            href="/dashboard/upload"
            className="px-4 py-2.5 bg-white hover:bg-stone-50 text-[#1C1917] border border-[#E7E5E4] text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Digitize Item
          </Link>
        </div>
      </motion.div>

      {/* 2. Weather & Daily Style Advisory Banner */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 md:p-8 shadow-xl shadow-stone-900/10 border border-stone-800">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Weather Metrics */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {weather?.icon || "☀️"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    {weather?.city || "Current Location"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
                    {weather ? `${Math.round(weather.temperature)}°C` : "24°C"}
                  </span>
                  <span className="text-stone-300 text-sm font-medium">
                    {weather?.condition || "Clear & Pleasant"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-400 mt-1">
                  <span>Humidity: {weather?.humidity || 45}%</span>
                  <span>•</span>
                  <span>Wind: {weather?.wind_speed || 6} km/h</span>
                </div>
              </div>
            </div>

            {/* Right: Style Directive */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 lg:max-w-md w-full">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
                <Compass size={14} /> Climate Advisory
              </div>
              <p className="text-xs md:text-sm text-stone-200 leading-relaxed">
                {weather?.recommendation_summary ||
                  "Pleasant climate: Ideal for breathable silks, tailored chinos, linen shirts, and layered light outerwear."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Executive Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Digitized Pieces",
            value: stats.totalItems,
            icon: Shirt,
            sub: "In wardrobe catalog",
            href: "/dashboard/wardrobe",
          },
          {
            label: "Saved Lookbooks",
            value: stats.savedOutfits,
            icon: Heart,
            sub: "Curated collections",
            href: "/dashboard/saved",
          },
          {
            label: "Style Personas",
            value: user?.persona ? user.persona.toUpperCase() : "CLASSIC",
            icon: Sparkles,
            sub: "Active aesthetic",
            href: "/dashboard/profile",
            isText: true,
          },
          {
            label: "Signature Shade",
            value: stats.dominantColor,
            sub: "Top dominant hue",
            isColor: true,
            colorHex: stats.dominantColorHex,
            href: "/dashboard/insights",
          },
        ].map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="group bg-white/85 backdrop-blur-xl border border-[#E7E5E4] hover:border-[#D4AF37]/50 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200/80 group-hover:bg-[#FAF8F5] group-hover:border-[#B8860B]/30 flex items-center justify-center text-[#8C6212] transition-colors">
                {stat.isColor ? (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: stat.colorHex }}
                  />
                ) : (
                  <stat.icon size={16} />
                )}
              </div>
            </div>
            <div>
              <div className={`font-serif font-bold text-[#1C1917] ${stat.isText ? "text-lg tracking-wider" : "text-2xl md:text-3xl"}`}>
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-[#A8A29E] font-medium">{stat.sub}</span>
                <ArrowUpRight size={14} className="text-[#A8A29E] group-hover:text-[#B8860B] transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* 4. Quick Action Studio */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/recommendations" className="group block">
          <div className="h-full bg-gradient-to-br from-[#B8860B] to-[#8C6212] p-6 rounded-2xl text-white shadow-md shadow-[#B8860B]/20 hover:scale-[1.015] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Wand2 size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                AI Powered
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl mb-1">Instant Outfit Stylist</h3>
              <p className="text-white/80 text-xs leading-relaxed">
                Generate 100% wardrobe-grounded combinations tuned to current weather & occasion.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/upload" className="group block">
          <div className="h-full bg-gradient-to-br from-stone-900 to-stone-800 p-6 rounded-2xl text-white shadow-md shadow-stone-900/10 hover:scale-[1.015] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-[#D4AF37]">
                <Plus size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full">
                DeepFashion2
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl mb-1">Digitize New Garment</h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Auto-extract exact CIELAB colors, garment category, and style attributes in seconds.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/outfit-builder" className="group block">
          <div className="h-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-6 rounded-2xl text-white shadow-md shadow-[#D4AF37]/20 hover:scale-[1.015] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Layers size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                Studio
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl mb-1">Custom Look Studio</h3>
              <p className="text-white/80 text-xs leading-relaxed">
                Manually assemble pieces with live color harmony and weather fit scoring.
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 5. Recent Wardrobe Ingestion Preview */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1C1917]">Wardrobe Catalog</h2>
            <p className="text-xs text-[#78716C]">Your most recently digitized pieces</p>
          </div>
          <Link
            href="/dashboard/wardrobe"
            className="text-xs font-bold text-[#8C6212] hover:text-[#B8860B] flex items-center gap-1 transition-colors"
          >
            View all ({stats.totalItems}) <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden p-2.5 shadow-2xs group hover:border-[#D4AF37]/60 hover:shadow-md transition-all"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2 relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full border border-white/80 shadow-xs"
                    style={{ backgroundColor: item.color_hex }}
                    title={item.color_name}
                  />
                </div>
                <div className="px-1">
                  <div className="text-xs font-bold text-[#1C1917] truncate">{item.name}</div>
                  <div className="flex items-center justify-between mt-0.5 text-[10px] text-[#78716C] uppercase font-semibold">
                    <span>{item.category}</span>
                    <span>{item.color_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white/70 backdrop-blur-xl rounded-2xl border border-[#E7E5E4]">
            <Shirt className="w-10 h-10 text-[#A8A29E] mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-[#1C1917]">No wardrobe pieces digitized yet</h4>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto mt-1 mb-4">
              Upload photos of your clothes to unlock AI styling and color harmony recommendations.
            </p>
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B8860B] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus size={14} /> Digitize First Garment
            </Link>
          </div>
        )}
      </motion.div>

      {/* 6. Curated Haute Couture Style Advisory */}
      <motion.div variants={itemVariants}>
        <div className="bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl p-5 flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#B8860B]/15 flex items-center justify-center shrink-0 text-[#8C6212]">
            <Lightbulb size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#8C6212]">Color Theory & Silhouette Principle</h4>
              <span className="text-[10px] font-bold bg-[#B8860B]/20 text-[#8C6212] px-2 py-0.2 rounded-full">
                Gold Standard
              </span>
            </div>
            <p className="text-[#57534E] text-xs leading-relaxed mt-1">
              For structured formal silhouettes, grounding your base in Obsidian or Charcoal and pairing with warm metallic accents (Dark Goldenrod or Champagne) achieves the ideal 90%+ CIELAB contrast ratio for effortless visual distinction.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
