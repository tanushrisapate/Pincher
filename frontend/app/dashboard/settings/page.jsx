"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Bell, Shield, Download, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";

const Toggle = ({ active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-[#B8860B]' : 'bg-[#E5E7EB]'}`}
  >
    <motion.div 
      layout
      className="w-4 h-4 bg-white rounded-full shadow-sm"
      animate={{ x: active ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
);

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    daily: true,
    weather: true,
    tips: false,
  });
  const [privacy, setPrivacy] = useState({
    shareData: true,
    saveHistory: true,
  });

  // TODO: connect to settings API

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 max-w-3xl mx-auto space-y-8 pb-20"
    >
      <h1 className="text-3xl font-bold text-[#1C1917] mb-8">Settings ⚙️</h1>

      {/* Appearance */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-[#E7E5E4]">
        <div className="p-6 border-b border-[#E7E5E4]">
          <h3 className="text-lg font-bold text-[#1C1917]">Appearance</h3>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="font-medium text-[#1C1917]">Theme</div>
            <div className="text-sm text-[#57534E]">Choose your preferred look</div>
          </div>
          <div className="flex bg-[#FAFAF9] p-1 rounded-xl border border-[#E7E5E4]">
            <button 
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white shadow-sm text-[#1C1917]' : 'text-[#57534E]'}`}
            >
              <Sun size={16} /> Light
            </button>
            <button 
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-[#1C1917] text-white' : 'text-[#57534E]'}`}
            >
              <Moon size={16} /> Dark
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-[#E7E5E4]">
        <div className="p-6 border-b border-[#E7E5E4] flex items-center gap-2">
          <Bell size={20} className="text-[#1C1917]" />
          <h3 className="text-lg font-bold text-[#1C1917]">Notifications</h3>
        </div>
        <div className="divide-y divide-[#E7E5E4]">
          <div className="p-6 flex items-center justify-between">
            <div>
              <div className="font-medium text-[#1C1917]">Daily Outfit Suggestion</div>
              <div className="text-sm text-[#57534E]">Get an outfit recommendation every morning</div>
            </div>
            <Toggle active={notifications.daily} onClick={() => setNotifications({...notifications, daily: !notifications.daily})} />
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <div className="font-medium text-[#1C1917]">Weather Alerts</div>
              <div className="text-sm text-[#57534E]">Notifications for sudden weather changes</div>
            </div>
            <Toggle active={notifications.weather} onClick={() => setNotifications({...notifications, weather: !notifications.weather})} />
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <div className="font-medium text-[#1C1917]">Style Tips</div>
              <div className="text-sm text-[#57534E]">Occasional personalized style advice</div>
            </div>
            <Toggle active={notifications.tips} onClick={() => setNotifications({...notifications, tips: !notifications.tips})} />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-[#E7E5E4]">
        <div className="p-6 border-b border-[#E7E5E4] flex items-center gap-2">
          <Shield size={20} className="text-[#1C1917]" />
          <h3 className="text-lg font-bold text-[#1C1917]">Privacy & Data</h3>
        </div>
        <div className="divide-y divide-[#E7E5E4]">
          <div className="p-6 flex items-center justify-between">
            <div>
              <div className="font-medium text-[#1C1917]">Share Wardrobe Data</div>
              <div className="text-sm text-[#57534E]">Improve recommendations through anonymized data</div>
            </div>
            <Toggle active={privacy.shareData} onClick={() => setPrivacy({...privacy, shareData: !privacy.shareData})} />
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <div className="font-medium text-[#1C1917]">Save Outfit History</div>
              <div className="text-sm text-[#57534E]">Keep a log of outfits you've worn</div>
            </div>
            <Toggle active={privacy.saveHistory} onClick={() => setPrivacy({...privacy, saveHistory: !privacy.saveHistory})} />
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-[#E7E5E4] space-y-4">
        <h3 className="text-lg font-bold text-[#1C1917] mb-4">Account Actions</h3>
        
        <button className="w-full flex items-center justify-between p-4 bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] text-[#1C1917] font-medium hover:bg-[#E7E5E4]/50 transition-colors">
          <span className="flex items-center gap-2"><Download size={18} /> Export My Data</span>
        </button>
        
        <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 font-medium hover:bg-red-100 transition-colors">
          <span className="flex items-center gap-2"><Trash2 size={18} /> Delete Account</span>
        </button>
      </div>

      {/* About */}
      <div className="text-center text-sm text-[#A8A29E] pt-4">
        <p className="font-medium mb-2">Pincher Wardrobe Assistant v0.1.0</p>
        <div className="flex items-center justify-center gap-4">
          <a href="#" className="hover:text-[#B8860B] transition-colors flex items-center gap-1">Terms <ExternalLink size={12} /></a>
          <span>•</span>
          <a href="#" className="hover:text-[#B8860B] transition-colors flex items-center gap-1">Privacy Policy <ExternalLink size={12} /></a>
        </div>
      </div>

    </motion.div>
  );
}
