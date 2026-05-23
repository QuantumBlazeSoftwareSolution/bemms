"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Wrench, 
  AlertTriangle, 
  Play, 
  FileText,
  Clock3,
  Settings,
  Sparkles
} from "lucide-react";
import { updateTaskStatusAction, completeTaskAction } from "@/lib/actions/tasks";
import Link from "next/link";

interface Task {
  id: string;
  assetId: string;
  technicianId: string | null;
  type: "REPAIR" | "CALIBRATION" | "PREVENTIVE";
  scheduledDate: string;
  completedDate: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  notes: string | null;
  timeSpent: string | null;
  spareParts: string | null;
  costSaved: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  assetName: string;
  department: string;
  images: string[];
  faultDescription: string;
}

interface TechnicianTasksClientProps {
  initialTasks: Task[];
}

export function TechnicianTasksClient({ initialTasks }: TechnicianTasksClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  
  // Log Service Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [serviceNotes, setServiceNotes] = useState("");
  const [timeSpent, setTimeSpent] = useState("1.5 hours");
  const [spareParts, setSpareParts] = useState("");
  const [costSaved, setCostSaved] = useState("12500");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const router = useRouter();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "ALL") return true;
      return task.status === filter;
    });
  }, [tasks, filter]);

  const handleStartWork = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      const res = await updateTaskStatusAction(taskId, "IN_PROGRESS");
      if (res.success) {
        // Optimistically update status
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: "IN_PROGRESS" } : t))
        );
        router.refresh();
      } else {
        alert(res.error || "Failed to start task.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleOpenCompleteModal = (task: Task) => {
    setActiveTask(task);
    setServiceNotes(`Successful ${task.type.toLowerCase()} service performed on ${task.assetName}. Operational parameters verified.`);
    setSpareParts("");
    setCostSaved(task.type === "CALIBRATION" ? "20000" : "15000");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCompleteTask = async () => {
    if (!activeTask) return;
    if (!serviceNotes.trim()) {
      setModalError("Please provide service notes describing the work done.");
      return;
    }

    setModalLoading(true);
    setModalError("");

    try {
      const costVal = parseFloat(costSaved) || 0;
      const res = await completeTaskAction(
        activeTask.id,
        serviceNotes,
        timeSpent,
        spareParts,
        costVal
      );

      if (res.success) {
        // Update task list state
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeTask.id
              ? {
                  ...t,
                  status: "COMPLETED",
                  notes: serviceNotes,
                  timeSpent,
                  spareParts: spareParts || "None",
                  costSaved: costVal,
                }
              : t
          )
        );
        setIsModalOpen(false);
        router.refresh();
      } else {
        setModalError(res.error || "Failed to complete task.");
      }
    } catch (err: any) {
      setModalError(err.message || "An unexpected error occurred.");
    } finally {
      setModalLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
      case "CRITICAL":
        return <Badge variant="destructive" className="text-xs">{priority}</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">{priority}</Badge>;
      default:
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white text-xs">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "IN_PROGRESS":
        return <PlayCircle className="w-4 h-4 text-primary animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Filters Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <span className="text-sm font-semibold text-slate-700">Filter Assigned Tasks:</span>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ALL")}
            className="text-xs"
          >
            All Work ({tasks.length})
          </Button>
          <Button
            variant={filter === "PENDING" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("PENDING")}
            className="text-xs text-slate-600 border-slate-200 bg-white"
          >
            Pending ({tasks.filter(t => t.status === "PENDING").length})
          </Button>
          <Button
            variant={filter === "IN_PROGRESS" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("IN_PROGRESS")}
            className="text-xs text-slate-600 border-slate-200 bg-white"
          >
            In Progress ({tasks.filter(t => t.status === "IN_PROGRESS").length})
          </Button>
          <Button
            variant={filter === "COMPLETED" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("COMPLETED")}
            className="text-xs text-slate-600 border-slate-200 bg-white"
          >
            Completed ({tasks.filter(t => t.status === "COMPLETED").length})
          </Button>
        </div>
      </div>

      {/* Table List */}
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold text-slate-600">Task ID</TableHead>
            <TableHead className="font-semibold text-slate-600">Asset & Unit</TableHead>
            <TableHead className="font-semibold text-slate-600">Task Type</TableHead>
            <TableHead className="font-semibold text-slate-600">Priority</TableHead>
            <TableHead className="font-semibold text-slate-600">Scheduled Date</TableHead>
            <TableHead className="font-semibold text-slate-600">Status</TableHead>
            <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <span>No assigned tasks match the selected filter.</span>
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono font-bold text-slate-900 text-sm">{task.id}</TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-950">{task.assetName}</div>
                  <div className="text-xs text-slate-500 font-medium">
                    {task.assetId} · <span className="text-primary">{task.department}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-slate-700 bg-slate-50 border-slate-200 uppercase font-bold text-[10px]">
                    {task.type}
                  </Badge>
                </TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell className="text-slate-600 font-medium text-sm">{task.scheduledDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(task.status)}
                    <span className="text-xs font-semibold text-slate-700 capitalize">
                      {task.status.replace("_", " ").toLowerCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {task.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => handleStartWork(task.id)}
                        disabled={loadingTaskId !== null}
                        className="h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-white flex items-center gap-1 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Work
                      </Button>
                    )}
                    
                    {task.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenCompleteModal(task)}
                        className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm animate-pulse"
                      >
                        <FileText className="w-3.5 h-3.5" /> Log Service
                      </Button>
                    )}

                    {task.status === "COMPLETED" && (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-1 text-xs">
                        Completed ✓
                      </Badge>
                    )}

                    <Link href={`/technician/assets/${task.assetId}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-200">
                        View Machine
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Log Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <Wrench className="w-5 h-5 text-primary" />
              <span>Log Service Record for {activeTask?.id}</span>
            </DialogTitle>
          </DialogHeader>

          {modalError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="space-y-4 py-4 text-left">
            <div>
              <Label className="text-xs font-bold text-slate-500 uppercase">Equipment Asset</Label>
              <div className="font-semibold text-slate-900 text-sm mt-0.5">
                {activeTask?.assetName} ({activeTask?.assetId})
              </div>
            </div>

            {activeTask?.notes && activeTask.notes.includes("Auto-allocated") && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <Label className="text-xs font-semibold text-amber-800">Problem / Request description</Label>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeTask.notes.replace(/Auto-allocated repair task triggered by breakdown report #[A-Z0-9-]+: /, "")}
                </p>
                <EvidenceGallery images={activeTask.images} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-800 font-semibold text-sm">
                Service Notes / Action Taken <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Describe what repair, calibration, or tests were performed..."
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                className="min-h-[100px] border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeSpent" className="text-slate-800 font-semibold text-sm">
                  Time Spent <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="timeSpent"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="e.g. 2 hours"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost" className="text-slate-800 font-semibold text-sm">
                  Estimated Cost Saved (LKR)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  value={costSaved}
                  onChange={(e) => setCostSaved(e.target.value)}
                  placeholder="e.g. 15000"
                  className="border-slate-200 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parts" className="text-slate-800 font-semibold text-sm">
                Spare Parts Replaced / Consumed
              </Label>
              <Input
                id="parts"
                value={spareParts}
                onChange={(e) => setSpareParts(e.target.value)}
                placeholder="e.g. Capacitor C23, Fuse 5A (comma separated)"
                className="border-slate-200"
              />
            </div>
          </div>

          <DialogFooter className="bg-slate-50 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={modalLoading}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteTask}
              disabled={modalLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {modalLoading ? "Saving Log..." : "Submit Service Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
