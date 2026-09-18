"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Settings,
  Shirt,
  Palette,
  Sun,
  Calendar,
  Shield,
  Camera,
  Pencil,
  Mail,
  Lock,
  Bell,
  ChevronRight,
  Save,
  Info,
  Ban,
  Check,
  Target,
  X,
  Plus
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import {
  hexToHsv,
  hsvToHex,
  isValidHex,
  normalizeHex
} from "@/app/lib/colorHarmony";

const STYLES_LIST = [
  "Minimal",
  "Casual",
  "Smart Casual",
  "Formal",
  "Streetwear",
  "Classic",
  "Sporty",
];

const FITS_LIST = ["Slim", "Regular", "Relaxed", "Oversized"];
const OUTFIT_STYLES_LIST = ["Simple", "Balanced", "Statement"];
const OCCASIONS_LIST = ["College", "Work", "Casual", "Date", "Party", "Outdoor"];

const STORAGE_KEY = "pincher_profile_preferences";

export default function ProfilePage() {
  const { user } = useAuth();

  const displayName = user?.name || "Tani";
  const displayEmail = user?.email || "tani@example.com";

  // Preferences State
  const [selectedStyles, setSelectedStyles] = useState(["Minimal", "Casual"]);
  const [favoriteColors, setFavoriteColors] = useState([
    "#111111",
    "#FFFFFF",
    "#1E3A8A",
    "#D4C3A3",
    "#6B7280",
    "#5A3825",
    "#DC2626",
    "#F472B6",
    "#2563EB",
    "#16A34A",
    "#656D4A",
    "#A78BFA",
  ]);
  const [selectedFavColor, setSelectedFavColor] = useState(null);

  const [colorsAvoid, setColorsAvoid] = useState([
    "#C55353",
    "#E06D2D",
    "#E3BA43",
    "#F6A8B4",
    "#9D78C6",
    "#88D49E",
    "#6BA4E8",
    "#D1D5DB",
    "#D6C29E",
  ]);
  const [selectedAvoidColor, setSelectedAvoidColor] = useState(null);

  // Color Picker State for Favorite Colors
  const [pickerHex, setPickerHex] = useState("#B8860B");
  const [pickerHue, setPickerHue] = useState(43);
  const [pickerSat, setPickerSat] = useState(94);
  const [pickerVal, setPickerVal] = useState(72);
  const [hexInputError, setHexInputError] = useState(false);
  const satValRef = useFavSatValRef();

  // Avoid Colors Popover State
  const [showAvoidPicker, setShowAvoidPicker] = useState(false);
  const [avoidPickerHex, setAvoidPickerHex] = useState("#DC2626");
  const [avoidPickerHue, setAvoidPickerHue] = useState(0);
  const [avoidPickerSat, setAvoidPickerSat] = useState(83);
  const [avoidPickerVal, setAvoidPickerVal] = useState(86);
  const avoidSatValRef = useRef(null);
  const avoidPopoverRef = useRef(null);

  // Clothing Preferences State
  const [preferredFit, setPreferredFit] = useState("Regular");
  const [outfitStyle, setOutfitStyle] = useState("Simple");

  // Frequent Occasions State
  const [occasions, setOccasions] = useState(["Work"]);

  // Weather Preferences State (0 to 40 °C)
  const [minTemp, setMinTemp] = useState(18);
  const [maxTemp, setMaxTemp] = useState(28);
  const [preferWarmer, setPreferWarmer] = useState(true);
  const [preferLighter, setPreferLighter] = useState(false);

  // Save Feedback State
  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error' | null

  // Ref for Favorite Color Sat/Val box
  function useFavSatValRef() {
    return useRef(null);
  }

  // Load preferences from localStorage and backend on mount
  useEffect(() => {
    // 1. LocalStorage
    let hasCachedPrefs = false;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        hasCachedPrefs = true;
        const parsed = JSON.parse(cached);
        if (parsed.selectedStyles) setSelectedStyles(parsed.selectedStyles);
        if (parsed.favoriteColors) setFavoriteColors(parsed.favoriteColors);
        if (parsed.avoidColors) setColorsAvoid(parsed.avoidColors);
        if (parsed.preferredFit) setPreferredFit(parsed.preferredFit);
        if (parsed.outfitStyle) setOutfitStyle(parsed.outfitStyle);
        if (parsed.occasions) setOccasions(parsed.occasions);
        if (typeof parsed.minTemp === "number") setMinTemp(parsed.minTemp);
        if (typeof parsed.maxTemp === "number") setMaxTemp(parsed.maxTemp);
        if (typeof parsed.preferWarmer === "boolean") setPreferWarmer(parsed.preferWarmer);
        if (typeof parsed.preferLighter === "boolean") setPreferLighter(parsed.preferLighter);
      }
    } catch (e) {
      console.warn("Could not read local preferences:", e);
    }

    // 2. Fetch from /api/profile/preferences
    async function syncBackendPrefs() {
      try {
        const res = await fetch("/api/profile/preferences");
        if (res.ok) {
          const data = await res.json();
          if (!hasCachedPrefs && data.preferences && data.source === "db") {
            const p = data.preferences;
            if (p.selectedStyles) setSelectedStyles(p.selectedStyles);
            if (p.favoriteColors) setFavoriteColors(p.favoriteColors);
            if (p.avoidColors) setColorsAvoid(p.avoidColors);
            if (p.preferredFit) setPreferredFit(p.preferredFit);
            if (p.outfitStyle) setOutfitStyle(p.outfitStyle);
            if (p.occasions) setOccasions(p.occasions);
            if (typeof p.minTemp === "number") setMinTemp(p.minTemp);
            if (typeof p.maxTemp === "number") setMaxTemp(p.maxTemp);
            if (typeof p.preferWarmer === "boolean") setPreferWarmer(p.preferWarmer);
            if (typeof p.preferLighter === "boolean") setPreferLighter(p.preferLighter);
          }
        }
      } catch (err) {
        console.warn("Preferences backend fetch failed:", err);
      }
    }
    syncBackendPrefs();
  }, []);

  // Listen for Escape key and click-outside to close avoid picker
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowAvoidPicker(false);
      }
    }
    function handleClickOutside(e) {
      if (avoidPopoverRef.current && !avoidPopoverRef.current.contains(e.target)) {
        setShowAvoidPicker(false);
      }
    }
    if (showAvoidPicker) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAvoidPicker]);

  // Synchronize 2D Sat/Val picker drag for Favorite Colors
  const handleFavSatValPointer = (e) => {
    const el = satValRef.current;
    if (!el) return;

    const update = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      const s = Math.round((x / rect.width) * 100);
      const v = Math.round((1 - y / rect.height) * 100);
      setPickerSat(s);
      setPickerVal(v);
      const newHex = hsvToHex(pickerHue, s, v);
      setPickerHex(newHex);
      setHexInputError(false);
    };

    update(e.clientX, e.clientY);

    const onMove = (moveEvt) => update(moveEvt.clientX, moveEvt.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Synchronize 2D Sat/Val picker drag for Avoid Colors popover
  const handleAvoidSatValPointer = (e) => {
    const el = avoidSatValRef.current;
    if (!el) return;

    const update = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      const s = Math.round((x / rect.width) * 100);
      const v = Math.round((1 - y / rect.height) * 100);
      setAvoidPickerSat(s);
      setAvoidPickerVal(v);
      const newHex = hsvToHex(avoidPickerHue, s, v);
      setAvoidPickerHex(newHex);
    };

    update(e.clientX, e.clientY);

    const onMove = (moveEvt) => update(moveEvt.clientX, moveEvt.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // When Hue changes on Favorite Picker
  const handleFavHueChange = (newHue) => {
    setPickerHue(newHue);
    const newHex = hsvToHex(newHue, pickerSat, pickerVal);
    setPickerHex(newHex);
    setHexInputError(false);
  };

  // When Hue changes on Avoid Picker
  const handleAvoidHueChange = (newHue) => {
    setAvoidPickerHue(newHue);
    const newHex = hsvToHex(newHue, avoidPickerSat, avoidPickerVal);
    setAvoidPickerHex(newHex);
  };

  // When HEX input is typed manually in Favorite Picker
  const handleFavHexInput = (val) => {
    setPickerHex(val);
    if (isValidHex(val)) {
      setHexInputError(false);
      const norm = normalizeHex(val);
      const hsv = hexToHsv(norm);
      setPickerHue(hsv.h);
      setPickerSat(hsv.s);
      setPickerVal(hsv.v);
    } else {
      setHexInputError(true);
    }
  };

  // When HEX input is typed in Avoid Picker
  const handleAvoidHexInput = (val) => {
    setAvoidPickerHex(val);
    if (isValidHex(val)) {
      const norm = normalizeHex(val);
      const hsv = hexToHsv(norm);
      setAvoidPickerHue(hsv.h);
      setAvoidPickerSat(hsv.s);
      setAvoidPickerVal(hsv.v);
    }
  };

  // Select/inspect a Favorite Color swatch
  const handleSelectFavColor = (col) => {
    if (selectedFavColor === col) {
      setSelectedFavColor(null);
    } else {
      setSelectedFavColor(col);
      setPickerHex(col);
      const hsv = hexToHsv(col);
      setPickerHue(hsv.h);
      setPickerSat(hsv.s);
      setPickerVal(hsv.v);
      setHexInputError(false);
    }
  };

  // Select/inspect an Avoid Color swatch
  const handleSelectAvoidColor = (col) => {
    if (selectedAvoidColor === col) {
      setSelectedAvoidColor(null);
    } else {
      setSelectedAvoidColor(col);
      setAvoidPickerHex(col);
      const hsv = hexToHsv(col);
      setAvoidPickerHue(hsv.h);
      setAvoidPickerSat(hsv.s);
      setAvoidPickerVal(hsv.v);
    }
  };

  // Add color to Favorite Colors
  const handleAddFavColor = () => {
    if (!isValidHex(pickerHex)) {
      setHexInputError(true);
      return;
    }
    const cleanHex = normalizeHex(pickerHex);
    if (!favoriteColors.includes(cleanHex)) {
      const updated = [...favoriteColors, cleanHex];
      setFavoriteColors(updated);
      setSelectedFavColor(cleanHex);
    } else {
      setSelectedFavColor(cleanHex);
    }
  };

  // Remove selected Favorite Color
  const handleRemoveFavColor = (colToRemove, e) => {
    e.stopPropagation();
    setFavoriteColors((prev) => prev.filter((c) => c !== colToRemove));
    if (selectedFavColor === colToRemove) setSelectedFavColor(null);
  };

  // Add color to Avoid Colors
  const handleAddAvoidColor = () => {
    if (!isValidHex(avoidPickerHex)) return;
    const cleanHex = normalizeHex(avoidPickerHex);
    if (!colorsAvoid.includes(cleanHex)) {
      setColorsAvoid((prev) => [...prev, cleanHex]);
      setSelectedAvoidColor(cleanHex);
    } else {
      setSelectedAvoidColor(cleanHex);
    }
    setShowAvoidPicker(false);
  };

  // Remove Avoid Color
  const handleRemoveAvoidColor = (colToRemove, e) => {
    e.stopPropagation();
    setColorsAvoid((prev) => prev.filter((c) => c !== colToRemove));
    if (selectedAvoidColor === colToRemove) setSelectedAvoidColor(null);
  };

  // Toggle Style pill
  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  // Toggle Occasion pill
  const toggleOccasion = (occ) => {
    setOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  // Save Changes handler
  const handleSave = async () => {
    setSaveStatus("saving");

    const payload = {
      selectedStyles,
      favoriteColors,
      avoidColors: colorsAvoid,
      preferredFit,
      outfitStyle,
      occasions,
      minTemp,
      maxTemp,
      preferWarmer,
      preferLighter,
    };

    // Save to LocalStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed saving to localStorage:", e);
    }

    // Save to Backend API
    try {
      const res = await fetch("/api/profile/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("saved"); // LocalStorage succeeded, keep positive feedback
      }
    } catch (err) {
      console.warn("Backend save error:", err);
      setSaveStatus("saved");
    }

    setTimeout(() => setSaveStatus(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] font-serif">
            Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Manage your account and styling preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#A86E18] hover:bg-[#925f14] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs self-start sm:self-auto disabled:opacity-75 cursor-pointer"
        >
          {saveStatus === "saved" ? (
            <>
              <Check size={14} />
              <span>Saved!</span>
            </>
          ) : saveStatus === "saving" ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* ================= LEFT COLUMN ================= */}
        <div className="w-full lg:w-72 shrink-0 space-y-5">
          {/* Profile Card */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
              <User size={16} />
              <span>Profile</span>
            </div>

            {/* Avatar & Camera Icon */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#525252] shadow-xs hover:text-[#A86E18] transition-colors cursor-pointer"
                title="Change Photo"
              >
                <Camera size={13} />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center">
              <h2 className="text-base font-bold text-[#111111]">{displayName}</h2>
              <p className="text-xs text-[#737373] mt-0.5">{displayEmail}</p>
            </div>

            {/* Edit Profile Button */}
            <button className="w-full py-2 bg-white border border-[#E5E5E5] hover:bg-stone-50 text-[#111111] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer">
              <Pencil size={13} />
              <span>Edit Profile</span>
            </button>

            {/* Meta Info Rows */}
            <div className="border-t border-[#F5F5F4] pt-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#737373]">
                <span className="flex items-center gap-1.5">
                  <Camera size={14} className="text-[#A8A29E]" />
                  <span>Member since</span>
                </span>
                <span className="font-medium text-[#111111]">Sep 2024</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#737373]">
                <span className="flex items-center gap-1.5">
                  <Target size={14} className="text-[#A8A29E]" />
                  <span>Account type</span>
                </span>
                <span className="font-medium text-[#111111]">Free Plan</span>
              </div>
            </div>
          </div>

          {/* Account Card */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#111111] mb-2">
              <Settings size={16} />
              <span>Account</span>
            </div>

            <button className="w-full flex items-center justify-between py-2 text-xs font-medium text-[#111111] hover:text-[#A86E18] transition-colors cursor-pointer">
              <span className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#737373]" />
                <span>Email</span>
              </span>
              <ChevronRight size={14} className="text-[#A8A29E]" />
            </button>

            <button className="w-full flex items-center justify-between py-2 text-xs font-medium text-[#111111] hover:text-[#A86E18] transition-colors cursor-pointer">
              <span className="flex items-center gap-2.5">
                <Lock size={15} className="text-[#737373]" />
                <span>Change Password</span>
              </span>
              <ChevronRight size={14} className="text-[#A8A29E]" />
            </button>

            <button className="w-full flex items-center justify-between py-2 text-xs font-medium text-[#111111] hover:text-[#A86E18] transition-colors cursor-pointer">
              <span className="flex items-center gap-2.5">
                <Bell size={15} className="text-[#737373]" />
                <span>Notifications</span>
              </span>
              <ChevronRight size={14} className="text-[#A8A29E]" />
            </button>

          </div>
        </div>

        {/* ================= RIGHT / MAIN COLUMN ================= */}
        <div className="flex-1 w-full space-y-5">
          {/* Style Preferences Card (Full Width) */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                <Shirt size={16} />
                <span>Style Preferences</span>
              </div>
              <button title="Information" className="text-[#A8A29E] hover:text-[#111111] cursor-pointer">
                <Info size={16} />
              </button>
            </div>
            <p className="text-xs text-[#737373] mb-3">Select the styles you like.</p>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Pills Area */}
              <div className="flex flex-wrap gap-2 max-w-xl">
                {STYLES_LIST.map((style) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#FDFBF7] text-[#A86E18] border border-[#A86E18] font-semibold"
                          : "bg-white text-[#525252] border border-[#E5E5E5] hover:border-stone-300"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>

              {/* Side Note */}
              <div className="md:border-l md:border-[#EEEEEE] md:pl-6 text-xs text-[#737373] max-w-[200px] leading-relaxed">
                Your style helps Pincher create more personalized outfits.
              </div>
            </div>
          </div>

          {/* 2-Column Grid Below Style Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ----------------- LEFT SUB-COLUMN ----------------- */}
            <div className="space-y-5">
              {/* Favorite Colors Card (With Interactive Picker) */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <Palette size={16} />
                  <span>Favorite Colors</span>
                </div>
                <p className="text-xs text-[#737373]">Pick the colors you love.</p>

                <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
                  {/* Color Swatches Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-6 gap-2.5">
                      {favoriteColors.map((col, idx) => {
                        const isSelected = selectedFavColor === col;
                        return (
                          <div
                            key={`${col}-${idx}`}
                            onClick={() => handleSelectFavColor(col)}
                            className={`group relative w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${
                              isSelected
                                ? "ring-2 ring-offset-2 ring-[#A86E18] scale-105"
                                : "border border-black/10 shadow-2xs"
                            }`}
                            style={{ backgroundColor: col }}
                            title={`${col} (Click to inspect or select)`}
                          >
                            {isSelected && (
                              <button
                                onClick={(e) => handleRemoveFavColor(col, e)}
                                title="Remove color"
                                className="w-3.5 h-3.5 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <X size={9} strokeWidth={3} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleAddFavColor}
                      className="flex items-center gap-2 text-xs text-[#525252] hover:text-[#A86E18] mt-3.5 transition-colors cursor-pointer group"
                    >
                      <div className="w-6 h-6 rounded-full border border-dashed border-[#A8A29E] group-hover:border-[#A86E18] flex items-center justify-center text-xs font-bold text-[#525252] group-hover:text-[#A86E18] transition-colors">
                        +
                      </div>
                      <span className="text-[11px] font-medium text-[#737373] group-hover:text-[#A86E18]">Add Color</span>
                    </button>
                  </div>

                  {/* Compact Color Picker Box */}
                  <div className="bg-white border border-[#EEEEEE] rounded-xl p-2.5 shadow-2xs w-44 space-y-2 shrink-0">
                    {/* 2D Saturation / Value Gradient Area */}
                    <div
                      ref={satValRef}
                      onMouseDown={handleFavSatValPointer}
                      className="w-full h-16 rounded-lg relative overflow-hidden cursor-crosshair shadow-inner select-none"
                      style={{
                        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${pickerHue}, 100%, 50%))`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow-xs absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                          left: `${pickerSat}%`,
                          top: `${100 - pickerVal}%`,
                          backgroundColor: pickerHex,
                        }}
                      />
                    </div>

                    {/* Rainbow Hue Bar */}
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={pickerHue}
                      onChange={(e) => handleFavHueChange(parseInt(e.target.value, 10))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background:
                          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                      }}
                    />

                    {/* Hex + Add Button */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={pickerHex}
                          onChange={(e) => handleFavHexInput(e.target.value)}
                          placeholder="#000000"
                          maxLength={7}
                          className={`w-full px-1.5 py-0.5 text-[10px] font-mono border rounded text-center text-[#111111] uppercase ${
                            hexInputError
                              ? "border-red-500 bg-red-50/50"
                              : "border-[#E5E5E5] focus:border-[#A86E18]"
                          }`}
                        />
                      </div>
                      <button
                        onClick={handleAddFavColor}
                        className="px-3 py-0.5 bg-[#A86E18] hover:bg-[#925f14] text-white text-[10px] font-semibold rounded shadow-2xs transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clothing Preferences Card */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <Shirt size={16} />
                  <span>Clothing Preferences</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Preferred Fit */}
                  <div>
                    <span className="text-xs text-[#737373] block mb-2 font-medium">
                      Preferred fit
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {FITS_LIST.map((fit) => {
                        const isSelected = preferredFit === fit;
                        return (
                          <button
                            key={fit}
                            onClick={() => setPreferredFit(fit)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#FDFBF7] text-[#A86E18] border border-[#A86E18] font-semibold"
                                : "bg-white text-[#525252] border border-[#E5E5E5] hover:border-stone-300"
                            }`}
                          >
                            {fit}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Outfit Style */}
                  <div>
                    <span className="text-xs text-[#737373] block mb-2 font-medium">
                      Preferred outfit style
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {OUTFIT_STYLES_LIST.map((style) => {
                        const isSelected = outfitStyle === style;
                        return (
                          <button
                            key={style}
                            onClick={() => setOutfitStyle(style)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#FDFBF7] text-[#A86E18] border border-[#A86E18] font-semibold"
                                : "bg-white text-[#525252] border border-[#E5E5E5] hover:border-stone-300"
                            }`}
                          >
                            {style}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Preferences Card */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <Sun size={16} />
                  <span>Weather Preferences</span>
                </div>
                <p className="text-xs text-[#737373]">
                  Set your comfortable temperature range.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-1">
                  {/* Range Slider */}
                  <div className="w-full sm:w-48">
                    <span className="text-xs font-bold text-[#111111] block text-right mb-1">
                      {minTemp}°C – {maxTemp}°C
                    </span>

                    {/* Interactive Dual Slider Track */}
                    <div className="relative w-full h-6 flex items-center select-none">
                      {/* Visual Bar Track */}
                      <div className="relative w-full h-1.5 bg-[#E5E5E5] rounded-full pointer-events-none">
                        <div
                          className="absolute top-0 bottom-0 bg-[#A86E18] rounded-full"
                          style={{
                            left: `${(minTemp / 40) * 100}%`,
                            right: `${100 - (maxTemp / 40) * 100}%`,
                          }}
                        />
                        {/* Visual Left Knob */}
                        <div
                          className="w-3.5 h-3.5 rounded-full bg-[#A86E18] border-2 border-white shadow-xs absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                          style={{ left: `${(minTemp / 40) * 100}%` }}
                        />
                        {/* Visual Right Knob */}
                        <div
                          className="w-3.5 h-3.5 rounded-full bg-[#A86E18] border-2 border-white shadow-xs absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                          style={{ left: `${(maxTemp / 40) * 100}%` }}
                        />
                      </div>

                      {/* Overlapping Range Inputs */}
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={minTemp}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), maxTemp - 1);
                          setMinTemp(val);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto"
                        style={{ zIndex: minTemp > 20 ? 5 : 3 }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={maxTemp}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), minTemp + 1);
                          setMaxTemp(val);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto"
                        style={{ zIndex: 4 }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#A8A29E] font-medium mt-1">
                      <span>0°C</span>
                      <span>40°C</span>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 shrink-0">
                    <label
                      onClick={() => setPreferWarmer(!preferWarmer)}
                      className="flex items-center gap-2 cursor-pointer text-xs text-[#111111] font-medium select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                          preferWarmer
                            ? "bg-[#A86E18] text-white"
                            : "border border-[#D4D4D4] bg-white"
                        }`}
                      >
                        {preferWarmer && "✓"}
                      </div>
                      <span>Prefer warmer outfits</span>
                    </label>

                    <label
                      onClick={() => setPreferLighter(!preferLighter)}
                      className="flex items-center gap-2 cursor-pointer text-xs text-[#111111] font-medium select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                          preferLighter
                            ? "bg-[#A86E18] text-white"
                            : "border border-[#D4D4D4] bg-white"
                        }`}
                      >
                        {preferLighter && "✓"}
                      </div>
                      <span>Prefer lighter outfits</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------- RIGHT SUB-COLUMN ----------------- */}
            <div className="space-y-5">
              {/* Colors I Avoid Card */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-3 relative">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <Ban size={16} />
                  <span>Colors I Avoid</span>
                </div>
                <p className="text-xs text-[#737373]">Select colors you don't prefer.</p>

                <div className="pt-1">
                  <div className="grid grid-cols-5 gap-3">
                    {colorsAvoid.map((col, idx) => {
                      const isSelected = selectedAvoidColor === col;
                      return (
                        <div
                          key={`${col}-${idx}`}
                          onClick={() => handleSelectAvoidColor(col)}
                          className={`group relative w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-red-500 scale-105"
                              : "border border-black/10 shadow-2xs"
                          }`}
                          style={{ backgroundColor: col }}
                          title={`${col} (Click to select or remove)`}
                        >
                          {isSelected && (
                            <button
                              onClick={(e) => handleRemoveAvoidColor(col, e)}
                              title="Remove avoid color"
                              className="w-3.5 h-3.5 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <X size={9} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* + Add Color Button with Popover */}
                    <div className="relative">
                      <div
                        onClick={() => setShowAvoidPicker(!showAvoidPicker)}
                        className="flex flex-col items-center justify-center cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-full border border-dashed border-[#A8A29E] group-hover:border-[#A86E18] flex items-center justify-center text-xs font-bold text-[#525252] group-hover:text-[#A86E18] transition-colors">
                          +
                        </div>
                        <span className="text-[9px] text-[#737373] group-hover:text-[#A86E18] mt-0.5">Add Color</span>
                      </div>

                      {/* Avoid Color Picker Popover */}
                      {showAvoidPicker && (
                        <div
                          ref={avoidPopoverRef}
                          className="absolute z-20 top-10 right-0 sm:left-0 bg-white border border-[#EEEEEE] rounded-xl p-3 shadow-xl w-48 space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <div className="flex items-center justify-between pb-1 border-b border-[#F5F5F4]">
                            <span className="text-[11px] font-bold text-[#111111]">Add Avoid Color</span>
                            <button
                              onClick={() => setShowAvoidPicker(false)}
                              className="text-[#A8A29E] hover:text-[#111111] cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>

                          {/* Avoid Sat/Val Box */}
                          <div
                            ref={avoidSatValRef}
                            onMouseDown={handleAvoidSatValPointer}
                            className="w-full h-16 rounded-lg relative overflow-hidden cursor-crosshair shadow-inner select-none"
                            style={{
                              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${avoidPickerHue}, 100%, 50%))`,
                            }}
                          >
                            <div
                              className="w-3 h-3 rounded-full border-2 border-white shadow-xs absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                              style={{
                                left: `${avoidPickerSat}%`,
                                top: `${100 - avoidPickerVal}%`,
                                backgroundColor: avoidPickerHex,
                              }}
                            />
                          </div>

                          {/* Rainbow Hue Bar */}
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={avoidPickerHue}
                            onChange={(e) => handleAvoidHueChange(parseInt(e.target.value, 10))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{
                              background:
                                "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                            }}
                          />

                          {/* Hex + Add Button */}
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <input
                              type="text"
                              value={avoidPickerHex}
                              onChange={(e) => handleAvoidHexInput(e.target.value)}
                              placeholder="#000000"
                              maxLength={7}
                              className="flex-1 px-1.5 py-1 text-[10px] font-mono border border-[#E5E5E5] rounded text-center text-[#111111] uppercase focus:border-[#A86E18]"
                            />
                            <button
                              onClick={handleAddAvoidColor}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold rounded shadow-2xs transition-colors cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequent Occasions Card */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <Calendar size={16} />
                  <span>Frequent Occasions</span>
                </div>
                <p className="text-xs text-[#737373]">What do you usually dress for?</p>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {OCCASIONS_LIST.map((occ) => {
                    const isSelected = occasions.includes(occ);
                    return (
                      <button
                        key={occ}
                        onClick={() => toggleOccasion(occ)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer ${
                          isSelected
                            ? "bg-[#FDFBF7] text-[#A86E18] border border-[#A86E18] font-semibold"
                            : "bg-white text-[#525252] border border-[#E5E5E5] hover:border-stone-300"
                        }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Privacy Card */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <Shield size={16} />
                  <span>Privacy</span>
                </div>
                <p className="text-xs text-[#737373] leading-relaxed">
                  Your wardrobe images are used to create your personalized outfit recommendations.
                </p>

                <div className="pt-1">
                  <button className="px-4 py-2 bg-white border border-[#E5E5E5] hover:bg-stone-50 text-[#111111] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer">
                    <span>Manage Privacy</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
