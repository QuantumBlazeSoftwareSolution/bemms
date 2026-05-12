import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, QrCode, TriangleAlert } from "lucide-react"
import { submittedFaults } from "@/lib/data"
import Link from "next/link"

export default function ClinicalDashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED": return <Badge className="bg-emerald-500 text-xs">Resolved</Badge>
      case "IN_PROGRESS": return <Badge className="bg-blue-500 text-xs">In Progress</Badge>
      default: return <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Open</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "border-l-4 border-l-red-500"
      case "HIGH": return "border-l-4 border-l-orange-400"
      case "MEDIUM": return "border-l-4 border-l-amber-400"
      default: return "border-l-4 border-l-slate-300"
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Equipment Status</h1>
        <p className="text-muted-foreground mt-1">Report faults and track your submitted issues.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Link href="/fault-report">
          <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-primary text-white cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <TriangleAlert className="w-7 h-7" />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">Report a Fault</div>
              <div className="text-sm text-white/80 mt-0.5">Tap to submit an equipment issue</div>
            </div>
          </div>
        </Link>

        <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl bg-slate-800 text-white cursor-pointer hover:bg-slate-700 transition-all shadow-lg active:scale-95">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <QrCode className="w-7 h-7" />
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">Scan Equipment QR</div>
            <div className="text-sm text-white/80 mt-0.5">Instant report via QR code</div>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-700">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>For life-threatening emergencies, please call the Biomedical Engineering department directly. Do not wait for a ticket.</span>
      </div>

      {/* Submitted Faults */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>My Submitted Faults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submittedFaults.map((fault) => (
              <div key={fault.id} className={`p-4 rounded-lg bg-white border border-slate-100 ${getPriorityColor(fault.priority)}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-slate-900">{fault.assetName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{fault.department} · {fault.category} · {fault.id}</div>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{fault.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {getStatusBadge(fault.status)}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{fault.submittedAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
