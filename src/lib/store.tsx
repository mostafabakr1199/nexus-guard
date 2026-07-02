import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// ---------- Roles & Users ----------
export type Role = "analyst" | "manager";

export type User = {
  username: string;
  name: string;
  role: Role;
};

const USERS: Record<string, { password: string; user: User }> = {
  analyst: { password: "analyst", user: { username: "analyst", name: "A. Okafor", role: "analyst" } },
  manager: { password: "manager", user: { username: "manager", name: "S. Whitmore", role: "manager" } },
};

// ---------- Case model ----------
export type CaseStatus = "New" | "Assigned" | "In Review" | "Pending Approval" | "Approved" | "Rejected" | "Closed";
export type CaseRisk = "High" | "Critical";
export type Decision = "True Match" | "False Positive";

export type CaseNote = { ts: string; user: string; text: string };

export type Case = {
  id: string;
  batchId: string;
  customer: string;
  date: string;
  risk: CaseRisk;
  analyst: string; // username or ""
  status: CaseStatus;
  riskScore: number;
  matchConfidence: number;
  falsePositiveProbability: number;
  severity: "High" | "Severe";
  recommendedAction: string;
  ageHours: number;
  slaHours: number;
  bestMatch?: { score: number; watchlist: string; reason: string; dob: string; nationality: string; passport: string };
  notes: CaseNote[];
  decision?: Decision;
  submittedBy?: string; // username who submitted for approval
};

const seedCases: Case[] = [
  { id: "CASE-2841", batchId: "BATCH-2026-0616-A", customer: "Mohamed Ahmed Sayed Ahmed", date: "2026-06-16",
    risk: "Critical", analyst: "analyst", status: "Pending Approval",
    riskScore: 91, matchConfidence: 91, falsePositiveProbability: 6, severity: "Severe",
    recommendedAction: "Freeze account & escalate to MLRO", ageHours: 4, slaHours: 24,
    bestMatch: { score: 91, watchlist: "OFAC May 2026", reason: "Full name + DOB + nationality match", dob: "1971-04-12", nationality: "Egypt", passport: "A04829112" },
    notes: [{ ts: "2026-06-16 14:20", user: "analyst", text: "Verified passport + DOB — strong match. Recommending true match." }],
    decision: "True Match", submittedBy: "analyst" },
  { id: "CASE-2840", batchId: "BATCH-2026-0616-A", customer: "Polaris Trading SA", date: "2026-06-16",
    risk: "High", analyst: "analyst", status: "In Review",
    riskScore: 88, matchConfidence: 82, falsePositiveProbability: 18, severity: "High",
    recommendedAction: "Request enhanced due diligence", ageHours: 6, slaHours: 24,
    bestMatch: { score: 88, watchlist: "OFAC May 2026", reason: "Beneficial owner sanctioned", dob: "—", nationality: "Panama", passport: "—" },
    notes: [] },
  { id: "CASE-2839", batchId: "BATCH-2026-0615-B", customer: "Maria H. Volkov", date: "2026-06-15",
    risk: "High", analyst: "", status: "New",
    riskScore: 86, matchConfidence: 79, falsePositiveProbability: 21, severity: "High",
    recommendedAction: "Verify identity & source of funds", ageHours: 22, slaHours: 24,
    bestMatch: { score: 86, watchlist: "Egypt Terrorism Watchlist", reason: "Alias overlap", dob: "1982-09-11", nationality: "Russia", passport: "73 4129881" },
    notes: [] },
  { id: "CASE-2838", batchId: "BATCH-2026-0615-B", customer: "Ahmed Mohamed El-Sayed", date: "2026-06-15",
    risk: "High", analyst: "", status: "New",
    riskScore: 78, matchConfidence: 78, falsePositiveProbability: 22, severity: "High",
    recommendedAction: "Assign analyst for review", ageHours: 3, slaHours: 24,
    bestMatch: { score: 78, watchlist: "Egypt Terrorism Watchlist", reason: "Partial name + nationality", dob: "1979-01-20", nationality: "Egypt", passport: "—" },
    notes: [] },
  { id: "CASE-2837", batchId: "BATCH-2026-0615-A", customer: "Ivan P. Sokolov", date: "2026-06-15",
    risk: "Critical", analyst: "", status: "New",
    riskScore: 95, matchConfidence: 93, falsePositiveProbability: 5, severity: "Severe",
    recommendedAction: "Auto-escalate to MLRO", ageHours: 1, slaHours: 24,
    bestMatch: { score: 95, watchlist: "OFAC May 2026", reason: "Direct sanction listing", dob: "1968-02-03", nationality: "Russia", passport: "75 1290034" },
    notes: [] },
  { id: "CASE-2836", batchId: "BATCH-2026-0614-C", customer: "Atlas Maritime Ltd", date: "2026-06-14",
    risk: "High", analyst: "analyst", status: "Rejected",
    riskScore: 90, matchConfidence: 88, falsePositiveProbability: 12, severity: "High",
    recommendedAction: "Reject onboarding", ageHours: 54, slaHours: 72,
    bestMatch: { score: 90, watchlist: "OFAC May 2026", reason: "Sanctioned vessel ownership", dob: "—", nationality: "Greece", passport: "—" },
    notes: [{ ts: "2026-06-15 09:10", user: "manager", text: "Insufficient evidence — please add source of funds documentation." }],
    decision: "True Match", submittedBy: "analyst" },
  { id: "CASE-2835", batchId: "BATCH-2026-0614-A", customer: "Hassan A. Farouk", date: "2026-06-14",
    risk: "High", analyst: "analyst", status: "Closed",
    riskScore: 76, matchConfidence: 74, falsePositiveProbability: 60, severity: "High",
    recommendedAction: "Approve — cleared after review", ageHours: 60, slaHours: 72,
    notes: [], decision: "False Positive", submittedBy: "analyst" },
];

export type AuditEntry = { ts: string; user: string; action: string; entity: string; before: string; after: string };

const seedAudit: AuditEntry[] = [
  { ts: "2026-06-16 14:32:11", user: "analyst", action: "Submitted for Approval", entity: "CASE-2841", before: "In Review", after: "Pending Approval" },
  { ts: "2026-06-16 09:48:30", user: "system", action: "Watchlist Sync", entity: "OFAC May 2026", before: "v2026.04", after: "v2026.05" },
];

// ---------- Store ----------
type Ctx = {
  user: User | null;
  login: (u: string, p: string) => { ok: boolean; error?: string };
  logout: () => void;
  cases: Case[];
  audit: AuditEntry[];
  assign: (id: string, analystUsername: string) => void;
  addNote: (id: string, text: string) => void;
  setDecision: (id: string, d: Decision) => void;
  submitForApproval: (id: string) => void;
  approve: (id: string) => { ok: boolean; error?: string };
  reject: (id: string, reason: string) => { ok: boolean; error?: string };
};

const AppCtx = createContext<Ctx | null>(null);

const now = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("ng.user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch { return null; }
  });
  const [cases, setCases] = useState<Case[]>(seedCases);
  const [audit, setAudit] = useState<AuditEntry[]>(seedAudit);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem("ng.user", JSON.stringify(user));
    else localStorage.removeItem("ng.user");
  }, [user]);

  const log = useCallback((entry: Omit<AuditEntry, "ts">) => {
    setAudit((a) => [{ ts: now(), ...entry }, ...a]);
  }, []);

  const login: Ctx["login"] = (u, p) => {
    const rec = USERS[u.toLowerCase()];
    if (!rec || rec.password !== p) return { ok: false, error: "Invalid username or password" };
    setUser(rec.user);
    return { ok: true };
  };
  const logout = () => setUser(null);

  const assign: Ctx["assign"] = (id, an) => {
    setCases((prev) => prev.map((c) => c.id === id ? { ...c, analyst: an, status: c.status === "New" ? "Assigned" : c.status } : c));
    log({ user: user?.username ?? "system", action: "Assigned", entity: id, before: "—", after: an });
  };
  const addNote: Ctx["addNote"] = (id, text) => {
    if (!user) return;
    setCases((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const status: CaseStatus = c.status === "Assigned" ? "In Review" : c.status;
      return { ...c, status, notes: [...c.notes, { ts: now(), user: user.username, text }] };
    }));
    log({ user: user.username, action: "Note Added", entity: id, before: "—", after: text.slice(0, 80) });
  };
  const setDecision: Ctx["setDecision"] = (id, d) => {
    setCases((prev) => prev.map((c) => c.id === id ? { ...c, decision: d } : c));
    if (user) log({ user: user.username, action: "Decision Set", entity: id, before: "—", after: d });
  };
  const submitForApproval: Ctx["submitForApproval"] = (id) => {
    if (!user) return;
    setCases((prev) => prev.map((c) => c.id === id ? { ...c, status: "Pending Approval", submittedBy: user.username } : c));
    log({ user: user.username, action: "Submitted for Approval", entity: id, before: "In Review", after: "Pending Approval" });
  };
  const approve: Ctx["approve"] = (id) => {
    if (!user) return { ok: false, error: "Not signed in" };
    const c = cases.find((x) => x.id === id);
    if (!c) return { ok: false, error: "Not found" };
    if (c.submittedBy === user.username) return { ok: false, error: "You cannot approve a case you submitted." };
    setCases((prev) => prev.map((x) => x.id === id ? { ...x, status: "Closed" } : x));
    log({ user: user.username, action: "Approved", entity: id, before: "Pending Approval", after: "Closed" });
    return { ok: true };
  };
  const reject: Ctx["reject"] = (id, reason) => {
    if (!user) return { ok: false, error: "Not signed in" };
    const c = cases.find((x) => x.id === id);
    if (!c) return { ok: false, error: "Not found" };
    if (c.submittedBy === user.username) return { ok: false, error: "You cannot reject a case you submitted." };
    setCases((prev) => prev.map((x) => x.id === id
      ? { ...x, status: "In Review", submittedBy: undefined, notes: [...x.notes, { ts: now(), user: user.username, text: `Rejected: ${reason}` }] }
      : x));
    log({ user: user.username, action: "Rejected", entity: id, before: "Pending Approval", after: "In Review" });
    return { ok: true };
  };

  const value = useMemo<Ctx>(() => ({
    user, login, logout, cases, audit,
    assign, addNote, setDecision, submitForApproval, approve, reject,
  }), [user, cases, audit]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export const ANALYST_OPTIONS = [{ username: "analyst", name: "A. Okafor" }];
