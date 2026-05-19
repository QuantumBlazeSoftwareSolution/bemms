"use server";

import { revalidatePath } from "next/cache";
import { getTaskById, getAllTasks } from "../db/crud/tasks/read";
import { updateTask } from "../db/crud/tasks/write";
import { getAssetById } from "../db/crud/assets/read";
import { updateAssetStatus, updateAssetMaintenanceDates } from "../db/crud/assets/write";
import { logActivity } from "../db/crud/activities/write";
import { updateUserStatus } from "../db/crud/users/write";
import { getCurrentUserAction } from "./auth";

export async function getTasksAction() {
  return await getAllTasks();
}

export async function updateTaskStatusAction(taskId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED") {
  try {
    const user = await getCurrentUserAction();
    const operator = user ? `Tech. ${user.name}` : "System";

    const task = await getTaskById(taskId);
    if (!task) return { success: false, error: "Task not found." };

    await updateTask(taskId, { status });

    // If task goes to IN_PROGRESS, set the technician's status to "Busy"
    if (status === "IN_PROGRESS" && task.technicianId) {
      await updateUserStatus(task.technicianId, "Busy");
      await logActivity(`Started task #${taskId} (${task.type}).`, operator);
    } else if (status === "CANCELLED") {
      if (task.technicianId) {
        await updateUserStatus(task.technicianId, "Available");
      }
      await logActivity(`Cancelled task #${taskId}.`, operator);
    }

    revalidatePath("/technician/dashboard");
    revalidatePath("/maintenance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function completeTaskAction(
  taskId: string,
  notes: string,
  timeSpent: string,
  spareParts: string,
  costSavedVal: number = 0
) {
  try {
    const user = await getCurrentUserAction();
    const operator = user ? `Tech. ${user.name}` : "System";

    const task = await getTaskById(taskId);
    if (!task) return { success: false, error: "Task not found." };

    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Complete Task in database
    const completedTask = await updateTask(taskId, {
      status: "COMPLETED",
      completedDate: todayStr,
      notes,
      timeSpent,
      spareParts: spareParts || "None",
      costSaved: costSavedVal,
    });

    // 2. Set technician's availability status back to Available
    if (task.technicianId) {
      await updateUserStatus(task.technicianId, "Available");
    }

    // 3. Update asset parameters:
    // If it was repair/preventative maintenance, set its health status to "OPERATIONAL"
    const asset = await getAssetById(task.assetId);
    if (asset) {
      await updateAssetStatus(task.assetId, "OPERATIONAL");

      // Update last maintenance date, and calculate future calibration target dates if it was a calibration
      let newLastMaintenance = asset.lastMaintenance;
      let newNextCalibration = asset.nextCalibration;

      if (task.type === "PREVENTIVE" || task.type === "REPAIR") {
        newLastMaintenance = todayStr;
      }
      if (task.type === "CALIBRATION") {
        // Automatically project next calibration date 6 months into the future
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 6);
        newNextCalibration = nextDate.toISOString().split("T")[0];
      }

      await updateAssetMaintenanceDates(task.assetId, newLastMaintenance, newNextCalibration);
    }

    await logActivity(
      `${task.type === "CALIBRATION" ? "Calibration" : "Maintenance"} task #${taskId} completed.`,
      operator
    );

    revalidatePath("/technician/dashboard");
    revalidatePath("/admin/dashboard");
    revalidatePath("/assets");
    revalidatePath("/maintenance");
    return { success: true, task: completedTask };
  } catch (error: any) {
    console.error("Complete task error:", error);
    return { success: false, error: error.message };
  }
}
