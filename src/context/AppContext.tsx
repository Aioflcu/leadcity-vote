import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ElectionStatus = "Open" | "Paused" | "Closed";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  manifesto: string;
  photo: string;
  votes: number;
}

export interface User {
  id: string;
  name: string;
  matric: string;
  email: string;
  password: string;
  verified: boolean;
  votedFor: Record<string, string>; // position -> candidateId
}

interface AppState {
  users: User[];
  candidates: Candidate[];
  currentUserId: string | null;
  electionStatus: ElectionStatus;
  electionEnd: string; // ISO
}

const STORAGE_KEY = "leadcity-voting-state-v1";

const seedCandidates: Candidate[] = [
  {
    id: "c1",
    name: "Adebayo Okonkwo",
    party: "Progressive Alliance",
    position: "President",
    manifesto: "Quality education, transparent leadership, and a stronger student voice across campus.",
    photo: "https://api.dicebear.com/7.x/initials/svg?seed=Adebayo%20Okonkwo&backgroundColor=008751&textColor=ffffff",
    votes: 42,
  },
  {
    id: "c2",
    name: "Chinwe Balogun",
    party: "Unity Front",
    position: "President",
    manifesto: "Better hostels, fair welfare policies, and digital innovation for every student.",
    photo: "https://api.dicebear.com/7.x/initials/svg?seed=Chinwe%20Balogun&backgroundColor=008751&textColor=ffffff",
    votes: 38,
  },
  {
    id: "c3",
    name: "Ibrahim Yusuf",
    party: "Reform Movement",
    position: "Vice President",
    manifesto: "Accountability, sports development, and inclusive student governance.",
    photo: "https://api.dicebear.com/7.x/initials/svg?seed=Ibrahim%20Yusuf&backgroundColor=008751&textColor=ffffff",
    votes: 51,
  },
  {
    id: "c4",
    name: "Funmilayo Eze",
    party: "Progressive Alliance",
    position: "Vice President",
    manifesto: "Mental health support, career mentorship, and gender equity for all students.",
    photo: "https://api.dicebear.com/7.x/initials/svg?seed=Funmilayo%20Eze&backgroundColor=008751&textColor=ffffff",
    votes: 47,
  },
  {
    id: "c5",
    name: "Kunle Adeyemi",
    party: "Unity Front",
    position: "Secretary",
    manifesto: "Transparent record-keeping and timely communication with the student body.",
    photo: "https://api.dicebear.com/7.x/initials/svg?seed=Kunle%20Adeyemi&backgroundColor=008751&textColor=ffffff",
    votes: 33,
  },
  {
    id: "c6",
    name: "Ngozi Bello",
    party: "Reform Movement",
    position: "Secretary",
    manifesto: "Open meeting minutes, accessible documentation, and faster turnaround on requests.",
    photo: "https://api.dicebear.com/7.x/initials/svg?seed=Ngozi%20Bello&backgroundColor=008751&textColor=ffffff",
    votes: 29,
  },
];

const defaultState: AppState = {
  users: [],
  candidates: seedCandidates,
  currentUserId: null,
  electionStatus: "Open",
  electionEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
};

interface AppContextValue extends AppState {
  currentUser: User | null;
  register: (data: { name: string; matric: string; email: string; password: string }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  castVote: (position: string, candidateId: string) => { ok: boolean; error?: string };
  addCandidate: (c: Omit<Candidate, "id" | "votes" | "photo"> & { photo?: string }) => void;
  removeCandidate: (id: string) => void;
  setElectionStatus: (s: ElectionStatus) => void;
  setElectionEnd: (iso: string) => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "matric">>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function load(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;

  const value: AppContextValue = {
    ...state,
    currentUser,
    register: ({ name, matric, email, password }) => {
      if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
      }
      if (state.users.some((u) => u.matric.toLowerCase() === matric.toLowerCase())) {
        return { ok: false, error: "This matric number is already registered." };
      }
      const id = "u_" + Math.random().toString(36).slice(2, 10);
      const user: User = { id, name, matric, email, password, verified: true, votedFor: {} };
      setState((s) => ({ ...s, users: [...s.users, user], currentUserId: id }));
      return { ok: true };
    },
    login: (email, password) => {
      const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) return { ok: false, error: "Invalid email or password." };
      setState((s) => ({ ...s, currentUserId: user.id }));
      return { ok: true };
    },
    logout: () => setState((s) => ({ ...s, currentUserId: null })),
    castVote: (position, candidateId) => {
      if (!currentUser) return { ok: false, error: "Please log in to vote." };
      if (state.electionStatus !== "Open") return { ok: false, error: `Voting is currently ${state.electionStatus.toLowerCase()}.` };
      if (currentUser.votedFor[position]) return { ok: false, error: "You have already voted for this position." };
      let applied = true;
      setState((s) => {
        if (s.electionStatus !== "Open") { applied = false; return s; }
        const u = s.users.find((x) => x.id === currentUser.id);
        // Re-check against the freshest state to block race conditions / rapid clicks
        if (!u || u.votedFor[position]) { applied = false; return s; }
        return {
          ...s,
          users: s.users.map((x) =>
            x.id === currentUser.id ? { ...x, votedFor: { ...x.votedFor, [position]: candidateId } } : x
          ),
          candidates: s.candidates.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)),
        };
      });
      if (!applied) return { ok: false, error: "You have already voted for this position." };
      return { ok: true };
    },
    addCandidate: (c) => {
      const id = "c_" + Math.random().toString(36).slice(2, 10);
      const photo = c.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}&backgroundColor=008751&textColor=ffffff`;
      setState((s) => ({ ...s, candidates: [...s.candidates, { ...c, id, votes: 0, photo }] }));
    },
    removeCandidate: (id) => setState((s) => ({ ...s, candidates: s.candidates.filter((c) => c.id !== id) })),
    setElectionStatus: (status) => setState((s) => ({ ...s, electionStatus: status })),
    setElectionEnd: (iso) => setState((s) => ({ ...s, electionEnd: iso })),
    updateProfile: (patch) => {
      if (!currentUser) return;
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === currentUser.id ? { ...u, ...patch } : u)),
      }));
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}