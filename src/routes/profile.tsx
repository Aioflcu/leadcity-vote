import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile & Settings — BallotBox" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({ name: "", matric: "", email: "" });
  const [dark, setDark] = useState(false);
  const [emails, setEmails] = useState(true);

  useEffect(() => {
    if (user) setForm({ name: user.name, matric: user.matric, email: user.email });
  }, [user]);

  useEffect(() => {
    const v = localStorage.getItem("vp_dark") === "1";
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  }, []);

  const toggleDark = (v: boolean) => {
    setDark(v);
    localStorage.setItem("vp_dark", v ? "1" : "0");
    document.documentElement.classList.toggle("dark", v);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card p-10">
          <h2 className="text-xl font-semibold">Please log in</h2>
          <Link to="/login"><Button className="mt-6">Login</Button></Link>
        </div>
      </div>
    );
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    toast.success("Profile updated");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences.</p>

      <form onSubmit={save} className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Personal information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Matric Number</Label><Input value={form.matric} onChange={(e) => setForm({ ...form, matric: e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        </div>
        <Button type="submit">Save changes</Button>
      </form>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Preferences</h2>
        <Row label="Dark mode" desc="Reduce glare in low light.">
          <Switch checked={dark} onCheckedChange={toggleDark} />
        </Row>
        <Row label="Email notifications" desc="Get notified when results are available.">
          <Switch checked={emails} onCheckedChange={setEmails} />
        </Row>
      </div>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-secondary/40 p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}
