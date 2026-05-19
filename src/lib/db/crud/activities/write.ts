import { db } from "@/lib/db";
import { activitiesTable, Activity } from "../../schemas";

export async function logActivity(text: string, user: string): Promise<Activity | null> {
  try {
    const result = await db
      .insert(activitiesTable)
      .values({ text, user })
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error logging activity:", error);
    return null;
  }
}
