"use client";

import { motion } from "framer-motion";
import { Edit2, Save, Mail, Calendar, Key } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  const displayName = user?.name || "Alex Park";
  const displayEmail = user?.email || "alex@example.com";
  const userPersona = user?.persona ? user.persona.charAt(0).toUpperCase() + user.persona.slice(1) : "Classic";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AP";

  const memberDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Aug 2026";

  const personas = ["Minimalist", "Classic", "Streetwear", "Bold", "Bohemian", "Sporty"];
  const fits = ["Slim", "Regular", "Relaxed"];
  const skinTones = ["Light", "Medium", "Dark", "Deep"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-20"
    >
      <h1 className="text-3xl font-bold text-[#1C1917] mb-8">Profile</h1>

      {/* Header section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-[#E7E5E4] flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-4xl font-black text-white shadow-lg">
            {initials}
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-[#E7E5E4] text-[#1C1917] hover:text-[#B8860B] transition-colors">
            <Edit2 size={18} />
          </button>
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-[#1C1917] mb-2">{displayName}</h2>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[#57534E] text-sm">
            <span className="flex items-center gap-1"><Mail size={14} /> {displayEmail}</span>
            <span className="hidden md:block">•</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Member since {memberDate}</span>
          </div>
        </div>
      </div>

      {/* Style Persona */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-[#E7E5E4]">
        <h3 className="text-xl font-bold text-[#1C1917] mb-4">Style Persona</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {personas.map((persona) => (
            <label key={persona} className="cursor-pointer relative">
              <input 
                type="radio" 
                name="persona" 
                className="peer sr-only" 
                defaultChecked={persona.toLowerCase() === userPersona.toLowerCase()} 
              />
              <div className="px-4 py-3 rounded-xl border border-[#E7E5E4] bg-white text-center font-medium text-[#57534E] peer-checked:bg-[#FAF8F5] peer-checked:border-[#B8860B] peer-checked:text-[#B8860B] transition-all">
                {persona}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Body & Preferences */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-[#E7E5E4] space-y-8">
        <h3 className="text-xl font-bold text-[#1C1917]">Body & Preferences</h3>
        
        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-3">Preferred Fit</label>
          <div className="flex gap-3">
            {fits.map((fit) => (
              <label key={fit} className="flex-1 cursor-pointer">
                <input type="radio" name="fit" className="peer sr-only" defaultChecked={fit === "Regular"} />
                <div className="py-2 text-center rounded-xl border border-[#E7E5E4] bg-white text-sm font-medium text-[#57534E] peer-checked:bg-[#FAF8F5] peer-checked:border-[#B8860B] peer-checked:text-[#B8860B] transition-all">
                  {fit}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-3">Skin Tone</label>
          <div className="flex gap-3">
            {skinTones.map((tone) => (
              <label key={tone} className="flex-1 cursor-pointer">
                <input type="radio" name="skinTone" className="peer sr-only" defaultChecked={tone === "Medium"} />
                <div className="py-2 text-center rounded-xl border border-[#E7E5E4] bg-white text-sm font-medium text-[#57534E] peer-checked:bg-[#FAF8F5] peer-checked:border-[#B8860B] peer-checked:text-[#B8860B] transition-all">
                  {tone}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-3">Favorite Colors</label>
          <div className="flex flex-wrap gap-3">
            {["#1C1917", "#FFFFFF", "#C19A6B", "#B8860B", "#10B981", "#D4AF37", "#8B5A2B"].map((color, i) => (
              <button 
                key={i} 
                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${i === 0 || i === 2 || i === 3 ? 'border-[#B8860B] scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color, boxShadow: color.toLowerCase() === '#ffffff' ? 'inset 0 0 0 1px #e5e7eb' : 'none' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-[#E7E5E4]">
        <h3 className="text-xl font-bold text-[#1C1917] mb-6">Account</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1C1917] mb-1">Email</label>
            <input 
              type="email" 
              defaultValue={displayEmail}
              className="w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-white focus:outline-none focus:ring-2 focus:ring-[#B8860B]/30 focus:border-[#B8860B] transition-all"
            />
          </div>
          
          <button className="flex items-center gap-2 text-[#57534E] font-medium text-sm hover:text-[#1C1917] transition-colors mt-4">
            <Key size={16} /> Change Password
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-8 py-3 bg-[#B8860B] text-white rounded-xl font-bold hover:bg-[#8C6212] transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)]">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
