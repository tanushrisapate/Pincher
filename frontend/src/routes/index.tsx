import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Palette, ShieldCheck, Sparkles, Star, Wand2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { FashionCard } from "@/components/ui-kit/FashionCard";
import { moodboardImages, styleReferences } from "@/lib/style-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pincher - Outfit and style prediction" },
      { name: "description", content: "Upload an outfit, add your preferences, and get a practical style report with palette and outfit suggestions." },
      { property: "og:title", content: "Pincher" },
      { property: "og:description", content: "A focused outfit analysis tool for building better looks." },
    ],
  }),
  component: Landing,
});

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
} as const;

function Landing() {
  return (
    <div className="overflow-hidden">
      <Navbar />

      <section className="relative bg-hero pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div initial="hidden" animate="show" variants={fade}>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-cocoa">
                <Sparkles className="h-3.5 w-3.5" /> Pincher style check
              </span>
              <h1 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-7xl">
                Build a clearer read on your outfit
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground text-balance">
                Upload a look, choose a few taste signals, and get a compact report with palette, style mood, and next-piece suggestions.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <GradientButton to="/register" size="lg">
                  Start a style check <ArrowRight className="h-4 w-4" />
                </GradientButton>
                <GradientButton to="/app/upload" size="lg" variant="outline">
                  Upload outfit
                </GradientButton>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex -space-x-3">
                  {moodboardImages.slice(0, 4).map((img) => (
                    <img key={img} src={img} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
                  ))}
                </div>
                <span>Designed for outfit notes, palettes, and repeatable style decisions.</span>
              </div>
            </motion.div>

            <motion.div
              className="relative hidden h-[560px] lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute right-0 top-0 w-64 animate-float">
                <FashionCard
                  image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
                  title="Quiet luxury"
                  subtitle="Clean lines, low contrast"
                  badge="Read"
                />
              </div>
              <div className="absolute left-0 top-32 w-56 animate-float [animation-delay:1s]">
                <FashionCard
                  image="https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80"
                  title="Dark academia"
                  subtitle="Layered, textural, warm"
                  badge="Mood"
                />
              </div>
              <div className="absolute right-8 bottom-0 w-72 animate-float [animation-delay:2s]">
                <div className="rounded-3xl bg-card p-5 shadow-elegant">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Palette direction</p>
                  <div className="mt-3 flex gap-2">
                    {["#F4E4C9", "#E8C4C0", "#5A3E2B", "#1A1614", "#B7C4A4"].map((color) => (
                      <span key={color} className="h-10 w-10 rounded-full ring-1 ring-border" style={{ background: color }} />
                    ))}
                  </div>
                  <p className="mt-3 font-display text-lg">Ivory, cocoa, sage</p>
                  <p className="text-xs text-muted-foreground">A warm base with room for sharper accents.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} className="mx-auto max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">What it checks</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">A practical outfit report</h2>
            <p className="mt-4 text-muted-foreground">Pincher keeps the result useful: what works, what to repeat, and what to add next.</p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Wand2, title: "Style read", desc: "Names the strongest visual direction without overcomplicating the result." },
              { icon: Palette, title: "Color anchors", desc: "Pulls a palette you can use for shopping, pairing, and saving looks." },
              { icon: Star, title: "Reference match", desc: "Connects your taste to familiar style references you choose." },
              { icon: Camera, title: "Image-first flow", desc: "Starts from the outfit photo instead of a long questionnaire." },
              { icon: ShieldCheck, title: "Account based", desc: "Keeps your checks tied to your own Pincher profile." },
              { icon: Sparkles, title: "Next-piece ideas", desc: "Suggests practical additions that match the current look." },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}
                transition={{ delay: index * 0.05 }}
                className="group rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-foreground transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-secondary/40 py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Flow</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Three steps</h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Upload", d: "Add one clear outfit photo or a saved look from your camera roll." },
              { n: "02", t: "Choose signals", d: "Pick colors, tags, and references that match your taste." },
              { n: "03", t: "Review", d: "Read the report, save the useful parts, and test another look." },
            ].map((step) => (
              <div key={step.n} className="rounded-3xl bg-card p-8 shadow-soft">
                <span className="font-display text-5xl text-gradient">{step.n}</span>
                <h3 className="mt-4 font-display text-2xl">{step.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">References</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Style directions you can compare</h2>
            </div>
            <Link to="/register" className="text-sm text-foreground underline-offset-4 hover:underline">
              Create account <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {styleReferences.slice(0, 6).map((ref) => (
              <FashionCard key={ref.id} image={ref.img} title={ref.name} subtitle={ref.style} badge="Reference" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-primary p-12 text-center text-primary-foreground shadow-elegant md:p-20">
            <h2 className="font-display text-4xl md:text-5xl">Check your next outfit with Pincher.</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Keep the report short, visual, and useful enough to act on.
            </p>
            <div className="mt-8 flex justify-center">
              <GradientButton to="/register" size="lg" variant="gold">
                Start now <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
