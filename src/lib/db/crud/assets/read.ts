import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { assetsTable, Asset } from "../../schemas";

export async function getAllAssets(): Promise<Asset[]> {
  try {
    return await db.select().from(assetsTable);
  } catch (error) {
    console.error("Error fetching all assets:", error);
    return [];
  }
}

export async function getAssetById(id: string): Promise<Asset | null> {
  try {
    const result = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching asset by ID:", error);
    return null;
  }
}

export async function getAssetsByDepartment(department: string): Promise<Asset[]> {
  try {
    return await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.department, department));
  } catch (error) {
    console.error("Error fetching assets by department:", error);
    return [];
  }
}

export async function getAssetByQrCode(qrCode: string): Promise<Asset | null> {
  try {
    const result = await db
      .select()
      .from(assetsTable)
      .where(eq(assetsTable.qrCode, qrCode))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching asset by QR code:", error);
    return null;
  }
}
