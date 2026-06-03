import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/candidates")({
  head: () => ({
    meta: [
      { title: "Candidates — BallotBox" },
      { name: "description", content: "Browse all candidates, their parties, and manifestos." },
    ],
  }),
  component: Candidates,
});

function Candidates() {
  const { candidates } = useApp();
  const positions = Array.from(new Set(candidates.map((c) => c.position)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Candidates</h1>
          <p className="mt-2 text-muted-foreground">Meet the people on the ballot and read their manifestos.</p>
        </div>
        <Link to="/vote"><Button>Go to ballot</Button></Link>
      </div>

      {positions.map((pos) => (
        <section key={pos} className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">{pos}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.filter((c) => c.position === pos).map((c) => (
              <div key={c.id} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-xl bg-secondary text-3xl">{c.photo}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{c.name}</h3>
                    <Badge variant="secondary" className="mt-1">{c.party}</Badge>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">{c.manifesto}</p>
                <Link to="/vote" className="mt-5">
                  <Button className="w-full">Vote Now</Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
