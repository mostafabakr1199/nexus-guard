import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Trail — Nexus Guard" }] }),
  component: AuditPage,
});

function AuditPage() {
  const { audit } = useApp();
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Audit Trail"
        description="Immutable record of every action across the screening platform."
        actions={<Button size="sm" variant="outline"><Download className="h-4 w-4" /> Export</Button>}
      />
      <div className="flex-1 space-y-4 p-6">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead>
                <TableHead>Entity</TableHead><TableHead>Before</TableHead><TableHead>After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audit.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{a.ts}</TableCell>
                  <TableCell><span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{a.user}</span></TableCell>
                  <TableCell className="font-medium">{a.action}</TableCell>
                  <TableCell className="font-mono text-xs">{a.entity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.before}</TableCell>
                  <TableCell className="text-sm">{a.after}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
