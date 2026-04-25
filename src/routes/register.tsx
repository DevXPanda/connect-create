import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, User, Briefcase, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Lumen" }] }),
  component: Register,
});

type Role = "creator" | "brand";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("creator");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const valid = name.length > 1 && /^\S+@\S+\.\S+$/.test(email) && password.length >= 6;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setSubmitting(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: name, role },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — welcome to Lumen!");
    navigate({ to: role === "creator" ? "/dashboard/influencer" : "/dashboard/customer" });
  };

  return (
    <div className="relative grid min-h-[calc(100vh-64px)] place-items-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 right-1/4 h-80 w-80 rounded-full gradient-warm opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full gradient-pink opacity-20 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elevated">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl gradient-sunset shadow-glow">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick your path — you can always switch later.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {([
            { id: "creator", label: "I'm a creator", icon: Camera, desc: "Build profile, get hired" },
            { id: "brand", label: "I'm a brand", icon: Briefcase, desc: "Discover & hire creators" },
          ] as const).map((r) => {
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary bg-accent/40 shadow-soft"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <r.icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div className="mt-2 text-sm font-semibold">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <div className="relative mt-1.5">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" placeholder="Aarav Sharma" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="pwd">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pwd" type="password" placeholder="At least 6 characters" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          {touched && !valid && <p className="text-xs text-destructive">Please fill all fields correctly.</p>}
          <Button type="submit" disabled={submitting} className="w-full rounded-full gradient-sunset border-0 text-white shadow-glow">
            {submitting ? "Creating…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have one?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
