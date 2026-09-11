"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: connect to API
    console.log("Requesting password reset for:", email);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#D8B168]/20 rounded-full blur-3xl pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_4px_20px_rgba(184,134,11,0.1)] p-8"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-[#B8860B] font-serif tracking-tight">Pincher</h1>
          </Link>
          
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-semibold text-[#1C1917] mt-6">Reset your password</h2>
              <p className="text-[#57534E] mt-2">Enter your email and we'll send you a reset code</p>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 flex flex-col items-center"
            >
              <CheckCircle2 className="w-16 h-16 text-[#22C55E] mb-4" />
              <h2 className="text-2xl font-semibold text-[#1C1917]">Check your email</h2>
              <p className="text-[#57534E] mt-2">We've sent a password reset link to <br/><strong>{email}</strong></p>
            </motion.div>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1C1917]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8A29E]" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E7E5E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/otp" className="w-full block text-center py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)]">
              Enter Reset Code (Demo)
            </Link>
          </motion.div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/login" className="flex items-center text-sm font-medium text-[#57534E] hover:text-[#B8860B] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
