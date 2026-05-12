import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Share2, Sparkles } from "lucide-react";
import { celebrities, recentPredictions } from "@/lib/mock-data";
import { ColorPalette } from "@/components/ui-kit/ColorPalette";
import { GradientButton } from "@/components/ui-kit/GradientButton";

export const Route = createFileRoute("/app/results")({
  head: () => ({ meta: [{ title: "Your AI report — Atelier AI" }] }),
  component: Results,
});

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground">{value}%</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-primary" />
      </div>
    </div>
  );
}

function Results() {
  const top = recentPredictions[0];
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3" /> AI fashion report
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">{top.aesthetic}</h1>
            <p className="mt-2 max-w-xl text-primary-foreground/80">
              A timeless, refined aesthetic defined by craftsmanship over logos. Quiet, expensive, and effortlessly composed.
            </p>
          </div>
          <div className="flex gap-2">
            <GradientButton variant="outline" size="md"><Share2 className="h-4 w-4" /> Share</GradientButton>
            <GradientButton variant="gold" size="md"><Download className="h-4 w-4" /> Export PDF</GradientButton>
          </div>
        </div>
      </div>

      {/* Top */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Aesthetic confidence</p>
          <p className="mt-3 font-display text-6xl text-gradient">{top.confidence}%</p>
          <p className="mt-2 text-sm text-muted-foreground">Across 4,200+ visual references.</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Personality</p>
          <p className="mt-3 font-display text-3xl">Composed Romantic</p>
          <p className="mt-2 text-sm text-muted-foreground">Discerning, warm, and quietly confident.</p>
          <div className="mt-4 space-y-3">
            <Bar label="Refined" value={92} />
            <Bar label="Romantic" value={78} />
            <Bar label="Adventurous" value={41} />
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Signature palette</p>
          <div className="mt-4">
            <ColorPalette colors={["#F4E4C9","#E8C4C0","#5A3E2B","#1A1614","#B7C4A4"]} size="lg" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Champagne, blush, cocoa, noir, sage — your seasonal harmony.</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-2xl">Outfit recommendations</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Cashmere ivory turtleneck", d: "Soft, structured, and timeless." },
            { t: "Pleated cocoa trousers", d: "Tailored for elongated proportions." },
            { t: "Suede slingbacks", d: "Warm-tone leather elevates daywear." },
            { t: "Gold heirloom hoops", d: "A discreet finishing flourish." },
          ].map((r, i) => (
            <motion.div
              key={r.t}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-secondary p-5 hover:bg-accent transition"
            >
              <p className="font-display text-lg">{r.t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.d}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Celeb matches */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-2xl">Celebrity style DNA</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {celebrities.slice(0, 3).map((c, i) => (
            <div key={c.id} className="flex items-center gap-4 rounded-2xl bg-secondary p-4">
              <img src={c.img} alt={c.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="font-display text-lg">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.style}</p>
                <Bar label="Match" value={92 - i * 6} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
