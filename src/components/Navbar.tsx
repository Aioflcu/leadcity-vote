import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Vote, LogOut, User as UserIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/candidates", label: "Candidates" },
  { to: "/vote", label: "Vote" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="grid h-9 w-9 place-items-center rounded-lg hero-gradient text-primary-foreground">
            <Vote className="h-5 w-5" />
          </div>
          <span className="text-lg tracking-tight">BallotBox</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold bg-accent text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                <UserIcon className="h-4 w-4" /> {user.name.split(" ")[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={() => { logout(); router.navigate({ to: "/" }); }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/register"><Button size="sm">Register to Vote</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                {l.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Profile</Link>
                  <button onClick={() => { logout(); setOpen(false); router.navigate({ to: "/" }); }} className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-accent">Register to Vote</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
