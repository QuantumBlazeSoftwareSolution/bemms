import { assets, maintenanceTasks } from "@/lib/data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRScannerModal } from "@/components/qr-scanner"
import { Activity, Calendar, Clock, Stethoscope, Wrench } from "lucide-react"

export default async function AssetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const assetId = resolvedParams.id.toUpperCase();
  const asset = assets.find((a) => a.id === assetId);

  if (!asset) {
    notFound();
  }

  const relatedTasks = maintenanceTasks.filter((t) => t.assetId === asset.id);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{asset.name}</h1>
            <Badge 
              variant={asset.status === "OPERATIONAL" ? "default" : "destructive"}
              className={asset.status === "OPERATIONAL" ? "bg-emerald-500" : ""}
            >
              {asset.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {asset.brand} - {asset.model}
          </p>
        </div>
        <div className="flex gap-2">
          <QRScannerModal />
          <Button>Report Issue</Button>
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
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle>Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-emerald-500 flex items-center justify-center bg-emerald-50">
              <Stethoscope className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="mt-4 font-bold text-xl text-slate-900">100% Uptime</div>
            <div className="text-sm text-slate-500">Over the last 90 days</div>
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
            {relatedTasks.map((task, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[25px] bg-white p-1 rounded-full border border-slate-200">
                  <Wrench className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pl-4">
                  <div>
                    <div className="font-semibold text-slate-900">{task.type} Task</div>
                    <div className="text-sm text-slate-600 mt-1">Performed by {task.technician}</div>
                    <div className="mt-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                      Routine check and parts replacement according to standard procedures.
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">{task.status}</Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" /> {task.scheduledDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Mock older task */}
            <div className="relative">
              <div className="absolute -left-[25px] bg-white p-1 rounded-full border border-slate-200">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pl-4">
                <div>
                  <div className="font-semibold text-slate-900">CALIBRATION Task</div>
                  <div className="text-sm text-slate-600 mt-1">Performed by Vendor</div>
                  <div className="mt-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                    Annual calibration completed successfully. Device operates within acceptable parameters.
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-emerald-500">COMPLETED</Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" /> {asset.lastMaintenance}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
