import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const assetStatusEnum = pgEnum("asset_status", [
  "OPERATIONAL",
  "UNDER_MAINTENANCE",
  "OUT_OF_SERVICE",
]);

export const assetsTable = pgTable("assets", {
  id: text("id").primaryKey(), // Custom ID (e.g., "AST-001")
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  serialNumber: text("serial_number").notNull(),
  department: text("department").notNull(),
  supplier: text("supplier").notNull(),
  status: assetStatusEnum("status").default("OPERATIONAL").notNull(),
  lastMaintenance: text("last_maintenance").notNull(), // String format like "2026-04-10"
  nextCalibration: text("next_calibration").notNull(), // String format like "2026-10-10"
  maintenanceFrequency: text("maintenance_frequency").notNull(), // e.g. "Quarterly", "Monthly"
  qrCodeUrl: text("qr_code_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Asset = typeof assetsTable.$inferSelect;
export type AssetInsert = typeof assetsTable.$inferInsert;
