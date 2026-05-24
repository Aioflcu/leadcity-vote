import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_KEY = "leadcity-admin-session";

export function Footer() {
  const [open, setOpen] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === "2000") {
      sessionStorage.setItem(ADMIN_KEY, "1");
      setOpen(false);
      setPwd("");
      setErr("");
      toast.success("Admin access granted");
      navigate({ to: "/admin" });
    } else {
      setErr("Incorrect password.");
    }
  };

  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="h-1 w-full" style={{ background: "var(--gradient-flag)" }} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold text-primary">Leadcity Voting App</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure, transparent, and accessible elections for the Leadcity community.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/elections" className="hover:text-primary">Candidates</Link></li>
            <li><Link to="/vote" className="hover:text-primary">Vote</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Administration</h4>
          <p className="mb-3 text-sm text-muted-foreground">Staff access only.</p>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            2000
          </Button>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-center text-xs text-muted-foreground md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Leadcity Voting App. All rights reserved.</span>
          <span>Built for the people. By the people.</span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Administrator Access</DialogTitle>
            <DialogDescription>Enter the administrator password to continue.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-pwd">Password</Label>
              <Input
                id="admin-pwd"
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoFocus
              />
              {err && <p className="text-sm text-destructive">{err}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Enter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export function isAdmin() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_KEY) === "1";
}

export function clearAdmin() {
  sessionStorage.removeItem(ADMIN_KEY);
}