import { Link, useRouterState } from "@tanstack/react-router";
import {
  ScanSearch,
  Briefcase,
  ListChecks,
  ScrollText,
  FileBarChart2,
  Settings,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const nav = [
  { label: "Screening", to: "/screening", icon: ScanSearch },
  { label: "Cases", to: "/cases", icon: Briefcase },
  { label: "Watchlists", to: "/watchlists", icon: ListChecks },
  { label: "Audit Trail", to: "/audit", icon: ScrollText },
  { label: "Reports", to: "/reports", icon: FileBarChart2 },
  { label: "Administration", to: "/admin", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">Nexus Guard</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">Compliance Intelligence</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar-primary/90 text-xs font-semibold text-sidebar-primary-foreground">
            SW
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-xs font-medium text-sidebar-foreground">Sarah Whitmore</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">L2 Compliance Analyst</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
