"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
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
            <BarChart3 size={28} />
          </div>
          <h1 className="text-3xl font-bold">Analytics</h1>
        </motion.div>

        {/* Empty State Hero */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-10 md:p-16 text-center border border-[#E7E5E4] shadow-sm flex flex-col items-center max-w-3xl mx-auto"
        >
          <div className="bg-[#FAFAF9] p-6 rounded-full border border-[#E7E5E4] mb-6">
            <BarChart3 size={56} className="text-[#A8A29E]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Start using Pincher to unlock analytics
          </h2>
          <p className="text-[#57534E] mb-8 max-w-md text-lg">
            Once you build outfits and use your wardrobe, we'll track scores,
            usage patterns, and wardrobe utilization.
          </p>
          <Link
            href="/dashboard/outfit-builder"
            className="inline-flex items-center justify-center bg-[#B8860B] hover:bg-[#8C6212] text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)]"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Preview Stat Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#E7E5E4] shadow-sm flex flex-col gap-2 opacity-80">
            <span className="text-sm font-medium text-[#57534E]">
              Avg. Score
            </span>
            <span className="text-3xl font-bold text-[#A8A29E]">—</span>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#E7E5E4] shadow-sm flex flex-col gap-2 opacity-80">
            <span className="text-sm font-medium text-[#57534E]">
              Outfits Created
            </span>
            <span className="text-3xl font-bold text-[#A8A29E]">0</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#E7E5E4] shadow-sm flex flex-col gap-2 opacity-80">
            <span className="text-sm font-medium text-[#57534E]">
              Wardrobe Items
            </span>
            <span className="text-3xl font-bold text-[#A8A29E]">0</span>
          </div>

          {/* Card 4 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#E7E5E4] shadow-sm flex flex-col gap-2 opacity-80">
            <span className="text-sm font-medium text-[#57534E]">
              Utilization
            </span>
            <span className="text-3xl font-bold text-[#A8A29E]">—</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
