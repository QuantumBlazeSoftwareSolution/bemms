import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, Clock, ShieldCheck, Stethoscope } from "lucide-react"
import { MaintenanceTrendChart, UptimeBarChart, TechnicianDonutChart } from "@/components/dashboard-charts"
import { alerts, recentActivity, technicians, assets, maintenanceTasks } from "@/lib/data"
import Link from "next/link"

export default function AdminDashboard() {
  const totalEquipment = assets.length
  const pendingMaintenance = maintenanceTasks.filter(t => t.status === "PENDING").length
  const overdueCalibrations = assets.filter(a => a.status === "OUT_OF_SERVICE").length
  const operationalCount = assets.filter(a => a.status === "OPERATIONAL").length

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Hospital equipment overview & technician performance.</p>
      </div>

      {/* Alert Banners */}
      <div className="flex flex-col gap-2">
        {alerts.map((alert, i) => (
          <Link key={i} href={alert.link}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium cursor-pointer transition-opacity hover:opacity-90 ${
              alert.type === "overdue" ? "bg-red-50 border-red-200 text-red-700" :
              alert.type === "critical" ? "bg-orange-50 border-orange-200 text-orange-700" :
              "bg-blue-50 border-blue-200 text-blue-700"
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {alert.message}
            </div>
          </Link>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Stethoscope className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
            <p className="text-xs text-muted-foreground mt-1">{operationalCount} currently operational</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue / Out of Service</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueCalibrations}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg System Uptime</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">94.6%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Maintenance Trends</CardTitle>
            <CardDescription>Monthly completed tasks vs fault reports</CardDescription>
          </CardHeader>
          <CardContent><MaintenanceTrendChart /></CardContent>
        </Card>
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current overall task breakdown</CardDescription>
          </CardHeader>
          <CardContent><TechnicianDonutChart /></CardContent>
        </Card>
      </div>

      {/* Uptime + Technician Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Department Uptime</CardTitle>
            <CardDescription>Equipment availability % by department</CardDescription>
          </CardHeader>
          <CardContent><UptimeBarChart /></CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Technician Performance</CardTitle>
              <CardDescription>Response times & task completion this month</CardDescription>
            </div>
            <Link href="/team"><Button variant="outline" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicians.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {tech.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{tech.name}</div>
                      <div className="text-xs text-slate-500">{tech.specialty}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs text-slate-500">Completed</div>
                      <div className="font-bold text-emerald-600 text-sm">{tech.completedThisMonth}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Avg Response</div>
                      <div className="font-bold text-slate-700 text-sm">{tech.avgResponseTime}</div>
                    </div>
                    <Badge variant={tech.status === "Available" ? "default" : "secondary"}
                      className={tech.status === "Available" ? "bg-emerald-500 text-xs" : "text-xs"}>
                      {tech.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-sm text-slate-800">{activity.text}</span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{activity.user}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
