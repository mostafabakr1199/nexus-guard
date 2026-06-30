import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { Plus, Edit3, Ban } from "lucide-react";
import { watchlistInternal } from "@/lib/mock-data";

export const Route = createFileRoute("/watchlists")({
  head: () => ({ meta: [{ title: "Watchlists — Nexus Guard" }] }),
  component: Watchlists,
});

const regulatoryLists = [
  { name: "OFAC SDN", entries: 18420 },
  { name: "UN Consolidated", entries: 7180 },
  { name: "EU Sanctions", entries: 12340 },
  { name: "UK HMT", entries: 9870 },
  { name: "World Bank Debarred", entries: 5210 },
  { name: "FATF Grey List", entries: 23 },
];

function Watchlists() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Watchlist Management"
        description="Regulatory feeds and internal blacklists used for screening."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Add Entity</Button>}
      />
      <div className="flex-1 p-6">
        <Tabs defaultValue="regulatory">
          <TabsList>
            <TabsTrigger value="regulatory">Regulatory Watchlists</TabsTrigger>
            <TabsTrigger value="internal">Internal Blacklist</TabsTrigger>
          </TabsList>

          <TabsContent value="regulatory" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {regulatoryLists.map((r) => (
                <Card key={r.name} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.name}</span>
                    <StatusPill variant="success">Active</StatusPill>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Last sync: 4 minutes ago</p>
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
                    <TableHead>ID</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Added By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlistInternal.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono text-xs">{w.id}</TableCell>
                      <TableCell className="font-medium">{w.name}</TableCell>
                      <TableCell><StatusPill variant="info" dot={false}>{w.type}</StatusPill></TableCell>
                      <TableCell>{w.country}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{w.reason}</TableCell>
                      <TableCell className="text-sm">{w.addedBy}</TableCell>
                      <TableCell className="text-sm">{w.date}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost"><Edit3 className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive"><Ban className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
