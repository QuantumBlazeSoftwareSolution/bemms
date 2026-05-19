import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { faultReportsTable, FaultReport } from "../../schemas";

export async function getAllFaults(): Promise<FaultReport[]> {
  try {
    return await db.select().from(faultReportsTable).orderBy(desc(faultReportsTable.createdAt));
  } catch (error) {
    console.error("Error fetching all faults:", error);
    return [];
  }
}

export async function getFaultById(id: string): Promise<FaultReport | null> {
  try {
    const result = await db
      .select()
      .from(faultReportsTable)
      .where(eq(faultReportsTable.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching fault report by ID:", error);
    return null;
  }
}

export async function getRecentFaults(limitCount: number = 5): Promise<FaultReport[]> {
  try {
    return await db
      .select()
      .from(faultReportsTable)
      .orderBy(desc(faultReportsTable.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error("Error fetching recent faults:", error);
    return [];
  }
}

export async function getFaultsByDepartment(department: string): Promise<FaultReport[]> {
  try {
    return await db
      .select()
      .from(faultReportsTable)
      .where(eq(faultReportsTable.department, department))
      .orderBy(desc(faultReportsTable.createdAt));
  } catch (error) {
    console.error("Error fetching faults by department:", error);
    return [];
  }
}
