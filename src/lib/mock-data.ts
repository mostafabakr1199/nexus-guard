// Mock data for Finaira Screening Hub
export const kpis = {
  todayScreenings: 12847,
  potentialMatches: 342,
  confirmedMatches: 47,
  falsePositives: 295,
  openInvestigations: 28,
  avgScreeningTime: "1.8s",
};

export const volumeTrend = [
  { day: "Mon", screenings: 9420, matches: 210 },
  { day: "Tue", screenings: 11230, matches: 287 },
  { day: "Wed", screenings: 10890, matches: 265 },
  { day: "Thu", screenings: 12340, matches: 298 },
  { day: "Fri", screenings: 12847, matches: 342 },
  { day: "Sat", screenings: 6210, matches: 121 },
  { day: "Sun", screenings: 4980, matches: 89 },
];

export const matchDistribution = [
  { name: "Sanctions", value: 142, color: "var(--color-chart-5)" },
  { name: "PEP", value: 118, color: "var(--color-chart-1)" },
  { name: "Adverse Media", value: 62, color: "var(--color-chart-4)" },
  { name: "Internal Watchlist", value: 20, color: "var(--color-chart-2)" },
];

export const analystWorkload = [
  { name: "S. Whitmore", open: 14, closed: 38 },
  { name: "A. Okafor", open: 9, closed: 41 },
  { name: "M. Tanaka", open: 12, closed: 29 },
  { name: "L. Rosales", open: 7, closed: 33 },
  { name: "R. Bergström", open: 11, closed: 25 },
];

export const recentActivity = [
  { id: 1, type: "match", text: "Match detected for Alibek N. Yermekov (OFAC SDN)", time: "2m ago", severity: "high" },
  { id: 2, type: "screened", text: "Acme Holdings Ltd screened — Clear", time: "4m ago", severity: "low" },
  { id: 3, type: "escalated", text: "Case CASE-2841 escalated to L2 by A. Okafor", time: "11m ago", severity: "med" },
  { id: 4, type: "closed", text: "Case CASE-2829 closed — False Positive", time: "23m ago", severity: "low" },
  { id: 5, type: "match", text: "PEP match — Maria H. Volkov (Tier 1)", time: "31m ago", severity: "med" },
  { id: 6, type: "screened", text: "Batch upload completed — 4,210 records", time: "48m ago", severity: "low" },
  { id: 7, type: "escalated", text: "Adverse media alert — Polaris Trading SA", time: "1h ago", severity: "med" },
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
  { id: "M-001", score: 94, name: "Alibek N. Yermekov", source: "OFAC SDN", country: "KZ", reason: "Full name + DOB match", status: "Likely", dob: "1971-04-12", aliases: ["A. Yermekoff", "Ali Yermek"] },
  { id: "M-002", score: 81, name: "Alibek Yermekov", source: "EU Consolidated", country: "RU", reason: "Name phonetic match", status: "Potential", dob: "1971-04-12" },
  { id: "M-003", score: 76, name: "Ali B. Yermekov", source: "UK HMT", country: "KZ", reason: "Partial name + nationality", status: "Potential" },
  { id: "M-004", score: 64, name: "Alibek Yermek", source: "Adverse Media", country: "—", reason: "Media mention - financial fraud", status: "Weak" },
  { id: "M-005", score: 58, name: "Alibec Yarmakov", source: "World Bank Debarred", country: "UZ", reason: "Fuzzy name match", status: "Weak" },
];

export const screeningSources = [
  { name: "OFAC SDN", status: "hit", lastSync: "2 min ago" },
  { name: "UN Consolidated", status: "clear", lastSync: "5 min ago" },
  { name: "EU Sanctions", status: "hit", lastSync: "3 min ago" },
  { name: "UK HMT", status: "hit", lastSync: "4 min ago" },
  { name: "World Bank Debarred", status: "weak", lastSync: "12 min ago" },
  { name: "PEP Database", status: "clear", lastSync: "1 min ago" },
  { name: "Adverse Media", status: "weak", lastSync: "8 min ago" },
];

export type Case = {
  id: string;
  customer: string;
  date: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  analyst: string;
  status: "New" | "Under Review" | "Escalated" | "Approved" | "Rejected" | "Closed";
};

export const cases: Case[] = [
  { id: "CASE-2841", customer: "Alibek N. Yermekov", date: "2026-06-16", risk: "Critical", analyst: "A. Okafor", status: "Escalated" },
  { id: "CASE-2840", customer: "Polaris Trading SA", date: "2026-06-16", risk: "High", analyst: "S. Whitmore", status: "Under Review" },
  { id: "CASE-2839", customer: "Maria H. Volkov", date: "2026-06-15", risk: "High", analyst: "M. Tanaka", status: "Under Review" },
  { id: "CASE-2838", customer: "Nordwind Energy GmbH", date: "2026-06-15", risk: "Medium", analyst: "L. Rosales", status: "New" },
  { id: "CASE-2837", customer: "Jiang Wei Industries", date: "2026-06-15", risk: "Medium", analyst: "R. Bergström", status: "Under Review" },
  { id: "CASE-2836", customer: "Rafael S. Mendoza", date: "2026-06-14", risk: "Low", analyst: "S. Whitmore", status: "Approved" },
  { id: "CASE-2835", customer: "Atlas Maritime Ltd", date: "2026-06-14", risk: "High", analyst: "A. Okafor", status: "Rejected" },
  { id: "CASE-2834", customer: "Helena K. Brandt", date: "2026-06-14", risk: "Low", analyst: "M. Tanaka", status: "Closed" },
  { id: "CASE-2833", customer: "Sahel Resources Holding", date: "2026-06-13", risk: "Medium", analyst: "L. Rosales", status: "Closed" },
  { id: "CASE-2832", customer: "Ivan P. Sokolov", date: "2026-06-13", risk: "Critical", analyst: "A. Okafor", status: "Escalated" },
];

export const watchlistInternal = [
  { id: "WL-101", name: "Bright Horizon LLC", type: "Corporate", country: "BVI", reason: "Internal fraud investigation 2025", addedBy: "Compliance Team", date: "2025-11-04" },
  { id: "WL-102", name: "Dmitri V. Sokolov", type: "Individual", country: "RU", reason: "Unverified source of funds", addedBy: "S. Whitmore", date: "2025-12-18" },
  { id: "WL-103", name: "Cayman Sun Holdings", type: "Corporate", country: "KY", reason: "Shell structure flagged", addedBy: "A. Okafor", date: "2026-01-09" },
  { id: "WL-104", name: "Aria Petrochem JSC", type: "Corporate", country: "IR", reason: "Sectoral restriction", addedBy: "Compliance Team", date: "2026-02-22" },
];

export const auditLog = [
  { ts: "2026-06-16 14:32:11", user: "a.okafor", action: "Case Escalated", entity: "CASE-2841", before: "Under Review", after: "Escalated" },
  { ts: "2026-06-16 14:21:04", user: "s.whitmore", action: "Match Reviewed", entity: "M-001", before: "—", after: "Likely Match" },
  { ts: "2026-06-16 13:58:47", user: "system", action: "Screening Run", entity: "CUST-99812", before: "—", after: "3 matches" },
  { ts: "2026-06-16 13:44:22", user: "m.tanaka", action: "Notes Added", entity: "CASE-2839", before: "—", after: "Requested KYC docs" },
  { ts: "2026-06-16 12:15:09", user: "l.rosales", action: "Case Closed", entity: "CASE-2829", before: "Under Review", after: "Closed - FP" },
  { ts: "2026-06-16 11:02:55", user: "admin", action: "Threshold Updated", entity: "Auto-Escalate", before: "85", after: "86" },
  { ts: "2026-06-16 09:48:30", user: "system", action: "Watchlist Sync", entity: "OFAC SDN", before: "v2026.06.15", after: "v2026.06.16" },
];

export const countries = ["Australia", "Brazil", "Canada", "China", "France", "Germany", "India", "Italy", "Japan", "Kazakhstan", "Russia", "Saudi Arabia", "Singapore", "South Africa", "Switzerland", "UAE", "United Kingdom", "United States"];
