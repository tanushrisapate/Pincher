import { createFileRoute, Link,useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, TrendingUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { stats, recentPredictions, galleryImages, celebrities } from "@/lib/mock-data";
import { ColorPalette } from "@/components/ui-kit/ColorPalette";
import { GradientButton } from "@/components/ui-kit/GradientButton";



export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Atelier AI" }] }),
  component: Dashboard,
});

function Counter({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
  username: "",
  
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token){
      navigate({to: "/login"});
    }
     const fetchUser = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setUser({
        username: data.username,
      });

    } catch (error) {
      console.log(error);
    }
  };

  fetchUser();
  },[]);
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3" /> Daily edit
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Good morning , {user.username} ✶</h1>
            <p className="mt-2 text-primary-foreground/80">
              Your latest aesthetic is <strong>Quiet Luxury</strong>. Ready to refine it further?
            </p>
          </div>
          <GradientButton to="/app/upload" variant="gold" size="lg">
            <Plus className="h-4 w-4" /> New prediction
          </GradientButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 font-display text-4xl"><Counter value={s.value} /></p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-foreground/70">
              <TrendingUp className="h-3 w-3" /> +12% this week
            </p>
          </motion.div>
        ))}
      </div>

      {/* Two-column */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent predictions</h2>
            <Link to="/app/results" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              See all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {recentPredictions.map((p) => (
              <div key={p.id} className="group overflow-hidden rounded-2xl bg-secondary">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.img} alt={p.aesthetic} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="font-display text-base">{p.aesthetic}</p>
                  <p className="text-xs text-muted-foreground">Confidence {p.confidence}%</p>
                  <div className="mt-3"><ColorPalette colors={p.palette} size="sm" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-2xl">Trend pulse</h2>
          <p className="text-xs text-muted-foreground">This week in fashion</p>
          <ul className="mt-5 space-y-4">
            {[
              { t: "Cocoa & cream", v: 87 },
              { t: "Sheer layers", v: 74 },
              { t: "Boho revival", v: 62 },
              { t: "Pewter metals", v: 51 },
            ].map((t) => (
              <li key={t.t}>
                <div className="mb-1 flex justify-between text-sm"><span>{t.t}</span><span className="text-muted-foreground">{t.v}</span></div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${t.v}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gallery + icons */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-2xl">Your moodboard</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {galleryImages.map((g) => (
              <div key={g} className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                <img src={g} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-2xl">Style icons matched</h2>
          <ul className="mt-5 space-y-4">
            {celebrities.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <img src={c.img} alt={c.name} className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.style}</p>
                </div>
                <span className="text-xs font-medium text-foreground">{90 - parseInt(c.id) * 3}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
