import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Vote } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function Footer() {
  const { adminLoginByCode } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLoginByCode(code)) {
      toast.success("Admin access granted");
      setOpen(false);
      setCode("");
      router.navigate({ to: "/admin" });
    } else {
      toast.error("Invalid admin code");
    }
  };

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <div className="grid h-9 w-9 place-items-center rounded-lg hero-gradient text-primary-foreground">
                <Vote className="h-5 w-5" />
              </div>
              <span className="text-lg">BallotBox</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A secure, transparent and modern voting platform built for trustworthy elections.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/candidates" className="hover:text-foreground">Candidates</Link></li>
              <li><Link to="/vote" className="hover:text-foreground">Vote</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Stay informed</h4>
            <p className="mt-3 text-sm text-muted-foreground">Election results in real time, straight to your inbox.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} BallotBox. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>v1.0</span>
            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground/70 transition hover:text-foreground"
              aria-label="Admin access"
            >
              2000
            </button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogDescription>Enter the admin password to continue.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Password</Label>
              <Input id="code" type="password" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
            </div>
            <DialogFooter>
              <Button type="submit">Enter Admin</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
