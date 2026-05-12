import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell, Bookmark, LayoutDashboard, LogOut, Search,
  Settings, Sparkles, Upload, User, BarChart3, Menu, X,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/upload", label: "Upload", icon: Upload },
  { to: "/app/results", label: "AI Results", icon: BarChart3 },
  { to: "/app/saved", label: "Saved", icon: Bookmark },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">Pincher</span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-4">
          <div className="rounded-2xl bg-secondary p-4">
            <p className="font-display text-sm">Upgrade to Couture</p>
            <p className="mt-1 text-xs text-muted-foreground">Unlimited AI predictions & exports.</p>
            <button className="mt-3 w-full rounded-full bg-foreground py-2 text-xs text-background">Upgrade</button>
          </div>
        </div>     {/*add upgrade title link*/}
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-secondary px-4 py-2 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search outfits, palettes, icons..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-secondary">
            <Bell className="h-4 w-4" />
          </button>
          <Link to="/app/profile" className="flex items-center gap-2 rounded-full border border-border bg-card pr-4 pl-1 py-1">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium">
              AV
            </span>
            <span className="hidden text-sm sm:inline">Ava</span>
          </Link>
          <Link to="/" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-secondary" title="Sign out">
            <LogOut className="h-4 w-4" />
          </Link>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
