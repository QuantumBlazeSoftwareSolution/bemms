"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle, 
  HelpCircle,
  FileText,
  Filter
} from "lucide-react";

interface Fault {
  id: string;
  assetId: string;
  category: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  submittedBy: string;
  submittedAt: string;
  department: string;
  images: string[];
  assetName: string;
  assignedTechnician: string;
}

interface ClinicalSubmissionsClientProps {
  initialFaults: Fault[];
}

export function ClinicalSubmissionsClient({ initialFaults }: ClinicalSubmissionsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED">("ALL");

  const filteredFaults = useMemo(() => {
    return initialFaults.filter((fault) => {
      const matchesSearch =
        fault.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || fault.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialFaults, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5 animate-spin-slow" /> In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50/20 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Open
          </Badge>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "border-l-4 border-l-red-500";
      case "HIGH":
        return "border-l-4 border-l-orange-400";
      case "MEDIUM":
        return "border-l-4 border-l-amber-400";
      default:
        return "border-l-4 border-l-slate-300";
    }
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

  return (
    <div className="space-y-6">
      {/* Search & Filtering header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-slate-200"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <Button
            variant={statusFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("ALL")}
            className="text-xs font-semibold"
          >
            All Submissions ({initialFaults.length})
          </Button>
          <Button
            variant={statusFilter === "OPEN" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("OPEN")}
            className="text-xs font-semibold text-slate-600 border-slate-200 bg-white"
          >
            Open ({initialFaults.filter(f => f.status === "OPEN").length})
          </Button>
          <Button
            variant={statusFilter === "IN_PROGRESS" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("IN_PROGRESS")}
            className="text-xs font-semibold text-slate-600 border-slate-200 bg-white"
          >
            In Progress ({initialFaults.filter(f => f.status === "IN_PROGRESS").length})
          </Button>
          <Button
            variant={statusFilter === "RESOLVED" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("RESOLVED")}
            className="text-xs font-semibold text-slate-600 border-slate-200 bg-white"
          >
            Resolved ({initialFaults.filter(f => f.status === "RESOLVED").length})
          </Button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid gap-4">
        {filteredFaults.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
            <HelpCircle className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="font-bold text-slate-900 text-lg">No submissions found</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              There are no reported faults matching the selected filters.
            </p>
          </div>
        ) : (
          filteredFaults.map((fault) => (
            <Card 
              key={fault.id}
              className={`shadow-xs border-slate-200 bg-white transition-all hover:shadow-sm ${getPriorityColor(fault.priority)}`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{fault.id}</span>
                      {getPriorityBadge(fault.priority)}
                    </div>
                    <h3 className="font-bold text-slate-950 text-lg mt-1">{fault.assetName}</h3>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Category: <span className="font-semibold text-slate-700">{fault.category}</span> · Department: <span className="text-primary font-semibold">{fault.department}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-750 bg-slate-50/50 p-3 rounded-lg border border-slate-100/50 leading-relaxed font-sans max-w-2xl">
                    {fault.description}
                  </p>

                  {/* Technician status badge */}
                  {fault.status !== "RESOLVED" && (
                    <div className="inline-flex text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-150 px-2.5 py-1.5 rounded-md items-center gap-1.5 shadow-3xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span>Assigned Engineer: <span className="text-primary font-bold">{fault.assignedTechnician}</span></span>
                    </div>
                  )}

                  {fault.status === "RESOLVED" && (
                    <div className="inline-flex text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-md items-center gap-1.5 shadow-3xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Resolved by: <span className="font-bold">{fault.assignedTechnician}</span></span>
                    </div>
                  )}

                  {/* Evidence Photo Grid */}
                  <EvidenceGallery images={fault.images} />
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 md:text-right">
                  {getStatusBadge(fault.status)}
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reported: {fault.submittedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
