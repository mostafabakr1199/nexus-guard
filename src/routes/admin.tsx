import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — Finaira" }] }),
  component: AdminPage,
});

const users = [
  { name: "Sarah Whitmore", email: "s.whitmore@finaira.io", role: "L2 Analyst", status: "Active" },
  { name: "Adaeze Okafor", email: "a.okafor@finaira.io", role: "MLRO", status: "Active" },
  { name: "Mio Tanaka", email: "m.tanaka@finaira.io", role: "L1 Analyst", status: "Active" },
  { name: "Luis Rosales", email: "l.rosales@finaira.io", role: "L1 Analyst", status: "Active" },
  { name: "Rikard Bergström", email: "r.bergstrom@finaira.io", role: "L2 Analyst", status: "Active" },
  { name: "James Patel", email: "j.patel@finaira.io", role: "Admin", status: "Pending" },
];

function AdminPage() {
  const [clear, setClear] = useState(70);
  const [escalate, setEscalate] = useState(86);
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Administration" description="Manage thresholds, users, roles, and data sources." />
      <div className="flex-1 p-6">
        <Tabs defaultValue="thresholds">
          <TabsList>
            <TabsTrigger value="thresholds">Screening Thresholds</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="sources">Screening Sources</TabsTrigger>
            <TabsTrigger value="api">API Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="thresholds" className="mt-4">
            <Card className="p-6">
              <h3 className="font-semibold">Risk Score Thresholds</h3>
              <p className="text-sm text-muted-foreground">Define how AI scores map to compliance outcomes.</p>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <ThresholdBand label="Clear" range={`0 – ${clear}`} variant="success" />
                <ThresholdBand label="Potential Match" range={`${clear + 1} – ${escalate}`} variant="warning" />
                <ThresholdBand label="Auto-Escalate" range={`${escalate + 1} – 100`} variant="destructive" />
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><Label>Clear ceiling</Label><span className="font-mono">{clear}</span></div>
                  <Slider value={[clear]} max={100} step={1} onValueChange={(v) => setClear(Math.min(v[0], escalate - 1))} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><Label>Escalation threshold</Label><span className="font-mono">{escalate}</span></div>
                  <Slider value={[escalate]} max={100} step={1} onValueChange={(v) => setEscalate(Math.max(v[0], clear + 1))} />
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t pt-5">
                <ToggleRow label="Auto-close confirmed false positives" defaultChecked />
                <ToggleRow label="Require dual approval for L2 escalation" defaultChecked />
                <ToggleRow label="Enable AI-suggested decisions in queue" defaultChecked />
              </div>

              <div className="mt-6 flex justify-end gap-2"><Button variant="outline">Reset</Button><Button>Save Configuration</Button></div>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <Card>
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-semibold">Users</h3>
                <Button size="sm">Invite User</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell><StatusPill variant={u.status === "Active" ? "success" : "warning"}>{u.status}</StatusPill></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost">Edit</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="mt-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Connected Screening Sources</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {["OFAC SDN", "UN Consolidated", "EU Sanctions", "UK HMT", "World Bank Debarred", "Dow Jones PEP", "ComplyAdvantage Media", "Refinitiv World-Check"].map((s) => (
                  <div key={s} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{s}</div>
                      <div className="text-xs text-muted-foreground">Refresh: every 15 minutes</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-4">
            <Card className="p-6">
              <h3 className="font-semibold">API Integrations</h3>
              <p className="text-sm text-muted-foreground">Programmatic access to the Finaira Screening API.</p>
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-xs">Production API Key</Label>
                  <Input readOnly defaultValue="fnra_live_••••••••••••••••••••a8f2" className="mt-1 font-mono" />
                </div>
                <div>
                  <Label className="text-xs">Webhook Endpoint</Label>
                  <Input defaultValue="https://core.bank.example/hooks/finaira" className="mt-1 font-mono" />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Stat label="Requests (24h)" value="184,221" />
                  <Stat label="Avg Latency" value="412 ms" />
                  <Stat label="Error Rate" value="0.04%" />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ThresholdBand({ label, range, variant }: { label: string; range: string; variant: "success" | "warning" | "destructive" }) {
  return (
    <div className={`rounded-lg border p-4 ${variant === "success" ? "border-success/30 bg-success/5" : variant === "warning" ? "border-warning/40 bg-warning/5" : "border-destructive/30 bg-destructive/5"}`}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{range}</div>
    </div>
  );
}
function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
