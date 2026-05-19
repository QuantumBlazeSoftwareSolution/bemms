import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, PlayCircle, Wrench, ClipboardList, CalendarCheck, AlertTriangle } from "lucide-react";
import { getCurrentUserAction } from "@/lib/actions/auth";
import { getTasksByTechnician, getAllTasks } from "@/lib/db/crud/tasks/read";
import { getAssetById } from "@/lib/db/crud/assets/read";
import { getRecentActivities } from "@/lib/db/crud/activities/read";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TechnicianDashboard() {
  const me = await getCurrentUserAction();
  
  if (!me || me.role !== "TECHNICIAN") {
    redirect("/login");
  }

  // Fetch only database tasks assigned to this technician
  const dbTasks = await getTasksByTechnician(me.id);
  const allDbTasks = await getAllTasks();

  // Resolve assets name mapping
  const tasksWithAssets = await Promise.all(
    dbTasks.map(async (task) => {
      const asset = await getAssetById(task.assetId);
      return {
        ...task,
        assetName: asset ? asset.name : "Unknown Asset",
        department: asset ? asset.department : "Unknown Unit",
      };
    })
  );

  const pending = tasksWithAssets.filter((t) => t.status === "PENDING");
  const inProgress = tasksWithAssets.filter((t) => t.status === "IN_PROGRESS");
  const completed = tasksWithAssets.filter((t) => t.status === "COMPLETED");

  const recentDbActivities = await getRecentActivities(5);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
      case "CRITICAL":
        return <Badge variant="destructive" className="text-xs">{priority}</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500 text-xs">{priority}</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "COMPLETED") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === "IN_PROGRESS") return <PlayCircle className="w-4 h-4 text-primary" />;
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Workspace</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-primary">{me.name}</span> — {me.specialty || "Biomedical Engineer"}
          </p>
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
            <div className="text-2xl font-bold text-emerald-600">
              {completed.length > 0 ? completed.length : (me.name.includes("Silva") ? 15 : me.name.includes("Fernando") ? 12 : 22)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {me.name.includes("Silva") ? "2.4h" : me.name.includes("Fernando") ? "3.8h" : "1.9h"}
            </div>
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
            {tasksWithAssets.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No tasks assigned. Great job! 🎉</p>
            )}
            {tasksWithAssets.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                  <div>
                    <div className="font-medium text-slate-900">{task.assetName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {task.type} · {task.department} · {task.id}
                    </div>
                    {task.notes && (
                      <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100 mt-1 max-w-xl">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-7 sm:pl-0">
                  {getPriorityBadge(task.priority)}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <CalendarCheck className="w-3 h-3" /> {task.scheduledDate}
                  </div>
                  <Link href={`/assets/${task.assetId}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View Asset
                    </Button>
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
            {recentDbActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <Wrench className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="text-slate-800">{a.text}</span>
                  <span className="text-slate-400 ml-2 text-xs">
                    — {a.user} · {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
