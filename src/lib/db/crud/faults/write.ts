import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { faultReportsTable, FaultReportInsert, FaultReport } from "../../schemas";

export async function createFaultReport(data: FaultReportInsert): Promise<FaultReport | null> {
  try {
    const result = await db.insert(faultReportsTable).values(data).returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error creating fault report:", error);
    return null;
  }
}

export async function updateFaultStatus(
  id: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED",
): Promise<FaultReport | null> {
  try {
    const result = await db
      .update(faultReportsTable)
      .set({ status })
      .where(eq(faultReportsTable.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error updating fault status:", error);
    return null;
  }
}
