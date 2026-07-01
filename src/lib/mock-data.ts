// Mock data for Nexus Guard
export const kpis = {
  todayScreenings: 12847,
  potentialMatches: 342,
  confirmedMatches: 47,
  falsePositives: 295,
  openInvestigations: 28,
  avgScreeningTime: "1.8s",
};

export const analysts = [
  "A. Okafor",
  "S. Whitmore",
  "M. Tanaka",
  "L. Rosales",
  "R. Bergström",
];

export const recentActivity = [
  { id: 1, type: "match", text: "Match detected for Mohamed Ahmed Sayed Ahmed (OFAC)", time: "2m ago", severity: "high" },
  { id: 2, type: "screened", text: "Acme Holdings Ltd screened — Clear", time: "4m ago", severity: "low" },
  { id: 3, type: "escalated", text: "Case CASE-2841 escalated to L2 by A. Okafor", time: "11m ago", severity: "med" },
];

export type CandidateMatch = {
  id: string;
  score: number;
  name: string;
  source: string;
  country: string;
  reason: string;
  status: "Potential" | "Likely" | "Weak";
  dob?: string;
  aliases?: string[];
};

export const candidateMatches: CandidateMatch[] = [
  { id: "M-001", score: 94, name: "Mohamed Ahmed Sayed Ahmed", source: "OFAC May 2026", country: "EG", reason: "Full name + DOB match", status: "Likely", dob: "1971-04-12", aliases: ["M. A. Sayed", "Mohamed A. Ahmed"] },
  { id: "M-002", score: 81, name: "Ahmed Mohamed Sayed", source: "Egypt Terrorism Watchlist", country: "EG", reason: "Reordered tokens — high similarity", status: "Potential", dob: "1971-04-12" },
  { id: "M-003", score: 76, name: "Mohamed Sayed Ahmed", source: "Egypt Terrorism Watchlist", country: "EG", reason: "Partial name + nationality", status: "Potential" },
];

export const screeningSources = [
  { name: "OFAC May 2026", status: "hit", lastSync: "2 min ago" },
  { name: "Egypt Terrorism Watchlist", status: "hit", lastSync: "5 min ago" },
  { name: "UN Consolidated", status: "clear", lastSync: "5 min ago" },
  { name: "EU Sanctions", status: "clear", lastSync: "3 min ago" },
];

export type CaseStatus = "Needs review" | "In review" | "Approved" | "Rejected" | "Escalated";
export type CaseRisk = "High" | "Critical";

export type Case = {
  id: string;
  batchId: string;
  customer: string;
  date: string;
  risk: CaseRisk;
  analyst: string; // "" = unassigned
  status: CaseStatus;
  riskScore: number;
  matchConfidence: number;
  falsePositiveProbability: number;
  severity: "High" | "Severe";
  recommendedAction: string;
  ageHours: number;
  slaHours: number;
  bestMatch?: {
    score: number;
    watchlist: string;
    reason: string;
    dob: string;
    nationality: string;
    passport: string;
  };
};

export const cases: Case[] = [
  {
    id: "CASE-2841", batchId: "BATCH-2026-0616-A", customer: "Mohamed Ahmed Sayed Ahmed", date: "2026-06-16",
    risk: "Critical", analyst: "A. Okafor", status: "Escalated",
    riskScore: 91, matchConfidence: 91, falsePositiveProbability: 6, severity: "Severe",
    recommendedAction: "Freeze account & escalate to MLRO", ageHours: 4, slaHours: 24,
    bestMatch: { score: 91, watchlist: "OFAC May 2026", reason: "Full name + DOB + nationality match", dob: "1971-04-12", nationality: "Egypt", passport: "A04829112" },
  },
  {
    id: "CASE-2840", batchId: "BATCH-2026-0616-A", customer: "Polaris Trading SA", date: "2026-06-16",
    risk: "High", analyst: "S. Whitmore", status: "In review",
    riskScore: 88, matchConfidence: 82, falsePositiveProbability: 18, severity: "High",
    recommendedAction: "Request enhanced due diligence", ageHours: 6, slaHours: 24,
    bestMatch: { score: 88, watchlist: "OFAC May 2026", reason: "Beneficial owner sanctioned", dob: "—", nationality: "Panama", passport: "—" },
  },
  {
    id: "CASE-2839", batchId: "BATCH-2026-0615-B", customer: "Maria H. Volkov", date: "2026-06-15",
    risk: "High", analyst: "M. Tanaka", status: "In review",
    riskScore: 86, matchConfidence: 79, falsePositiveProbability: 21, severity: "High",
    recommendedAction: "Verify identity & source of funds", ageHours: 22, slaHours: 24,
    bestMatch: { score: 86, watchlist: "Egypt Terrorism Watchlist", reason: "Alias overlap", dob: "1982-09-11", nationality: "Russia", passport: "73 4129881" },
  },
  {
    id: "CASE-2838", batchId: "BATCH-2026-0615-B", customer: "Ahmed Mohamed El-Sayed", date: "2026-06-15",
    risk: "High", analyst: "", status: "Needs review",
    riskScore: 78, matchConfidence: 78, falsePositiveProbability: 22, severity: "High",
    recommendedAction: "Assign analyst for review", ageHours: 3, slaHours: 24,
    bestMatch: { score: 78, watchlist: "Egypt Terrorism Watchlist", reason: "Partial name + nationality", dob: "1979-01-20", nationality: "Egypt", passport: "—" },
  },
  {
    id: "CASE-2837", batchId: "BATCH-2026-0615-A", customer: "Ivan P. Sokolov", date: "2026-06-15",
    risk: "Critical", analyst: "", status: "Needs review",
    riskScore: 95, matchConfidence: 93, falsePositiveProbability: 5, severity: "Severe",
    recommendedAction: "Auto-escalate to MLRO", ageHours: 1, slaHours: 24,
    bestMatch: { score: 95, watchlist: "OFAC May 2026", reason: "Direct sanction listing — name + DOB", dob: "1968-02-03", nationality: "Russia", passport: "75 1290034" },
  },
  {
    id: "CASE-2836", batchId: "BATCH-2026-0614-C", customer: "Atlas Maritime Ltd", date: "2026-06-14",
    risk: "High", analyst: "A. Okafor", status: "Rejected",
    riskScore: 90, matchConfidence: 88, falsePositiveProbability: 12, severity: "High",
    recommendedAction: "Reject onboarding", ageHours: 54, slaHours: 72,
    bestMatch: { score: 90, watchlist: "OFAC May 2026", reason: "Sanctioned vessel ownership", dob: "—", nationality: "Greece", passport: "—" },
  },
  {
    id: "CASE-2835", batchId: "BATCH-2026-0614-A", customer: "Hassan A. Farouk", date: "2026-06-14",
    risk: "High", analyst: "R. Bergström", status: "Approved",
    riskScore: 76, matchConfidence: 74, falsePositiveProbability: 60, severity: "High",
    recommendedAction: "Approve — cleared after review", ageHours: 60, slaHours: 72,
  },
];

export const watchlistInternal: Array<{ id: string; name: string; type: string; country: string; reason: string; addedBy: string; date: string }> = [];

export const auditLog = [
  { ts: "2026-06-16 14:32:11", user: "a.okafor", action: "Case Escalated", entity: "CASE-2841", before: "In review", after: "Escalated" },
  { ts: "2026-06-16 14:21:04", user: "s.whitmore", action: "Match Reviewed", entity: "M-001", before: "—", after: "Likely Match" },
  { ts: "2026-06-16 13:58:47", user: "system", action: "Screening Run", entity: "CUST-99812", before: "—", after: "3 matches" },
  { ts: "2026-06-16 13:44:22", user: "m.tanaka", action: "Notes Added", entity: "CASE-2839", before: "—", after: "Requested KYC docs" },
  { ts: "2026-06-16 11:02:55", user: "admin", action: "Threshold Updated", entity: "Auto-Escalate", before: "85", after: "91" },
  { ts: "2026-06-16 09:48:30", user: "system", action: "Watchlist Sync", entity: "OFAC May 2026", before: "v2026.04", after: "v2026.05" },
];

export const countries = ["Australia", "Brazil", "Canada", "China", "Egypt", "France", "Germany", "India", "Italy", "Japan", "Kazakhstan", "Russia", "Saudi Arabia", "Singapore", "South Africa", "Switzerland", "UAE", "United Kingdom", "United States"];
