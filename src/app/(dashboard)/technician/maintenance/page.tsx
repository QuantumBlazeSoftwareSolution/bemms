import { getCurrentUserAction } from "@/lib/actions/auth";
import { getTasksByTechnician } from "@/lib/db/crud/tasks/read";
import { getAssetById } from "@/lib/db/crud/assets/read";
import { getFaultById } from "@/lib/db/crud/faults/read";
import { TechnicianTasksClient } from "@/components/TechnicianTasksClient";
import { redirect } from "next/navigation";

export default async function TechnicianMaintenancePage() {
  const me = await getCurrentUserAction();

  if (!me || me.role !== "TECHNICIAN") {
    redirect("/login");
  }

  // Fetch ONLY tasks assigned to this technician
  const dbTasks = await getTasksByTechnician(me.id);

  // Resolve all relationships (Asset details & Breakdown Images)
  const resolvedTasks = await Promise.all(
    dbTasks.map(async (task) => {
      const asset = await getAssetById(task.assetId);
      
      let images: string[] = [];
      let faultDescription = "";
      const match = task.notes?.match(/breakdown report #([A-Z0-9-]+)/i);
      const faultId = match ? match[1] : null;
      if (faultId) {
        const fault = await getFaultById(faultId);
        if (fault) {
          images = fault.images || [];
          faultDescription = fault.description || "";
        }
      }

      return {
        ...task,
        assetName: asset ? asset.name : "Unknown Machine",
        department: asset ? asset.department : "Unknown Unit",
        images,
        faultDescription,
      };
    })
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-left">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Assigned Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Perform scheduled maintenance, calibrations, and breakdown repairs allocated to you.
        </p>
      </div>

      <TechnicianTasksClient initialTasks={resolvedTasks as any} />
    </div>
  );
}
