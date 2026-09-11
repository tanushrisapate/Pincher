"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CloudRain, Palette, Shirt, ArrowRight, Upload, Sparkles, Smile } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-light blob animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-accent-sand blob animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-accent-champagne blob animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-primary/20 text-primary-dark font-medium text-sm mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Meet your new personal stylist</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight">
            Your closet, <span className="text-primary">perfected</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Pincher takes the guesswork out of getting dressed. Smart, weather-aware, and color-coordinated outfits from the clothes you already own.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium transition-colors shadow-[0_4px_20px_rgba(184,134,11,0.25)] flex items-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-xl bg-white/70 hover:bg-white backdrop-blur-sm text-text-primary font-medium transition-colors border border-border shadow-sm">
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 z-10 bg-white/30 backdrop-blur-md border-y border-white/40">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: CloudRain,
                color: "text-accent-mint",
                bg: "bg-accent-mint/20",
                title: "Weather-Smart",
                desc: "Never freeze or overheat again. Outfits curated for your exact local forecast."
              },
              {
                icon: Palette,
                color: "text-primary",
                bg: "bg-primary/20",
                title: "Color Harmony",
                desc: "We analyze your items to find color combinations that effortlessly work together."
              },
              {
                icon: Shirt,
                color: "text-primary-dark",
                bg: "bg-accent-sand/30",
                title: "Your Real Clothes",
                desc: "No impossible catalog models. Just real, stylish outfits using what's in your closet."
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card p-8 rounded-2xl flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold mb-16">How it works</h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col md:flex-row gap-12 relative"
          >
            <div className="hidden md:block absolute top-8 left-20 right-20 h-0.5 bg-border/50 -z-10"></div>
            
            {[
              { step: 1, title: "Upload", desc: "Snap photos of your favorite pieces.", icon: Upload },
              { step: 2, title: "Answer", desc: "Tell us your vibe and the day's plans.", icon: Smile },
              { step: 3, title: "Wear", desc: "Get perfect outfit recommendations.", icon: Sparkles }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="flex-1 flex flex-col items-center relative">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-bg shadow-sm flex items-center justify-center text-xl font-bold text-primary mb-6">
                  {item.step}
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center bg-primary/5 border-primary/10"
        >
          <h2 className="font-heading text-4xl font-bold mb-6">Ready to look amazing?</h2>
          <p className="text-lg text-text-secondary mb-8">Join Pincher today and wake up to a perfectly planned outfit.</p>
          <Link href="/signup" className="inline-block px-10 py-4 rounded-xl bg-text-primary text-white font-medium hover:bg-black transition-colors shadow-lg">
            Start styling
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-text-muted z-10 relative">
        <p>© {new Date().getFullYear()} Pincher. Styled with 💖</p>
      </footer>
    </div>
  );
}
