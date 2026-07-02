import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/StatusPill";
import { Activity, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Executive Dashboard — Nexus Guard" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { cases } = useApp();
  const open = cases.filter((c) => !["Closed", "Approved", "Rejected"].includes(c.status));
  const pending = cases.filter((c) => c.status === "Pending Approval");
  const critical = cases.filter((c) => c.risk === "Critical");
  const closed = cases.filter((c) => c.status === "Closed");

  const kpis = [
    { label: "Today's Screenings", value: "12,847", icon: Activity },
    { label: "Open Cases", value: open.length.toString(), icon: ShieldAlert },
    { label: "Pending Approval", value: pending.length.toString(), icon: Clock },
    { label: "Critical Alerts", value: critical.length.toString(), icon: AlertTriangle },
    { label: "Closed This Week", value: closed.length.toString(), icon: CheckCircle2 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Executive Dashboard" description="Portfolio-wide compliance posture and live workload." />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {kpis.map((k) => (
            <Card key={k.label} className="kpi-card pl-5 p-4">
              <div className="flex items-start justify-between">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</div>
                <k.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 text-3xl font-semibold tabular-nums">{k.value}</div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Cases by Status</h3>
              <span className="text-xs text-muted-foreground">{cases.length} total</span>
            </div>
            <div className="space-y-2">
              {(["New", "Assigned", "In Review", "Pending Approval", "Closed", "Rejected"] as const).map((s) => {
                const n = cases.filter((c) => c.status === s).length;
                const pct = cases.length ? (n / cases.length) * 100 : 0;
                return (
                  <div key={s}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{s}</span>
                      <span className="tabular-nums text-muted-foreground">{n}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded bg-muted">
                      <div className="h-full rounded bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 font-semibold">Critical & Pending Queue</h3>
            <ul className="divide-y">
              {cases
                .filter((c) => c.risk === "Critical" || c.status === "Pending Approval")
                .slice(0, 6)
                .map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{c.customer}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{c.id} · {c.batchId}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusPill variant={c.risk === "Critical" ? "destructive" : "warning"}>{c.risk}</StatusPill>
                      <StatusPill variant={c.status === "Pending Approval" ? "info" : "muted"}>{c.status}</StatusPill>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
