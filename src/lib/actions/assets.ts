"use server";

import { revalidatePath } from "next/cache";
import { getAllAssets, getAssetById } from "../db/crud/assets/read";
import { createAsset, updateAsset } from "../db/crud/assets/write";
import { logActivity } from "../db/crud/activities/write";
import { getCurrentUserAction } from "./auth";

export async function getAssetsAction() {
  return await getAllAssets();
}

export async function getAssetByIdAction(id: string) {
  return await getAssetById(id);
}

export async function createAssetAction(formData: FormData) {
  try {
    const user = await getCurrentUserAction();
    const operator = user ? `${user.role === "ADMIN" ? "Manager" : "Tech"}. ${user.name}` : "System";

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const serialNumber = formData.get("serialNumber") as string;
    const department = formData.get("department") as string;
    const supplier = formData.get("supplier") as string;
    const maintenanceFrequency = formData.get("maintenanceFrequency") as string;
    const lastMaintenance = formData.get("lastMaintenance") as string || new Date().toISOString().split("T")[0];
    const nextCalibration = formData.get("nextCalibration") as string || new Date().toISOString().split("T")[0];

    if (!id || !name || !brand || !model || !serialNumber || !department || !supplier || !maintenanceFrequency) {
      return { success: false, error: "Please fill all required fields." };
    }

    const existing = await getAssetById(id);
    if (existing) {
      return { success: false, error: `Asset with ID ${id} already exists.` };
    }

    const newAsset = await createAsset({
      id,
      name,
      brand,
      model,
      serialNumber,
      department,
      supplier,
      maintenanceFrequency,
      lastMaintenance,
      nextCalibration,
      status: "OPERATIONAL",
      qrCodeUrl: `https://www.bemmslk.com/assets/${id}`,
    });

    if (!newAsset) {
      return { success: false, error: "Database error registering asset." };
    }

    await logActivity(`Registered new equipment: ${name} (#${id})`, operator);
    revalidatePath("/assets");
    return { success: true, asset: newAsset };
  } catch (error: any) {
    console.error("Create asset action error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
