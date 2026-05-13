import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GradientButton } from "../ui-kit/GradientButton";

const links = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features" },
  { to: "/#how", label: "How it works" },
  { to: "/#testimonials", label: "Stories" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all ${
          scrolled
            ? "glass shadow-soft mx-4 md:mx-auto"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>

          <span className="font-display text-lg tracking-tight">
            Pincher AI
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <GradientButton to="/app/dashboard" variant="outline">
                Dashboard
              </GradientButton>

              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Sign in
              </Link>

              <GradientButton to="/register" size="sm">
                Get started
              </GradientButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {open ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="mx-4 mt-2 rounded-3xl glass p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {/* Mobile Links */}
            {links.map((link) => (
              <a
                key={link.label}
                href={link.to}
                onClick={() => setOpen(false)}
                className="text-base text-foreground"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {isLoggedIn ? (
                <>
                  <GradientButton
                    to="/app/dashboard"
                    variant="outline"
                  >
                    Dashboard
                  </GradientButton>

                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-border px-4 py-2 text-sm transition hover:bg-muted"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <GradientButton
                    to="/login"
                    variant="outline"
                  >
                    Sign in
                  </GradientButton>

                  <GradientButton to="/register">
                    Get started
                  </GradientButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}