import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — BallotBox" }] }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(80),
  matric: z.string().trim().min(3, "Invalid matric").max(40),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(4, "At least 4 characters").max(72),
});

function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", matric: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const r = register(parsed.data);
    setLoading(false);
    if (!r.ok) return toast.error(r.error || "Could not register");
    toast.success("Account created. You're verified to vote.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-md place-items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Register to vote in under a minute.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5"><Label>Full name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Matric number</Label><Input required value={form.matric} onChange={(e) => setForm({ ...form, matric: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Password</Label><Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already registered? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
