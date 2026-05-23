import { getAssetsAction } from "@/lib/actions/assets";
import { AssetsListClient } from "@/components/AssetsListClient";
import { AlertTriangle } from "lucide-react";

export default async function TechnicianAssetsPage() {
  const assets = await getAssetsAction();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Equipment List</h1>
          <p className="text-muted-foreground mt-1">
            Browse and look up clinical equipment assets in BEMMS.
          </p>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
          <AlertTriangle className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="font-bold text-slate-900 text-lg">No equipment found</h3>
          <p className="text-muted-foreground max-w-sm mt-1">
            Please ask the administrator to seed the default hospital assets.
          </p>
        </div>
      ) : (
        <AssetsListClient initialAssets={assets} />
      )}
    </div>
  );
}
