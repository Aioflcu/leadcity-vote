import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { ArrowRight, ShieldCheck, BarChart3, Users, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BallotBox — Secure Online Voting" },
      { name: "description", content: "Cast your vote securely. View live results. Trust every ballot." },
    ],
  }),
  component: Home,
});

function Home() {
  const { election, candidates, votes } = useApp();
  const totalVotes = votes.length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 surface-grid opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Election {election.status === "open" ? "is live" : `is ${election.status}`}
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Vote with <span className="text-gradient">confidence.</span>
                <br /> Counted in real time.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                {election.description} Secure authentication, one ballot per voter, transparent tallies.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/candidates">
                  <Button size="lg" className="gap-2">View Elections <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">Register to Vote</Button>
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                <Stat label="Candidates" value={candidates.length} />
                <Stat label="Votes cast" value={totalVotes} />
                <Stat label="Positions" value={new Set(candidates.map(c => c.position)).size} />
              </div>
            </div>
            <div className="lg:justify-self-end">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
                <p className="text-sm font-medium text-muted-foreground">Election closes in</p>
                <h3 className="mt-1 text-xl font-semibold">{election.title}</h3>
                <div className="mt-4">
                  <Countdown to={election.endsAt} />
                </div>
                <div className="mt-6 rounded-xl bg-secondary/60 p-4">
                  <p className="text-sm text-muted-foreground">
                    Verified voters can cast their ballot from any device, anywhere. Results update instantly as votes are tallied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for trust</h2>
          <p className="mt-3 text-muted-foreground">Every feature is engineered around fairness, privacy, and transparency.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, t: "Secure ballots", d: "End-to-end protected with verified voter authentication." },
            { icon: Lock, t: "One vote each", d: "Cryptographic guarantees against double voting per position." },
            { icon: BarChart3, t: "Live results", d: "Real-time tallies with charts and exportable summaries." },
            { icon: Users, t: "Inclusive", d: "Accessible from any device, fully responsive interface." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6 transition hover:shadow-md">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl hero-gradient p-10 text-center text-primary-foreground sm:p-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Your voice. Your vote.</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">Join thousands of verified voters shaping the future. Registration takes less than a minute.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register"><Button size="lg" variant="secondary">Create account</Button></Link>
            <Link to="/candidates"><Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20">Browse candidates</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
