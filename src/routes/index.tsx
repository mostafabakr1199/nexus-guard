import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";
import {
  Activity, AlertTriangle, FileSearch, ShieldAlert, TrendingUp, Users,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { kpis, volumeTrend, recentActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Nexus Guard" }] }),
  component: Dashboard,
});

const kpiCards = [
  { label: "Screenings Today", value: kpis.todayScreenings.toLocaleString(), delta: "+8.2%", icon: FileSearch },
  { label: "Potential Matches", value: kpis.potentialMatches, delta: "+12", icon: AlertTriangle },
  { label: "Confirmed Matches", value: kpis.confirmedMatches, delta: "+3", icon: ShieldAlert },
  { label: "Open Investigations", value: kpis.openInvestigations, delta: "5 escalated", icon: Users },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Executive Dashboard"
        description="Real-time view of screening operations and compliance alerts."
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm" asChild><Link to="/screening">New Screening</Link></Button>
          </>
        }
      />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((k) => (
            <div key={k.label} className="kpi-card pl-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</span>
                <k.icon className="h-4 w-4 text-primary/70" />
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.delta} vs yesterday</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Screening Volume Trend</h3>
                <p className="text-xs text-muted-foreground">Last 7 days — total screenings and matches detected</p>
              </div>
              <StatusPill variant="info" dot={false}><TrendingUp className="h-3 w-3" /> +8.2%</StatusPill>
            </div>
            <div className="h-80">
              <ResponsiveContainer>
                <AreaChart data={volumeTrend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="screenings" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="matches" stroke="var(--color-chart-2)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Recent Activity</h3>
                <p className="text-xs text-muted-foreground">Live operational feed</p>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <ol className="space-y-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className={`mt-1 status-dot shrink-0 ${a.severity === "high" ? "bg-destructive" : a.severity === "med" ? "bg-warning" : "bg-success"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm leading-snug">{a.text}</div>
                    <div className="text-xs text-muted-foreground">{a.time}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
