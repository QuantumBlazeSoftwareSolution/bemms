import { getAllTasks } from "@/lib/db/crud/tasks/read";
import { getAssetById } from "@/lib/db/crud/assets/read";
import { getUserById } from "@/lib/db/crud/users/read";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";

export default async function MaintenancePage() {
  const dbTasks = await getAllTasks();

  // Resolve all relationships (Asset & Technician names)
  const resolvedTasks = await Promise.all(
    dbTasks.map(async (task) => {
      const asset = await getAssetById(task.assetId);
      let techName = "Unassigned";
      
      if (task.technicianId) {
        const user = await getUserById(task.technicianId);
        if (user) techName = user.name;
      }

      return {
        ...task,
        assetName: asset ? asset.name : "Unknown Machine",
        technician: techName,
      };
    })
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
      case "CRITICAL":
        return <Badge variant="destructive">{priority}</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500 hover:bg-amber-600">{priority}</Badge>;
      default:
        return <Badge className="bg-slate-500 hover:bg-slate-600">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "IN_PROGRESS":
        return <PlayCircle className="w-4 h-4 text-primary" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Maintenance Scheduler</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage preventive maintenance and repairs.
          </p>
        </div>
        <Link href="/fault-report">
          <Button className="flex items-center gap-2 shadow-sm">
            <CalendarIcon className="w-4 h-4" /> Schedule Repair / Task
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-600">Task ID</TableHead>
              <TableHead className="font-semibold text-slate-600">Asset</TableHead>
              <TableHead className="font-semibold text-slate-600">Type</TableHead>
              <TableHead className="font-semibold text-slate-600">Technician</TableHead>
              <TableHead className="font-semibold text-slate-600">Date</TableHead>
              <TableHead className="font-semibold text-slate-600">Priority</TableHead>
              <TableHead className="font-semibold text-slate-600 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resolvedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No active maintenance tasks scheduled.
                </TableCell>
              </TableRow>
            ) : (
              resolvedTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-900">{task.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{task.assetName}</div>
                    <div className="text-xs text-slate-500">{task.assetId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-slate-600 bg-slate-50">
                      {task.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{task.technician}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{task.scheduledDate}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {task.status.replace("_", " ").toLowerCase()}
                      </span>
                      {getStatusIcon(task.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
