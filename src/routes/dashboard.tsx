import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Vote } from "lucide-react";
import { Countdown } from "@/components/Countdown";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BallotBox" },
      { name: "description", content: "Track your voting status, active elections, and history." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, votes, candidates, election } = useApp();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card p-10">
          <h2 className="text-xl font-semibold">Please log in</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your dashboard is private.</p>
          <Link to="/login"><Button className="mt-6">Login</Button></Link>
        </div>
      </div>
    );
  }

  const myVotes = votes.filter((v) => v.userId === user.id);
  const positions = Array.from(new Set(candidates.map((c) => c.position)));
  const completed = positions.every((p) => myVotes.find((v) => v.position === p));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
        </div>
        <div className="flex gap-2">
          {user.verified && <Badge className="gap-1 bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>}
          {completed ? <Badge className="bg-primary text-primary-foreground">Voted</Badge> : <Badge variant="secondary">Pending</Badge>}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Active election</p>
              <h2 className="mt-1 text-xl font-semibold">{election.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Status: <span className="capitalize">{election.status}</span></p>
            </div>
            <Link to="/vote"><Button>Go vote</Button></Link>
          </div>
          <div className="mt-6">
            <Countdown to={election.endsAt} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Your progress</p>
          <div className="mt-4 space-y-3">
            {positions.map((p) => {
              const v = myVotes.find((x) => x.position === p);
              return (
                <div key={p} className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
                  <span className="text-sm font-medium">{p}</span>
                  {v
                    ? <Badge className="gap-1 bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3" /> Done</Badge>
                    : <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h3 className="mb-4 text-lg font-semibold">Voting history</h3>
        {myVotes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            <Vote className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2">No votes yet — head to the ballot to participate.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {myVotes.map((v) => {
                  const c = candidates.find((x) => x.id === v.candidateId);
                  return (
                    <tr key={v.id} className="border-t border-border bg-card">
                      <td className="px-4 py-3 font-medium">{v.position}</td>
                      <td className="px-4 py-3">{c?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(v.timestamp).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
