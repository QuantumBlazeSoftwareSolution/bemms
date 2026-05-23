import { getAllFaults } from "@/lib/db/crud/faults/read";
import { getAssetById } from "@/lib/db/crud/assets/read";
import { getAllTasks } from "@/lib/db/crud/tasks/read";
import { getUserById } from "@/lib/db/crud/users/read";
import { ClinicalSubmissionsClient } from "@/components/ClinicalSubmissionsClient";

export default async function ClinicalSubmissionsPage() {
  const dbFaults = await getAllFaults();
  const allTasks = await getAllTasks();

  // Dynamically resolve equipment names & assigned technicians from DB relationships
  const resolvedFaults = await Promise.all(
    dbFaults.map(async (fault) => {
      const asset = await getAssetById(fault.assetId);
      
      // Find the associated repair task
      const associatedTask = allTasks.find(
        (t) => t.notes && t.notes.includes(`breakdown report #${fault.id}`)
      );
      
      let techName = "Pending Allocation";
      if (associatedTask) {
        if (associatedTask.technicianId) {
          const tech = await getUserById(associatedTask.technicianId);
          if (tech) techName = tech.name;
        } else {
          techName = "Manual Allocation Required";
        }
      }

      return {
        ...fault,
        assetName: asset ? asset.name : "Unknown Machine",
        assignedTechnician: techName,
      };
    })
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Detailed list of all your logged equipment fault tickets and maintenance updates.
        </p>
      </div>

      <ClinicalSubmissionsClient initialFaults={resolvedFaults as any} />
    </div>
  );
}
