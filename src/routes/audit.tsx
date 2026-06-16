import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { auditLog } from "@/lib/mock-data";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Trail — Finaira" }] }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Audit Trail"
        description="Immutable record of every action across the screening platform."
        actions={<Button size="sm" variant="outline"><Download className="h-4 w-4" /> Export</Button>}
      />
      <div className="flex-1 space-y-4 p-6">
        <Card className="p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Input placeholder="Search user, entity…" />
            <Input type="date" />
            <Select defaultValue="all"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="Case Escalated">Case Escalated</SelectItem>
                <SelectItem value="Screening Run">Screening Run</SelectItem>
                <SelectItem value="Match Reviewed">Match Reviewed</SelectItem>
                <SelectItem value="Watchlist Sync">Watchlist Sync</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="a.okafor">a.okafor</SelectItem>
                <SelectItem value="s.whitmore">s.whitmore</SelectItem>
                <SelectItem value="system">system</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Before</TableHead>
                <TableHead>After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((a, i) => (
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
