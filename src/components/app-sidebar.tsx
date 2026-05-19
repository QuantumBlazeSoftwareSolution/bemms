"use client"

import { usePathname, useRouter } from "next/navigation"
import { signOutAction } from "@/lib/actions/auth"
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
  Wrench,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"

// ─── Nav config per role ────────────────────────────────────────────────────

const adminNav = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Asset Management", icon: Activity },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/team", label: "Technicians", icon: Users },
  { href: "/fault-report", label: "Report Fault", icon: AlertTriangle, danger: true },
]

const technicianNav = [
  { href: "/dashboard/technician", label: "My Workspace", icon: LayoutDashboard },
  { href: "/assets", label: "Equipment List", icon: Activity },
  { href: "/maintenance", label: "My Tasks", icon: ClipboardList },
  { href: "/fault-report", label: "Report Fault", icon: AlertTriangle, danger: true },
]

const clinicalNav = [
  { href: "/dashboard/clinical", label: "My Dashboard", icon: LayoutDashboard },
  { href: "/fault-report", label: "Report a Fault", icon: AlertTriangle, danger: true },
  { href: "/dashboard/clinical", label: "My Submissions", icon: ClipboardList },
]

// ─── Role detection ──────────────────────────────────────────────────────────

function useRole(pathname: string) {
  if (pathname.startsWith("/dashboard/technician")) return "technician"
  if (pathname.startsWith("/dashboard/clinical")) return "clinical"
  return "admin"
}

const roleLabel = {
  admin: "Administrator",
  technician: "Biomedical Engineer",
  clinical: "Clinical User",
}

const roleBadgeColor = {
  admin: "bg-primary/10 text-primary",
  technician: "bg-amber-100 text-amber-700",
  clinical: "bg-emerald-100 text-emerald-700",
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname()
  const role = useRole(pathname)
  const router = useRouter()

  const handleLogout = async () => {
    await signOutAction();
    router.push("/login");
    router.refresh();
  }

  const navItems =
    role === "technician" ? technicianNav :
    role === "clinical" ? clinicalNav :
    adminNav

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Stethoscope className="w-6 h-6" />
          <span>BEMMS</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Biomedical Equipment Maintenance</p>
        {/* Role badge */}
        <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md text-xs font-medium w-fit ${roleBadgeColor[role]}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          {roleLabel[role]}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href + item.label}>
                    <Link href={item.href} className="w-full">
                      <SidebarMenuButton
                        className={`w-full ${isActive ? "bg-primary/10 text-primary font-semibold" : ""} ${item.danger ? "text-destructive hover:text-destructive hover:bg-destructive/5" : ""}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Dev Role Switcher ──────────────────────────────── */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5 text-amber-600">
            <FlaskConical className="w-3 h-3" />
            Dev
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton className="w-full text-amber-700 hover:bg-amber-50 hover:text-amber-800" />
                    }
                  >
                    <Users className="w-4 h-4" />
                    <span>Role Preview</span>
                    <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          href="/dashboard/admin"
                          className={pathname.startsWith("/dashboard/admin") ? "text-primary font-semibold" : ""}
                        >
                          Admin
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          href="/dashboard/technician"
                          className={pathname.startsWith("/dashboard/technician") ? "text-primary font-semibold" : ""}
                        >
                          Technician
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          href="/dashboard/clinical"
                          className={pathname.startsWith("/dashboard/clinical") ? "text-primary font-semibold" : ""}
                        >
                          Clinical
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-muted-foreground hover:text-slate-800 cursor-pointer transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 mt-3 text-destructive/70 hover:text-destructive transition-colors cursor-pointer text-left bg-transparent border-0 p-0"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
