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
import { Sparkles, Paperclip, MessageSquare, UserPlus, X } from "lucide-react";
import { cases, type Case } from "@/lib/mock-data";

export const Route = createFileRoute("/cases")({
  head: () => ({ meta: [{ title: "Cases — Finaira" }] }),
  component: CasesPage,
});

const riskVariant = (r: Case["risk"]) =>
  r === "Critical" ? "destructive" : r === "High" ? "destructive" : r === "Medium" ? "warning" : "success";
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
            <Input placeholder="Search case ID, customer…" className="max-w-xs" />
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
        <DialogContent className="max-w-4xl">
          {open && <CaseDetails c={open} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CaseDetails({ c }: { c: Case }) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between pr-6">
          <div>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">{c.id}</span>
              <span>{c.customer}</span>
            </DialogTitle>
            <div className="mt-2 flex items-center gap-2">
              <StatusPill variant={riskVariant(c.risk)}>{c.risk} Risk</StatusPill>
              <StatusPill variant={statusVariant(c.status)}>{c.status}</StatusPill>
              <span className="text-xs text-muted-foreground">Opened {c.date} • Analyst: {c.analyst}</span>
            </div>
          </div>
        </div>
      </DialogHeader>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card className="border-info/30 bg-info/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-info"><Sparkles className="h-4 w-4" /> AI Case Summary</div>
            <p className="mt-1.5 text-sm leading-relaxed">
              Customer flagged on 5 sources with 94% identity correlation to OFAC SDN entry. Two prior screenings
              cleared. Pattern of cross-border wire transfers (avg. €420K/quarter) to high-risk jurisdictions
              detected in the last 90 days. <b>Recommended action:</b> escalate to MLRO, freeze account pending review.
            </p>
          </Card>

          <Card className="p-4">
            <div className="mb-3 text-sm font-semibold">Timeline</div>
            <ol className="space-y-3 border-l border-border pl-4">
              {[
                { t: "14:32", text: `Case escalated to L2 by A. Okafor`, kind: "escalate" },
                { t: "14:21", text: "OFAC match reviewed — confidence 94%" },
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
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4" /> Analyst Notes</div>
            <Textarea placeholder="Add a note for the investigation log…" />
            <div className="mt-2 flex justify-end"><Button size="sm">Add Note</Button></div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-3 text-sm font-semibold">Actions</div>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline"><UserPlus className="h-4 w-4" /> Assign Case</Button>
              <Button className="w-full justify-start" variant="outline"><Paperclip className="h-4 w-4" /> Request KYC Documents</Button>
              <Button className="w-full justify-start" variant="outline">Approve</Button>
              <Button className="w-full justify-start" variant="destructive"><X className="h-4 w-4" /> Reject & Close</Button>
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
