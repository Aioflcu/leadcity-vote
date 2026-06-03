import { useEffect, useState } from "react";

export function Countdown({ to }: { to: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, to - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const Item = ({ v, l }: { v: number; l: string }) => (
    <div className="flex min-w-[72px] flex-col items-center rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <span className="text-3xl font-bold tabular-nums text-foreground">{String(v).padStart(2, "0")}</span>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{l}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Item v={d} l="Days" />
      <Item v={h} l="Hours" />
      <Item v={m} l="Min" />
      <Item v={s} l="Sec" />
    </div>
  );
}
