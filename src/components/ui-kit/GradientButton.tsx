import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-elegant hover:-translate-y-0.5",
  gold: "bg-gradient-gold text-cocoa shadow-soft hover:shadow-elegant hover:-translate-y-0.5",
  ghost: "text-foreground hover:bg-secondary",
  outline:
    "border border-border bg-background/60 backdrop-blur text-foreground hover:bg-secondary hover:border-foreground/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

interface Props extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  to?: string;
  children: ReactNode;
}

export function GradientButton({
  variant = "primary",
  size = "md",
  to,
  className = "",
  children,
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
