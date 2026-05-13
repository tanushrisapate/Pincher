import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Camera, Wand2, Palette, Star,
  ShieldCheck, Heart, Quote,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { FashionCard } from "@/components/ui-kit/FashionCard";
import { celebrities, galleryImages } from "@/lib/mock-data";
import { useEffect } from "react";
import api from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier AI — Discover your AI fashion identity" },
      { name: "description", content: "AI-powered fashion analysis. Upload an outfit and get personalized aesthetic, palette and celebrity style matches in seconds." },
      { property: "og:title", content: "Atelier AI — Your AI Fashion Atelier" },
      { property: "og:description", content: "Discover your aesthetic, palette and celebrity matches with AI." },
    ],
  }),
  component: Landing,
});

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
} as const;

function Landing() {
  useEffect(() => {
  api.get("/")
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div className="overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-hero">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div initial="hidden" animate="show" variants={fade}>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-cocoa">
                <Sparkles className="h-3.5 w-3.5" /> AI Fashion Atelier · Beta
              </span>
              <h1 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-7xl">
                Discover your <span className="text-gradient italic">AI-powered</span> fashion identity
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground text-balance">
                Upload an outfit. Choose the colors and icons you love. Our atelier reveals your aesthetic, palette, and the celebrities whose style mirrors yours.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <GradientButton to="/register" size="lg">
                  Start your style report <ArrowRight className="h-4 w-4" />
                </GradientButton>
                <GradientButton to="/app/dashboard" size="lg" variant="outline">
                  Explore demo
                </GradientButton>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex -space-x-3">
                  {galleryImages.slice(0, 4).map((g) => (
                    <img key={g} src={g} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
                  ))}
                </div>
                <span>Loved by <strong className="text-foreground">12k+ stylists</strong> worldwide</span>
              </div>
            </motion.div>

            {/* Floating cards */}
            <motion.div
              className="relative h-[560px] hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute right-0 top-0 w-64 animate-float">
                <FashionCard
                  image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
                  title="Quiet Luxury"
                  subtitle="94% match"
                  badge="Aesthetic"
                />
              </div>
              <div className="absolute left-0 top-32 w-56 animate-float [animation-delay:1s]">
                <FashionCard
                  image="https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80"
                  title="Dark Academia"
                  subtitle="91% match"
                  badge="Aesthetic"
                />
              </div>
              <div className="absolute right-8 bottom-0 w-72 animate-float [animation-delay:2s]">
                <div className="rounded-3xl bg-card p-5 shadow-elegant">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Your palette</p>
                  <div className="mt-3 flex gap-2">
                    {["#F4E4C9","#E8C4C0","#5A3E2B","#1A1614","#B7C4A4"].map((c)=>(
                      <span key={c} className="h-10 w-10 rounded-full ring-1 ring-border" style={{background:c}}/>
                    ))}
                  </div>
                  <p className="mt-3 font-display text-lg">Champagne · Cocoa</p>
                  <p className="text-xs text-muted-foreground">Refined, warm, and timeless.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logos / trust */}
      <section className="border-y border-border bg-secondary/40 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>Vogue Edit</span><span>·</span><span>Highsnobiety</span><span>·</span>
          <span>Net-a-porter</span><span>·</span><span>SSENSE</span><span>·</span><span>Hypebeast</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Features</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">An atelier in your pocket</h2>
            <p className="mt-4 text-muted-foreground">
              Six AI lenses that decode every outfit into a styled, shareable report.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Wand2, title: "Aesthetic Decoder", desc: "Identifies your visual aesthetic from 40+ fashion archetypes." },
              { icon: Palette, title: "Palette Profiler", desc: "Builds your signature color palette with seasonal harmony." },
              { icon: Star, title: "Celebrity Matches", desc: "Find the icons whose style DNA closest mirrors your own." },
              { icon: Heart, title: "Personality Style", desc: "Maps clothing cues to personality traits and moods." },
              { icon: Camera, title: "Outfit Studio", desc: "Smart drag-and-drop uploads with style suggestions." },
              { icon: ShieldCheck, title: "Privacy First", desc: "Your photos stay yours. Encrypted and never sold." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}
                transition={{ delay: i * 0.05 }}
                className="group rounded-3xl border border-border bg-card p-7 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-foreground group-hover:bg-gradient-primary group-hover:text-primary-foreground transition">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-secondary/40 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">How it works</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Three steps to your style report</h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Upload your outfit", d: "Snap a photo or drop an image — anything from a fit pic to a moodboard." },
              { n: "02", t: "Tune your taste", d: "Pick favorite colors, icons and inspiration tags to refine the prediction." },
              { n: "03", t: "Receive your report", d: "Get aesthetic, personality, palette, and celebrity matches in seconds." },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl bg-card p-8 shadow-soft">
                <span className="font-display text-5xl text-gradient">{s.n}</span>
                <h3 className="mt-4 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Celebrities */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Style icons</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">The icons in our index</h2>
            </div>
            <Link to="/register" className="text-sm text-foreground underline-offset-4 hover:underline">
              See full index →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {celebrities.slice(0, 6).map((c) => (
              <FashionCard key={c.id} image={c.img} title={c.name} subtitle={c.style} badge="Icon" />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-secondary/40 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Stories</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Loved by editors, stylists & dreamers</h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { q: "It nailed my aesthetic in one upload. Genuinely uncanny.", n: "Mira K.", r: "Stylist, Paris" },
              { q: "The palette report is now bookmarked. My new shopping bible.", n: "Jules A.", r: "Creative Director" },
              { q: "Finally an AI tool that feels like Vogue, not a chatbot.", n: "Noor S.", r: "Editor, Milan" },
            ].map((t) => (
              <div key={t.n} className="rounded-3xl bg-card p-8 shadow-soft">
                <Quote className="h-6 w-6 text-muted-foreground" />
                <p className="mt-4 font-display text-xl leading-snug">{t.q}</p>
                <div className="mt-6 text-sm">
                  <p className="font-medium">{t.n}</p>
                  <p className="text-muted-foreground">{t.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-primary p-12 text-center text-primary-foreground shadow-elegant md:p-20">
            <h2 className="font-display text-4xl md:text-5xl">Your fashion identity, decoded.</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Get your personalized AI style report in under 30 seconds. Free during beta.
            </p>
            <div className="mt-8 flex justify-center">
              <GradientButton to="/register" size="lg" variant="gold">
                Create your report <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
