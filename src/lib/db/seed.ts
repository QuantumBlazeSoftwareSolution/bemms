import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import * as schema from "./schemas";
import fs from "fs";
import path from "path";

// Automatically load local .env variables for standalone execution
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...values] = trimmed.split("=");
        const value = values.join("=");
        if (key && value) {
          process.env[key.trim()] = value.trim().replace(/^['"]|['"]$/g, "");
        }
      }
    });
  }
} catch (e) {
  console.warn("Unable to parse local .env file", e);
}

// Read connection string from system environment or local variable check
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Please set it in your environment or .env file.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding database...");

  try {
    // 1. Clear existing records to ensure idempotency
    console.log("Cleaning tables...");
    await db.delete(schema.activitiesTable);
    await db.delete(schema.maintenanceTasksTable);
    await db.delete(schema.faultReportsTable);
    await db.delete(schema.assetsTable);
    await db.delete(schema.usersTable);

    console.log("Seeding users...");
    const saltRounds = 10;
    const adminPassword = bcrypt.hashSync("admin123", saltRounds);
    const techPassword = bcrypt.hashSync("tech123", saltRounds);
    const clinicalPassword = bcrypt.hashSync("clinical123", saltRounds);

    // Insert Users
    const users = await db.insert(schema.usersTable).values([
      {
        email: "admin@hospital.lk",
        passwordHash: adminPassword,
        name: "Manager Silva",
        role: "ADMIN",
        status: "Available",
      },
      {
        email: "silva@hospital.lk",
        passwordHash: techPassword,
        name: "Silva A.",
        role: "TECHNICIAN",
        specialty: "Radiology & Imaging Equipment",
        status: "Available",
      },
      {
        email: "fernando@hospital.lk",
        passwordHash: techPassword,
        name: "Fernando K.",
        role: "TECHNICIAN",
        specialty: "Life Support Systems",
        status: "Busy",
      },
      {
        email: "kumara@hospital.lk",
        passwordHash: techPassword,
        name: "Kumara P.",
        role: "TECHNICIAN",
        specialty: "General Electronics & Monitoring",
        status: "Available",
      },
      {
        email: "clinical@hospital.lk",
        passwordHash: clinicalPassword,
        name: "Dr. Perera",
        role: "CLINICAL",
        status: "Available",
      },
    ]).returning();

    const tech1 = users.find(u => u.name === "Silva A.")!;
    const tech2 = users.find(u => u.name === "Fernando K.")!;
    const tech3 = users.find(u => u.name === "Kumara P.")!;

    console.log("Seeding assets...");
    const assets = await db.insert(schema.assetsTable).values([
      {
        id: "AST-001",
        name: "Defibrillator",
        brand: "Philips",
        model: "HeartStart Intrepid",
        serialNumber: "PHL-89321",
        department: "Emergency",
        supplier: "Philips Lanka",
        status: "OPERATIONAL",
        lastMaintenance: "2026-04-10",
        nextCalibration: "2026-10-10",
        maintenanceFrequency: "Quarterly",
        qrCodeUrl: "https://www.bemmslk.com/assets/AST-001",
      },
      {
        id: "AST-002",
        name: "MRI Scanner",
        brand: "Siemens",
        model: "MAGNETOM Lumina",
        serialNumber: "SIE-11200",
        department: "Radiology",
        supplier: "Siemens Healthineers",
        status: "UNDER_MAINTENANCE",
        lastMaintenance: "2026-03-15",
        nextCalibration: "2027-03-15",
        maintenanceFrequency: "Annually",
        qrCodeUrl: "https://www.bemmslk.com/assets/AST-002",
      },
      {
        id: "AST-003",
        name: "Ventilator",
        brand: "Medtronic",
        model: "Puritan Bennett 980",
        serialNumber: "MED-55441",
        department: "ICU",
        supplier: "Medtronic Lanka",
        status: "OPERATIONAL",
        lastMaintenance: "2026-05-01",
        nextCalibration: "2026-11-01",
        maintenanceFrequency: "Monthly",
        qrCodeUrl: "https://www.bemmslk.com/assets/AST-003",
      },
      {
        id: "AST-004",
        name: "ECG Machine",
        brand: "GE Healthcare",
        model: "MAC 2000",
        serialNumber: "GEH-90822",
        department: "Cardiology",
        supplier: "GE Healthcare",
        status: "OUT_OF_SERVICE",
        lastMaintenance: "2025-12-20",
        nextCalibration: "2026-06-20",
        maintenanceFrequency: "Daily",
        qrCodeUrl: "https://www.bemmslk.com/assets/AST-004",
      },
      {
        id: "AST-005",
        name: "Infusion Pump",
        brand: "B. Braun",
        model: "Infusomat Space",
        serialNumber: "BBR-33211",
        department: "ICU Ward B",
        supplier: "B. Braun Lanka",
        status: "OPERATIONAL",
        lastMaintenance: "2026-02-14",
        nextCalibration: "2026-08-14",
        maintenanceFrequency: "Bi-Weekly",
        qrCodeUrl: "https://www.bemmslk.com/assets/AST-005",
      },
      {
        id: "AST-006",
        name: "Patient Monitor",
        brand: "Mindray",
        model: "MEC-2000",
        serialNumber: "MDR-44120",
        department: "OT",
        supplier: "Mindray Lanka",
        status: "OPERATIONAL",
        lastMaintenance: "2026-04-28",
        nextCalibration: "2026-07-28",
        maintenanceFrequency: "Monthly",
        qrCodeUrl: "https://www.bemmslk.com/assets/AST-006",
      },
    ]).returning();

    console.log("Seeding fault reports...");
    await db.insert(schema.faultReportsTable).values([
      {
        id: "FLT-001",
        assetId: "AST-002",
        category: "Mechanical",
        description: "Loud grinding noise from gantry area during scan.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        submittedBy: "Dr. Perera",
        submittedAt: "2026-05-11 09:15",
        department: "Radiology",
      },
      {
        id: "FLT-002",
        assetId: "AST-004",
        category: "Software / Display",
        description: "Screen flickering and freezing after 30 mins of use.",
        priority: "MEDIUM",
        status: "OPEN",
        submittedBy: "Nurse Kumari",
        submittedAt: "2026-05-10 14:30",
        department: "Cardiology",
      },
      {
        id: "FLT-003",
        assetId: "AST-003",
        category: "Power / Electrical",
        description: "Battery alarm triggering even when plugged in.",
        priority: "CRITICAL",
        status: "RESOLVED",
        submittedBy: "Dr. Bandara",
        submittedAt: "2026-05-09 07:00",
        department: "ICU",
      },
    ]);

    console.log("Seeding maintenance tasks...");
    await db.insert(schema.maintenanceTasksTable).values([
      {
        id: "TSK-101",
        assetId: "AST-002",
        technicianId: tech1.id,
        type: "REPAIR",
        scheduledDate: "2026-05-10",
        status: "IN_PROGRESS",
        priority: "HIGH",
        timeSpent: "3h",
        spareParts: "Cooling Fan x1",
        notes: "Cooling system replaced",
      },
      {
        id: "TSK-102",
        assetId: "AST-004",
        technicianId: tech2.id,
        type: "PREVENTIVE",
        scheduledDate: "2026-05-12",
        status: "PENDING",
        priority: "MEDIUM",
      },
      {
        id: "TSK-103",
        assetId: "AST-001",
        technicianId: tech3.id,
        type: "CALIBRATION",
        scheduledDate: "2026-05-08",
        status: "COMPLETED",
        priority: "HIGH",
        timeSpent: "1.5h",
        spareParts: "None",
        notes: "Annual calibration completed. Within tolerance.",
      },
      {
        id: "TSK-104",
        assetId: "AST-005",
        technicianId: tech1.id,
        type: "PREVENTIVE",
        scheduledDate: "2026-05-14",
        status: "PENDING",
        priority: "LOW",
      },
      {
        id: "TSK-105",
        assetId: "AST-006",
        technicianId: tech2.id,
        type: "CALIBRATION",
        scheduledDate: "2026-05-09",
        status: "COMPLETED",
        priority: "MEDIUM",
        timeSpent: "2h",
        spareParts: "Battery Pack x2",
        notes: "Battery replaced, display calibrated.",
      },
    ]);

    console.log("Seeding audit activities...");
    await db.insert(schema.activitiesTable).values([
      {
        text: "Defibrillator #AST-001 calibration completed.",
        user: `Tech. ${tech3.name}`,
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
      },
      {
        text: "New fault reported: MRI Scanner cooling issue.",
        user: "Dr. Perera",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        text: "Ventilator #AST-003 preventive maintenance done.",
        user: `Tech. ${tech2.name}`,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        text: "ECG Machine #AST-004 battery replaced.",
        user: `Tech. ${tech1.name}`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        text: "Quarterly inspection completed for ICU Ward B.",
        user: "Manager Silva",
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000), // 1.1 days ago
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

main();
