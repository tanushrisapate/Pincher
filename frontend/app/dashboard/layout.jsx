"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherProvider } from "@/app/context/WeatherContext";
import {
  LayoutDashboard,
  Shirt,
  Wand2,
  Sparkles,
  Upload,
  Heart,
  Palette,
  BarChart2,
  Menu,
  Star,
  X,
  Plus,
  ChevronDown
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/wardrobe", label: "Wardrobe", icon: Shirt },
  { href: "/dashboard/recommendations", label: "AI Stylist", icon: Sparkles, isStylist: true },
  { href: "/dashboard/outfit-builder", label: "Studio", icon: Wand2 },
  { href: "/dashboard/upload", label: "Digitize", icon: Upload },
  { href: "/dashboard/saved", label: "Lookbooks", icon: Heart, isLookbooks: true },
  { href: "/dashboard/insights", label: "Color Theory", icon: Palette },
  { href: "/dashboard/analytics", label: "Stats", icon: BarChart2, isStats: true },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const displayName = "Tani";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 1)
    .toUpperCase() || "T";

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#111111] font-sans flex flex-col">
      {/* ================= UPPER SIDE / TOP NAVIGATION ================= */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#EEEEEE]">
        {/* Main Upper Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* 1. Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 -ml-1.5 text-[#525252] hover:bg-stone-100 rounded-lg transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>

              <Link href="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-md bg-[#A86E18] flex items-center justify-center text-white font-serif font-bold text-sm shadow-2xs">
                  P
                </div>
                <span className="text-base font-bold text-[#111111] tracking-tight">
                  Pincher.
                </span>
              </Link>
            </div>

            {/* 2. Upper Horizontal Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isActive
                        ? "bg-[#FDFBF7] text-[#A86E18] border border-[#E8DCC0] font-semibold"
                        : "text-[#262626] hover:text-[#A86E18] font-normal"
                    }`}
                  >
                    {link.isStylist && (
                      <Sparkles
                        size={12}
                        className={isActive ? "text-[#A86E18]" : "text-[#737373]"}
                      />
                    )}
                    {link.isLookbooks && (
                      <Heart
                        size={11}
                        className={isActive ? "text-[#A86E18]" : "text-[#737373]"}
                      />
                    )}
                    {link.isStats && (
                      <BarChart2
                        size={11}
                        className={isActive ? "text-[#A86E18]" : "text-[#737373]"}
                      />
                    )}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 3. Upper Right Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard/upload"
                className="bg-[#A86E18] hover:bg-[#925f14] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Plus size={14} />
                <span>Add Garment</span>
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#A86E18] transition-colors"
                title={displayName}
              >
                <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-semibold text-xs tracking-tight shadow-2xs">
                  {initials}
                </div>
                <span className="hidden sm:inline-block font-medium">{displayName}</span>
                <ChevronDown size={14} className="text-[#737373]" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 lg:pb-12">
        <WeatherProvider>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </WeatherProvider>
      </main>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 240 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[290px] bg-white border-r border-[#E7E5E4] z-50 flex flex-col shadow-2xl"
            >
              <div className="p-4 flex items-center justify-between border-b border-[#E7E5E4]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-white font-bold font-serif shadow-xs">
                    P
                  </div>
                  <div>
                    <span className="text-lg font-bold tracking-tight text-[#1C1917]">
                      Pincher<span className="text-[#B8860B]">.</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#A8A29E] hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-3 border-b border-[#E7E5E4] bg-[#FAF9F6]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-white font-semibold text-xs shadow-xs">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1C1917]">{displayName}</p>
                    <p className="text-[10px] text-[#78716C]">Wardrobe Member</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                  Upper Navigation Menu
                </div>
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm ${
                        isActive
                          ? "bg-[#FAF8F5] text-[#8C6212] font-bold border border-[#D4AF37]/30"
                          : "text-[#57534E] hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? "text-[#B8860B]" : "text-[#A8A29E]"} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[10px] font-bold bg-[#B8860B]/15 text-[#8C6212] px-2 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#E7E5E4] flex items-center justify-between bg-stone-50">
                <Link
                  href="/dashboard/upload"
                  className="flex-1 mr-2 text-center py-2 bg-[#B8860B] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  + Add Garment
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E7E5E4] z-40 shadow-lg">
        <div className="flex items-center justify-around px-2 h-16">
          <Link href="/dashboard" className="flex flex-col items-center justify-center w-12 h-full text-[#A8A29E]">
            <LayoutDashboard size={20} className={pathname === "/dashboard" ? "text-[#B8860B]" : ""} />
            <span className="text-[10px] font-semibold mt-0.5">Home</span>
          </Link>
          <Link href="/dashboard/wardrobe" className="flex flex-col items-center justify-center w-12 h-full text-[#A8A29E]">
            <Shirt size={20} className={pathname === "/dashboard/wardrobe" ? "text-[#B8860B]" : ""} />
            <span className="text-[10px] font-semibold mt-0.5">Wardrobe</span>
          </Link>

          <Link href="/dashboard/upload" className="relative -top-4">
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-[#F59E0B] shadow-[0_4px_18px_rgba(184,134,11,0.35)] flex items-center justify-center text-white transform transition-transform active:scale-95">
              <Plus size={24} />
            </div>
          </Link>

          <Link href="/dashboard/recommendations" className="flex flex-col items-center justify-center w-12 h-full text-[#A8A29E]">
            <Star size={20} className={pathname === "/dashboard/recommendations" ? "text-[#B8860B]" : ""} />
            <span className="text-[10px] font-semibold mt-0.5">AI Style</span>
          </Link>
          <Link href="/dashboard/saved" className="flex flex-col items-center justify-center w-12 h-full text-[#A8A29E]">
            <Heart size={20} className={pathname === "/dashboard/saved" ? "text-[#B8860B]" : ""} />
            <span className="text-[10px] font-semibold mt-0.5">Saved</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
