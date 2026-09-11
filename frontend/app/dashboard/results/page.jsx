"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Palette, CloudSun, Shirt } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] p-8 md:p-12 flex flex-col items-center justify-center">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-12"
      >
        <motion.div variants={item} className="flex flex-col items-center space-y-6">
          <div className="w-32 h-32 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-4 shadow-[0_4px_20px_rgba(184,134,11,0.15)]">
            <Sparkles className="w-16 h-16 text-[#B8860B]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">No outfit ready yet ✨</h1>
          <p className="text-[#57534E] text-lg max-w-md mx-auto">
            Build your first outfit to see smart recommendations based on your wardrobe and weather.
          </p>
          <Link href="/dashboard/outfit-builder">
            <button className="mt-4 px-8 py-4 bg-[#B8860B] text-white rounded-xl font-medium text-lg hover:bg-[#8C6212] transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)] flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Build an Outfit
            </button>
          </Link>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
          <Link href="/dashboard/outfit-builder">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center p-6 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl shadow-sm text-center space-y-4 h-full cursor-pointer hover:border-[#B8860B] transition-colors"
            >
              <div className="p-3 bg-[#B8860B]/10 rounded-full text-[#B8860B]">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">Try Your Fav Colors</h3>
              <p className="text-[#A8A29E] text-sm">Experiment with color palettes</p>
            </motion.div>
          </Link>
          
          <Link href="/dashboard/outfit-builder">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center p-6 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl shadow-sm text-center space-y-4 h-full cursor-pointer hover:border-[#B8860B] transition-colors"
            >
              <div className="p-3 bg-[#D4AF37]/20 rounded-full text-[#B8860B]">
                <CloudSun className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">Check the Weather</h3>
              <p className="text-[#A8A29E] text-sm">Dress right for today</p>
            </motion.div>
          </Link>

          <Link href="/dashboard/wardrobe">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center p-6 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl shadow-sm text-center space-y-4 h-full cursor-pointer hover:border-[#B8860B] transition-colors"
            >
              <div className="p-3 bg-[#D8B168]/20 rounded-full text-[#B8860B]">
                <Shirt className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">Browse Wardrobe</h3>
              <p className="text-[#A8A29E] text-sm">See what you own</p>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
