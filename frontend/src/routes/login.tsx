import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in - Pincher" }] }),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.data.access_token);
        navigate({ to: "/app/dashboard" });
      } else {
        setError(data.detail || "Login failed");
      }
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-cocoa/70 via-cocoa/30 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-xl">Pincher</span>
          </Link>
          <div>
            <p className="font-display text-4xl leading-snug text-balance">
              "Small outfit notes become much easier to act on when they are organized visually."
            </p>
            <p className="mt-6 text-sm opacity-80">Pincher workspace</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-display text-lg">Pincher</span>
            </Link>
          </div>
          <h1 className="font-display text-4xl">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue your style checks.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field icon={Mail} type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field
              icon={Lock}
              type={show ? "text" : "password"}
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              right={
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-foreground" /> Remember me
              </label>
              <a className="text-foreground hover:underline" href="#">Forgot password?</a>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <GradientButton size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </GradientButton>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to Pincher? <Link to="/register" className="text-foreground hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, right, ...rest
}: { icon: React.ElementType; label: string; right?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 transition focus-within:border-foreground/40 focus-within:shadow-soft">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input {...rest} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        {right}
      </div>
    </label>
  );
}
