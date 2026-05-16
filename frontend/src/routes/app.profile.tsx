import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Edit3,
  MapPin,
} from "lucide-react";

import { moodboardImages } from "@/lib/style-data";

import { ColorPalette } from "@/components/ui-kit/ColorPalette";

import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [{ title: "Profile — Pincher" }],
  }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Cover */}
      <div className="relative h-48 overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=80"
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="relative rounded-3xl border border-border bg-card pt-22 pb-6 px-6 shadow-elegant text-center">
          <div className="mx-auto -mt-16 grid h-24 w-24 place-items-center rounded-full bg-gradient-primary text-primary-foreground font-display text-3xl ring-4 ring-background">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <h2 className="mt-4 font-display text-2xl">
            {user?.username}
          </h2>

          <p className="text-sm text-muted-foreground">
            {user?.email}
          </p>

          <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Paris, France
          </p>

          <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary transition">
            <Edit3 className="h-3 w-3" />
            Edit profile
          </button>
        </div>

        {/* Aesthetic overview */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Fashion personality
          </p>

          <h3 className="mt-2 font-display text-3xl">
            Composed Romantic · Quiet Luxury
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Your wardrobe values craftsmanship over branding.
            Soft tailoring, warm neutrals, and one heirloom
            finish.
          </p>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Signature palette
            </p>

            <ColorPalette
              colors={[
                "#F4E4C9",
                "#E8C4C0",
                "#5A3E2B",
                "#1A1614",
                "#B7C4A4",
              ]}
              size="lg"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                l: "Predictions",
                v: "24",
              },
              {
                l: "Saved looks",
                v: "58",
              },
              {
                l: "Style score",
                v: "92",
              },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-secondary p-4 text-center"
              >
                <p className="font-display text-2xl">
                  {s.v}
                </p>

                <p className="text-xs text-muted-foreground">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-2xl">
          Achievements
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "First upload",
            "10 predictions",
            "Curated 25 looks",
            "Trendsetter",
          ].map((a) => (
            <div
              key={a}
              className="flex items-center gap-3 rounded-2xl bg-secondary p-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold text-cocoa">
                <Award className="h-4 w-4" />
              </span>

              <p className="font-medium text-sm">
                {a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved gallery */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-2xl">
          Saved outfits
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {moodboardImages.map((g) => (
            <div
              key={g}
              className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary"
            >
              <img
                src={g}
                alt=""
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


