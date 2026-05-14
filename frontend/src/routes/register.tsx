import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Sparkles } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "@/components/ui-kit/GradientButton";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Atelier AI" }] }),
  component: Register,
});

function Register() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try{

      const response = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if(response.ok){
        navigate({ to: "/app/dashboard"});
      }
    } catch (error){
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background p-6 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 lg:hidden mb-8">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">Pincher</span>
          </Link>
          <h1 className="font-display text-4xl">Begin your atelier</h1>
          <p className="mt-2 text-muted-foreground">Create your free account</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Row>
              <Field
                  icon={User}
                  label="Username"
                  placeholder="tanushri"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
            </Row>
            <Field
              icon={Mail}
              type="email"
              label="Email"
              placeholder="you@atelier.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Field
              icon={Lock}
              type="password"
              label="Password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-foreground" />
              I agree to the <a className="text-foreground hover:underline" href="#">Terms</a> and <a className="text-foreground hover:underline" href="#">Privacy Policy</a>.
            </label>
            <GradientButton size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </GradientButton>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-2xl border border-border bg-card py-3 text-sm font-medium hover:bg-secondary transition">Google</button>
            <button className="rounded-2xl border border-border bg-card py-3 text-sm font-medium hover:bg-secondary transition">Apple</button>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden overflow-hidden lg:block order-1 lg:order-2">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-bl from-cocoa/70 via-cocoa/30 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-xl">Pincher</span>
          </Link>
          <div>
            <p className="font-display text-4xl leading-snug text-balance">
              Your wardrobe, decoded into a personal lookbook.
            </p>
            <p className="mt-6 text-sm opacity-80">Join 12k+ stylists already in beta.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}
function Field({
  icon: Icon, label, ...rest
}: { icon: React.ElementType; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 transition focus-within:border-foreground/40 focus-within:shadow-soft">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input {...rest} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
    </label>
  );
}
