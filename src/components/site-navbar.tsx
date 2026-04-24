import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Sparkles, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./theme-provider";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
import { toast } from "sonner";

const baseLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/browse" as const, label: "Browse" },
];

export function SiteNavbar() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    ...baseLinks,
    ...(user && profile?.role === "creator"
      ? [{ to: "/dashboard/influencer" as const, label: "Creator" }]
      : []),
    ...(user && profile?.role === "brand"
      ? [{ to: "/dashboard/customer" as const, label: "Brand" }]
      : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
    setOpen(false);
  };

  const initial =
    profile?.full_name?.trim()?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-sunset shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Lumen</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to={profile?.role === "creator" ? "/dashboard/influencer" : "/dashboard/customer"}
                className="flex h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 transition-colors hover:bg-secondary"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full gradient-sunset text-xs font-bold text-white">
                  {initial}
                </span>
                <span className="max-w-[120px] truncate text-sm font-medium">
                  {profile?.full_name || user.email}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="rounded-full">Sign in</Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button size="sm" className="rounded-full gradient-sunset border-0 text-white shadow-glow hover:opacity-95">
                  Get started
                </Button>
              </Link>
            </>
          )}

          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-2">
                <div className="px-3 pb-2 text-xs text-muted-foreground">
                  Signed in as {profile?.full_name || user.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full rounded-full">Sign in</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full rounded-full gradient-sunset border-0 text-white">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
