"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OTPPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-advance
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Auto submit when all filled
  useEffect(() => {
    const isComplete = code.every(digit => digit !== '');
    if (isComplete && !isLoading && !isSuccess) {
      handleVerify();
    }
  }, [code]);

  const handleVerify = () => {
    setIsLoading(true);
    // TODO: connect to API
    const finalCode = code.join('');
    console.log("Verifying code:", finalCode);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/reset-password');
      }, 2000);
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
            <h1 className="text-3xl font-bold text-[#B8860B] font-serif tracking-tight">Pincher</h1>
          </Link>
          
          {!isSuccess ? (
            <>
              <h2 className="text-2xl font-semibold text-[#1C1917] mt-6">Verify your email ✨</h2>
              <p className="text-[#57534E] mt-2">
                We sent a 6-digit code to<br />
                <span className="font-medium text-[#1C1917]">j***@example.com</span>
              </p>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 flex flex-col items-center"
            >
              <CheckCircle2 className="w-16 h-16 text-[#22C55E] mb-4" />
              <h2 className="text-2xl font-semibold text-[#1C1917]">Verified successfully!</h2>
            </motion.div>
          )}
        </div>

        {!isSuccess && (
          <div className="space-y-8">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-12 h-14 text-center text-xl font-semibold bg-white border border-[#E7E5E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent transition-all disabled:opacity-50"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={isLoading || code.some(d => d === '')}
              className="w-full py-3 bg-[#B8860B] hover:bg-[#8C6212] text-white rounded-xl font-medium transition-colors shadow-[0_4px_15px_rgba(184,134,11,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </motion.button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-[#57534E]">
                  Resend code in <span className="font-medium text-[#B8860B]">{countdown}s</span>
                </p>
              ) : (
                <button 
                  onClick={() => setCountdown(60)}
                  className="text-sm font-medium text-[#B8860B] hover:text-[#8C6212] transition-colors"
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
