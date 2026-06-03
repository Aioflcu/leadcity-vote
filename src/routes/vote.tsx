import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/vote")({
  head: () => ({
    meta: [
      { title: "Cast Your Vote — BallotBox" },
      { name: "description", content: "Secure ballot interface. Cast your vote across all positions." },
    ],
  }),
  component: VotePage,
});

function VotePage() {
  const { user, candidates, election, castVote, hasVotedFor } = useApp();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<string | null>(null);

  if (!user) {
    return (
      <CenterCard
        title="Sign in to cast your ballot"
        body="You need a verified account to vote. It only takes a minute."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/register"><Button variant="outline">Register</Button></Link>
          </div>
        }
      />
    );
  }

  if (election.status !== "open") {
    return (
      <CenterCard
        title={`Election is ${election.status}`}
        body="Voting is not available right now. Please check back later."
        action={<Link to="/"><Button>Back home</Button></Link>}
        icon={<ShieldAlert className="h-6 w-6 text-warning" />}
      />
    );
  }

  const positions = Array.from(new Set(candidates.map((c) => c.position)));

  const handle = async (candidateId: string) => {
    setSubmitting(candidateId);
    await new Promise((r) => setTimeout(r, 400));
    const r = castVote(candidateId);
    setSubmitting(null);
    if (!r.ok) toast.error(r.error || "Could not cast vote");
    else toast.success("Vote recorded. Thank you for participating!");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Official Ballot</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Voting as <span className="font-medium text-foreground">{user.name}</span> · Matric {user.matric}
        </p>
      </div>

      {positions.map((pos) => {
        const voted = hasVotedFor(pos);
        return (
          <section key={pos} className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{pos}</h2>
              {voted && (
                <Badge className="gap-1 bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3" /> Voted</Badge>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {candidates.filter((c) => c.position === pos).map((c) => {
                const isChoice = voted?.candidateId === c.id;
                const disabled = !!voted || submitting !== null;
                return (
                  <div key={c.id} className={`rounded-xl border p-5 transition ${isChoice ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-lg bg-secondary text-2xl">{c.photo}</div>
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.party}</p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{c.manifesto}</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="mt-4 w-full" disabled={disabled} variant={isChoice ? "secondary" : "default"}>
                          {isChoice ? "Your choice" : voted ? "Locked" : submitting === c.id ? "Submitting..." : "Cast vote"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm your vote</AlertDialogTitle>
                          <AlertDialogDescription>
                            You are voting for <strong>{c.name}</strong> for the position of <strong>{c.position}</strong>. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handle(c.id)}>Confirm vote</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="mt-10 text-center">
        <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>View my dashboard</Button>
      </div>
    </div>
  );
}

function CenterCard({ title, body, action, icon }: { title: string; body: string; action: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="rounded-2xl border border-border bg-card p-10">
        {icon && <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-secondary">{icon}</div>}
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6">{action}</div>
      </div>
    </div>
  );
}
