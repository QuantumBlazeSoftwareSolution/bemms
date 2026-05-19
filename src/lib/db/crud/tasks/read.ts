import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { maintenanceTasksTable, MaintenanceTask } from "../../schemas";

export async function getAllTasks(): Promise<MaintenanceTask[]> {
  try {
    return await db.select().from(maintenanceTasksTable).orderBy(desc(maintenanceTasksTable.createdAt));
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    return [];
  }
}

export async function getTaskById(id: string): Promise<MaintenanceTask | null> {
  try {
    const result = await db
      .select()
      .from(maintenanceTasksTable)
      .where(eq(maintenanceTasksTable.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    return null;
  }
}

export async function getTasksByTechnician(technicianId: string): Promise<MaintenanceTask[]> {
  try {
    return await db
      .select()
      .from(maintenanceTasksTable)
      .where(eq(maintenanceTasksTable.technicianId, technicianId))
      .orderBy(desc(maintenanceTasksTable.createdAt));
  } catch (error) {
    console.error("Error fetching tasks by technician:", error);
    return [];
  }
}

export async function getPendingTasks(): Promise<MaintenanceTask[]> {
  try {
    return await db
      .select()
      .from(maintenanceTasksTable)
      .where(eq(maintenanceTasksTable.status, "PENDING"));
  } catch (error) {
    console.error("Error fetching pending tasks:", error);
    return [];
  }
}
