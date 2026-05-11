import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ImagePlus, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { aestheticPalette, celebrities, stylePreferences } from "@/lib/mock-data";
import { GradientButton } from "@/components/ui-kit/GradientButton";

export const Route = createFileRoute("/app/upload")({
  head: () => ({ meta: [{ title: "Upload outfit — Atelier AI" }] }),
  component: Upload,
});

function Upload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [colors, setColors] = useState<string[]>([]);
  const [icons, setIcons] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = (file: File) => {
    setPreview(URL.createObjectURL(file));
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); return 100; }
        return p + 7;
      });
    }, 80);
  };

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/app/results" }), 1100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Upload an outfit</h1>
        <p className="mt-2 text-muted-foreground">Drop an image, choose your taste, and let the atelier predict.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Drop zone */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className="lg:col-span-2 cursor-pointer rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center shadow-soft hover:border-foreground/30 transition"
        >
          <input
            ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {preview ? (
            <div className="space-y-4">
              <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-2xl">
                <img src={preview} alt="preview" className="h-full w-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setProgress(0); }}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mx-auto h-2 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{progress < 100 ? `Uploading... ${progress}%` : "Uploaded ✓"}</p>
            </div>
          ) : (
            <div className="py-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-secondary">
                <ImagePlus className="h-7 w-7 text-foreground" />
              </div>
              <p className="mt-5 font-display text-2xl">Drop your outfit here</p>
              <p className="mt-1 text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
              <GradientButton size="sm" className="mt-5" variant="outline">Browse files</GradientButton>
            </div>
          )}
        </motion.div>

        {/* Preferences */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl">Tune your taste</h3>
          <p className="text-xs text-muted-foreground">Refines the prediction.</p>

          <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">Favorite colors</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {aestheticPalette.map((c) => {
              const on = colors.includes(c.hex);
              return (
                <button
                  key={c.hex}
                  onClick={() => toggle(colors, setColors, c.hex)}
                  className={`relative h-9 w-9 rounded-full ring-2 transition ${on ? "ring-foreground" : "ring-border hover:ring-foreground/40"}`}
                  style={{ background: c.hex }}
                  title={c.name}
                />
              );
            })}
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">Style chips</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stylePreferences.map((s) => {
              const on = tags.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(tags, setTags, s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    on ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebrity picker */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-xl">Choose icons you love</h3>
        <p className="text-xs text-muted-foreground">Optional — helps personalize matches.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {celebrities.map((c) => {
            const on = icons.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(icons, setIcons, c.id)}
                className={`group overflow-hidden rounded-2xl border transition ${on ? "border-foreground shadow-elegant" : "border-border hover:border-foreground/30"}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={c.img} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-3 text-left">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.style}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <GradientButton size="lg" onClick={onSubmit} disabled={!preview || loading}>
          {loading ? "Analyzing..." : <>Analyze with AI <Sparkles className="h-4 w-4" /></>}
        </GradientButton>
      </div>
    </div>
  );
}
