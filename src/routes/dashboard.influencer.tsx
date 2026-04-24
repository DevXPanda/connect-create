import { createFileRoute } from "@tanstack/react-router";
import { Eye, MousePointerClick, TrendingUp, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { influencers } from "@/data/influencers";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/influencer")({
  head: () => ({ meta: [{ title: "Creator dashboard — Lumen" }] }),
  component: CreatorDash,
});

function CreatorDash() {
  const me = influencers[0];
  const portfolio = influencers.slice(0, 4).map((i) => i.cover);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Creator dashboard</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Hello, {me.name.split(" ")[0]} 👋</h1>
      </div>

      {/* analytics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Eye, label: "Profile views", value: "12,482", delta: "+18%" },
          { icon: MousePointerClick, label: "Clicks", value: "3,210", delta: "+9%" },
          { icon: TrendingUp, label: "Bookings", value: "24", delta: "+4" },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <Badge variant="secondary" className="rounded-full text-xs text-emerald-600">{s.delta}</Badge>
            </div>
            <div className="mt-4 font-display text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* edit profile */}
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Edit profile</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><Label>Display name</Label><Input defaultValue={me.name} className="mt-1.5" /></div>
            <div><Label>Handle</Label><Input defaultValue={me.handle} className="mt-1.5" /></div>
            <div><Label>Category</Label><Input defaultValue={me.category} className="mt-1.5" /></div>
            <div><Label>Location</Label><Input defaultValue={me.location} className="mt-1.5" /></div>
            <div className="sm:col-span-2"><Label>Bio</Label><Textarea defaultValue={me.bio} className="mt-1.5" rows={3} /></div>
          </div>

          <h3 className="mt-8 font-display text-base font-semibold">Portfolio</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {portfolio.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-2xl border border-border">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            <button
              onClick={() => toast("Upload coming soon")}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary"
            >
              <Upload className="h-5 w-5" />
              Upload
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => toast.success("Profile saved")} className="rounded-full gradient-sunset border-0 text-white shadow-glow">
              Save changes
            </Button>
          </div>
        </div>

        {/* pricing */}
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Pricing</h2>
            <Button size="sm" variant="outline" className="rounded-full"><Plus className="mr-1 h-3 w-3" /> Add</Button>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { name: "Story", price: me.startingPrice },
              { name: "Post", price: me.startingPrice * 2.5 },
              { name: "Reel", price: me.startingPrice * 4 },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold">{t.name}</span>
                  <span className="font-display font-bold">{formatINR(t.price)}</span>
                </div>
                <Input type="number" defaultValue={Math.round(t.price)} className="mt-3" />
              </div>
            ))}
          </div>
          <Button onClick={() => toast.success("Pricing updated")} variant="secondary" className="mt-5 w-full rounded-full">Update pricing</Button>
        </div>
      </div>
    </div>
  );
}
