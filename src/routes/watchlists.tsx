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
  head: () => ({ meta: [{ title: "Watchlists — Finaira" }] }),
  component: Watchlists,
});

function Watchlists() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Watchlist Management"
        description="Internal blacklists, high-risk customers, and regulatory watchlists."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Add Entity</Button>}
      />
      <div className="flex-1 p-6">
        <Tabs defaultValue="internal">
          <TabsList>
            <TabsTrigger value="internal">Internal Blacklist</TabsTrigger>
            <TabsTrigger value="highrisk">High Risk Customers</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory Watchlists</TabsTrigger>
          </TabsList>

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

          <TabsContent value="highrisk" className="mt-4">
            <Card className="p-8 text-center text-sm text-muted-foreground">
              412 high-risk customers tracked. Risk recomputed nightly.
            </Card>
          </TabsContent>
          <TabsContent value="regulatory" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {["OFAC SDN", "UN Consolidated", "EU Sanctions", "UK HMT", "World Bank Debarred", "FATF Grey List"].map((r) => (
                <Card key={r} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r}</span>
                    <StatusPill variant="success">Active</StatusPill>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Last sync: 4 minutes ago</p>
                  <div className="mt-3 flex justify-between text-xs">
                    <span className="text-muted-foreground">Entries</span>
                    <span className="font-medium tabular-nums">{(Math.random() * 30000 + 5000).toFixed(0)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
