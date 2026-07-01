import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/StatusPill";
import { UploadCloud, Download, FileSpreadsheet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/screening")({
  head: () => ({ meta: [{ title: "Customer Screening — Nexus Guard" }] }),
  component: Screening,
});

function Screening() {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Customer Screening"
        description="Upload a bulk customer file to screen against sanctions, PEP, watchlists, and adverse media."
      />
      <div className="flex-1 p-6">
        <Card className="mx-auto max-w-5xl p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Bulk Upload</h2>
            <p className="text-sm text-muted-foreground">Upload a CSV or XLSX with your customer records.</p>
          </div>

          {!uploaded ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-16 text-center cursor-pointer transition hover:border-primary/40 hover:bg-primary/[0.03]"
              onClick={() => setUploaded(true)}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10">
                <UploadCloud className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Drop your CSV or XLSX here</p>
                <p className="text-sm text-muted-foreground">or click to browse — max 100,000 rows</p>
              </div>
              <Button size="sm">Select File</Button>
              <p className="mt-2 text-xs text-muted-foreground">Required columns: name, dob, country, id_number</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "Records Uploaded", value: "4,210" },
                  { label: "Processed", value: "4,210" },
                  { label: "Matches Found", value: "187" },
                  { label: "Failed Records", value: "3" },
                ].map((s) => (
                  <div key={s.label} className="kpi-card pl-5">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                    <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
              <Card className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-primary" /> customers_q2_2026.csv</span>
                  <span className="text-muted-foreground">100% complete • 38s</span>
                </div>
                <Progress value={100} className="mt-3" />
              </Card>
              <Card>
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <h3 className="font-semibold">Sample of Results</h3>
                    <p className="text-xs text-muted-foreground">Showing 8 of 4,210 records</p>
                  </div>
                  <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5" /> Export</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 1, name: "Acme Holdings Ltd", country: "US", status: "Clear", score: 12 },
                      { id: 2, name: "Volkov, Maria H.", country: "RU", status: "Potential", score: 76 },
                      { id: 3, name: "Nordwind Energy GmbH", country: "DE", status: "Clear", score: 8 },
                      { id: 4, name: "Mohamed Ahmed Sayed Ahmed", country: "EG", status: "Likely", score: 91 },
                      { id: 5, name: "Sahel Resources Holding", country: "ML", status: "Potential", score: 71 },
                      { id: 6, name: "Jiang Wei Industries", country: "CN", status: "Clear", score: 22 },
                      { id: 7, name: "Polaris Trading SA", country: "PA", status: "Potential", score: 68 },
                      { id: 8, name: "Atlas Maritime Ltd", country: "GR", status: "Likely", score: 88 },
                    ].map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-muted-foreground">{r.id}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.country}</TableCell>
                        <TableCell className="tabular-nums font-semibold">{r.score}</TableCell>
                        <TableCell>
                          <StatusPill variant={r.status === "Clear" ? "success" : r.status === "Potential" ? "warning" : "destructive"}>
                            {r.status}
                          </StatusPill>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setUploaded(false)}>Upload Another</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
