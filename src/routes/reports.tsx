import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Nexus Guard" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Reports" description="Generate scheduled or ad-hoc compliance reports." />
      <div className="flex-1 space-y-6 p-6">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">Screening Summary Report</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Volume, match rate, throughput by day/week/month.
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline"><FileText className="h-3.5 w-3.5" /> Export PDF</Button>
                <Button size="sm" variant="outline"><FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel</Button>
                <Button size="sm">Generate</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Recent Reports</h3>
          <ul className="mt-3 divide-y">
            {[
              { name: "Screening Summary — June W2 2026", by: "Auto-generated", date: "2026-06-14" },
              { name: "Screening Summary — June W1 2026", by: "S. Whitmore", date: "2026-06-07" },
              { name: "Screening Summary — May 2026", by: "Auto-generated", date: "2026-06-01" },
            ].map((r) => (
              <li key={r.name} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">By {r.by} • {r.date}</div>
                </div>
                <Button size="sm" variant="ghost">Download</Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
