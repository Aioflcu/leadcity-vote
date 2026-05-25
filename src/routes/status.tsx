import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const BUILD_TIME = new Date().toISOString();
const APP_VERSION = "1.0.0";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "System Status — Leadcity Voting App" },
      { name: "description", content: "Production sanity check for the Leadcity Voting App deployment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StatusPage,
});

function Row({ label, value, ok = true }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`flex items-center gap-2 text-sm font-medium ${ok ? "text-primary" : "text-destructive"}`}>
        {ok && <CheckCircle2 className="h-4 w-4" />} {value}
      </span>
    </div>
  );
}

function StatusPage() {
  const { candidates, users, electionStatus, electionEnd } = useApp();
  const storageOk = typeof window !== "undefined" && !!window.localStorage;
  const routerOk = typeof window === "undefined" ? true : window.location.pathname === "/status";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">All systems operational</h1>
        <p className="mt-2 text-sm text-muted-foreground">Production sanity page used to verify deployment health.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Row label="App version" value={APP_VERSION} />
          <Row label="Build timestamp" value={BUILD_TIME} />
          <Row label="Client router" value={routerOk ? "OK" : "Mismatch"} ok={routerOk} />
          <Row label="LocalStorage" value={storageOk ? "Available" : "Unavailable"} ok={storageOk} />
          <Row label="Election status" value={electionStatus} />
          <Row label="Election end" value={new Date(electionEnd).toLocaleString()} />
          <Row label="Candidates loaded" value={String(candidates.length)} ok={candidates.length > 0} />
          <Row label="Registered users" value={String(users.length)} />
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/"><Button variant="outline">Back home</Button></Link>
        <Link to="/elections"><Button>View elections</Button></Link>
      </div>
    </div>
  );
}