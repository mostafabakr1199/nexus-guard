import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — Nexus Guard" }] }),
  component: AdminPage,
});

const users = [
  { name: "Sarah Whitmore", email: "s.whitmore@nexusguard.io", role: "Sanctions Manager", status: "Active" },
  { name: "Adaeze Okafor", email: "a.okafor@nexusguard.io", role: "Sanctions Analyst", status: "Active" },
  { name: "Mio Tanaka", email: "m.tanaka@nexusguard.io", role: "Sanctions Analyst", status: "Active" },
  { name: "Luis Rosales", email: "l.rosales@nexusguard.io", role: "Sanctions Analyst", status: "Active" },
  { name: "Rikard Bergström", email: "r.bergstrom@nexusguard.io", role: "Sanctions Manager", status: "Active" },
];

function AdminPage() {
  const [clearance, setClearance] = useState(true);
  const [critical, setCritical] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Administration" description="Manage thresholds, users, and roles." />
      <div className="flex-1 p-6">
        <Tabs defaultValue="thresholds">
          <TabsList>
            <TabsTrigger value="thresholds">Screening Thresholds</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="thresholds" className="mt-4">
            <Card className="p-6">
              <h3 className="font-semibold">Risk Score Thresholds</h3>
              <p className="text-sm text-muted-foreground">Fixed bands mapping risk scores to compliance outcomes.</p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <ThresholdBand label="Clear" range="0 – 75" variant="success" description="Auto-clear. No analyst review required." />
                <ThresholdBand label="Potential Match (High)" range="75 – 90" variant="warning" description="Routed to analyst review queue." />
                <ThresholdBand label="Auto-Escalate (Critical)" range="91 – 100" variant="destructive" description="Auto-escalated to Sanctions Manager." />
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <Label className="text-sm font-semibold">Auto-Clearance</Label>
                    <p className="text-xs text-muted-foreground">Automatically clear cases scoring below 75.</p>
                  </div>
                  <Switch checked={clearance} onCheckedChange={setClearance} />
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <Label className="text-sm font-semibold">Auto-Escalate Critical</Label>
                    <p className="text-xs text-muted-foreground">Automatically escalate cases scoring 91 or above.</p>
                  </div>
                  <Switch checked={critical} onCheckedChange={setCritical} />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Configuration</Button>
              </div>
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
                      <TableCell><StatusPill variant="success">{u.status}</StatusPill></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost">Edit</Button></TableCell>
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

function ThresholdBand({ label, range, variant, description }: { label: string; range: string; variant: "success" | "warning" | "destructive"; description: string }) {
  return (
    <div className={`rounded-lg border p-4 ${variant === "success" ? "border-success/30 bg-success/5" : variant === "warning" ? "border-warning/40 bg-warning/5" : "border-destructive/30 bg-destructive/5"}`}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{range}</div>
      <div className="mt-2 text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
