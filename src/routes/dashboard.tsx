import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, Vote, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Leadcity Voting App" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { currentUser, candidates, electionStatus, electionEnd } = useApp();

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="mt-2 text-muted-foreground">Sign in to view your dashboard.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login"><Button>Login</Button></Link>
          <Link to="/register"><Button variant="outline">Register</Button></Link>
        </div>
      </div>
    );
  }

  const votedCount = Object.keys(currentUser.votedFor).length;
  const positions = Array.from(new Set(candidates.map((c) => c.position)));
  const hasVotedAll = votedCount >= positions.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold md:text-4xl">Welcome, {currentUser.name.split(" ")[0]}</h1>
      <p className="mt-2 text-muted-foreground">Track your voting activity and active elections.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Verification</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <Badge className="bg-primary text-primary-foreground">{currentUser.verified ? "Verified" : "Pending"}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Voting Status</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <Badge variant={hasVotedAll ? "default" : "secondary"}>
              {hasVotedAll ? "Voted (All Positions)" : votedCount > 0 ? `Partially Voted (${votedCount}/${positions.length})` : "Not Voted"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Election</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{electionStatus}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Active Election</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Leadcity Student Union {new Date().getFullYear()}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Ends on {new Date(electionEnd).toLocaleString()}</p>
              </div>
              <Link to="/vote"><Button><Vote className="mr-2 h-4 w-4" /> Vote</Button></Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {positions.map((p) => {
                const choiceId = currentUser.votedFor[p];
                const choice = candidates.find((c) => c.id === choiceId);
                return (
                  <div key={p} className="rounded-lg border border-border p-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{p}</div>
                    <div className="mt-1 text-sm font-medium">{choice ? `✓ ${choice.name}` : "Not voted yet"}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Voting History</CardTitle></CardHeader>
          <CardContent>
            {votedCount === 0 ? (
              <p className="text-sm text-muted-foreground">You have not cast any votes yet.</p>
            ) : (
              <ul className="space-y-3">
                {Object.entries(currentUser.votedFor).map(([pos, cid]) => {
                  const c = candidates.find((x) => x.id === cid);
                  return (
                    <li key={pos} className="flex items-center gap-3">
                      {c && <img src={c.photo} alt="" className="h-9 w-9 rounded-full object-cover" />}
                      <div>
                        <div className="text-sm font-medium">{c?.name ?? "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{pos}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}