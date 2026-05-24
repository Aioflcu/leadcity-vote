import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Vote } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { currentUser, logout } = useApp();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/elections", label: "Candidates" },
    { to: "/vote", label: "Vote" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Vote className="h-5 w-5" />
          </span>
          <span className="text-lg leading-tight">
            Leadcity<span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Voting App</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-primary"
              activeProps={{ className: "bg-secondary text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {currentUser ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-foreground hover:text-primary">
                {currentUser.name.split(" ")[0]}
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
              <Link to="/register"><Button size="sm">Register</Button></Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {currentUser ? (
                <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); }} className="flex-1">Logout</Button>
              ) : (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setOpen(false)}><Button variant="outline" size="sm" className="w-full">Login</Button></Link>
                  <Link to="/register" className="flex-1" onClick={() => setOpen(false)}><Button size="sm" className="w-full">Register</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}