import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Vote, BarChart3, Users, Clock, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leadcity Voting App — Secure Online Elections" },
      { name: "description", content: "Cast your vote securely. View candidates, track elections, and make your voice count at Leadcity." },
    ],
  }),
  component: Index,
});

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function Index() {
  const { electionEnd, electionStatus, candidates, users } = useApp();
  const c = useCountdown(electionEnd);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-white" /> Election {electionStatus}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Your Voice.<br />Your Vote.<br /><span className="text-white/90">Your Future.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/85">
              Leadcity Voting App is a secure, transparent platform that puts elections in the palm of your hand. Verified students. One vote. Real impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/elections"><Button size="lg" variant="secondary">View Elections</Button></Link>
              <Link to="/register"><Button size="lg" className="bg-white text-primary hover:bg-white/90">Register to Vote</Button></Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md md:p-8" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <p className="text-sm font-medium uppercase tracking-widest text-white/80">Election closes in</p>
            <div className="mt-4 grid grid-cols-4 gap-3 text-primary-foreground">
              {[
                { v: c.d, l: "Days" },
                { v: c.h, l: "Hours" },
                { v: c.m, l: "Minutes" },
                { v: c.s, l: "Seconds" },
              ].map((x) => (
                <div key={x.l} className="rounded-xl bg-white/15 p-4 text-center backdrop-blur">
                  <div className="text-3xl font-bold tabular-nums md:text-4xl">{String(x.v).padStart(2, "0")}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-white/80">{x.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-white">
              <div className="rounded-lg bg-white/10 p-3">
                <div className="text-2xl font-bold">{candidates.length}</div>
                <div className="text-xs text-white/80">Candidates</div>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-xs text-white/80">Registered</div>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <div className="text-2xl font-bold">{candidates.reduce((a, b) => a + b.votes, 0)}</div>
                <div className="text-xs text-white/80">Votes Cast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Built for trust</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Every feature is designed to keep your vote safe, your identity verified, and the results transparent.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified Identity", desc: "Only registered students with valid matric numbers can cast votes." },
            { icon: Vote, title: "One Person, One Vote", desc: "Built-in safeguards prevent duplicate voting across every category." },
            { icon: BarChart3, title: "Live Analytics", desc: "Real-time graphical tallies keep the process transparent and open." },
          ].map((f) => (
            <Card key={f.title} className="border-border/60 transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold md:text-4xl">Election Timeline</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">From registration to result — every step at a glance.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { icon: Users, t: "Registration", d: "Students sign up with matric details." },
              { icon: CheckCircle2, t: "Verification", d: "Eligibility confirmed automatically." },
              { icon: Vote, t: "Voting", d: "Cast secure ballots per position." },
              { icon: Clock, t: "Results", d: "Live results published transparently." },
            ].map((x, i) => (
              <div key={x.t} className="relative rounded-2xl bg-card p-6 shadow-sm">
                <div className="absolute -top-3 left-6 grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</div>
                <x.icon className="mt-2 h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{x.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Ready to make your voice heard?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Join thousands of Leadcity students shaping the future, one vote at a time.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register"><Button size="lg">Get Started</Button></Link>
          <Link to="/elections"><Button size="lg" variant="outline">See Candidates</Button></Link>
        </div>
      </section>
    </div>
  );
}
