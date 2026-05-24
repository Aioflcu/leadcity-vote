import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/elections")({
  head: () => ({
    meta: [
      { title: "Candidates — Leadcity Voting App" },
      { name: "description", content: "Browse all candidates running in the current Leadcity election." },
    ],
  }),
  component: ElectionsPage,
});

function ElectionsPage() {
  const { candidates } = useApp();
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<string>("All");

  const positions = useMemo(() => ["All", ...Array.from(new Set(candidates.map((c) => c.position)))], [candidates]);
  const filtered = candidates.filter(
    (c) =>
      (pos === "All" || c.position === pos) &&
      (c.name.toLowerCase().includes(q.toLowerCase()) || c.party.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Meet the Candidates</h1>
        <p className="mt-2 text-muted-foreground">Read manifestos and learn who is running for each position.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input placeholder="Search candidates or parties..." value={q} onChange={(e) => setQ(e.target.value)} className="md:max-w-sm" />
        <Tabs value={pos} onValueChange={setPos}>
          <TabsList>
            {positions.map((p) => (
              <TabsTrigger key={p} value={p}>{p}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">No candidates match your search.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="group overflow-hidden border-border/60 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-square w-full overflow-hidden bg-secondary">
                <img src={c.photo} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.party}</p>
                  </div>
                  <Badge variant="secondary">{c.position}</Badge>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{c.manifesto}</p>
                <Link to="/vote" className="mt-4 block">
                  <Button className="w-full">Vote Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}