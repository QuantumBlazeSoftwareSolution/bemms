import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { maintenanceTasksTable, MaintenanceTaskInsert, MaintenanceTask } from "../../schemas";

export async function createTask(data: MaintenanceTaskInsert): Promise<MaintenanceTask | null> {
  try {
    const result = await db.insert(maintenanceTasksTable).values(data).returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error creating maintenance task:", error);
    return null;
  }
}

export async function updateTask(
  id: string,
  data: Partial<MaintenanceTaskInsert>,
): Promise<MaintenanceTask | null> {
  try {
    const result = await db
      .update(maintenanceTasksTable)
      .set(data)
      .where(eq(maintenanceTasksTable.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error updating maintenance task:", error);
    return null;
  }
}

export async function updateTaskStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
): Promise<MaintenanceTask | null> {
  try {
    const result = await db
      .update(maintenanceTasksTable)
      .set({ status })
      .where(eq(maintenanceTasksTable.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error updating task status:", error);
    return null;
  }
}
