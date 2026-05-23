"use client"

import { usePathname, useRouter } from "next/navigation"
import { signOutAction, getCurrentUserAction } from "@/lib/actions/auth"
import { useEffect, useState } from "react"
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
import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
  Wrench,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"

interface NavItem {
  href: string;
  label: string;
  icon: any;
  danger?: boolean;
}

const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Asset Management", icon: Activity },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/team", label: "Technicians", icon: Users },
  { href: "/fault-report", label: "Report Fault", icon: AlertTriangle, danger: true },
]

const technicianNav: NavItem[] = [
  { href: "/technician/dashboard", label: "My Workspace", icon: LayoutDashboard },
  { href: "/technician/assets", label: "Equipment List", icon: Activity },
  { href: "/technician/maintenance", label: "My Tasks", icon: ClipboardList },
]

const clinicalNav: NavItem[] = [
  { href: "/clinic/dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { href: "/fault-report", label: "Report a Fault", icon: AlertTriangle, danger: true },
  { href: "/clinic/submissions", label: "My Submissions", icon: ClipboardList },
]

// ─── Role detection ──────────────────────────────────────────────────────────

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
  const router = useRouter()
  
  // Initial fallback guess based on URL
  const pathnameRole = pathname.startsWith("/technician") ? "technician" :
                       pathname.startsWith("/clinic") ? "clinical" : "admin";
                       
  const [role, setRole] = useState<"admin" | "technician" | "clinical">(pathnameRole)

  useEffect(() => {
    async function loadUserRole() {
      try {
        const user = await getCurrentUserAction()
        if (user) {
          setRole(user.role.toLowerCase() as "admin" | "technician" | "clinical")
        }
      } catch (err) {
        console.error("Failed to load user role in sidebar:", err)
      }
    }
    loadUserRole()
  }, [pathname])

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
          <img src="/logo.png" alt="BEMMS Logo" className="w-7 h-7 rounded-md object-cover border border-slate-200 shadow-sm" />
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
