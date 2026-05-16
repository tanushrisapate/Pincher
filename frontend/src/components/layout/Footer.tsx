import { Link } from "@tanstack/react-router";
import { Sparkles, Instagram, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">Pincher</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A simple place to check outfits, save style notes, and build better looks over time.
          </p>
        </div>
        {[
          { title: "Product", items: ["Features", "Upload", "Dashboard", "Saved looks"] },
          { title: "Account", items: ["Profile", "Settings", "Privacy", "Support"] },
          { title: "Resources", items: ["Style notes", "Lookbook", "Help center", "Feedback"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-base">{col.title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i} className="hover:text-foreground transition cursor-pointer">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Pincher. Built for everyday outfit decisions.</p>
          <div className="flex gap-4 text-muted-foreground">
            <Instagram className="h-4 w-4 hover:text-foreground transition cursor-pointer" />
            <Twitter className="h-4 w-4 hover:text-foreground transition cursor-pointer" />
            <Github className="h-4 w-4 hover:text-foreground transition cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}

