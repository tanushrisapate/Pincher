"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, isLoading: isAuthLoading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // If already authenticated, redirect to dashboard or intended page
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, isAuthLoading, router, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push(redirectTo);
      } else {
        setErrorMessage(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-[#B8860B] font-serif tracking-tight">Pincher</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-[#1C1917] mt-6">Welcome back ✨</h2>
          <p className="text-[#57534E] mt-2">Enter your details to access your wardrobe</p>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1C1917]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8A29E]" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white border border-[#E7E5E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#57534E] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-[#E7E5E4] text-[#B8860B] focus:ring-[#B8860B] accent-[#B8860B]" />
              <span className="text-[#57534E]">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-[#B8860B] hover:text-[#8C6212] font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-[#E7E5E4] flex-1" />
          <span className="text-sm text-[#A8A29E]">or continue with</span>
          <div className="h-px bg-[#E7E5E4] flex-1" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 py-2.5 bg-white border border-[#E7E5E4] rounded-xl hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            <span className="text-sm font-medium text-[#1C1917]">Google</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-2.5 bg-white border border-[#E7E5E4] rounded-xl hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.15 2.18c.95-.95 2.37-1.45 3.52-1.45.18 1.15-.35 2.65-1.2 3.52-.8.85-2.25 1.4-3.4 1.4-.2-1.25.3-2.65 1.08-3.47zm5.95 7.17c-1.3-1-3.2-1.15-4.4-.3-1.05.7-2.1.7-2.95 0-1.2-.85-2.85-.75-4.05.2-1.25 1-2.25 2.85-2.25 4.95 0 2.5 1.6 4.75 3 6.6 1.4 1.8 2.35 2.1 3.55 2.1 1.3 0 1.6-.7 3.05-.7 1.4 0 1.95.7 3.25.7 1.05 0 2-1.5 3.35-3.45.85-1.25 1.25-2.45 1.3-2.55-.05-.05-2.35-.9-2.35-3.65 0-2.3 1.9-3.4 1.95-3.45-1.1-1.6-2.8-1.75-3.4-1.85z"/></svg>
            <span className="text-sm font-medium text-[#1C1917]">Apple</span>
          </button>
        </div>

        <p className="text-center text-sm text-[#57534E] mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#B8860B] hover:text-[#8C6212] font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF9]" />}>
      <LoginForm />
    </Suspense>
  );
}
