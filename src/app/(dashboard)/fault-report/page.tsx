import { getAssetsAction } from "@/lib/actions/assets";
import { FaultReportClient } from "@/components/FaultReportClient";
import { Suspense } from "react";

export default async function FaultReportPage() {
  // Fetch real database assets to populate the dropdown
  const dbAssets = await getAssetsAction();

  const formattedAssets = dbAssets.map((asset) => ({
    id: asset.id,
    name: asset.name,
    brand: asset.brand,
    model: asset.model,
    department: asset.department,
  }));

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Report Fault</h1>
        <p className="text-muted-foreground mt-1">
          Submit a new equipment fault or issue. High priority issues will trigger immediate alerts and automatic technician allocation.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-500 text-sm gap-2">
          Loading report form...
        </div>
      }>
        <FaultReportClient assets={formattedAssets} />
      </Suspense>
    </div>
  );
}
