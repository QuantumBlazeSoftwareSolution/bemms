import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const activitiesTable = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(), // Activity description
  user: text("user").notNull(), // Operator user string (e.g., "Tech. Kumara P.")
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Activity = typeof activitiesTable.$inferSelect;
export type ActivityInsert = typeof activitiesTable.$inferInsert;
