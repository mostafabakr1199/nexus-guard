import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  ScanSearch, Briefcase, ListChecks, ScrollText, FileBarChart2, Settings,
  ShieldCheck, LayoutDashboard, ClipboardList, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useApp, type Role } from "@/lib/store";
import { Button } from "@/components/ui/button";

type NavItem = { label: string; to: string; icon: typeof ScanSearch; roles: Role[] };

const nav: NavItem[] = [
  { label: "Executive Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["manager"] },
  { label: "My Cases", to: "/my-cases", icon: ClipboardList, roles: ["analyst"] },
  { label: "All Cases", to: "/cases", icon: Briefcase, roles: ["manager"] },
  { label: "Screening", to: "/screening", icon: ScanSearch, roles: ["manager", "analyst"] },
  { label: "Watchlists", to: "/watchlists", icon: ListChecks, roles: ["manager", "analyst"] },
  { label: "Audit Trail", to: "/audit", icon: ScrollText, roles: ["manager"] },
  { label: "Reports", to: "/reports", icon: FileBarChart2, roles: ["manager"] },
  { label: "Administration", to: "/admin", icon: Settings, roles: ["manager"] },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useApp();
  const navigate = useNavigate();
  if (!user) return null;

  const items = nav.filter((n) => n.roles.includes(user.role));

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
              {items.map((item) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
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
        <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:hidden">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1 text-xs">
            <div className="truncate font-medium text-sidebar-foreground">{user.name}</div>
            <div className="truncate text-sidebar-foreground/60 capitalize">Sanctions {user.role}</div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { logout(); navigate({ to: "/login", replace: true }); }} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
