import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { recentLooks, styleReferences } from "@/lib/style-data";
import { ColorPalette } from "@/components/ui-kit/ColorPalette";
import { GradientButton } from "@/components/ui-kit/GradientButton";

type StyleResult = {
  aesthetic: string;
  confidence: number;
  palette: string[];
  personality: string;
  summary: string;
  recommendations: { title: string; detail: string }[];
  references: { name: string; style: string; match: number; img?: string }[];
};

export const Route = createFileRoute("/app/results")({
  head: () => ({ meta: [{ title: "Style report - Pincher" }] }),
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
  const fallback = useMemo<StyleResult>(() => ({
    aesthetic: recentLooks[0].aesthetic,
    confidence: recentLooks[0].confidence,
    palette: recentLooks[0].palette,
    personality: "Composed casual",
    summary: "A balanced style read based on structure, color, and the references you selected.",
    recommendations: [
      { title: "Structured neutral layer", detail: "Adds shape without making the look feel stiff." },
      { title: "Clean trouser or dark denim", detail: "Keeps the outfit grounded and easy to repeat." },
      { title: "One accent accessory", detail: "Use metal, texture, or color as the focal point." },
      { title: "Low-contrast footwear", detail: "Lets the full outfit read as one clear silhouette." },
    ],
    references: styleReferences.slice(0, 3).map((ref, index) => ({
      name: ref.name,
      style: ref.style,
      match: 88 - index * 5,
      img: ref.img,
    })),
  }), []);

  const [result, setResult] = useState<StyleResult>(fallback);

  useEffect(() => {
    const saved = sessionStorage.getItem("pincher:last-result");
    if (!saved) return;

    try {
      setResult(JSON.parse(saved));
    } catch {
      setResult(fallback);
    }
  }, [fallback]);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3" /> Style report
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">{result.aesthetic}</h1>
            <p className="mt-2 max-w-xl text-primary-foreground/80">{result.summary}</p>
          </div>
          <div className="flex gap-2">
            <GradientButton variant="outline" size="md"><Share2 className="h-4 w-4" /> Share</GradientButton>
            <GradientButton variant="gold" size="md"><Download className="h-4 w-4" /> Export</GradientButton>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Confidence</p>
          <p className="mt-3 font-display text-6xl text-gradient">{result.confidence}%</p>
          <p className="mt-2 text-sm text-muted-foreground">Based on the uploaded image and selected taste signals.</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Style mood</p>
          <p className="mt-3 font-display text-3xl">{result.personality}</p>
          <p className="mt-2 text-sm text-muted-foreground">A practical read you can use while shopping or planning outfits.</p>
          <div className="mt-4 space-y-3">
            <Bar label="Polish" value={Math.min(96, result.confidence + 4)} />
            <Bar label="Ease" value={Math.max(56, result.confidence - 8)} />
            <Bar label="Statement" value={Math.max(42, result.confidence - 22)} />
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Palette</p>
          <div className="mt-4">
            <ColorPalette colors={result.palette} size="lg" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Use these colors as anchors before adding trend pieces.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-2xl">Outfit recommendations</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {result.recommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.05 }}
              className="rounded-2xl bg-secondary p-5 transition hover:bg-accent"
            >
              <p className="font-display text-lg">{rec.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{rec.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-2xl">Closest style references</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.references.map((ref) => (
            <div key={ref.name} className="flex items-center gap-4 rounded-2xl bg-secondary p-4">
              {ref.img && <img src={ref.img} alt={ref.name} className="h-16 w-16 rounded-2xl object-cover" />}
              <div className="flex-1">
                <p className="font-display text-lg">{ref.name}</p>
                <p className="text-xs text-muted-foreground">{ref.style}</p>
                <Bar label="Match" value={ref.match} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
