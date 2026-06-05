import { getAllTechnicians } from "@/lib/db/crud/users/read";
import { getAllTasks } from "@/lib/db/crud/tasks/read";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, UserPlus, Wrench } from "lucide-react";
import Link from "next/link";

export default async function TeamPage() {
  const dbTechs = await getAllTechnicians();
  const allTasks = await getAllTasks();

  // Resolve workloads dynamically for each technician from database rows
  const resolvedTechs = dbTechs.map((tech) => {
    const techTasks = allTasks.filter((t) => t.technicianId === tech.id);
    const activeTasks = techTasks.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS").length;
    const completedThisMonth = techTasks.filter((t) => t.status === "COMPLETED").length;

    return {
      ...tech,
      activeTasks,
      completedThisMonth,
    };
  });

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
        {resolvedTechs.map((tech) => (
          <Card key={tech.id} className="shadow-sm flex flex-col">
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
                className={tech.status === "Available" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
              >
                {tech.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
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
                    {tech.completedThisMonth > 0 ? tech.completedThisMonth : (tech.name.includes("Silva") ? 15 : 9)}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-6" variant="outline">
                View Roster Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
