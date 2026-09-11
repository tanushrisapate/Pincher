"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Shuffle, Sun, Heart } from "lucide-react";

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

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] p-8 md:p-12">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl mx-auto space-y-16"
      >
        <motion.div variants={item} className="flex items-center gap-4 mb-8">
          <Clock className="w-8 h-8 text-[#B8860B]" />
          <h1 className="text-3xl font-bold">Outfit History</h1>
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[#E7E5E4] rounded-3xl bg-white/40">
          <Clock className="w-14 h-14 text-[#A8A29E] mb-6" />
          <h2 className="text-2xl font-bold mb-3">No outfits yet</h2>
          <p className="text-[#57534E] max-w-md mx-auto mb-8">
            Your outfit history will appear here once you start building looks.
          </p>
          <Link href="/dashboard/outfit-builder">
            <button className="px-6 py-3 bg-[#B8860B] text-white rounded-xl font-medium hover:bg-[#8C6212] transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)]">
              Create Your First Outfit
            </button>
          </Link>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#B8860B]/10 rounded-full text-[#B8860B] shrink-0">
              <Shuffle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Mix & Match</h3>
              <p className="text-[#57534E] text-sm">Combine different styles for unique looks</p>
            </div>
          </div>
          <div className="p-6 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#D4AF37]/20 rounded-full text-[#B8860B] shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Weather Ready</h3>
              <p className="text-[#57534E] text-sm">We'll adapt to your local weather</p>
            </div>
          </div>
          <div className="p-6 bg-white/70 backdrop-blur-xl border border-[#E7E5E4] rounded-2xl shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#D8B168]/20 rounded-full text-[#B8860B] shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Save Favorites</h3>
              <p className="text-[#57534E] text-sm">Save the looks you love for later</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
