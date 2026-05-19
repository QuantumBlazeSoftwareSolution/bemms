import { getAssetByIdAction } from "@/lib/actions/assets";
import { getAllTasks } from "@/lib/db/crud/tasks/read";
import { getUserById } from "@/lib/db/crud/users/read";
import { getFaultById } from "@/lib/db/crud/faults/read";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRScannerModal } from "@/components/qr-scanner";
import { Activity, Calendar, Clock, Stethoscope, Wrench, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AssetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const assetId = resolvedParams.id;
  
  let asset = await getAssetByIdAction(assetId);
  if (!asset) {
    asset = await getAssetByIdAction(assetId.toUpperCase());
  }

  if (!asset) {
    notFound();
  }

  // Fetch all tasks from DB and filter by this asset
  const allTasks = await getAllTasks();
  const dbRelatedTasks = allTasks.filter((t) => t.assetId === asset.id);

  // Resolve technicians' names and breakdown evidence photos for each task
  const relatedTasks = await Promise.all(
    dbRelatedTasks.map(async (task) => {
      let techName = "Unassigned";
      if (task.technicianId) {
        const user = await getUserById(task.technicianId);
        if (user) techName = user.name;
      }

      let images: string[] = [];
      const match = task.notes?.match(/breakdown report #([A-Z0-9-]+)/i);
      const faultId = match ? match[1] : null;
      if (faultId) {
        const fault = await getFaultById(faultId);
        if (fault) {
          images = fault.images || [];
        }
      }

      return {
        ...task,
        technician: techName,
        images,
      };
    })
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Operational</Badge>;
      case "UNDER_MAINTENANCE":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Maintenance</Badge>;
      case "OUT_OF_SERVICE":
        return <Badge variant="destructive">Out of Service</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isHealthy = asset.status === "OPERATIONAL";

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{asset.name}</h1>
            {getStatusBadge(asset.status)}
          </div>
          <p className="text-muted-foreground mt-1">
            {asset.brand} - {asset.model}
          </p>
        </div>
        <div className="flex gap-2">
          <QRScannerModal />
          <Link href={`/fault-report?assetId=${asset.id}`}>
            <Button className="shadow-sm">Report Issue</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200 col-span-2">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle>Asset Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <div className="text-sm text-slate-500 mb-1">Serial Number</div>
              <div className="font-medium text-slate-900">{asset.serialNumber}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Department</div>
              <div className="font-medium text-slate-900">{asset.department}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Last Maintenance</div>
              <div className="font-medium text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> {asset.lastMaintenance}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Next Calibration</div>
              <div className="font-medium text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> {asset.nextCalibration}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Supplier Vendor</div>
              <div className="font-medium text-slate-900">{asset.supplier}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Frequency check</div>
              <div className="font-medium text-slate-900">{asset.maintenanceFrequency}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle>Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <div
              className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${
                isHealthy
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-amber-500 bg-amber-50"
              }`}
            >
              <Stethoscope
                className={`w-12 h-12 ${isHealthy ? "text-emerald-600" : "text-amber-600"}`}
              />
            </div>
            <div className="mt-4 font-bold text-xl text-slate-900">
              {isHealthy ? "100% Uptime" : "Needs Service"}
            </div>
            <div className="text-sm text-slate-500">
              {isHealthy ? "Fully Operational" : "Active breakdown reported"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle>Service History & Timeline</CardTitle>
          <CardDescription>Full log of maintenance, repairs, and calibrations.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8 pl-4 border-l-2 border-slate-100 relative">
            {relatedTasks.length === 0 && (
              <div className="flex items-center text-slate-500 py-4 gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                No tasks logged for this asset yet.
              </div>
            )}
            {relatedTasks.map((task, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[25px] bg-white p-1 rounded-full border border-slate-200">
                  <Wrench className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pl-4">
                  <div>
                    <div className="font-semibold text-slate-900">{task.type} Task</div>
                    <div className="text-sm text-slate-600 mt-1">Performed by {task.technician}</div>
                    {task.notes && (
                      <div className="mt-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100 max-w-xl">
                        {task.notes}
                      </div>
                    )}
                    <EvidenceGallery images={task.images} />
                    {task.spareParts && task.spareParts !== "None" && (
                      <div className="mt-1 text-xs text-slate-500">
                        🛠️ Spare parts used: <span className="font-semibold">{task.spareParts}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={task.status === "COMPLETED" ? "default" : "secondary"}>
                      {task.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" /> {task.scheduledDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
