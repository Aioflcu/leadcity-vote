import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/vote")({
  head: () => ({
    meta: [
      { title: "Cast Your Vote — Leadcity Voting App" },
      { name: "description", content: "Securely cast your vote for each open position." },
    ],
  }),
  component: VotePage,
});

function VotePage() {
  const { currentUser, candidates, electionStatus, castVote } = useApp();
  const positions = useMemo(() => Array.from(new Set(candidates.map((c) => c.position))), [candidates]);
  const [pending, setPending] = useState<{ position: string; candidateId: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Lock className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Login required</h1>
        <p className="mt-2 text-muted-foreground">You must be logged in and verified to vote.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login"><Button>Login</Button></Link>
          <Link to="/register"><Button variant="outline">Register</Button></Link>
        </div>
      </div>
    );
  }

  if (electionStatus !== "Open") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Voting is {electionStatus.toLowerCase()}</h1>
        <p className="mt-2 text-muted-foreground">Please check back later.</p>
      </div>
    );
  }

  const confirm = () => {
    if (!pending) return;
    // Hard guard against double-submits from rapid clicks / double-tap
    if (submitLock.current) return;
    if (currentUser?.votedFor[pending.position]) {
      toast.error("You have already voted for this position.");
      setPending(null);
      return;
    }
    submitLock.current = true;
    setSubmitting(true);
    const res = castVote(pending.position, pending.candidateId);
    if (res.ok) toast.success(`Vote recorded for ${pending.name}`);
    else toast.error(res.error || "Could not record vote");
    setPending(null);
    setSubmitting(false);
    // Release after a tick to swallow any duplicate click
    setTimeout(() => { submitLock.current = false; }, 400);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Cast Your Ballot</h1>
          <p className="mt-2 text-muted-foreground">Select one candidate per position. Choices are final.</p>
        </div>
        <Badge className="w-fit bg-primary text-primary-foreground">Voter: {currentUser.name}</Badge>
      </div>

      <div className="space-y-10">
        {positions.map((position) => {
          const voted = currentUser.votedFor[position];
          return (
            <section key={position}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">{position}</h2>
                {voted && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Vote submitted
                  </Badge>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {candidates.filter((c) => c.position === position).map((c) => {
                  const isChoice = voted === c.id;
                  return (
                    <Card key={c.id} className={`overflow-hidden transition ${isChoice ? "ring-2 ring-primary" : ""}`}>
                      <div className="flex items-center gap-4 p-4">
                        <img src={c.photo} alt={c.name} className="h-16 w-16 rounded-full object-cover" />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold">{c.name}</h3>
                          <p className="truncate text-sm text-muted-foreground">{c.party}</p>
                        </div>
                      </div>
                      <CardContent className="pt-0">
                        <p className="line-clamp-2 text-sm text-foreground/80">{c.manifesto}</p>
                        <Button
                          className="mt-4 w-full"
                          disabled={!!voted || submitting}
                          variant={isChoice ? "secondary" : "default"}
                          onClick={() => setPending({ position, candidateId: c.id, name: c.name })}
                        >
                          {isChoice ? "Your Choice" : voted ? "Vote Locked" : "Vote"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm your vote</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to vote for <strong>{pending?.name}</strong> as <strong>{pending?.position}</strong>. This choice is final and cannot be changed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirm} disabled={submitting}>
              {submitting ? "Submitting…" : "Confirm Vote"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}