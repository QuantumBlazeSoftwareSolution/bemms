export type AssetStatus = "OPERATIONAL" | "UNDER_MAINTENANCE" | "OUT_OF_SERVICE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskType = "PREVENTIVE" | "CALIBRATION" | "REPAIR";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export const assets = [
  {
    id: "AST-001",
    name: "Defibrillator",
    brand: "Philips",
    model: "HeartStart Intrepid",
    serialNumber: "PHL-89321",
    department: "Emergency",
    status: "OPERATIONAL" as AssetStatus,
    lastMaintenance: "2026-04-10",
    nextCalibration: "2026-10-10",
  },
  {
    id: "AST-002",
    name: "MRI Scanner",
    brand: "Siemens",
    model: "MAGNETOM Lumina",
    serialNumber: "SIE-11200",
    department: "Radiology",
    status: "UNDER_MAINTENANCE" as AssetStatus,
    lastMaintenance: "2026-03-15",
    nextCalibration: "2027-03-15",
  },
  {
    id: "AST-003",
    name: "Ventilator",
    brand: "Medtronic",
    model: "Puritan Bennett 980",
    serialNumber: "MED-55441",
    department: "ICU",
    status: "OPERATIONAL" as AssetStatus,
    lastMaintenance: "2026-05-01",
    nextCalibration: "2026-11-01",
  },
  {
    id: "AST-004",
    name: "ECG Machine",
    brand: "GE Healthcare",
    model: "MAC 2000",
    serialNumber: "GEH-90822",
    department: "Cardiology",
    status: "OUT_OF_SERVICE" as AssetStatus,
    lastMaintenance: "2025-12-20",
    nextCalibration: "2026-06-20",
  },
  {
    id: "AST-005",
    name: "Infusion Pump",
    brand: "B. Braun",
    model: "Infusomat Space",
    serialNumber: "BBR-33211",
    department: "ICU Ward B",
    status: "OPERATIONAL" as AssetStatus,
    lastMaintenance: "2026-02-14",
    nextCalibration: "2026-08-14",
  },
];

export const maintenanceTasks = [
  {
    id: "TSK-101",
    assetId: "AST-002",
    assetName: "MRI Scanner",
    technician: "Silva A.",
    type: "REPAIR" as TaskType,
    scheduledDate: "2026-05-10",
    status: "IN_PROGRESS" as TaskStatus,
    priority: "HIGH" as Priority,
  },
  {
    id: "TSK-102",
    assetId: "AST-004",
    assetName: "ECG Machine",
    technician: "Fernando K.",
    type: "PREVENTIVE" as TaskType,
    scheduledDate: "2026-05-12",
    status: "PENDING" as TaskStatus,
    priority: "MEDIUM" as Priority,
  },
  {
    id: "TSK-103",
    assetId: "AST-001",
    assetName: "Defibrillator",
    technician: "Kumara P.",
    type: "CALIBRATION" as TaskType,
    scheduledDate: "2026-05-08",
    status: "COMPLETED" as TaskStatus,
    priority: "HIGH" as Priority,
  },
];

export const technicians = [
  {
    id: "TECH-001",
    name: "Silva A.",
    specialty: "Radiology Equipment",
    activeTasks: 2,
    completedThisMonth: 15,
    status: "Available",
  },
  {
    id: "TECH-002",
    name: "Fernando K.",
    specialty: "Life Support",
    activeTasks: 4,
    completedThisMonth: 12,
    status: "Busy",
  },
  {
    id: "TECH-003",
    name: "Kumara P.",
    specialty: "General Electronics",
    activeTasks: 1,
    completedThisMonth: 22,
    status: "Available",
  },
];

export const recentActivity = [
  { time: "10 mins ago", text: "Defibrillator #AST-001 calibration completed.", user: "Tech. Kumara P." },
  { time: "1 hour ago", text: "New fault reported: MRI Scanner cooling issue.", user: "Dr. Perera" },
  { time: "3 hours ago", text: "Ventilator #AST-003 preventive maintenance done.", user: "Tech. Fernando K." },
  { time: "Yesterday", text: "ECG Machine #AST-004 battery replaced.", user: "Tech. Silva A." },
  { time: "Yesterday", text: "Quarterly inspection completed for ICU Ward B.", user: "Manager. Silva" },
];
