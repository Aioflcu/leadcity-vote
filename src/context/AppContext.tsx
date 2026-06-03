import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { store, User, Candidate, VoteRecord, Election, uid } from "@/lib/voting-store";

type Ctx = {
  user: User | null;
  users: User[];
  candidates: Candidate[];
  votes: VoteRecord[];
  election: Election;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: { name: string; matric: string; email: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  castVote: (candidateId: string) => { ok: boolean; error?: string };
  hasVotedFor: (position: string) => VoteRecord | undefined;
  addCandidate: (c: Omit<Candidate, "id" | "votes">) => void;
  removeCandidate: (id: string) => void;
  setElection: (e: Election) => void;
  adminLoginByCode: (code: string) => boolean;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [election, setElectionState] = useState<Election>(store.getElection());

  useEffect(() => {
    store.init();
    setUsers(store.getUsers());
    setCandidates(store.getCandidates());
    setVotes(store.getVotes());
    setElectionState(store.getElection());
    setUser(store.currentUser());
  }, []);

  const refreshUsers = () => setUsers(store.getUsers());

  const login: Ctx["login"] = (email, password) => {
    const u = store.getUsers().find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.password !== password) return { ok: false, error: "Invalid email or password" };
    store.setSession(u.id);
    setUser(u);
    return { ok: true };
  };

  const register: Ctx["register"] = ({ name, matric, email, password }) => {
    const all = store.getUsers();
    if (all.find((u) => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, error: "Email already registered" };
    if (all.find((u) => u.matric.toLowerCase() === matric.toLowerCase())) return { ok: false, error: "Matric number already registered" };
    const u: User = { id: uid(), name, matric, email, password, verified: true, role: "voter", createdAt: Date.now() };
    const next = [...all, u];
    store.saveUsers(next);
    store.setSession(u.id);
    setUsers(next);
    setUser(u);
    return { ok: true };
  };

  const logout = () => {
    store.setSession(null);
    setUser(null);
  };

  const updateProfile: Ctx["updateProfile"] = (patch) => {
    if (!user) return;
    const next = store.getUsers().map((u) => (u.id === user.id ? { ...u, ...patch } : u));
    store.saveUsers(next);
    setUsers(next);
    setUser(next.find((u) => u.id === user.id) ?? null);
  };

  const hasVotedFor = useCallback(
    (position: string) => votes.find((v) => v.userId === user?.id && v.position === position),
    [votes, user]
  );

  const castVote: Ctx["castVote"] = (candidateId) => {
    if (!user) return { ok: false, error: "You must be logged in to vote" };
    if (election.status !== "open") return { ok: false, error: `Election is ${election.status}` };
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return { ok: false, error: "Candidate not found" };
    if (hasVotedFor(cand.position)) return { ok: false, error: `You already voted for ${cand.position}` };
    const v: VoteRecord = { id: uid(), userId: user.id, candidateId, position: cand.position, timestamp: Date.now() };
    const nextVotes = [...votes, v];
    const nextCands = candidates.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c));
    store.saveVotes(nextVotes);
    store.saveCandidates(nextCands);
    setVotes(nextVotes);
    setCandidates(nextCands);
    return { ok: true };
  };

  const addCandidate: Ctx["addCandidate"] = (c) => {
    const next = [...candidates, { ...c, id: uid(), votes: 0 }];
    store.saveCandidates(next);
    setCandidates(next);
  };
  const removeCandidate: Ctx["removeCandidate"] = (id) => {
    const next = candidates.filter((c) => c.id !== id);
    store.saveCandidates(next);
    setCandidates(next);
    const nv = votes.filter((v) => v.candidateId !== id);
    store.saveVotes(nv);
    setVotes(nv);
  };
  const setElection: Ctx["setElection"] = (e) => {
    store.saveElection(e);
    setElectionState(e);
  };

  const adminLoginByCode: Ctx["adminLoginByCode"] = (code) => {
    if (code !== "2000") return false;
    const admin = store.getUsers().find((u) => u.role === "admin");
    if (!admin) return false;
    store.setSession(admin.id);
    setUser(admin);
    refreshUsers();
    return true;
  };

  return (
    <AppCtx.Provider
      value={{
        user, users, candidates, votes, election,
        login, register, logout, updateProfile,
        castVote, hasVotedFor, addCandidate, removeCandidate, setElection, adminLoginByCode,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}
