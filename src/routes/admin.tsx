import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApp, type ElectionStatus } from "@/context/AppContext";
import { isAdmin, clearAdmin } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Leadcity Voting App" }] }),
  component: AdminPage,
});

const candidateSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  party: z.string().trim().min(2, "Party is required").max(60),
  position: z.string().trim().min(2, "Position is required").max(40),
  manifesto: z.string().trim().min(10, "Manifesto must be at least 10 characters").max(500),
});
type CandidateInput = z.infer<typeof candidateSchema>;

const COLORS = ["#008751", "#10b981", "#34d399", "#6ee7b7", "#047857", "#065f46", "#022c22"];

function AdminPage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/" });
    else setAllowed(true);
  }, [navigate]);

  const { candidates, addCandidate, removeCandidate, electionStatus, setElectionStatus, users } = useApp();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CandidateInput>({
    resolver: zodResolver(candidateSchema),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, { name: string; votes: number }[]>();
    for (const c of candidates) {
      if (!map.has(c.position)) map.set(c.position, []);
      map.get(c.position)!.push({ name: c.name, votes: c.votes });
    }
    return Array.from(map.entries());
  }, [candidates]);

  const totalVotes = candidates.reduce((a, b) => a + b.votes, 0);

  if (!allowed) return null;

  const onAdd = (data: CandidateInput) => {
    addCandidate(data);
    toast.success(`${data.name} added`);
    reset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold md:text-4xl">
            <ShieldAlert className="h-7 w-7 text-primary" />
            Admin Console
          </h1>
          <p className="mt-2 text-muted-foreground">Manage candidates, election status, and view analytics.</p>
        </div>
        <Button variant="outline" onClick={() => { clearAdmin(); navigate({ to: "/" }); }}>Exit Admin</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Candidates</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{candidates.length}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Registered Voters</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{users.length}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Votes</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{totalVotes}</CardContent></Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Status</CardTitle></CardHeader>
          <CardContent>
            <Select value={electionStatus} onValueChange={(v) => { setElectionStatus(v as ElectionStatus); toast.success(`Election ${v}`); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Votes by Candidate</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={candidates.map((c) => ({ name: c.name.split(" ")[0], votes: c.votes }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="votes" fill="#008751" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vote Share</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={candidates.map((c) => ({ name: c.name, value: c.votes }))} dataKey="value" nameKey="name" outerRadius={100} label>
                  {candidates.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Manage candidates */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Add Candidate</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onAdd)} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="party">Party</Label>
                <Input id="party" {...register("party")} />
                {errors.party && <p className="text-xs text-destructive">{errors.party.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="e.g. President" {...register("position")} />
                {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="manifesto">Manifesto</Label>
                <Textarea id="manifesto" rows={4} {...register("manifesto")} />
                {errors.manifesto && <p className="text-xs text-destructive">{errors.manifesto.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>Add Candidate</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Current Candidates</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {grouped.map(([position, list]) => (
              <div key={position}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold text-primary">{position}</h3>
                  <Badge variant="secondary">{list.length}</Badge>
                </div>
                <div className="divide-y divide-border rounded-lg border border-border">
                  {candidates.filter((c) => c.position === position).map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-3 p-3">
                      <div className="flex items-center gap-3">
                        <img src={c.photo} alt={c.name} className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.party} · {c.votes} votes</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => { removeCandidate(c.id); toast.success("Candidate removed"); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}