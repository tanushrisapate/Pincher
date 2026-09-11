"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sun, Sparkles, Wand2, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = 4;

const OCCASIONS = [
  { id: "daily", label: "Daily Casual", emoji: "☕", desc: "Effortless, relaxed everyday style" },
  { id: "formal", label: "Work & Executive", emoji: "💼", desc: "Sharp, tailored & professional" },
  { id: "date", label: "Evening & Date Night", emoji: "🍷", desc: "Sophisticated, elegant & alluring" },
  { id: "party", label: "Celebration / Gala", emoji: "✨", desc: "Bold, statement-making luxury" },
  { id: "outdoor", label: "Active & Weekend", emoji: "🌿", desc: "Functional, breathable & clean" },
];

const FORMALITIES = [
  { id: "relaxed", label: "Relaxed & Casual", emoji: "🛋️", desc: "Unstructured breathable silhouettes" },
  { id: "smart", label: "Smart Casual", emoji: "✨", desc: "Blazers, tailored chinos & oxfords" },
  { id: "formal", label: "Haute Formal", emoji: "👔", desc: "Structured suiting & cocktail attire" },
];

const VIBES = [
  { id: "classic", label: "Classic & Timeless", emoji: "🏛️", desc: "Clean lines, muted neutrals & symmetry" },
  { id: "bold", label: "Bold & Expressive", emoji: "⚡", desc: "High contrast, gold accents & signature cuts" },
  { id: "minimal", label: "Minimalist Luxe", emoji: "⚪", desc: "Monochrome, refined drape & texture" },
  { id: "streetwear", label: "Modern Street", emoji: "👟", desc: "Layered outerwear & statement sneakers" },
];

const PREFERRED_PALETTES = [
  { id: "gold", name: "Gold & Camel", hex: "#B8860B" },
  { id: "black", name: "Obsidian & Charcoal", hex: "#111111" },
  { id: "navy", name: "Midnight Navy", hex: "#1E293B" },
  { id: "white", name: "Ivory & Cream", hex: "#F5EBE0" },
  { id: "wine", name: "Burgundy Wine", hex: "#722F37" },
  { id: "green", name: "Emerald & Olive", hex: "#15803D" },
];

export default function OutfitBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [weatherSnippet, setWeatherSnippet] = useState(null);

  // Form State
  const [occasion, setOccasion] = useState("daily");
  const [selectedPalette, setSelectedPalette] = useState("gold");
  const [formality, setFormality] = useState("smart");
  const [vibe, setVibe] = useState("classic");

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch("/api/weather/current?lat=28.6139&lon=77.2090&city=Delhi");
        if (res.ok) {
          const data = await res.json();
          if (data.data) setWeatherSnippet(data.data);
        }
      } catch (err) {
        setWeatherSnippet({ temperature: 24, condition: "Pleasant" });
      }
    }
    loadWeather();
  }, []);

  const nextStep = () => {
    if (step < STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      // Route to recommendations with styled parameters
      router.push(`/dashboard/recommendations?occasion=${occasion}&vibe=${vibe}&palette=${selectedPalette}`);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6212] bg-[#B8860B]/10 px-3 py-1 rounded-full">
                Step 1 of 4 • Context
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1C1917] mt-2">
                What is the occasion?
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Pincher adjusts color contrast, layering, and formality rules accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-3xl mx-auto">
              {OCCASIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOccasion(item.id)}
                  className={`p-5 rounded-2xl flex flex-col justify-between text-left transition-all border ${
                    occasion === item.id
                      ? "bg-[#FAF8F5] border-[#B8860B] ring-2 ring-[#B8860B]/20 shadow-sm"
                      : "bg-white border-[#E7E5E4] hover:border-[#D4AF37] hover:bg-stone-50"
                  }`}
                >
                  <span className="text-3xl mb-3">{item.emoji}</span>
                  <div>
                    <span className="font-bold text-sm text-[#1C1917] block">{item.label}</span>
                    <span className="text-xs text-[#78716C] mt-0.5 block">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6212] bg-[#B8860B]/10 px-3 py-1 rounded-full">
                Step 2 of 4 • Color Mood
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1C1917] mt-2">
                Select your tonal palette
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Choose the dominant color harmony for your outfit.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto">
              {PREFERRED_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setSelectedPalette(palette.id)}
                  className={`p-4 rounded-2xl flex items-center gap-3 transition-all border text-left ${
                    selectedPalette === palette.id
                      ? "bg-[#FAF8F5] border-[#B8860B] ring-2 ring-[#B8860B]/20 shadow-sm"
                      : "bg-white border-[#E7E5E4] hover:border-[#D4AF37]"
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full border border-black/20 shrink-0 shadow-2xs"
                    style={{ backgroundColor: palette.hex }}
                  />
                  <div>
                    <span className="font-bold text-xs text-[#1C1917] block">{palette.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6212] bg-[#B8860B]/10 px-3 py-1 rounded-full">
                Step 3 of 4 • Formality
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1C1917] mt-2">
                Silhouette & structure
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Define the tailoring expectation for the look.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {FORMALITIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormality(item.id)}
                  className={`p-5 rounded-2xl flex flex-col justify-between text-left transition-all border ${
                    formality === item.id
                      ? "bg-[#FAF8F5] border-[#B8860B] ring-2 ring-[#B8860B]/20 shadow-sm"
                      : "bg-white border-[#E7E5E4] hover:border-[#D4AF37]"
                  }`}
                >
                  <span className="text-3xl mb-3">{item.emoji}</span>
                  <div>
                    <span className="font-bold text-sm text-[#1C1917] block">{item.label}</span>
                    <span className="text-xs text-[#78716C] mt-0.5 block">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6212] bg-[#B8860B]/10 px-3 py-1 rounded-full">
                Step 4 of 4 • Aesthetic
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1C1917] mt-2">
                What aesthetic vibe?
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Personalize your look with an unmistakable signature flair.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {VIBES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setVibe(item.id)}
                  className={`p-5 rounded-2xl flex items-center gap-4 transition-all border text-left ${
                    vibe === item.id
                      ? "bg-[#FAF8F5] border-[#B8860B] ring-2 ring-[#B8860B]/20 shadow-sm"
                      : "bg-white border-[#E7E5E4] hover:border-[#D4AF37]"
                  }`}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <span className="font-bold text-sm text-[#1C1917] block">{item.label}</span>
                    <span className="text-xs text-[#78716C] mt-0.5 block">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Weather Bar */}
      {weatherSnippet && (
        <div className="bg-[#FAF8F5] border border-[#D4AF37]/30 text-[#1C1917] py-2.5 px-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-2xs">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#B8860B]" />
            <span>
              Today in {weatherSnippet.city || "Delhi"}: {Math.round(weatherSnippet.temperature)}°C ({weatherSnippet.condition})
            </span>
          </div>
          <span className="text-[#8C6212] hidden sm:inline">AI adapts fabrics & layering automatically</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-[#E7E5E4] h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] transition-all duration-500 ease-out"
          style={{ width: `${(step / STEPS) * 100}%` }}
        />
      </div>

      {/* Interactive Step Content */}
      <div className="min-h-[380px] relative">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center pt-6 border-t border-[#E7E5E4]">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            step === 1 ? "opacity-0 pointer-events-none" : "text-[#57534E] hover:bg-stone-100"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all bg-[#B8860B] hover:bg-[#8C6212] text-white shadow-md shadow-[#B8860B]/20"
        >
          {step === STEPS ? "Synthesize Outfits ✨" : "Continue"}
          {step !== STEPS && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
