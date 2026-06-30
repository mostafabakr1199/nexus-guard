import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPill } from "@/components/StatusPill";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sparkles, Paperclip, MessageSquare, UserPlus, X, ShieldAlert, Target, Activity,
  Clock, TrendingDown, FileSearch, Link2, History, AlertTriangle,
} from "lucide-react";
import { cases, type Case } from "@/lib/mock-data";

export const Route = createFileRoute("/cases")({
  head: () => ({ meta: [{ title: "Cases — Nexus Guard" }] }),
  component: CasesPage,
});

const riskVariant = (r: Case["risk"]) =>
  r === "Critical" || r === "High" ? "destructive" : r === "Medium" ? "warning" : "success";
const statusVariant = (s: Case["status"]) =>
  s === "Escalated" || s === "Rejected" ? "destructive"
    : s === "Under Review" || s === "New" ? "warning"
    : s === "Approved" ? "success" : "muted";

function CasesPage() {
  const [open, setOpen] = useState<Case | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? cases : cases.filter((c) => c.status === filter);
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
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {["New", "Under Review", "Escalated", "Approved", "Rejected", "Closed"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
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
                <TableHead>Status</TableHead>
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
                  <TableCell className="text-sm">{c.analyst}</TableCell>
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
          {open && <CaseDetails c={open} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone = "default" }: { icon: any; label: string; value: string; tone?: "default" | "danger" | "warn" | "ok" }) {
  const color =
    tone === "danger" ? "text-destructive" :
    tone === "warn" ? "text-warning-foreground" :
    tone === "ok" ? "text-success" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-1 text-lg font-semibold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function MatchBar({ label, value }: { label: string; value: number }) {
  const tone = value >= 85 ? "bg-destructive" : value >= 65 ? "bg-warning" : value >= 40 ? "bg-info" : "bg-muted-foreground/40";
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children, accent }: { icon: any; title: string; subtitle?: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <Card className={`p-4 ${accent ? "border-primary/30" : ""}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-[11px] text-muted-foreground">{subtitle}</div>}
        </div>
      </div>
      {children}
    </Card>
  );
}

function CaseDetails({ c }: { c: Case }) {
  const isHighRisk = c.risk === "High" || c.risk === "Critical";
  const slaPct = Math.min(100, (c.ageHours / c.slaHours) * 100);
  const slaTone = slaPct >= 90 ? "danger" : slaPct >= 60 ? "warn" : "ok";

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
              <span className="text-xs text-muted-foreground">Opened {c.date} • Analyst: {c.analyst}</span>
            </div>
          </div>
        </div>
      </DialogHeader>

      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <Metric icon={ShieldAlert} label="Risk Score" value={`${c.riskScore}/100`} tone={c.riskScore >= 85 ? "danger" : c.riskScore >= 60 ? "warn" : "ok"} />
        <Metric icon={Target} label="Match Confidence" value={`${c.matchConfidence}%`} tone={c.matchConfidence >= 80 ? "danger" : "warn"} />
        <Metric icon={TrendingDown} label="False Positive Prob." value={`${c.falsePositiveProbability}%`} tone={c.falsePositiveProbability >= 60 ? "ok" : "warn"} />
        <Metric icon={AlertTriangle} label="Severity" value={c.severity} tone={c.severity === "Severe" || c.severity === "High" ? "danger" : "warn"} />
        <Metric icon={Activity} label="Recommended" value={c.recommendedAction.split(" ").slice(0, 2).join(" ") + "…"} />
        <Metric icon={Clock} label="Age / SLA" value={`${c.ageHours}h / ${c.slaHours}h`} tone={slaTone as any} />
      </div>

      {/* Best Match — only High/Critical */}
      {isHighRisk && c.bestMatch && (
        <Card className="border-destructive/40 bg-destructive/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <ShieldAlert className="h-4 w-4" /> Best Match
            </div>
            <StatusPill variant="destructive" dot={false}>Score {c.bestMatch.score}</StatusPill>
          </div>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <Row k="Watchlist" v={c.bestMatch.watchlist} />
            <Row k="Match Reason" v={c.bestMatch.reason} />
            <Row k="DOB" v={c.bestMatch.dob} />
            <Row k="Nationality" v={c.bestMatch.nationality} />
            <Row k="Passport" v={c.bestMatch.passport} />
            <Row k="Recommended" v={c.recommendedAction} />
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {/* AI Summary */}
          <Card className="border-info/30 bg-info/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-info"><Sparkles className="h-4 w-4" /> AI Case Summary</div>
            <p className="mt-1.5 text-sm leading-relaxed">
              {c.customer} flagged with {c.matchConfidence}% identity correlation. Pattern of cross-border activity
              consistent with sanctioned counterparties. <b>Recommended:</b> {c.recommendedAction}.
            </p>
          </Card>

          {/* Match Quality */}
          <SectionCard icon={Target} title="Match Quality" subtitle="AI-decomposed similarity dimensions">
            <div className="grid gap-3 md:grid-cols-2">
              <MatchBar label="Name" value={Math.min(100, c.matchConfidence + 4)} />
              <MatchBar label="Identity" value={c.matchConfidence} />
              <MatchBar label="DOB / Document" value={Math.max(0, c.matchConfidence - 12)} />
              <MatchBar label="Alias / Phonetic" value={Math.max(0, c.matchConfidence - 18)} />
            </div>
          </SectionCard>

          {/* Key Insights */}
          <SectionCard icon={FileSearch} title="Key Insights" subtitle="What drives — and weakens — this match">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <div className="mb-1 text-xs font-medium text-foreground">Match Drivers</div>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                  <li>Exact name token match</li>
                  <li>DOB alignment</li>
                  <li>Nationality match</li>
                </ul>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-foreground">Missing Evidence</div>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                  <li>Passport not on record</li>
                  <li>No biometric reference</li>
                  <li>Address unverified</li>
                </ul>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-foreground">Sanctions Context</div>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                  <li>Listed under OFAC EO 13662</li>
                  <li>Sectoral — financial services</li>
                  <li>Cross-listed on EU & UK HMT</li>
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Customer Context */}
          <SectionCard icon={History} title="Customer Context" subtitle="Historical screening posture">
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Previous Screenings</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">4</div>
                <div className="text-xs text-muted-foreground">last 12 months</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Past Decisions</div>
                <div className="mt-1 flex items-center gap-2">
                  <StatusPill variant="success" dot={false}>3 Clear</StatusPill>
                  <StatusPill variant="warning" dot={false}>1 Review</StatusPill>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Customer Risk Rating</div>
                <div className="mt-1"><StatusPill variant={riskVariant(c.risk)}>{c.risk}</StatusPill></div>
                <div className="text-xs text-muted-foreground">recomputed nightly</div>
              </div>
            </div>
          </SectionCard>

          {/* Related Intelligence */}
          <SectionCard icon={Link2} title="Related Intelligence" subtitle="Entities and cases connected to this subject">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">Related Entities</div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex justify-between rounded-md border p-2"><span>Bright Horizon LLC</span><span className="text-xs text-muted-foreground">Beneficial owner</span></li>
                  <li className="flex justify-between rounded-md border p-2"><span>Cayman Sun Holdings</span><span className="text-xs text-muted-foreground">Shared director</span></li>
                </ul>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium text-foreground">Linked Cases</div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex justify-between rounded-md border p-2"><span className="font-mono text-xs">CASE-2832</span><StatusPill variant="destructive" dot={false}>Escalated</StatusPill></li>
                  <li className="flex justify-between rounded-md border p-2"><span className="font-mono text-xs">CASE-2701</span><StatusPill variant="muted" dot={false}>Closed</StatusPill></li>
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Timeline */}
          <SectionCard icon={Activity} title="Timeline">
            <ol className="space-y-3 border-l border-border pl-4">
              {[
                { t: "14:32", text: `Case escalated to L2 by ${c.analyst}` },
                { t: "14:21", text: `Best-match reviewed — confidence ${c.matchConfidence}%` },
                { t: "13:58", text: "Screening run completed — 5 candidates" },
                { t: "11:02", text: "Customer onboarded via branch portal" },
              ].map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] mt-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                  <div className="text-sm">{e.text}</div>
                  <div className="text-xs text-muted-foreground">Today, {e.t}</div>
                </li>
              ))}
            </ol>
          </SectionCard>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4" /> Analyst Notes</div>
            <Textarea placeholder="Add a note for the investigation log…" />
            <div className="mt-2 flex justify-end"><Button size="sm">Add Note</Button></div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-3 text-sm font-semibold">Recommended Action</div>
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
              {c.recommendedAction}
            </div>
            <div className="mt-3 space-y-2">
              <Button className="w-full justify-start" variant="outline"><UserPlus className="h-4 w-4" /> Assign Case</Button>
              <Button className="w-full justify-start" variant="outline"><Paperclip className="h-4 w-4" /> Request KYC Documents</Button>
              <Button className="w-full justify-start" variant="outline">Approve</Button>
              <Button className="w-full justify-start" variant="destructive"><X className="h-4 w-4" /> Reject & Close</Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-2 text-sm font-semibold">SLA</div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{c.ageHours}h elapsed</span>
              <span className="font-medium">{c.slaHours}h target</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className={`h-full ${slaPct >= 90 ? "bg-destructive" : slaPct >= 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${slaPct}%` }} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-3 text-sm font-semibold">Attached Evidence</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-md border p-2"><span>passport_front.pdf</span><span className="text-xs text-muted-foreground">412 KB</span></li>
              <li className="flex items-center justify-between rounded-md border p-2"><span>ofac_record_29481.pdf</span><span className="text-xs text-muted-foreground">88 KB</span></li>
              <li className="flex items-center justify-between rounded-md border p-2"><span>tx_history_90d.csv</span><span className="text-xs text-muted-foreground">2.1 MB</span></li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</div>
      <div className="text-sm font-medium">{v}</div>
    </div>
  );
}
