import { AddAssetClient } from "@/components/AddAssetClient";

export default function NewAssetPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Asset</h1>
        <p className="text-muted-foreground mt-1">
          Scan the physical device QR code or barcode to generate the Asset ID, then record its biomedical metadata into Neon.
        </p>
      </div>

      <AddAssetClient />
    </div>
  );
}
