import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Nexus Guard" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const router = useRouter();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user) navigate({ to: user.role === "manager" ? "/dashboard" : "/my-cases", replace: true });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = login(u, p);
    if (!r.ok) { setErr(r.error ?? "Login failed"); return; }
    router.invalidate();
  };

  const fill = (role: "analyst" | "manager") => { setU(role); setP(role); };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold">Nexus Guard</div>
            <div className="text-xs text-muted-foreground">Sanctions Screening Platform</div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs">Username</Label>
            <Input value={u} onChange={(e) => setU(e.target.value)} autoFocus className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Password</Label>
            <Input type="password" value={p} onChange={(e) => setP(e.target.value)} className="mt-1" />
          </div>
          {err && <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{err}</div>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>

        <div className="mt-6 rounded-md border bg-muted/40 p-3 text-xs">
          <div className="mb-2 font-semibold text-foreground">Demo credentials</div>
          <div className="grid gap-2">
            <button type="button" onClick={() => fill("analyst")} className="flex items-center justify-between rounded border bg-background p-2 text-left hover:border-primary/40">
              <span><span className="font-medium">Sanctions Analyst</span> — <span className="font-mono">analyst / analyst</span></span>
              <span className="text-primary">Use</span>
            </button>
            <button type="button" onClick={() => fill("manager")} className="flex items-center justify-between rounded border bg-background p-2 text-left hover:border-primary/40">
              <span><span className="font-medium">Sanctions Manager</span> — <span className="font-mono">manager / manager</span></span>
              <span className="text-primary">Use</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
