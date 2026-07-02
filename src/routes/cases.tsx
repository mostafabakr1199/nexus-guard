import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPill } from "@/components/StatusPill";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle, UserPlus, Send, ShieldAlert, Target, Sparkles } from "lucide-react";
import { useApp, ANALYST_OPTIONS, type Case, type CaseStatus, type CaseRisk } from "@/lib/store";

export const Route = createFileRoute("/cases")({
  head: () => ({ meta: [{ title: "Case Management — Nexus Guard" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ open: (s.open as string) || undefined }),
  component: CasesPage,
});

const ALL_STATUSES: CaseStatus[] = ["New", "Assigned", "In Review", "Pending Approval", "Approved", "Rejected", "Closed"];

const statusVariant = (s: CaseStatus) =>
  s === "Rejected" ? "destructive"
  : s === "New" ? "warning"
  : s === "Assigned" || s === "In Review" ? "warning"
  : s === "Pending Approval" ? "info"
  : s === "Approved" || s === "Closed" ? "success" : "muted";

const riskVariant = (r: CaseRisk) => (r === "Critical" ? "destructive" : "warning");

function CasesPage() {
  const { user, cases } = useApp();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [openId, setOpenId] = useState<string | null>(search.open ?? null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => { if (!user) navigate({ to: "/login", replace: true }); }, [user, navigate]);
  if (!user) return null;

  // Analyst can only see their own; Manager sees all
  const scoped = user.role === "analyst" ? cases.filter((c) => c.analyst === user.username) : cases;

  const filtered = scoped.filter((c) =>
    (statusFilter === "all" || c.status === statusFilter) &&
    (riskFilter === "all" || c.risk === riskFilter) &&
    (q === "" || [c.id, c.batchId, c.customer].some((v) => v.toLowerCase().includes(q.toLowerCase())))
  );

  const openCase = openId ? cases.find((c) => c.id === openId) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title={user.role === "manager" ? "All Cases" : "My Cases"}
        description={user.role === "manager" ? "Review, assign, and approve investigations." : "Cases assigned to you."}
      />
      <div className="flex-1 space-y-4 p-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Search case ID, customer, batch…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Risk" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
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
                <TableHead>Date</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No cases match.</TableCell></TableRow>
              )}
              {filtered.map((c) => (
                <CaseRow key={c.id} c={c} onOpen={() => setOpenId(c.id)} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!openCase} onOpenChange={(o) => { if (!o) setOpenId(null); }}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          {openCase && <CaseDetails c={openCase} onClose={() => setOpenId(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CaseRow({ c, onOpen }: { c: Case; onOpen: () => void }) {
  const { user, assign } = useApp();
  const isManager = user?.role === "manager";
  return (
    <TableRow className="cursor-pointer" onClick={onOpen}>
      <TableCell className="font-mono text-xs font-medium">{c.id}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{c.batchId}</TableCell>
      <TableCell className="font-medium">{c.customer}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
      <TableCell><StatusPill variant={riskVariant(c.risk)}>{c.risk}</StatusPill></TableCell>
      <TableCell className="text-sm" onClick={(e) => e.stopPropagation()}>
        {c.analyst ? (
          ANALYST_OPTIONS.find((a) => a.username === c.analyst)?.name ?? c.analyst
        ) : isManager ? (
          <Select onValueChange={(v) => assign(c.id, v)}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <div className="flex items-center gap-1.5"><UserPlus className="h-3 w-3" /><SelectValue placeholder="Assign" /></div>
            </SelectTrigger>
            <SelectContent>
              {ANALYST_OPTIONS.map((a) => <SelectItem key={a.username} value={a.username}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell><StatusPill variant={statusVariant(c.status)}>{c.status}</StatusPill></TableCell>
      <TableCell className="text-right text-xs text-muted-foreground">View →</TableCell>
    </TableRow>
  );
}

function CaseDetails({ c, onClose }: { c: Case; onClose: () => void }) {
  const { user, addNote, setDecision, submitForApproval, approve, reject, assign } = useApp();
  const [note, setNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [err, setErr] = useState<string>("");

  const isMine = user?.username === c.analyst;
  const isManager = user?.role === "manager";
  const isAnalyst = user?.role === "analyst";

  // Analyst can edit only when case is theirs and not pending/closed
  const canEdit = isAnalyst && isMine && ["Assigned", "In Review"].includes(c.status);
  const canSubmit = canEdit && !!c.decision;
  const canApproveReject = isManager && c.status === "Pending Approval" && c.submittedBy !== user?.username;

  const components = useMemo(() => [
    { k: "softtfidf", v: "100.0" },
    { k: "first_name_similarity", v: "70.71" },
    { k: "family_name_similarity", v: "100.0" },
    { k: "coverage", v: "100.0" },
    { k: "phonetic_score", v: "100.0" },
    { k: "full_string_similarity", v: "92.3" },
  ], []);

  const doNote = () => { if (!note.trim()) return; addNote(c.id, note.trim()); setNote(""); };
  const doSubmit = () => { submitForApproval(c.id); onClose(); };
  const doApprove = () => { setErr(""); const r = approve(c.id); if (!r.ok) setErr(r.error ?? ""); else onClose(); };
  const doReject = () => {
    setErr("");
    if (!rejectReason.trim()) { setErr("Please provide a rejection reason."); return; }
    const r = reject(c.id, rejectReason.trim());
    if (!r.ok) setErr(r.error ?? ""); else onClose();
  };

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
          <div>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">{c.id}</span>
              <span>{c.customer}</span>
            </DialogTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusPill variant={riskVariant(c.risk)}>{c.risk} Risk</StatusPill>
              <StatusPill variant={statusVariant(c.status)}>{c.status}</StatusPill>
              <span className="font-mono text-[11px] text-muted-foreground">{c.batchId}</span>
              <span className="text-xs text-muted-foreground">
                Opened {c.date} • Analyst: {c.analyst ? (ANALYST_OPTIONS.find((a) => a.username === c.analyst)?.name ?? c.analyst) : "Unassigned"}
              </span>
            </div>
          </div>
        </div>
      </DialogHeader>

      {/* Manager assign for unassigned */}
      {isManager && !c.analyst && (
        <Card className="p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Assign Analyst:</span>
            <Select onValueChange={(v) => assign(c.id, v)}>
              <SelectTrigger className="h-8 w-56"><SelectValue placeholder="Select analyst" /></SelectTrigger>
              <SelectContent>
                {ANALYST_OPTIONS.map((a) => <SelectItem key={a.username} value={a.username}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Header metrics */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            <Target className="h-3 w-3" /> Match Score
          </div>
          <div className="mt-1 text-3xl font-semibold tabular-nums text-destructive">{c.bestMatch?.score.toFixed(2) ?? c.riskScore}%</div>
          <div className="mt-1 text-xs text-muted-foreground">{c.severity} severity</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Watchlist</div>
          <div className="mt-1 text-base font-semibold">{c.bestMatch?.watchlist ?? "—"}</div>
          <div className="text-xs text-muted-foreground">{c.bestMatch?.reason}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Recommended Action</div>
          <div className="mt-1 text-xs leading-relaxed">{c.recommendedAction}</div>
        </div>
      </div>

      {/* Evidence */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldAlert className="h-4 w-4 text-primary" /> Match Components</div>
        <div className="grid gap-x-6 gap-y-1.5 md:grid-cols-2">
          {components.map((r) => (
            <div key={r.k} className="flex items-center justify-between border-b py-1 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{r.k}</span>
              <span className="font-semibold tabular-nums">{r.v}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-4">
        <div className="mb-3 text-sm font-semibold">Investigation Notes</div>
        {c.notes.length === 0 && <div className="text-xs text-muted-foreground">No notes yet.</div>}
        <ul className="space-y-2">
          {c.notes.map((n, i) => (
            <li key={i} className="rounded-md border bg-muted/30 p-2 text-sm">
              <div className="mb-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">{n.user}</span> · <span>{n.ts}</span>
              </div>
              <div>{n.text}</div>
            </li>
          ))}
        </ul>
        {canEdit && (
          <div className="mt-3 flex gap-2">
            <Textarea placeholder="Add investigation note…" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
            <Button onClick={doNote} disabled={!note.trim()}>Add</Button>
          </div>
        )}
      </Card>

      {/* Analyst decision */}
      {isAnalyst && isMine && (
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Analyst Decision</div>
          <RadioGroup
            value={c.decision ?? ""}
            onValueChange={(v) => setDecision(c.id, v as "True Match" | "False Positive")}
            disabled={!canEdit}
            className="grid gap-2 md:grid-cols-2"
          >
            <label className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm has-[[data-state=checked]]:border-destructive has-[[data-state=checked]]:bg-destructive/5">
              <RadioGroupItem value="True Match" /> True Match
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm has-[[data-state=checked]]:border-success has-[[data-state=checked]]:bg-success/5">
              <RadioGroupItem value="False Positive" /> False Positive
            </label>
          </RadioGroup>
          {c.status === "Pending Approval" && (
            <div className="mt-2 text-xs text-info">This case is awaiting manager approval.</div>
          )}
        </Card>
      )}

      {/* Manager approval area */}
      {canApproveReject && (
        <Card className="border-info/30 bg-info/5 p-4">
          <div className="mb-2 text-sm font-semibold">Manager Review</div>
          <div className="text-sm">
            Analyst decision: <b>{c.decision ?? "—"}</b> · Submitted by <span className="font-mono">{c.submittedBy}</span>
          </div>
          {showReject && (
            <div className="mt-3 space-y-2">
              <Label className="text-xs">Rejection reason</Label>
              <Textarea rows={2} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Explain why this decision is being sent back…" />
            </div>
          )}
        </Card>
      )}

      {isManager && c.status === "Pending Approval" && c.submittedBy === user?.username && (
        <Card className="border-warning/40 bg-warning/5 p-3 text-xs">
          You submitted this case for approval — a different manager must approve or reject it.
        </Card>
      )}

      {err && <div className="rounded-md border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">{err}</div>}

      {/* Action bar */}
      <div className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t bg-background pt-3">
        <Button variant="outline" onClick={onClose}>Close</Button>
        {canSubmit && (
          <Button onClick={doSubmit} className="gap-2"><Send className="h-4 w-4" /> Submit for Approval</Button>
        )}
        {isAnalyst && isMine && canEdit && !c.decision && (
          <span className="self-center text-xs text-muted-foreground">Select a decision to submit.</span>
        )}
        {canApproveReject && !showReject && (
          <>
            <Button variant="outline" className="gap-2" onClick={() => setShowReject(true)}>
              <XCircle className="h-4 w-4" /> Reject
            </Button>
            <Button className="gap-2" onClick={doApprove}>
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button>
          </>
        )}
        {canApproveReject && showReject && (
          <>
            <Button variant="ghost" onClick={() => { setShowReject(false); setRejectReason(""); setErr(""); }}>Cancel</Button>
            <Button variant="destructive" className="gap-2" onClick={doReject}>
              <XCircle className="h-4 w-4" /> Confirm Reject
            </Button>
          </>
        )}
      </div>
    </>
  );
}
