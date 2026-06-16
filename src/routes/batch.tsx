import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { UploadCloud, Download, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/batch")({
  head: () => ({ meta: [{ title: "Batch Screening — Finaira" }] }),
  component: BatchPage,
});

const sample = [
  { id: 1, name: "Acme Holdings Ltd", country: "US", status: "Clear", score: 12 },
  { id: 2, name: "Volkov, Maria H.", country: "RU", status: "Potential", score: 76 },
  { id: 3, name: "Nordwind Energy GmbH", country: "DE", status: "Clear", score: 8 },
  { id: 4, name: "Yermekov, Alibek N.", country: "KZ", status: "Likely", score: 94 },
  { id: 5, name: "Sahel Resources Holding", country: "ML", status: "Potential", score: 71 },
  { id: 6, name: "Jiang Wei Industries", country: "CN", status: "Clear", score: 22 },
  { id: 7, name: "Polaris Trading SA", country: "PA", status: "Potential", score: 68 },
  { id: 8, name: "Atlas Maritime Ltd", country: "GR", status: "Likely", score: 88 },
];

function BatchPage() {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Batch Screening"
        description="Screen thousands of customers in a single upload. CSV or XLSX."
        actions={uploaded ? <Button size="sm" variant="outline"><Download className="h-4 w-4" /> Export Results</Button> : null}
      />
      <div className="flex-1 space-y-5 p-6">
        {!uploaded ? (
          <Card className="border-dashed">
            <div
              className="flex flex-col items-center justify-center gap-3 p-16 text-center cursor-pointer"
              onClick={() => setUploaded(true)}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10">
                <UploadCloud className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Drag and drop your CSV file here</p>
                <p className="text-sm text-muted-foreground">or click to browse — max 100,000 rows</p>
              </div>
              <Button size="sm">Select File</Button>
              <p className="mt-2 text-xs text-muted-foreground">Required columns: name, dob, country, id_number</p>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Records Uploaded", value: "4,210", tone: "info" },
                { label: "Processed", value: "4,210", tone: "info" },
                { label: "Matches Found", value: "187", tone: "warning" },
                { label: "Failed Records", value: "3", tone: "destructive" },
              ].map((s) => (
                <div key={s.label} className="kpi-card">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                  <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                </div>
              ))}
            </div>
            <Card className="p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" /> customers_q2_2026.csv</span>
                <span className="text-muted-foreground">100% complete • 38s</span>
              </div>
              <Progress value={100} className="mt-3" />
            </Card>
            <Card>
              <div className="border-b p-4">
                <h3 className="font-semibold">Sample of Results</h3>
                <p className="text-xs text-muted-foreground">Showing 8 of 4,210 records</p>
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
                  {sample.map((r) => (
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
          </>
        )}
      </div>
    </div>
  );
}
