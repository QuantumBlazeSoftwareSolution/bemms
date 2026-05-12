export type AssetStatus = "OPERATIONAL" | "UNDER_MAINTENANCE" | "OUT_OF_SERVICE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskType = "PREVENTIVE" | "CALIBRATION" | "REPAIR";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type UserRole = "ADMIN" | "TECHNICIAN" | "CLINICAL";

export const assets = [
  { id: "AST-001", name: "Defibrillator", brand: "Philips", model: "HeartStart Intrepid", serialNumber: "PHL-89321", department: "Emergency", supplier: "Philips Lanka", status: "OPERATIONAL" as AssetStatus, lastMaintenance: "2026-04-10", nextCalibration: "2026-10-10", maintenanceFrequency: "Quarterly" },
  { id: "AST-002", name: "MRI Scanner", brand: "Siemens", model: "MAGNETOM Lumina", serialNumber: "SIE-11200", department: "Radiology", supplier: "Siemens Healthineers", status: "UNDER_MAINTENANCE" as AssetStatus, lastMaintenance: "2026-03-15", nextCalibration: "2027-03-15", maintenanceFrequency: "Annually" },
  { id: "AST-003", name: "Ventilator", brand: "Medtronic", model: "Puritan Bennett 980", serialNumber: "MED-55441", department: "ICU", supplier: "Medtronic Lanka", status: "OPERATIONAL" as AssetStatus, lastMaintenance: "2026-05-01", nextCalibration: "2026-11-01", maintenanceFrequency: "Monthly" },
  { id: "AST-004", name: "ECG Machine", brand: "GE Healthcare", model: "MAC 2000", serialNumber: "GEH-90822", department: "Cardiology", supplier: "GE Healthcare", status: "OUT_OF_SERVICE" as AssetStatus, lastMaintenance: "2025-12-20", nextCalibration: "2026-06-20", maintenanceFrequency: "Daily" },
  { id: "AST-005", name: "Infusion Pump", brand: "B. Braun", model: "Infusomat Space", serialNumber: "BBR-33211", department: "ICU Ward B", supplier: "B. Braun Lanka", status: "OPERATIONAL" as AssetStatus, lastMaintenance: "2026-02-14", nextCalibration: "2026-08-14", maintenanceFrequency: "Bi-Weekly" },
  { id: "AST-006", name: "Patient Monitor", brand: "Mindray", model: "MEC-2000", serialNumber: "MDR-44120", department: "OT", supplier: "Mindray Lanka", status: "OPERATIONAL" as AssetStatus, lastMaintenance: "2026-04-28", nextCalibration: "2026-07-28", maintenanceFrequency: "Monthly" },
];

export const maintenanceTasks = [
  { id: "TSK-101", assetId: "AST-002", assetName: "MRI Scanner", department: "Radiology", technicianId: "TECH-001", technician: "Silva A.", type: "REPAIR" as TaskType, scheduledDate: "2026-05-10", status: "IN_PROGRESS" as TaskStatus, priority: "HIGH" as Priority, timeSpent: "3h", spareParts: "Cooling Fan x1", notes: "Cooling system replaced" },
  { id: "TSK-102", assetId: "AST-004", assetName: "ECG Machine", department: "Cardiology", technicianId: "TECH-002", technician: "Fernando K.", type: "PREVENTIVE" as TaskType, scheduledDate: "2026-05-12", status: "PENDING" as TaskStatus, priority: "MEDIUM" as Priority, timeSpent: "", spareParts: "", notes: "" },
  { id: "TSK-103", assetId: "AST-001", assetName: "Defibrillator", department: "Emergency", technicianId: "TECH-003", technician: "Kumara P.", type: "CALIBRATION" as TaskType, scheduledDate: "2026-05-08", status: "COMPLETED" as TaskStatus, priority: "HIGH" as Priority, timeSpent: "1.5h", spareParts: "None", notes: "Annual calibration completed. Within tolerance." },
  { id: "TSK-104", assetId: "AST-005", assetName: "Infusion Pump", department: "ICU Ward B", technicianId: "TECH-001", technician: "Silva A.", type: "PREVENTIVE" as TaskType, scheduledDate: "2026-05-14", status: "PENDING" as TaskStatus, priority: "LOW" as Priority, timeSpent: "", spareParts: "", notes: "" },
  { id: "TSK-105", assetId: "AST-006", assetName: "Patient Monitor", department: "OT", technicianId: "TECH-002", technician: "Fernando K.", type: "CALIBRATION" as TaskType, scheduledDate: "2026-05-09", status: "COMPLETED" as TaskStatus, priority: "MEDIUM" as Priority, timeSpent: "2h", spareParts: "Battery Pack x2", notes: "Battery replaced, display calibrated." },
];

export const technicians = [
  { id: "TECH-001", name: "Silva A.", specialty: "Radiology & Imaging Equipment", activeTasks: 2, completedThisMonth: 15, avgResponseTime: "2.4h", repeatFaults: 1, pendingWork: 2, status: "Available" },
  { id: "TECH-002", name: "Fernando K.", specialty: "Life Support Systems", activeTasks: 4, completedThisMonth: 12, avgResponseTime: "3.8h", repeatFaults: 3, pendingWork: 4, status: "Busy" },
  { id: "TECH-003", name: "Kumara P.", specialty: "General Electronics & Monitoring", activeTasks: 1, completedThisMonth: 22, avgResponseTime: "1.9h", repeatFaults: 0, pendingWork: 1, status: "Available" },
];

export const recentActivity = [
  { time: "10 mins ago", text: "Defibrillator #AST-001 calibration completed.", user: "Tech. Kumara P." },
  { time: "1 hour ago", text: "New fault reported: MRI Scanner cooling issue.", user: "Dr. Perera" },
  { time: "3 hours ago", text: "Ventilator #AST-003 preventive maintenance done.", user: "Tech. Fernando K." },
  { time: "Yesterday", text: "ECG Machine #AST-004 battery replaced.", user: "Tech. Silva A." },
  { time: "Yesterday", text: "Quarterly inspection completed for ICU Ward B.", user: "Manager. Silva" },
];

// Tasks assigned to logged-in technician (TECH-001 = Silva A.)
export const myAssignedTasks = maintenanceTasks.filter(t => t.technicianId === "TECH-001");

// Fault reports submitted by clinical users
export const submittedFaults = [
  { id: "FLT-001", assetId: "AST-002", assetName: "MRI Scanner", category: "Mechanical", description: "Loud grinding noise from gantry area during scan.", priority: "HIGH" as Priority, status: "IN_PROGRESS", submittedBy: "Dr. Perera", submittedAt: "2026-05-11 09:15", department: "Radiology" },
  { id: "FLT-002", assetId: "AST-004", assetName: "ECG Machine", category: "Software / Display", description: "Screen flickering and freezing after 30 mins of use.", priority: "MEDIUM" as Priority, status: "OPEN", submittedBy: "Nurse Kumari", submittedAt: "2026-05-10 14:30", department: "Cardiology" },
  { id: "FLT-003", assetId: "AST-003", assetName: "Ventilator", category: "Power / Electrical", description: "Battery alarm triggering even when plugged in.", priority: "CRITICAL" as Priority, status: "RESOLVED", submittedBy: "Dr. Bandara", submittedAt: "2026-05-09 07:00", department: "ICU" },
];

// Alert banners for dashboards
export const alerts = [
  { type: "overdue", message: "ECG Machine #AST-004 calibration is 21 days overdue.", link: "/assets/AST-004" },
  { type: "upcoming", message: "Ventilator #AST-003 PM scheduled for tomorrow (2026-05-13).", link: "/assets/AST-003" },
  { type: "critical", message: "Critical fault reported on MRI Scanner — technician assigned.", link: "/fault-report" },
];

// Monthly trend data for charts
export const maintenanceTrendData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  completed: [18, 24, 20, 30, 28, 35, 40, 52, 60, 48, 55, 45],
  faults: [12, 10, 15, 18, 14, 20, 22, 30, 25, 20, 28, 22],
};

// Uptime per department
export const deptUptime = [
  { dept: "ICU", uptime: 98.5 },
  { dept: "Emergency", uptime: 99.1 },
  { dept: "Radiology", uptime: 91.2 },
  { dept: "Cardiology", uptime: 87.4 },
  { dept: "OT", uptime: 96.8 },
];
