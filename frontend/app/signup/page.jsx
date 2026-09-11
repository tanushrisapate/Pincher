"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, isLoading: isAuthLoading, signup } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isAuthLoading, router]);

  const personas = [
    { id: 'minimalist', label: 'Minimalist', emoji: '🤍' },
    { id: 'classic', label: 'Classic', emoji: '🥂' },
    { id: 'streetwear', label: 'Streetwear', emoji: '👟' },
    { id: 'bold', label: 'Bold', emoji: '🔥' },
  ];

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 3;
    if (password.length > 5) return 2;
    return 1;
  };
  
  const strength = getPasswordStrength();
  const strengthColors = ['bg-[#E7E5E4]', 'bg-[#EF4444]', 'bg-[#F59E0B]', 'bg-[#22C55E]'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(name, email, password, selectedPersona || 'classic');
      if (result.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(result.error || 'Failed to create account');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen bg-[#FAFAF9] relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Decorative Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity }}
        className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity }}
        className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#D8B168]/20 rounded-full blur-3xl pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_4px_20px_rgba(184,134,11,0.1)] p-8"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-[#B8860B] font-serif tracking-tight">Pincher</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-[#1C1917] mt-6">Create your account 🌸</h2>
          <p className="text-[#57534E] mt-2">Join us to curate your perfect wardrobe</p>
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
            <label className="text-sm font-medium text-[#1C1917]">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8A29E]" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E7E5E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent transition-all"
                placeholder="Jane Doe"
              />
            </div>
          </div>

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
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E7E5E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            {/* Password strength indicator */}
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
                className={`w-full pl-10 pr-10 py-3 bg-white border ${passwordsMatch ? 'border-[#22C55E]' : 'border-[#E7E5E4]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
              {passwordsMatch && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#22C55E]" />
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-[#1C1917]">Style Persona (Optional)</label>
            <div className="grid grid-cols-2 gap-3">
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedPersona === persona.id 
                      ? 'border-[#B8860B] bg-[#FAF8F5] shadow-sm' 
                      : 'border-[#E7E5E4] bg-white hover:border-[#D4AF37]'
                  }`}
                >
                  <span className="text-2xl mb-1">{persona.emoji}</span>
                  <span className="text-sm font-medium text-[#1C1917]">{persona.label}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start space-x-2 mt-4 cursor-pointer">
            <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-[#E7E5E4] text-[#B8860B] focus:ring-[#B8860B] accent-[#B8860B]" />
            <span className="text-sm text-[#57534E]">
              I agree to the <Link href="#" className="text-[#B8860B] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#B8860B] hover:underline">Privacy Policy</Link>
            </span>
          </label>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || (password && confirmPassword && !passwordsMatch)}
            className="w-full py-3 mt-4 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-[#57534E] mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-[#B8860B] hover:text-[#8C6212] font-medium transition-colors">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

