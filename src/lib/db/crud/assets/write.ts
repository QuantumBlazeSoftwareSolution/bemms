import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { assetsTable, AssetInsert, Asset, assetStatusEnum } from "../../schemas";

export async function createAsset(data: AssetInsert): Promise<Asset | null> {
  try {
    const result = await db.insert(assetsTable).values(data).returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error creating asset:", error);
    return null;
  }
}

export async function updateAsset(
  id: string,
  data: Partial<AssetInsert>,
): Promise<Asset | null> {
  try {
    const result = await db
      .update(assetsTable)
      .set(data)
      .where(eq(assetsTable.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error updating asset:", error);
    return null;
  }
}

export async function updateAssetStatus(
  id: string,
  status: "OPERATIONAL" | "UNDER_MAINTENANCE" | "OUT_OF_SERVICE",
): Promise<Asset | null> {
  return updateAsset(id, { status });
}

export async function updateAssetMaintenanceDates(
  id: string,
  lastMaintenance: string,
  nextCalibration: string,
): Promise<Asset | null> {
  return updateAsset(id, { lastMaintenance, nextCalibration });
}
