// LocalStorage-backed mock data layer for the voting app.
export type Candidate = {
  id: string;
  name: string;
  party: string;
  position: string; // e.g. "President", "Vice President"
  manifesto: string;
  photo: string; // emoji or URL
  votes: number;
};

export type User = {
  id: string;
  name: string;
  matric: string;
  email: string;
  password: string;
  verified: boolean;
  role: "voter" | "admin";
  createdAt: number;
};

export type VoteRecord = {
  id: string;
  userId: string;
  candidateId: string;
  position: string;
  timestamp: number;
};

export type ElectionStatus = "open" | "paused" | "closed";

export type Election = {
  title: string;
  description: string;
  status: ElectionStatus;
  endsAt: number; // ms epoch
};

const K = {
  users: "vp_users",
  candidates: "vp_candidates",
  votes: "vp_votes",
  session: "vp_session",
  election: "vp_election",
};

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}

export const seedCandidates: Candidate[] = [
  { id: "c1", name: "Amara Johnson", party: "Progressive Union", position: "President", manifesto: "Modernize student services, expand scholarships, and champion mental health support.", photo: "🟦", votes: 0 },
  { id: "c2", name: "David Okeke", party: "Unity Front", position: "President", manifesto: "Bridge faculties through inclusive policy and transparent budgeting.", photo: "🟩", votes: 0 },
  { id: "c3", name: "Priya Kapoor", party: "Future Forward", position: "President", manifesto: "Invest in research labs, sustainability, and digital infrastructure.", photo: "🟧", votes: 0 },
  { id: "c4", name: "Marcus Liu", party: "Progressive Union", position: "Vice President", manifesto: "Strengthen clubs, sports, and student wellbeing programs.", photo: "🟪", votes: 0 },
  { id: "c5", name: "Sade Adekunle", party: "Unity Front", position: "Vice President", manifesto: "Defend student rights and improve campus safety.", photo: "🟨", votes: 0 },
];

export const defaultElection: Election = {
  title: "Student Union General Election 2026",
  description: "Cast your vote for the next leaders of the Student Union.",
  status: "open",
  endsAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
};

// Seed admin
function ensureSeed() {
  const users = read<User[]>(K.users, []);
  if (!users.find((u) => u.email === "admin@vote.app")) {
    users.push({
      id: "admin",
      name: "Election Admin",
      matric: "ADMIN-2000",
      email: "admin@vote.app",
      password: "2000",
      verified: true,
      role: "admin",
      createdAt: Date.now(),
    });
    write(K.users, users);
  }
  if (!localStorage.getItem(K.candidates)) write(K.candidates, seedCandidates);
  if (!localStorage.getItem(K.election)) write(K.election, defaultElection);
}

export const store = {
  init() {
    if (typeof window !== "undefined") ensureSeed();
  },
  // Users
  getUsers: () => read<User[]>(K.users, []),
  saveUsers: (u: User[]) => write(K.users, u),
  // Session
  getSession: () => read<string | null>(K.session, null),
  setSession: (id: string | null) => write(K.session, id),
  currentUser(): User | null {
    const id = this.getSession();
    if (!id) return null;
    return this.getUsers().find((u) => u.id === id) ?? null;
  },
  // Candidates
  getCandidates: () => read<Candidate[]>(K.candidates, seedCandidates),
  saveCandidates: (c: Candidate[]) => write(K.candidates, c),
  // Votes
  getVotes: () => read<VoteRecord[]>(K.votes, []),
  saveVotes: (v: VoteRecord[]) => write(K.votes, v),
  // Election
  getElection: () => read<Election>(K.election, defaultElection),
  saveElection: (e: Election) => write(K.election, e),
};

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
