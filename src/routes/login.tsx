import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth-provider";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Lumen" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already signed in, redirect
  useEffect(() => {
    if (user && profile) {
      navigate({ to: profile.role === "creator" ? "/dashboard/influencer" : "/dashboard/customer" });
    }
  }, [user, profile, navigate]);

  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const passValid = password.length >= 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!emailValid || !passValid) return;
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    // Fetch role to route correctly
    const uid = data.user?.id;
    if (uid) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", uid)
        .maybeSingle();
      navigate({ to: prof?.role === "creator" ? "/dashboard/influencer" : "/dashboard/customer" });
    } else {
      navigate({ to: "/dashboard/customer" });
    }
  };

  return (
    <div className="relative grid min-h-[calc(100vh-64px)] place-items-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full gradient-warm opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full gradient-pink opacity-20 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elevated">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl gradient-sunset shadow-glow">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to Lumen</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@brand.in" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {touched && !emailValid && <p className="mt-1 text-xs text-destructive">Enter a valid email.</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
            </div>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {touched && !passValid && <p className="mt-1 text-xs text-destructive">At least 6 characters.</p>}
          </div>
          <Button type="submit" disabled={submitting} className="w-full rounded-full gradient-sunset border-0 text-white shadow-glow">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
