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
} from "@/components/ui/sidebar"
import { Activity, LayoutDashboard, Settings, Wrench, Users, Stethoscope, AlertTriangle, LogOut } from "lucide-react"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Stethoscope className="w-6 h-6" />
          <span>BEMMS</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Biomedical Equipment Maintenance</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <a href="/dashboard">
                  <SidebarMenuButton>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <a href="/assets">
                  <SidebarMenuButton>
                    <Activity />
                    <span>Asset Management</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <a href="/maintenance">
                  <SidebarMenuButton>
                    <Wrench />
                    <span>Maintenance</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <a href="/team">
                  <SidebarMenuButton>
                    <Users />
                    <span>Technicians</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <a href="/fault-report">
                  <SidebarMenuButton>
                    <AlertTriangle className="text-destructive" />
                    <span className="text-destructive font-medium">Report Fault</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-muted-foreground hover:text-slate-800 cursor-pointer transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </div>
        <a href="/login" className="flex items-center gap-2 mt-3 text-destructive/70 hover:text-destructive transition-colors cursor-pointer">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  )
}
