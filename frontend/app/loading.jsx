"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6"
      >
        <div className="w-8 h-8 rounded-full bg-primary" />
      </motion.div>
      <h2 className="font-heading text-2xl text-text-primary font-medium animate-pulse">
        Styling your wardrobe...
      </h2>
    </div>
  );
}
