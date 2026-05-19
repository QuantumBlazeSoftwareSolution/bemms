import { db } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { usersTable, User } from "../../schemas";

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export async function getAllTechnicians(): Promise<User[]> {
  try {
    return await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "TECHNICIAN"));
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
}

// Automatic Allocation helper:
// Find an available technician with the closest matching specialty, 
// sorted by who has the least workload (or number of active tasks)
export async function findEligibleTechnician(specialtyKeyword: string): Promise<User | null> {
  try {
    // We search for technicians. If their specialty matches the keyword (e.g. Life Support),
    // we return them. If not, we find any technician with the least active tasks.
    const techs = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "TECHNICIAN"));

    if (techs.length === 0) return null;

    // Filter by specialty if possible
    const matchingTechs = techs.filter(t => 
      t.specialty && 
      (t.specialty.toLowerCase().includes(specialtyKeyword.toLowerCase()) || 
       specialtyKeyword.toLowerCase().includes(t.specialty.toLowerCase()))
    );

    const targetList = matchingTechs.length > 0 ? matchingTechs : techs;

    // Sort by status ("Available" first) and select any
    const available = targetList.filter(t => t.status === "Available");
    if (available.length > 0) return available[0];

    return targetList[0] || null;
  } catch (error) {
    console.error("Error finding eligible technician:", error);
    return null;
  }
}
