"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 3;
    if (password.length > 5) return 2;
    return 1;
  };
  
  const strength = getPasswordStrength();
  const strengthColors = ['bg-[#E7E5E4]', 'bg-[#EF4444]', 'bg-[#F59E0B]', 'bg-[#22C55E]'];
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    
    setIsLoading(true);
    // TODO: connect to API
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

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
          
          {!isSuccess ? (
            <>
              <h2 className="text-2xl font-semibold text-[#1C1917] mt-6">Set new password 🔒</h2>
              <p className="text-[#57534E] mt-2">Make sure it's strong and secure</p>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 flex flex-col items-center"
            >
              <CheckCircle2 className="w-16 h-16 text-[#22C55E] mb-4" />
              <h2 className="text-2xl font-semibold text-[#1C1917]">Password updated!</h2>
              <p className="text-[#57534E] mt-2">Redirecting you to login...</p>
            </motion.div>
          )}
        </div>

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1C1917]">New Password</label>
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
              <div className="flex space-x-1 mt-2">
                <div className={`h-1 flex-1 rounded-full ${strength >= 1 ? strengthColors[strength] : 'bg-[#E7E5E4]'} transition-colors duration-300`} />
                <div className={`h-1 flex-1 rounded-full ${strength >= 2 ? strengthColors[strength] : 'bg-[#E7E5E4]'} transition-colors duration-300`} />
                <div className={`h-1 flex-1 rounded-full ${strength >= 3 ? strengthColors[strength] : 'bg-[#E7E5E4]'} transition-colors duration-300`} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1C1917]">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8A29E]" />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white border ${passwordsMatch ? 'border-[#22C55E]' : 'border-[#E7E5E4]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent transition-all`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !passwordsMatch || password.length === 0}
              className="w-full py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
