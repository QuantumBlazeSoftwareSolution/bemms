import { pgTable, text, timestamp, integer, pgEnum, uuid } from "drizzle-orm/pg-core";
import { assetsTable } from "./assets";
import { usersTable } from "./users";
import { priorityEnum } from "./faults";

export const taskTypeEnum = pgEnum("task_type", ["PREVENTIVE", "CALIBRATION", "REPAIR"]);
export const taskStatusEnum = pgEnum("task_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const maintenanceTasksTable = pgTable("maintenance_tasks", {
  id: text("id").primaryKey(), // Custom ID (e.g., "TSK-101")
  assetId: text("asset_id")
    .references(() => assetsTable.id, { onDelete: "cascade" })
    .notNull(),
  technicianId: uuid("technician_id")
    .references(() => usersTable.id, { onDelete: "set null" }), // Nullable if tech deleted
  type: taskTypeEnum("type").notNull(),
  scheduledDate: text("scheduled_date").notNull(), // String format like "2026-05-10"
  completedDate: text("completed_date"), // String format like "2026-05-13"
  status: taskStatusEnum("status").default("PENDING").notNull(),
  priority: priorityEnum("priority").default("MEDIUM").notNull(),
  timeSpent: text("time_spent"), // E.g., "3h", "1.5h"
  spareParts: text("spare_parts"), // E.g., "Battery Pack x2"
  notes: text("notes"),
  costSaved: integer("cost_saved").default(0).notNull(), // E.g., estimated replacement cost saved in Rs/USD
  createdAt: timestamp("created_at").defaultNow(),
});

export type MaintenanceTask = typeof maintenanceTasksTable.$inferSelect;
export type MaintenanceTaskInsert = typeof maintenanceTasksTable.$inferInsert;
