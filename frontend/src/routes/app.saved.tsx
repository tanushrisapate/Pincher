import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { moodboardImages } from "@/lib/style-data";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { GradientButton } from "@/components/ui-kit/GradientButton";

export const Route = createFileRoute("/app/saved")({
  head: () => ({ meta: [{ title: "Saved — Pincher" }] }),
  component: Saved,
});

const tabs = ["All", "Outfits", "Palettes", "Icons"] as const;

function Saved() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const empty = false;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Saved inspirations</h1>
          <p className="mt-2 text-muted-foreground">Your private lookbook of saved looks and palettes.</p>
        </div>
        <GradientButton to="/app/upload"><Plus className="h-4 w-4" /> Add inspiration</GradientButton>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              tab === t ? "bg-foreground text-background" : "bg-secondary hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {empty ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          description="Save looks from results to build your private lookbook."
          action={<GradientButton to="/app/upload">Upload an outfit</GradientButton>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...moodboardImages, ...moodboardImages].map((g, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-secondary">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={g} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass">
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

