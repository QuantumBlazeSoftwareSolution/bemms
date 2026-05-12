import { assets } from "@/lib/data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, QrCode, Search, Filter } from "lucide-react"

export default function AssetsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Operational</Badge>
      case "UNDER_MAINTENANCE":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Maintenance</Badge>
      case "OUT_OF_SERVICE":
        return <Badge variant="destructive">Out of Service</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Asset Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all hospital medical equipment.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Asset
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search assets..." 
              className="pl-9 bg-white border-slate-200"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-600">Asset ID</TableHead>
              <TableHead className="font-semibold text-slate-600">Name & Model</TableHead>
              <TableHead className="font-semibold text-slate-600">Department</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">{asset.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{asset.name}</div>
                  <div className="text-xs text-slate-500">{asset.brand} - {asset.model}</div>
                </TableCell>
                <TableCell className="text-slate-600">{asset.department}</TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <a href={`/assets/${asset.id}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-200">
                        View
                      </Button>
                    </a>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
