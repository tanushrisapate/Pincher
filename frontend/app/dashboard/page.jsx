"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  Sparkles,
  Plus,
  ArrowRight,
  Droplets,
  Wind,
  MapPin,
  ChevronDown,
  Camera,
  Shirt,
  Bookmark,
  Palette
} from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good afternoon");
  const [weather, setWeather] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [savedCount, setSavedCount] = useState(3);
  const [loading, setLoading] = useState(true);

  // Time-of-day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch live wardrobe data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const weatherPromise = fetch("/api/weather/current?lat=28.6139&lon=77.2090&city=Delhi")
          .then((r) => r.json())
          .then((d) => (d.success ? d.data : null))
          .catch(() => null);

        const wardrobePromise = fetch("/api/wardrobe")
          .then((r) => r.json())
          .then((d) => (d.success ? d.items : []))
          .catch(() => []);

        const outfitsPromise = fetch("/api/outfits/saved")
          .then((r) => (r.ok ? r.json() : { outfits: [] }))
          .then((d) => (d.success ? d.outfits : []))
          .catch(() => []);

        const [weatherData, items, savedOutfits] = await Promise.all([
          weatherPromise,
          wardrobePromise,
          outfitsPromise,
        ]);

        if (weatherData) setWeather(weatherData);
        if (items) setWardrobeItems(items);
        if (savedOutfits) setSavedCount(savedOutfits.length || 3);
      } catch (err) {
        console.warn("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : "Tani";

  // Curate 8 thumbnails for the wardrobe preview (use user clothes + clean defaults)
  const defaultPreviews = [
    { id: "p1", name: "White Shirt", image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" },
    { id: "p2", name: "Blue Denim Jeans", image_url: "https://images.unsplash.com/photo-1542272604-780c96856592?w=400" },
    { id: "p3", name: "Suede Jacket", image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
    { id: "p4", name: "White Leather Sneakers", image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" },
    { id: "p5", name: "Classic Sunglasses", image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400" },
    { id: "p6", name: "Minimal Watch", image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400" },
    { id: "p7", name: "Leather Tote", image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400" },
    { id: "p8", name: "Cotton Cap", image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" },
  ];

  const displayPreviews = wardrobeItems.length >= 8
    ? wardrobeItems.slice(0, 8)
    : [...wardrobeItems, ...defaultPreviews.slice(wardrobeItems.length, 8)];

  const totalItemCount = wardrobeItems.length > 0 ? wardrobeItems.length : 45;
  const remainingCount = totalItemCount > 8 ? totalItemCount - 8 : 37;

  // Curate 5 items for "Today's Outfit" preview
  const outfitPieces = [
    {
      role: "Top",
      name: "Navy Polo",
      image_url: wardrobeItems.find((i) => i.category === "tops")?.image_url || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400",
    },
    {
      role: "Bottom",
      name: "Beige Chinos",
      image_url: wardrobeItems.find((i) => i.category === "bottoms")?.image_url || "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400",
    },
    {
      role: "Shoes",
      name: "White Sneakers",
      image_url: wardrobeItems.find((i) => i.category === "shoes")?.image_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    },
    {
      role: "Accessory",
      name: "Classic Watch",
      image_url: wardrobeItems.find((i) => i.category === "accessories")?.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
    },
    {
      role: "Accessory",
      name: "Sunglasses",
      image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Greeting Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            {greeting}, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Ready to find your outfit?
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/dashboard/recommendations"
            className="bg-[#A86E18] hover:bg-[#925f14] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Sparkles size={13} />
            <span>Get Outfit for Today</span>
          </Link>

          <Link
            href="/dashboard/upload"
            className="bg-white hover:bg-stone-50 border border-[#E5E5E5] text-[#111111] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus size={14} />
            <span>Add Garment</span>
          </Link>
        </div>
      </div>

      {/* 2. Weather Bar Card */}
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        {/* Weather condition */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">☀️</span>
          <div>
            <span className="text-[10px] text-[#737373] block leading-none mb-1 font-medium">
              Today
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#111111]">
                {weather ? `${Math.round(weather.temperature)}°C` : "24°C"}
              </span>
              <span className="text-xs text-[#737373]">
                {weather?.condition || "Clear"}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:block h-7 w-px bg-[#EEEEEE]" />

        {/* Humidity */}
        <div className="flex items-center gap-2 text-xs text-[#525252] font-medium">
          <Droplets size={15} className="text-[#737373]" />
          <span>Humidity {weather?.humidity || 45}%</span>
        </div>

        <div className="hidden sm:block h-7 w-px bg-[#EEEEEE]" />

        {/* Wind */}
        <div className="flex items-center gap-2 text-xs text-[#525252] font-medium">
          <Wind size={15} className="text-[#737373]" />
          <span>Wind {weather?.wind_speed || 6} km/h</span>
        </div>

        <div className="hidden sm:block h-7 w-px bg-[#EEEEEE]" />

        {/* Location Dropdown */}
        <div className="flex items-center gap-1 text-xs font-semibold text-[#111111] cursor-pointer hover:text-[#A86E18] transition-colors">
          <MapPin size={14} className="text-[#737373]" />
          <span>Delhi</span>
          <ChevronDown size={13} className="text-[#737373]" />
        </div>
      </div>

      {/* 3. Your Wardrobe Card */}
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#111111]">
              Your Wardrobe
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              {totalItemCount} items
            </p>
          </div>
          <Link
            href="/dashboard/wardrobe"
            className="text-xs font-semibold text-[#A86E18] hover:underline flex items-center gap-1 transition-colors"
          >
            <span>View Wardrobe</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 8 Thumbnails + "+37" Badge */}
        <div className="grid grid-cols-4 sm:grid-cols-9 gap-2.5">
          {displayPreviews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="aspect-square rounded-xl bg-[#F6F6F5] p-2 flex items-center justify-center overflow-hidden border border-[#EEEEEE]/60 group"
              title={item.name}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}

          {/* Plus Remaining Count Tile */}
          <Link
            href="/dashboard/wardrobe"
            className="aspect-square rounded-xl bg-[#FDFBF7] border border-[#E8DCC0]/60 flex items-center justify-center text-[#A86E18] font-bold text-sm hover:bg-[#FAF4E5] transition-colors"
          >
            +{remainingCount}
          </Link>
        </div>
      </div>

      {/* 4. Today's Outfit Card */}
      <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#111111]">
              Today's Outfit
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              A recommended look for your day and weather.
            </p>
          </div>
          <Link
            href="/dashboard/recommendations"
            className="text-xs font-semibold text-[#A86E18] hover:underline flex items-center gap-1 transition-colors"
          >
            <span>View Outfit</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Inset Recommended Look Panel */}
        <div className="bg-[#F9F9F8] border border-[#EEEEEE] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* 5 Garment Tiles in Row */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 flex-1">
            {outfitPieces.map((piece, idx) => (
              <div
                key={idx}
                className="aspect-[3/4] rounded-lg bg-[#EFEFEF] p-2 flex items-center justify-center overflow-hidden"
                title={piece.name}
              >
                <img
                  src={piece.image_url}
                  alt={piece.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Right Text Description & View Details CTA */}
          <div className="md:w-64 shrink-0 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-[#111111]">
              Smart & Comfortable
            </h3>
            <p className="text-xs text-[#737373] mt-1 mb-4">
              Perfect for a relaxed Sunday.
            </p>
            <div>
              <Link
                href="/dashboard/recommendations"
                className="bg-[#A86E18] hover:bg-[#925f14] text-white px-4 py-2 rounded-lg text-xs font-semibold inline-block transition-colors shadow-2xs"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Row: Quick Actions & Your Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Quick Actions (2 Cols) */}
        <div className="md:col-span-2 bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-[#111111] mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <Link href="/dashboard/upload" className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-center text-[#A86E18] group-hover:border-[#A86E18] transition-colors shadow-2xs">
                <Camera size={18} />
              </div>
              <span className="text-[11px] text-[#525252] text-center font-medium">
                Add Garment
              </span>
            </Link>

            <Link href="/dashboard/wardrobe" className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-center text-[#A86E18] group-hover:border-[#A86E18] transition-colors shadow-2xs">
                <Shirt size={18} />
              </div>
              <span className="text-[11px] text-[#525252] text-center font-medium">
                View Wardrobe
              </span>
            </Link>

            <Link href="/dashboard/saved" className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-center text-[#A86E18] group-hover:border-[#A86E18] transition-colors shadow-2xs">
                <Bookmark size={18} />
              </div>
              <span className="text-[11px] text-[#525252] text-center font-medium">
                Saved Outfits
              </span>
            </Link>

            <Link href="/dashboard/outfit-builder" className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-center text-[#A86E18] group-hover:border-[#A86E18] transition-colors shadow-2xs">
                <Palette size={18} />
              </div>
              <span className="text-[11px] text-[#525252] text-center font-medium">
                Color Match
              </span>
            </Link>
          </div>
        </div>

        {/* Your Activity (1 Col) */}
        <div className="md:col-span-1 bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-[#111111] mb-3">
            Your Activity
          </h3>
          <div className="space-y-2.5 divide-y divide-[#F5F5F4]">
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#737373]">Wardrobe items</span>
              <span className="font-bold text-[#111111]">{totalItemCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2.5">
              <span className="text-[#737373]">Outfits generated</span>
              <span className="font-bold text-[#111111]">12</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2.5">
              <span className="text-[#737373]">Saved outfits</span>
              <span className="font-bold text-[#111111]">{savedCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
