import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/watchlists")({
  head: () => ({ meta: [{ title: "Watchlists — Nexus Guard" }] }),
  component: Watchlists,
});

const regulatoryLists = [
  { name: "Egypt Terrorism Watchlist", updated: "17 May 2026", entries: 1240 },
  { name: "OFAC May 2026", updated: "01 May 2026", entries: 18620 },
];

function Watchlists() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Watchlist Management" description="Regulatory feeds and internal blacklists used for screening." />
      <div className="flex-1 p-6">
        <Tabs defaultValue="regulatory">
          <TabsList>
            <TabsTrigger value="regulatory">Regulatory Watchlists</TabsTrigger>
            <TabsTrigger value="internal">Internal Blacklist</TabsTrigger>
          </TabsList>

          <TabsContent value="regulatory" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              {regulatoryLists.map((r) => (
                <Card key={r.name} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.name}</span>
                    <StatusPill variant="success">Active</StatusPill>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Last updated: {r.updated}</p>
                  <div className="mt-3 flex justify-between text-xs">
                    <span className="text-muted-foreground">Entries</span>
                    <span className="font-medium tabular-nums">{r.entries.toLocaleString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="internal" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead><TableHead>Entity</TableHead><TableHead>Type</TableHead>
                    <TableHead>Country</TableHead><TableHead>Reason</TableHead><TableHead>Added By</TableHead><TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Inbox className="h-8 w-8" />
                        <div className="text-sm font-medium">No entries in the internal blacklist</div>
                        <div className="text-xs">Internal entries added here would appear in this list.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
