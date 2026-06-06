"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, UserPlus, Wrench, Clock, PlayCircle, Eye, Mail, Info } from "lucide-react";
import Link from "next/link";

export interface TaskDetail {
  id: string;
  assetId: string;
  assetName: string;
  type: string;
  scheduledDate: string;
  completedDate: string | null;
  status: string;
  priority: string;
  notes: string | null;
}

export interface TechnicianDetail {
  id: string;
  name: string;
  email: string;
  specialty: string | null;
  status: string;
  activeTasks: number;
  completedThisMonth: number;
  tasks: TaskDetail[];
}

interface TeamListClientProps {
  technicians: TechnicianDetail[];
}

export function TeamListClient({ technicians }: TeamListClientProps) {
  const [selectedTech, setSelectedTech] = useState<TechnicianDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDetails = (tech: TechnicianDetail) => {
    setSelectedTech(tech);
    setModalOpen(true);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return <Badge variant="destructive" className="text-[10px] font-bold">CRITICAL</Badge>;
      case "HIGH":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold">HIGH</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold">MEDIUM</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] font-bold">LOW</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case "IN_PROGRESS":
        return <PlayCircle className="w-4 h-4 text-blue-500 shrink-0 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Biomedical Team</h1>
          <p className="text-muted-foreground mt-1">
            Monitor technician workload and assign maintenance tasks.
          </p>
        </div>
        <Link href="/team/add">
          <Button className="flex items-center gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" /> Add Technician
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {technicians.map((tech) => (
          <Card key={tech.id} className="shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start gap-4 pb-4">
              <Avatar className="w-12 h-12 border-2 border-slate-100 shadow-inner">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {tech.name
                    ? tech.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "PM"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{tech.name}</CardTitle>
                <CardDescription className="mt-1">{tech.specialty || "Biomedical Specialist"}</CardDescription>
              </div>
              <Badge
                variant={tech.status === "Available" ? "default" : "secondary"}
                className={tech.status === "Available" ? "bg-emerald-500 hover:bg-emerald-600 text-white font-medium" : "font-medium"}
              >
                {tech.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Wrench className="w-4 h-4" />
                    <span className="text-sm font-medium">Active Tasks</span>
                  </div>
                  <span className="font-bold text-slate-900">{tech.activeTasks}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">Completed tasks</span>
                  </div>
                  <span className="font-bold text-emerald-600">
                    {tech.completedThisMonth}
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => handleOpenDetails(tech)}
                className="w-full mt-6 flex items-center justify-center gap-1.5 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-3xs" 
                variant="outline"
              >
                <Eye className="w-4 h-4" />
                <span>View Roster Details</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roster Details Dialog Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-3xl max-w-4xl w-[90vw] text-left">
          {selectedTech && (
            <>
              <DialogHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4 pr-8">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-slate-200">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {selectedTech.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl font-bold text-slate-900">{selectedTech.name}</DialogTitle>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {selectedTech.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-slate-700 bg-slate-50 border-slate-200 py-1 font-semibold text-xs">
                      {selectedTech.specialty || "General Electronics"}
                    </Badge>
                    <Badge
                      className={selectedTech.status === "Available" ? "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-1 text-xs" : "font-semibold py-1 text-xs"}
                    >
                      {selectedTech.status}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                  <Wrench className="w-4 h-4 text-primary" />
                  <span>Assigned Maintenance Worksheets ({selectedTech.tasks.length})</span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[350px] overflow-y-auto w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-600 text-xs">Task ID</TableHead>
                        <TableHead className="font-semibold text-slate-600 text-xs">Equipment / Asset</TableHead>
                        <TableHead className="font-semibold text-slate-600 text-xs">Type</TableHead>
                        <TableHead className="font-semibold text-slate-600 text-xs">Scheduled</TableHead>
                        <TableHead className="font-semibold text-slate-600 text-xs">Priority</TableHead>
                        <TableHead className="font-semibold text-slate-600 text-xs text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTech.tasks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-xs">
                            No tasks currently scheduled for this engineer.
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedTech.tasks.map((task) => (
                          <TableRow key={task.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                            <TableCell className="font-semibold text-slate-800">{task.id}</TableCell>
                            <TableCell>
                              <div className="font-semibold text-slate-800">{task.assetName}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{task.assetId}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 uppercase font-medium">
                                {task.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600">{task.scheduledDate}</TableCell>
                            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="font-medium text-slate-700 capitalize text-[11px]">
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

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button 
                  onClick={() => setModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
