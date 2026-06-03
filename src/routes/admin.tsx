import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Trash2, Play, Pause, Square } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — BallotBox" }, { name: "description", content: "Manage candidates and elections." }],
  }),
  component: Admin,
});

const COLORS = ["oklch(0.48 0.18 258)", "oklch(0.62 0.17 155)", "oklch(0.75 0.16 75)", "oklch(0.58 0.22 27)", "oklch(0.55 0.18 300)"];

function Admin() {
  const { user, candidates, votes, election, addCandidate, removeCandidate, setElection, users } = useApp();
  const [form, setForm] = useState({ name: "", party: "", position: "President", manifesto: "", photo: "🟦" });

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card p-10">
          <h2 className="text-xl font-semibold">Admin only</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in as admin via the footer access button (label “2000”).</p>
          <Link to="/"><Button className="mt-6">Back home</Button></Link>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.party.trim() || !form.manifesto.trim()) {
      toast.error("All fields required");
      return;
    }
    addCandidate(form);
    setForm({ name: "", party: "", position: form.position, manifesto: "", photo: "🟦" });
    toast.success("Candidate added");
  };

  const positions = Array.from(new Set(candidates.map((c) => c.position)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage candidates, election status, and analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Voters: {users.filter(u => u.role === "voter").length}</Badge>
          <Badge variant="outline">Votes: {votes.length}</Badge>
        </div>
      </div>

      {/* Election status */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Election control</h2>
        <p className="text-sm text-muted-foreground">Current status: <span className="font-medium capitalize text-foreground">{election.status}</span></p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setElection({ ...election, status: "open" })} variant={election.status === "open" ? "default" : "outline"}><Play className="mr-2 h-4 w-4" />Open</Button>
          <Button onClick={() => setElection({ ...election, status: "paused" })} variant={election.status === "paused" ? "default" : "outline"}><Pause className="mr-2 h-4 w-4" />Pause</Button>
          <Button onClick={() => setElection({ ...election, status: "closed" })} variant={election.status === "closed" ? "default" : "outline"}><Square className="mr-2 h-4 w-4" />Close</Button>
        </div>
      </section>

      {/* Analytics */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Vote tallies</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={candidates.map((c) => ({ name: c.name.split(" ")[0], votes: c.votes }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="votes" fill="oklch(0.48 0.18 258)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Share of votes</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={candidates.map((c) => ({ name: c.name, value: c.votes }))} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {candidates.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Add candidate */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add candidate</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Party</Label><Input value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(positions.length ? positions : ["President", "Vice President"]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  <SelectItem value="Senate Leader">Senate Leader</SelectItem>
                  <SelectItem value="Treasurer">Treasurer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Photo (emoji)</Label><Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Manifesto</Label><Textarea rows={3} value={form.manifesto} onChange={(e) => setForm({ ...form, manifesto: e.target.value })} /></div>
          <Button type="submit">Add candidate</Button>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Candidates ({candidates.length})</h2>
          <div className="mt-4 max-h-[420px] space-y-2 overflow-auto pr-1">
            {candidates.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-card text-xl">{c.photo}</div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.position} · {c.party} · {c.votes} votes</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => { removeCandidate(c.id); toast.success("Removed"); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
