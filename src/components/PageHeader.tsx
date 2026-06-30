import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex h-14 items-center gap-2 px-4">
        <SidebarTrigger />
        <div className="ml-2 hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Compliance</span>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search cases, customers, lists…" className="h-8 w-72 pl-8 text-xs" />
          </div>
          <button className="relative grid h-8 w-8 place-items-center rounded-md hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">9</span>
          </button>
          <Badge variant="outline" className="hidden lg:inline-flex border-success/40 bg-success/10 text-success">
            <span className="status-dot bg-success mr-1.5" /> All sources online
          </Badge>
        </div>
      </div>
      <div className="relative px-6 pb-5 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
        <div className="gold-divider mt-4 w-24" />
      </div>
    </div>
  );
}
