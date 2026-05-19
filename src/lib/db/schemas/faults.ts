import { pgTable, text, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { assetsTable } from "./assets";

export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const faultStatusEnum = pgEnum("fault_status", ["OPEN", "IN_PROGRESS", "RESOLVED"]);

export const faultReportsTable = pgTable("fault_reports", {
  id: text("id").primaryKey(), // Custom ID (e.g., "FLT-001")
  assetId: text("asset_id")
    .references(() => assetsTable.id, { onDelete: "cascade" })
    .notNull(),
  category: text("category").notNull(), // Mechanical, Software, Power, etc.
  description: text("description").notNull(),
  images: jsonb("images").$type<string[]>().default([]), // Supports multiple images via JSONB array
  priority: priorityEnum("priority").default("MEDIUM").notNull(),
  status: faultStatusEnum("status").default("OPEN").notNull(),
  submittedBy: text("submitted_by").notNull(), // E.g., "Dr. Perera"
  submittedAt: text("submitted_at").notNull(), // E.g., "2026-05-11 09:15"
  department: text("department").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type FaultReport = typeof faultReportsTable.$inferSelect;
export type FaultReportInsert = typeof faultReportsTable.$inferInsert;
