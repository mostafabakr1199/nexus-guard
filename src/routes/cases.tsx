import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPill } from "@/components/StatusPill";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sparkles, ShieldAlert, Target, CheckCircle2, XCircle, UserPlus,
} from "lucide-react";
import { cases, analysts, type Case, type CaseStatus, type CaseRisk } from "@/lib/mock-data";

export const Route = createFileRoute("/cases")({
  head: () => ({ meta: [{ title: "Cases — Nexus Guard" }] }),
  component: CasesPage,
});

const STATUSES: CaseStatus[] = ["Needs review", "In review", "Approved", "Rejected", "Escalated"];
const RISKS: CaseRisk[] = ["Critical", "High"];

const riskVariant = (r: CaseRisk) => (r === "Critical" ? "destructive" : "warning");
const statusVariant = (s: CaseStatus) =>
  s === "Escalated" || s === "Rejected" ? "destructive"
  : s === "Needs review" ? "warning"
  : s === "In review" ? "info"
  : s === "Approved" ? "success" : "muted";

function CasesPage() {
  const [open, setOpen] = useState<Case | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [rows, setRows] = useState<Case[]>(cases);

  const filtered = rows.filter((c) =>
    (statusFilter === "all" || c.status === statusFilter) &&
    (riskFilter === "all" || c.risk === riskFilter),
  );

  const assign = (id: string, analyst: string) => {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, analyst, status: c.status === "Needs review" ? "In review" : c.status } : c)));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Case Management"
        description="Track, assign, and resolve compliance investigations."
        actions={<Button size="sm">New Case</Button>}
      />
      <div className="flex-1 space-y-4 p-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search case ID, customer, batch…" className="max-w-xs" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Case status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Risk level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                {RISKS.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
            <div className="ml-auto text-xs text-muted-foreground">{filtered.length} cases</div>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Screening Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Assigned Analyst</TableHead>
                <TableHead>Case status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setOpen(c)}>
                  <TableCell className="font-mono text-xs font-medium">{c.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.batchId}</TableCell>
                  <TableCell className="font-medium">{c.customer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                  <TableCell><StatusPill variant={riskVariant(c.risk)}>{c.risk}</StatusPill></TableCell>
                  <TableCell className="text-sm" onClick={(e) => e.stopPropagation()}>
                    {c.analyst ? (
                      c.analyst
                    ) : (
                      <Select onValueChange={(v) => assign(c.id, v)}>
                        <SelectTrigger className="h-8 w-44 text-xs">
                          <div className="flex items-center gap-1.5"><UserPlus className="h-3 w-3" /><SelectValue placeholder="Assign analyst" /></div>
                        </SelectTrigger>
                        <SelectContent>
                          {analysts.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell><StatusPill variant={statusVariant(c.status)}>{c.status}</StatusPill></TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">View →</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {open && <CaseDetails c={open} onDecide={(s) => { setRows((prev) => prev.map((x) => x.id === open.id ? { ...x, status: s } : x)); setOpen(null); }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CaseDetails({ c, onDecide }: { c: Case; onDecide: (s: CaseStatus) => void }) {
  // Hard-coded per specification for the flagship demo record
  const components = [
    { k: "softtfidf", v: "100.0" },
    { k: "first_name_similarity", v: "70.71" },
    { k: "family_name_similarity", v: "100.0" },
    { k: "coverage", v: "100.0" },
    { k: "phonetic_score", v: "100.0" },
    { k: "full_string_similarity", v: "92.3" },
  ];
  const factors = [
    { k: "token_count_factor", v: "1.0" },
    { k: "order_factor", v: "0.967" },
    { k: "distinctiveness_gate", v: "1.0" },
  ];
  const tokens = [
    { en: "mohamed", ar: "محمد", score: 100 },
    { en: "ahmed", ar: "احمد", score: 100 },
    { en: "sayed", ar: "سيد", score: 100 },
    { en: "ahmed", ar: "احمد", score: 100 },
  ];
  const indicators = [
    "Full token coverage (4/4)",
    "100% phonetic match",
    "100% family name match",
    "Distinctive tokens present",
    "Minor order penalty (0.967)",
  ];
  const topMatches = [
    { rank: 1, level: "Critical", name: "Mohamed Ahmed Sayed Ahmed", score: 90.71, note: "Same name, full alignment" },
    { rank: 2, level: "High", name: "Ahmed Mohamed Sayed Ahmed", score: 86.42, note: "Tokens reordered — 4/4 coverage, 100% token similarity" },
    { rank: 3, level: "High", name: "Sayed Ahmed Mohamed Ahmed", score: 84.10, note: "Tokens reordered — 4/4 coverage, 100% token similarity" },
    { rank: 4, level: "High", name: "Ahmed Sayed Ahmed Mohamed", score: 82.55, note: "Tokens reordered — 4/4 coverage, 100% token similarity" },
  ];

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
          <div>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">{c.id}</span>
              <span dir="auto">Mohamed Ahmed Sayed Ahmed <span className="text-muted-foreground font-normal">/</span> <span className="font-normal" dir="rtl">محمد أحمد سيد أحمد</span></span>
            </DialogTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusPill variant={riskVariant(c.risk)}>{c.risk} Risk</StatusPill>
              <StatusPill variant={statusVariant(c.status)}>{c.status}</StatusPill>
              <span className="font-mono text-[11px] text-muted-foreground">{c.batchId}</span>
              <span className="text-xs text-muted-foreground">Opened {c.date} • Analyst: {c.analyst || "Unassigned"}</span>
            </div>
          </div>
        </div>
      </DialogHeader>

      {/* Header metrics */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            <Target className="h-3 w-3" /> Score
          </div>
          <div className="mt-1 text-3xl font-semibold tabular-nums text-destructive">90.71%</div>
          <div className="mt-1 text-xs text-muted-foreground">High-confidence true positive</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Source</div>
          <div className="mt-1 text-base font-semibold">Egypt Terrorism Watchlist</div>
          <div className="text-xs text-muted-foreground">Updated 17 May 2026</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Explanation</div>
          <div className="mt-1 text-xs leading-relaxed">
            4/4 tokens aligned; distinctive tokens matched; family token strong; order penalty applied.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Components */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldAlert className="h-4 w-4 text-primary" /> Components</div>
          <div className="divide-y">
            {components.map((r) => (
              <div key={r.k} className="flex items-center justify-between py-1.5 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{r.k}</span>
                <span className="font-semibold tabular-nums">{r.v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Factors */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldAlert className="h-4 w-4 text-primary" /> Factors</div>
          <div className="divide-y">
            {factors.map((r) => (
              <div key={r.k} className="flex items-center justify-between py-1.5 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{r.k}</span>
                <span className="font-semibold tabular-nums">{r.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Token Match Evidence */}
      <Card className="p-4">
        <div className="mb-3 text-sm font-semibold">Token Match Evidence</div>
        <div className="grid gap-2 md:grid-cols-2">
          {tokens.map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span className="font-mono">{t.en} = <span dir="rtl" className="font-sans">{t.ar}</span></span>
              <StatusPill variant="success" dot={false}>{t.score}</StatusPill>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Indicators */}
      <Card className="p-4">
        <div className="mb-3 text-sm font-semibold">Risk Indicators</div>
        <ul className="grid gap-1.5 md:grid-cols-2">
          {indicators.map((ind) => (
            <li key={ind} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <span>{ind}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Analyst Conclusion */}
      <Card className="border-info/30 bg-info/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-info"><Sparkles className="h-4 w-4" /> Analyst Conclusion</div>
        <p className="mt-1.5 text-sm leading-relaxed">
          A composite score of <b>90.71%</b> combined with full token alignment (4/4), 100% phonetic and family-name
          similarity, and matching distinctive tokens is a strong indicator of a <b>high-confidence true positive</b>.
          The small order penalty (0.967) reflects token reordering only and does not weaken the identity match.
          Recommend escalation to MLRO and account freeze pending EDD.
        </p>
      </Card>

      {/* Top Matches */}
      <Card>
        <div className="border-b p-4 text-sm font-semibold">Top Matches</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topMatches.map((m) => (
              <TableRow key={m.rank}>
                <TableCell className="text-muted-foreground">{m.rank}</TableCell>
                <TableCell>
                  <StatusPill variant={m.level === "Critical" ? "destructive" : "warning"}>{m.level}</StatusPill>
                </TableCell>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="font-semibold tabular-nums">{m.score.toFixed(2)}%</TableCell>
                <TableCell className="text-xs text-muted-foreground">{m.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Decision actions */}
      <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-background pt-3">
        <Button variant="outline" onClick={() => onDecide("Rejected")} className="gap-2">
          <XCircle className="h-4 w-4" /> Reject Case
        </Button>
        <Button onClick={() => onDecide("Approved")} className="gap-2">
          <CheckCircle2 className="h-4 w-4" /> Approve Case
        </Button>
      </div>
    </>
  );
}
