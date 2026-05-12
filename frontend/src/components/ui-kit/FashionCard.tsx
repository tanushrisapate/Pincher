import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  image?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
  className?: string;
}

export function FashionCard({ image, title, subtitle, badge, children, className = "" }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`group overflow-hidden rounded-3xl bg-card shadow-soft hover:shadow-elegant transition-shadow ${className}`}
    >
      {image && (
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {badge && (
            <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-xs font-medium">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <h3 className="font-display text-xl text-foreground">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </motion.div>
  );
}
