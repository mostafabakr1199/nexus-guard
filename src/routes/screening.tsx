import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/StatusPill";
import { Sparkles, ShieldCheck, Loader2, CheckCircle2, ArrowRight, FileText, AlertOctagon, Eye } from "lucide-react";
import { candidateMatches, screeningSources, countries } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/screening")({
  head: () => ({ meta: [{ title: "Customer Screening — Finaira" }] }),
  component: Screening,
});

const steps = [
  "Checking Sanctions Lists",
  "Checking PEP Lists",
  "Checking Internal Watchlists",
  "Checking Adverse Media",
  "Computing AI Risk Score",
];

type Phase = "form" | "running" | "results";

function Screening() {
  const [phase, setPhase] = useState<Phase>("form");
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const runScreening = () => {
    setPhase("running");
    setStepIdx(0);
    steps.forEach((_, i) => {
      setTimeout(() => {
        setStepIdx(i + 1);
        if (i === steps.length - 1) setTimeout(() => setPhase("results"), 500);
      }, (i + 1) * 700);
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Customer Screening"
        description="Screen individuals and entities against sanctions, PEP, watchlists, and adverse media."
        actions={phase === "results" ? <Button variant="outline" size="sm" onClick={() => setPhase("form")}>New Screening</Button> : null}
      />
      <div className="flex-1 p-6">
        {phase === "form" && <ScreeningForm onRun={runScreening} />}
        {phase === "running" && <RunningWorkflow stepIdx={stepIdx} />}
        {phase === "results" && <ResultsView onSelect={setSelectedMatch} />}
      </div>

      <Dialog open={!!selectedMatch} onOpenChange={(o) => !o && setSelectedMatch(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Match Details — Side-by-Side Comparison</DialogTitle></DialogHeader>
          <MatchDetails matchId={selectedMatch!} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScreeningForm({ onRun }: { onRun: () => void }) {
  return (
    <Card className="mx-auto max-w-4xl p-6">
      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
        </TabsList>
        <TabsContent value="individual" className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name *"><Input defaultValue="Alibek N. Yermekov" /></Field>
            <Field label="Date of Birth *"><Input type="date" defaultValue="1971-04-12" /></Field>
            <Field label="Nationality">
              <Select defaultValue="Kazakhstan">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="National ID"><Input defaultValue="871109300521" /></Field>
            <Field label="Passport Number"><Input defaultValue="N04829112" /></Field>
            <Field label="Address"><Input defaultValue="14 Dostyk Ave, Almaty" /></Field>
          </div>
        </TabsContent>
        <TabsContent value="corporate" className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company Name *"><Input placeholder="e.g. Polaris Trading SA" /></Field>
            <Field label="Registration Number *"><Input placeholder="HRB 384921" /></Field>
            <Field label="Country">
              <Select><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>{countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Tax Number"><Input /></Field>
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-6 flex items-center justify-between border-t pt-5">
        <p className="text-xs text-muted-foreground">Screening runs against 7 sources • SLA: under 3 seconds</p>
        <Button onClick={onRun} className="gap-2"><ShieldCheck className="h-4 w-4" /> Run Screening</Button>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RunningWorkflow({ stepIdx }: { stepIdx: number }) {
  const pct = (stepIdx / steps.length) * 100;
  return (
    <Card className="mx-auto max-w-2xl p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Running Screening</h2>
        <p className="text-sm text-muted-foreground">Querying sanction, PEP, watchlist & media providers…</p>
      </div>
      <Progress value={pct} className="mt-6" />
      <ul className="mt-6 space-y-3">
        {steps.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <li key={s} className="flex items-center gap-3 text-sm">
              {done ? <CheckCircle2 className="h-4 w-4 text-success" /> :
                active ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> :
                <span className="h-4 w-4 rounded-full border border-border" />}
              <span className={done ? "text-foreground" : active ? "text-foreground font-medium" : "text-muted-foreground"}>{s}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function ResultsView({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Overall Status</p>
              <div className="mt-2 flex items-center gap-3">
                <StatusPill variant="destructive">Likely Match</StatusPill>
                <span className="text-sm text-muted-foreground">Alibek N. Yermekov • DOB 1971-04-12</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Risk Score</p>
              <div className="mt-1 text-3xl font-semibold text-destructive">94<span className="text-base text-muted-foreground">/100</span></div>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-info/30 bg-info/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-info"><Sparkles className="h-4 w-4" /> AI Risk Assessment</div>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
              Strong identity correlation with OFAC SDN entry (94% confidence). Full name, date of birth, and nationality
              match. Two corroborating EU and UK HMT entries plus one adverse media reference. Recommend immediate
              escalation to L2 review with KYC document collection.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Screening Sources</h3>
          <p className="mb-3 text-xs text-muted-foreground">7 providers queried</p>
          <ul className="space-y-2">
            {screeningSources.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <span>{s.name}</span>
                <StatusPill variant={s.status === "hit" ? "destructive" : s.status === "weak" ? "warning" : "success"} dot={false}>
                  {s.status === "hit" ? "Match" : s.status === "weak" ? "Weak" : "Clear"}
                </StatusPill>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="font-semibold">Candidate Matches</h3>
            <p className="text-xs text-muted-foreground">5 candidates returned • Ranked by AI similarity score</p>
          </div>
          <Button size="sm" variant="outline"><FileText className="h-3.5 w-3.5" /> Generate Report</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Score</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Source List</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Match Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidateMatches.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${m.score >= 85 ? "bg-destructive" : m.score >= 70 ? "bg-warning" : "bg-info"}`} style={{ width: `${m.score}%` }} />
                    </div>
                    <span className="font-semibold tabular-nums">{m.score}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell><span className="text-xs">{m.source}</span></TableCell>
                <TableCell><span className="text-xs">{m.country}</span></TableCell>
                <TableCell className="text-xs text-muted-foreground">{m.reason}</TableCell>
                <TableCell>
                  <StatusPill variant={m.status === "Likely" ? "destructive" : m.status === "Potential" ? "warning" : "muted"}>
                    {m.status}
                  </StatusPill>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => onSelect(m.id)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive"><AlertOctagon className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost"><ArrowRight className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function MatchDetails({ matchId }: { matchId: string }) {
  const match = candidateMatches.find((m) => m.id === matchId) ?? candidateMatches[0];
  const rows = [
    { label: "Name", left: "Alibek N. Yermekov", right: match.name, match: true },
    { label: "Date of Birth", left: "1971-04-12", right: match.dob ?? "—", match: !!match.dob },
    { label: "Nationality", left: "Kazakhstan", right: match.country === "KZ" ? "Kazakhstan" : match.country, match: match.country === "KZ" },
    { label: "Address", left: "14 Dostyk Ave, Almaty", right: "Almaty Region (last known)", match: true },
    { label: "Document", left: "N04829112", right: "Not on record", match: false },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</div>
          <div className="space-y-2 text-sm">
            <Row k="Full Name" v="Alibek N. Yermekov" />
            <Row k="DOB" v="1971-04-12" />
            <Row k="Nationality" v="Kazakhstan" />
            <Row k="National ID" v="871109300521" />
            <Row k="Passport" v="N04829112" />
          </div>
        </Card>
        <Card className="p-4 border-destructive/30">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-destructive">Sanctioned Entity</div>
            <StatusPill variant="destructive" dot={false}>{match.source}</StatusPill>
          </div>
          <div className="space-y-2 text-sm">
            <Row k="Listed Name" v={match.name} />
            <Row k="DOB" v={match.dob ?? "—"} />
            <Row k="Country" v={match.country} />
            <Row k="Aliases" v={(match.aliases ?? ["—"]).join(", ")} />
            <Row k="Listed Since" v="2022-09-14" />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-3 text-sm font-semibold">Comparison Matrix</div>
        <div className="grid grid-cols-5 gap-2">
          {rows.map((r) => (
            <div key={r.label} className={`rounded-md border p-3 text-center ${r.match ? "border-success/40 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{r.label}</div>
              <div className={`mt-1 text-sm font-semibold ${r.match ? "text-success" : "text-destructive"}`}>{r.match ? "Match" : "No Match"}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-info/30 bg-info/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-info"><Sparkles className="h-4 w-4" /> Why was this match detected?</div>
        <p className="mt-2 text-sm leading-relaxed">
          The candidate exhibits a 94% identity correlation: <b>exact name token match</b>, <b>identical DOB</b>,
          and <b>nationality alignment</b> with OFAC SDN record SDN-29481. Phonetic variants ("A. Yermekoff",
          "Ali Yermek") were also matched in EU and UK HMT lists. Document number could not be confirmed against
          the source, lowering confidence slightly from 100% to 94%.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Recommended Decision:</span>
          <StatusPill variant="destructive" dot={false}>Escalate to L2</StatusPill>
        </div>
      </Card>

      <div className="flex justify-end gap-2 border-t pt-3">
        <Button variant="ghost">Mark False Positive</Button>
        <Button variant="outline">Mark Clear</Button>
        <Button variant="destructive">Escalate</Button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
