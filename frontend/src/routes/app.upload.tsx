import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ImagePlus, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { corePalette, styleReferences, styleTags } from "@/lib/style-data";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import api from "@/lib/api";

export const Route = createFileRoute("/app/upload")({
  head: () => ({ meta: [{ title: "Upload outfit - Pincher" }] }),
  component: Upload,
});

function Upload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [colors, setColors] = useState<string[]>([]);
  const [icons, setIcons] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = (nextFile: File) => {
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setProgress(100);
    setError("");
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
  };

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const onSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("colors", JSON.stringify(colors));
    formData.append("icons", JSON.stringify(icons));
    formData.append("tags", JSON.stringify(tags));

    try {
      const { data } = await api.post("/predictions/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      sessionStorage.setItem("pincher:last-result", JSON.stringify(data));
      navigate({ to: "/app/results" });
    } catch {
      setError("Could not analyze this image. Check that the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Upload an outfit</h1>
        <p className="mt-2 text-muted-foreground">Add a clear outfit photo and a few taste signals. Pincher will build a style read from it.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.005 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) handleFile(droppedFile);
          }}
          onClick={() => inputRef.current?.click()}
          className="lg:col-span-2 cursor-pointer rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center shadow-soft transition hover:border-foreground/30"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {preview ? (
            <div className="space-y-4">
              <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-2xl">
                <img src={preview} alt="Selected outfit" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mx-auto h-2 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">Image ready</p>
            </div>
          ) : (
            <div className="py-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-secondary">
                <ImagePlus className="h-7 w-7 text-foreground" />
              </div>
              <p className="mt-5 font-display text-2xl">Drop your outfit here</p>
              <p className="mt-1 text-sm text-muted-foreground">PNG or JPG, up to 10MB</p>
              <GradientButton size="sm" className="mt-5" variant="outline">Browse files</GradientButton>
            </div>
          )}
        </motion.div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl">Taste signals</h3>
          <p className="text-xs text-muted-foreground">Optional details that make the result more personal.</p>

          <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">Favorite colors</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {corePalette.map((c) => {
              const on = colors.includes(c.hex);
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => toggle(colors, setColors, c.hex)}
                  className={`relative h-9 w-9 rounded-full ring-2 transition ${on ? "ring-foreground" : "ring-border hover:ring-foreground/40"}`}
                  style={{ background: c.hex }}
                  title={c.name}
                />
              );
            })}
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">Style tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {styleTags.map((s) => {
              const on = tags.includes(s);
              return (
                <button
                  key={s}
                  type="button"
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

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-xl">Style references</h3>
        <p className="text-xs text-muted-foreground">Pick any references that feel close to your taste.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {styleReferences.map((c) => {
            const on = icons.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
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

      <div className="flex flex-col items-end gap-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <GradientButton size="lg" onClick={onSubmit} disabled={!preview || loading}>
          {loading ? "Analyzing..." : <>Analyze outfit <Sparkles className="h-4 w-4" /></>}
        </GradientButton>
      </div>
    </div>
  );
}
