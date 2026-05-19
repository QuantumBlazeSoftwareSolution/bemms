import { getAssetsAction } from "@/lib/actions/assets";
import { AssetsListClient } from "@/components/AssetsListClient";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AssetsPage() {
  const assets = await getAssetsAction();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Asset Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all hospital medical equipment.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/assets/new">
            <Button className="flex items-center gap-2 shadow-sm bg-primary hover:bg-primary/95 text-white">
              <Plus className="w-4 h-4" /> Add Asset
            </Button>
          </Link>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
          <AlertTriangle className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="font-bold text-slate-900 text-lg">No equipment found</h3>
          <p className="text-muted-foreground max-w-sm mt-1">
            Please run the database seed script to populate default equipment or insert them manually.
          </p>
        </div>
      ) : (
        <AssetsListClient initialAssets={assets} />
      )}
    </div>
  );
}
