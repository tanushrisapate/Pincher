"use client";

import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, User, Palette, PieChart, Lock } from "lucide-react";
import Link from "next/link";

export default function InsightsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-6 md:p-10 text-[#1C1917]">
      <motion.div
        className="max-w-5xl mx-auto space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className="p-3 bg-[#B8860B]/10 rounded-xl text-[#B8860B]">
            <TrendingUp size={28} />
          </div>
          <h1 className="text-3xl font-bold">Style Insights</h1>
        </motion.div>

        {/* Empty State Hero */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-10 md:p-16 text-center border border-[#E7E5E4] shadow-sm flex flex-col items-center max-w-3xl mx-auto"
        >
          <div className="bg-[#FAFAF9] p-6 rounded-full border border-[#E7E5E4] mb-6">
            <Lightbulb size={56} className="text-[#A8A29E]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Not enough data yet</h2>
          <p className="text-[#57534E] mb-8 max-w-md text-lg">
            Build a few outfits and we'll show you patterns in your style — your
            go-to colors, favorite categories, and style persona.
          </p>
          <Link
            href="/dashboard/outfit-builder"
            className="inline-flex items-center justify-center bg-[#B8860B] hover:bg-[#8C6212] text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)]"
          >
            Build Your First Outfit
          </Link>
        </motion.div>

        {/* Preview Cards */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xl font-semibold text-[#57534E]">
            What to expect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Persona Card */}
            <div className="bg-white/60 rounded-2xl p-6 border border-[#E7E5E4] opacity-75 relative overflow-hidden flex flex-col items-start gap-4 shadow-sm group hover:opacity-100 transition-opacity">
              <div className="absolute top-4 right-4 text-[#A8A29E]">
                <Lock size={16} />
              </div>
              <div className="p-3 bg-[#FAFAF9] rounded-xl text-[#B8860B] border border-[#E7E5E4]">
                <User size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Style Persona</h4>
                <p className="text-sm text-[#57534E]">
                  Discover your style identity
                </p>
              </div>
            </div>

            {/* Colors Card */}
            <div className="bg-white/60 rounded-2xl p-6 border border-[#E7E5E4] opacity-75 relative overflow-hidden flex flex-col items-start gap-4 shadow-sm group hover:opacity-100 transition-opacity">
              <div className="absolute top-4 right-4 text-[#A8A29E]">
                <Lock size={16} />
              </div>
              <div className="p-3 bg-[#FAFAF9] rounded-xl text-[#B8860B] border border-[#E7E5E4]">
                <Palette size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Color Trends</h4>
                <p className="text-sm text-[#57534E]">
                  See your most-used colors
                </p>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white/60 rounded-2xl p-6 border border-[#E7E5E4] opacity-75 relative overflow-hidden flex flex-col items-start gap-4 shadow-sm group hover:opacity-100 transition-opacity">
              <div className="absolute top-4 right-4 text-[#A8A29E]">
                <Lock size={16} />
              </div>
              <div className="p-3 bg-[#FAFAF9] rounded-xl text-[#B8860B] border border-[#E7E5E4]">
                <PieChart size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Wardrobe Balance</h4>
                <p className="text-sm text-[#57534E]">
                  Understand your category mix
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
