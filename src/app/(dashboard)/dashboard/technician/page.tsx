import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, PlayCircle, Wrench, ClipboardList, CalendarCheck } from "lucide-react"
import { myAssignedTasks, technicians, recentActivity } from "@/lib/data"
import Link from "next/link"

export default function TechnicianDashboard() {
  // Simulate logged-in technician
  const me = technicians[0] // Silva A.
  const pending = myAssignedTasks.filter(t => t.status === "PENDING")
  const inProgress = myAssignedTasks.filter(t => t.status === "IN_PROGRESS")

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH": case "CRITICAL": return <Badge variant="destructive" className="text-xs">{priority}</Badge>
      case "MEDIUM": return <Badge className="bg-amber-500 text-xs">{priority}</Badge>
      default: return <Badge variant="secondary" className="text-xs">{priority}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "COMPLETED") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    if (status === "IN_PROGRESS") return <PlayCircle className="w-4 h-4 text-primary" />
    return <Clock className="w-4 h-4 text-slate-400" />
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Workspace</h1>
          <p className="text-muted-foreground mt-1">Welcome back, <span className="font-semibold text-primary">{me.name}</span> — {me.specialty}</p>
        </div>
        <Link href="/maintenance">
          <Button className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Log Service
          </Button>
        </Link>
      </div>

      {/* My Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pending.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inProgress.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Completed (Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{me.completedThisMonth}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{me.avgResponseTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Tasks */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>My Assigned Tasks</CardTitle>
          <CardDescription>Tasks currently allocated to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myAssignedTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No tasks assigned. Great job! 🎉</p>
            )}
            {myAssignedTasks.map((task) => (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                  <div>
                    <div className="font-medium text-slate-900">{task.assetName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{task.type} · {task.department} · {task.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-7 sm:pl-0">
                  {getPriorityBadge(task.priority)}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <CalendarCheck className="w-3 h-3" /> {task.scheduledDate}
                  </div>
                  <Link href={`/assets/${task.assetId}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">View Asset</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent system activity */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest updates from the team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <Wrench className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="text-slate-800">{a.text}</span>
                  <span className="text-slate-400 ml-2 text-xs">— {a.user} · {a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
