import { getAllTechnicians } from "@/lib/db/crud/users/read";
import { getAllTasks } from "@/lib/db/crud/tasks/read";
import { getAllAssets } from "@/lib/db/crud/assets/read";
import { TeamListClient, TechnicianDetail, TaskDetail } from "@/components/TeamListClient";

export default async function TeamPage() {
  const dbTechs = await getAllTechnicians();
  const allTasks = await getAllTasks();
  const allAssets = await getAllAssets();

  const assetMap = new Map(allAssets.map((asset) => [asset.id, asset.name]));

  // Resolve workloads dynamically for each technician from database rows
  const resolvedTechs: TechnicianDetail[] = dbTechs.map((tech) => {
    const techTasks = allTasks.filter((t) => t.technicianId === tech.id);
    const activeTasks = techTasks.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS").length;
    const completedThisMonth = techTasks.filter((t) => t.status === "COMPLETED").length;

    const mappedTasks: TaskDetail[] = techTasks.map((t) => ({
      id: t.id,
      assetId: t.assetId,
      assetName: assetMap.get(t.assetId) || "Unknown Machine",
      type: t.type,
      scheduledDate: t.scheduledDate,
      completedDate: t.completedDate,
      status: t.status,
      priority: t.priority,
      notes: t.notes,
    }));

    return {
      id: tech.id,
      name: tech.name,
      email: tech.email,
      specialty: tech.specialty,
      status: tech.status,
      activeTasks,
      completedThisMonth,
      tasks: mappedTasks,
    };
  });

  return <TeamListClient technicians={resolvedTechs} />;
}
