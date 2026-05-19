"use server";

import { revalidatePath } from "next/cache";
import { getAssetById } from "../db/crud/assets/read";
import { updateAssetStatus } from "../db/crud/assets/write";
import { createFaultReport } from "../db/crud/faults/write";
import { findEligibleTechnician } from "../db/crud/users/read";
import { createTask } from "../db/crud/tasks/write";
import { logActivity } from "../db/crud/activities/write";
import { getCurrentUserAction } from "./auth";
import { priorityEnum } from "../db/schemas/faults";
import { getDriveImageUrl } from "../drive-image";

export async function reportFaultAction(formData: FormData) {
  try {
    const user = await getCurrentUserAction();
    const reporterName = user ? user.name : (formData.get("submittedBy") as string || "Anonymous");

    const assetId = formData.get("assetId") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    const rawImagesJson = formData.get("images") as string || "[]";
    let rawImages: string[] = [];
    try {
      rawImages = JSON.parse(rawImagesJson);
    } catch (e) {
      rawImages = [];
    }

    // Clean Google Drive URLs if provided
    const images = rawImages
      .filter((url: string) => url.trim() !== "")
      .map((url: string) => {
        return url.includes("drive.google.com") ? getDriveImageUrl(url) : url;
      });

    if (!assetId || !category || !description || !priority) {
      return { success: false, error: "Please fill all required fields." };
    }

    const asset = await getAssetById(assetId);
    if (!asset) {
      return { success: false, error: `Equipment with ID ${assetId} not found.` };
    }

    // 1. Create the Fault Report in DB
    const faultId = `FLT-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    const fault = await createFaultReport({
      id: faultId,
      assetId,
      category,
      description,
      priority,
      status: "OPEN",
      submittedBy: reporterName,
      submittedAt: nowStr,
      department: asset.department,
      images,
    });

    if (!fault) {
      return { success: false, error: "Database error reporting fault." };
    }

    // 2. Adjust Asset status based on severity
    let targetAssetStatus: "OPERATIONAL" | "UNDER_MAINTENANCE" | "OUT_OF_SERVICE" = "UNDER_MAINTENANCE";
    if (priority === "CRITICAL") {
      targetAssetStatus = "OUT_OF_SERVICE";
    }
    await updateAssetStatus(assetId, targetAssetStatus);

    // 3. RUN AUTOMATIC TECHNICIAN ALLOCATION ENGINE
    // Determine required specialty keyword
    let specialtyKeyword = "General Electronics";
    const lowerAsset = asset.name.toLowerCase();
    if (lowerAsset.includes("mri") || lowerAsset.includes("scanner") || lowerAsset.includes("x-ray") || lowerAsset.includes("ct")) {
      specialtyKeyword = "Radiology";
    } else if (lowerAsset.includes("defibrillator") || lowerAsset.includes("ventilator") || lowerAsset.includes("infusion") || lowerAsset.includes("pump")) {
      specialtyKeyword = "Life Support";
    }

    const eligibleTech = await findEligibleTechnician(specialtyKeyword);

    // 4. Create Maintenance/Repair Task
    const taskId = `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const task = await createTask({
      id: taskId,
      assetId,
      technicianId: eligibleTech ? eligibleTech.id : null,
      type: "REPAIR",
      scheduledDate: nowStr.split(" ")[0],
      status: "PENDING",
      priority,
      notes: `Auto-allocated repair task triggered by breakdown report #${faultId}: "${description}"`,
    });

    // 5. Audit logs
    await logActivity(
      `New fault reported: ${asset.name} cooling/breakdown issue.`,
      reporterName
    );

    if (eligibleTech) {
      await logActivity(
        `Auto-allocated repair task #${taskId} to Tech. ${eligibleTech.name} (Specialty: ${specialtyKeyword})`,
        "System Allocation"
      );
    } else {
      await logActivity(
        `Allocated repair task #${taskId} created (Needs manual allocation)`,
        "System Allocation"
      );
    }

    revalidatePath("/clinic/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/fault-report");
    revalidatePath("/maintenance");
    return { 
      success: true, 
      fault, 
      task, 
      allocatedTo: eligibleTech ? eligibleTech.name : "Unassigned" 
    };
  } catch (error: any) {
    console.error("Report fault action error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
