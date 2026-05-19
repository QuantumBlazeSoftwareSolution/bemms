import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { usersTable, UserInsert, User } from "../../schemas";

export async function createUser(data: UserInsert): Promise<User | null> {
  try {
    const result = await db.insert(usersTable).values(data).returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function updateUser(
  id: string,
  data: Partial<UserInsert>,
): Promise<User | null> {
  try {
    const result = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function updateUserStatus(
  id: string,
  status: string,
): Promise<User | null> {
  return updateUser(id, { status });
}
