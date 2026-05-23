"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { QrCode, Search, Filter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Asset {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  department: string;
  supplier: string;
  status: "OPERATIONAL" | "UNDER_MAINTENANCE" | "OUT_OF_SERVICE";
  lastMaintenance: string;
  nextCalibration: string;
  maintenanceFrequency: string;
  qrCodeUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface AssetsListClientProps {
  initialAssets: Asset[];
}

export function AssetsListClient({ initialAssets }: AssetsListClientProps) {
  const pathname = usePathname();
  const isTechnician = pathname.startsWith("/technician");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");

  const filteredAssets = useMemo(() => {
    return initialAssets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept =
        selectedDept === "ALL" || asset.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [initialAssets, searchTerm, selectedDept]);

  // Extract unique departments for filtering
  const departments = useMemo(() => {
    const depts = new Set(initialAssets.map((a) => a.department));
    return Array.from(depts);
  }, [initialAssets]);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search assets..."
            className="pl-9 bg-white border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <Button
            variant={selectedDept === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDept("ALL")}
            className="text-xs"
          >
            All Units
          </Button>
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={selectedDept === dept ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDept(dept)}
              className="text-xs whitespace-nowrap"
            >
              {dept}
            </Button>
          ))}
        </div>
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
          {filteredAssets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No matching equipment assets found.
              </TableCell>
            </TableRow>
          ) : (
            filteredAssets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">{asset.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{asset.name}</div>
                  <div className="text-xs text-slate-500">
                    {asset.brand} - {asset.model}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{asset.department}</TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`${isTechnician ? "/technician" : ""}/assets/${asset.id}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-200">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`${isTechnician ? "/technician" : ""}/assets/${asset.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
