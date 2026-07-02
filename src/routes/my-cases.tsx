import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/my-cases")({
  head: () => ({ meta: [{ title: "My Cases — Nexus Guard" }] }),
  component: MyCasesPage,
});

function MyCasesPage() {
  const { user, cases } = useApp();
  const navigate = useNavigate();
  useEffect(() => { if (!user) navigate({ to: "/login", replace: true }); }, [user, navigate]);
  if (!user) return null;

  const mine = cases.filter((c) => c.analyst === user.username);
  const active = mine.filter((c) => !["Closed", "Rejected", "Approved"].includes(c.status));
  const pending = mine.filter((c) => c.status === "Pending Approval");
  const closed = mine.filter((c) => c.status === "Closed").length;
  const rejected = mine.filter((c) => c.status === "Rejected").length;

  const stats = [
    { label: "Assigned to me", value: mine.length },
    { label: "Active", value: active.length },
    { label: "Awaiting Approval", value: pending.length },
    { label: "Closed", value: closed },
    { label: "Rejected", value: rejected },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="My Cases" description={`Welcome ${user.name} — cases assigned to you.`} />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-5">
          {stats.map((s) => (
            <Card key={s.label} className="kpi-card pl-5 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="border-b p-4"><h3 className="font-semibold">My Assigned Cases</h3></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No cases assigned yet.</TableCell></TableRow>
              )}
              {mine.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate({ to: "/cases", search: { open: c.id } as never })}>
                  <TableCell className="font-mono text-xs font-medium">{c.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.batchId}</TableCell>
                  <TableCell className="font-medium">{c.customer}</TableCell>
                  <TableCell><StatusPill variant={c.risk === "Critical" ? "destructive" : "warning"}>{c.risk}</StatusPill></TableCell>
                  <TableCell><StatusPill variant={statusVariant(c.status)}>{c.status}</StatusPill></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.decision ?? "—"}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">Open →</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

function statusVariant(s: string) {
  if (s === "Pending Approval") return "info" as const;
  if (s === "In Review" || s === "Assigned") return "warning" as const;
  if (s === "Closed" || s === "Approved") return "success" as const;
  if (s === "Rejected") return "destructive" as const;
  return "muted" as const;
}
