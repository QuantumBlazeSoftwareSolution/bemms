import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { activitiesTable, Activity } from "../../schemas";

export async function getRecentActivities(limitCount: number = 5): Promise<Activity[]> {
  try {
    return await db
      .select()
      .from(activitiesTable)
      .orderBy(desc(activitiesTable.timestamp))
      .limit(limitCount);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}
