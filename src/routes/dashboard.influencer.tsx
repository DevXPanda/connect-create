import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Eye, MousePointerClick, TrendingUp, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/influencer")({
  head: () => ({ meta: [{ title: "Creator dashboard — Lumen" }] }),
  component: CreatorDash,
});

type Tier = { id?: string; name: string; price: number; sort_order: number };
type Portfolio = { id: string; image_path: string; url: string };

function publicUrl(path: string) {
  return supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
}

function CreatorDash() {
  const { profile, user, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [handle, setHandle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, handle, category, location, bio, starting_price")
        .eq("id", user.id)
        .maybeSingle();
      if (prof) {
        setFullName(prof.full_name || "");
        setHandle(prof.handle || "");
        setCategory(prof.category || "");
        setLocation(prof.location || "");
        setBio(prof.bio || "");
        setStartingPrice(Number(prof.starting_price ?? 0));
      }

      const { data: t } = await supabase
        .from("pricing_tiers")
        .select("id, name, price, sort_order")
        .eq("user_id", user.id)
        .order("sort_order");
      if (t && t.length) {
        setTiers(t.map((x) => ({ id: x.id, name: x.name, price: Number(x.price), sort_order: x.sort_order })));
      } else {
        setTiers([
          { name: "Story", price: 0, sort_order: 0 },
          { name: "Post", price: 0, sort_order: 1 },
          { name: "Reel", price: 0, sort_order: 2 },
        ]);
      }

      const { data: imgs } = await supabase
        .from("portfolio_images")
        .select("id, image_path")
        .eq("user_id", user.id)
        .order("sort_order");
      setPortfolio((imgs || []).map((i) => ({ id: i.id, image_path: i.image_path, url: publicUrl(i.image_path) })));
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        handle: handle || null,
        category: category || null,
        location: location || null,
        bio: bio || null,
        starting_price: startingPrice || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    refreshProfile();
  };

  const savePricing = async () => {
    if (!user) return;
    // Upsert all rows; delete is handled separately
    const rows = tiers.map((t, idx) => ({
      ...(t.id ? { id: t.id } : {}),
      user_id: user.id,
      name: t.name,
      price: t.price,
      sort_order: idx,
    }));
    const { error } = await supabase.from("pricing_tiers").upsert(rows).select();
    if (error) return toast.error(error.message);
    toast.success("Pricing updated");
    // refresh ids
    const { data } = await supabase
      .from("pricing_tiers")
      .select("id, name, price, sort_order")
      .eq("user_id", user.id)
      .order("sort_order");
    if (data) setTiers(data.map((x) => ({ id: x.id, name: x.name, price: Number(x.price), sort_order: x.sort_order })));
  };

  const removeTier = async (idx: number) => {
    const t = tiers[idx];
    if (t.id) await supabase.from("pricing_tiers").delete().eq("id", t.id);
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.length) return;
    const file = e.target.files[0];
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file);
    if (upErr) {
      setUploading(false);
      return toast.error(upErr.message);
    }
    const { data, error } = await supabase
      .from("portfolio_images")
      .insert({ user_id: user.id, image_path: path, sort_order: portfolio.length })
      .select()
      .single();
    setUploading(false);
    if (error || !data) return toast.error(error?.message || "Upload failed");
    setPortfolio([...portfolio, { id: data.id, image_path: path, url: publicUrl(path) }]);
    toast.success("Image uploaded");
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = async (img: Portfolio) => {
    await supabase.storage.from("portfolio").remove([img.image_path]);
    await supabase.from("portfolio_images").delete().eq("id", img.id);
    setPortfolio(portfolio.filter((p) => p.id !== img.id));
  };

  const displayName = fullName?.split(" ")[0] || profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Creator dashboard</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Hello, {displayName} 👋</h1>
      </div>

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
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Edit profile</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><Label>Display name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Handle</Label><Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourname" className="mt-1.5" /></div>
            <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Fashion, Tech…" className="mt-1.5" /></div>
            <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Mumbai, India" className="mt-1.5" /></div>
            <div><Label>Starting price (₹)</Label><Input type="number" value={startingPrice} onChange={(e) => setStartingPrice(Number(e.target.value))} className="mt-1.5" /></div>
            <div className="sm:col-span-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1.5" rows={3} /></div>
          </div>

          <h3 className="mt-8 font-display text-base font-semibold">Portfolio</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {portfolio.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border">
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => removeImage(img)}
                  className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary">
              <Upload className="h-5 w-5" />
              {uploading ? "Uploading…" : "Upload"}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={saveProfile} disabled={saving} className="rounded-full gradient-sunset border-0 text-white shadow-glow">
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Pricing</h2>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setTiers([...tiers, { name: "New tier", price: 0, sort_order: tiers.length }])}
            >
              <Plus className="mr-1 h-3 w-3" /> Add
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {tiers.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    value={t.name}
                    onChange={(e) => {
                      const next = [...tiers]; next[idx] = { ...t, name: e.target.value }; setTiers(next);
                    }}
                    className="h-8 max-w-[60%] font-display font-semibold"
                  />
                  <span className="font-display font-bold">{formatINR(t.price)}</span>
                  <button onClick={() => removeTier(idx)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Input
                  type="number"
                  value={t.price}
                  onChange={(e) => {
                    const next = [...tiers]; next[idx] = { ...t, price: Number(e.target.value) }; setTiers(next);
                  }}
                  className="mt-3"
                />
              </div>
            ))}
          </div>
          <Button onClick={savePricing} variant="secondary" className="mt-5 w-full rounded-full">Update pricing</Button>
        </div>
      </div>
    </div>
  );
}
