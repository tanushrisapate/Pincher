"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import {
  LayoutDashboard,
  Shirt,
  Wand2,
  Upload,
  Sparkles,
  History,
  Heart,
  Star,
  TrendingUp,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Sun,
  ShieldCheck,
  ChevronRight,
  Plus
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/wardrobe", label: "Wardrobe Catalog", icon: Shirt },
  { href: "/dashboard/recommendations", label: "AI Recommendations", icon: Star, badge: "AI" },
  { href: "/dashboard/outfit-builder", label: "Outfit Studio", icon: Wand2 },
  { href: "/dashboard/upload", label: "Digitize Garment", icon: Upload },
  { href: "/dashboard/saved", label: "Saved Lookbook", icon: Heart },
  { href: "/dashboard/history", label: "Outfit History", icon: History },
  { href: "/dashboard/insights", label: "Color Theory", icon: TrendingUp },
  { href: "/dashboard/analytics", label: "Wardrobe Stats", icon: BarChart3 },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [weatherSnippet, setWeatherSnippet] = useState(null);
  const { user, isLoading, logout } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  // Fetch quick weather snippet for top bar
  useEffect(() => {
    async function loadWeatherSnippet() {
      try {
        const res = await fetch("/api/weather/current?lat=28.6139&lon=77.2090&city=Current+Location");
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setWeatherSnippet(data.data);
          }
        }
      } catch (e) {
        // Fallback default
        setWeatherSnippet({ temperature: 22, condition: "Pleasant", icon: "☀️" });
      }
    }
    loadWeatherSnippet();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-[#F59E0B] flex items-center justify-center text-white font-serif font-bold text-2xl shadow-xl shadow-[#B8860B]/25"
        >
          P
        </motion.div>
        <p className="mt-5 text-sm font-semibold text-[#8C6212] tracking-widest uppercase animate-pulse">
          Pincher Wardrobe Intelligence
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user?.name || "Member";
  const userPersona = user?.persona ? user.persona.charAt(0).toUpperCase() + user.persona.slice(1) : "Classic";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "P";

  // Current Page Title
  const activeLink = NAV_LINKS.find((l) => l.href === pathname);
  const pageTitle = activeLink ? activeLink.label : "Dashboard";

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] font-sans selection:bg-[#D4AF37]/30 flex flex-col">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[275px] bg-white/85 backdrop-blur-2xl border-r border-[#E7E5E4] z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-[#F5F5F4]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-[#F59E0B] flex items-center justify-center text-white font-serif font-bold shadow-md shadow-[#B8860B]/20 transition-transform group-hover:scale-105">
              P
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#1C1917] block leading-none">
                Pincher<span className="text-[#B8860B]">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A8A29E]">
                Haute Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
            Menu
          </div>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-[#FAF8F5] text-[#8C6212] font-bold border border-[#D4AF37]/30 shadow-xs shadow-[#B8860B]/5"
                    : "text-[#57534E] hover:bg-stone-50 hover:text-[#1C1917] font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#B8860B] text-white shadow-xs"
                        : "bg-stone-100 text-[#78716C] group-hover:bg-[#B8860B]/10 group-hover:text-[#B8860B]"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
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

        {/* User Card & Logout */}
        <div className="p-3.5 border-t border-[#E7E5E4] bg-[#FAF9F6]/50">
          <div className="flex items-center justify-between p-2 rounded-xl border border-[#E7E5E4]/80 bg-white/80 shadow-2xs">
            <Link href="/dashboard/profile" className="flex items-center gap-3 flex-1 min-w-0 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1C1917] truncate group-hover:text-[#B8860B] transition-colors">
                  {displayName}
                </p>
                <span className="text-[10px] font-medium text-[#8C6212] bg-[#B8860B]/10 px-1.5 py-0.2 rounded inline-block">
                  {userPersona} Style
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-0.5">
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-[#A8A29E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-[275px] flex flex-col flex-1 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E7E5E4] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#57534E] hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#78716C]">
              <span>Pincher</span>
              <ChevronRight size={14} />
              <span className="font-semibold text-[#1C1917]">{pageTitle}</span>
            </div>
            <h1 className="sm:hidden text-lg font-bold text-[#1C1917]">{pageTitle}</h1>
          </div>

          {/* Right Utilities (Weather Widget + Quick Add + Profile) */}
          <div className="flex items-center gap-3">
            {/* Live Weather Pill */}
            {weatherSnippet && (
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold bg-stone-50 border border-[#E7E5E4] text-[#1C1917] px-3 py-1.5 rounded-full shadow-2xs">
                <span>{weatherSnippet.icon || "☀️"}</span>
                <span>{Math.round(weatherSnippet.temperature || 22)}°C</span>
                <span className="text-[#A8A29E]">•</span>
                <span className="text-[#57534E]">{weatherSnippet.condition || "Pleasant"}</span>
              </div>
            )}

            {/* Quick Upload Button */}
            <Link
              href="/dashboard/upload"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B8860B] hover:bg-[#8C6212] text-white text-xs font-bold rounded-full transition-all shadow-xs shadow-[#B8860B]/20"
            >
              <Plus size={14} />
              <span>Add Garment</span>
            </Link>

            {/* User Profile Avatar Link */}
            <Link
              href="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-white font-bold text-xs shadow-xs hover:ring-2 hover:ring-[#B8860B]/30 transition-all"
            >
              {initials}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-[#1C1917]/30 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[280px] bg-white border-r border-[#E7E5E4] z-50 flex flex-col shadow-2xl"
            >
              <div className="p-4 flex items-center justify-between border-b border-[#E7E5E4]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-white font-bold font-serif shadow-xs">
                    P
                  </div>
                  <span className="text-lg font-bold tracking-tight text-[#1C1917]">
                    Pincher<span className="text-[#B8860B]">.</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#A8A29E] hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-white font-bold text-xs">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1C1917]">{displayName}</p>
                    <p className="text-[10px] text-[#8C6212]">{userPersona} Style</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-[#A8A29E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#E7E5E4] z-40 shadow-lg">
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
