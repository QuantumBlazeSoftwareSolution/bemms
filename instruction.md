# BEMMS (Biomedical Equipment Maintenance Management System)

## Core Objective
Build a high-performance, minimalist, and polished Biomedical Equipment Maintenance Management System for Sri Lankan hospitals. The system must bridge the gap between manual logbooks and modern digital workflows, focusing on equipment uptime, patient safety, and technical accountability.

## Tech Stack Requirements
- **Framework**: Latest Next.js (App Router) with TypeScript.
- **Styling**: Tailwind CSS for a minimalist, "Medical-grade" UI.
- **Components**: Shadcn UI for polished forms, tables, and buttons.
- **Animations**: Framer Motion for subtle, professional transitions and page loads.
- **Database**: No database connection required for the frontend implementation. Use mock data.
- **Storage**: Integrated support for Image Uploads (Vercel Blob/Cloudinary) for fault documentation.
- **Icons**: Lucide React (Clean and Minimal).

## Visual Language & UI/UX
- **Theme**: Professional Hospital UI. Use a clean "Healthcare White" background with "Stethoscope Blue" (#0056b3) and "Clinical Gray" accents.
- **Layout**: Dashboard-driven with a sidebar navigation. Every page must feel spacious and uncluttered (Minimalist).
- **Dashboard**: Must include real-time metrics for Total Equipment, Pending Maintenance, and Overdue Calibrations. Use ApexCharts for maintenance trend visualization.

## User Roles & Access Control
- **Administrator/Manager**: Full oversight, technician performance monitoring, and resource allocation.
- **Biomedical Engineer/Technician**: View assigned tasks, log service records, and track equipment history.
- **Clinical User (Nurses/Doctors)**: Quick fault reporting via QR codes and status tracking.

## Key Modules to Build
- **Asset Management**: Centralized equipment list with metadata, Department-wise categorization, Unique QR code generation.
- **Smart Fault Reporting**: Guided fault reporting, Image upload functionality, Automated priority indicators.
- **Enhanced Technician Allocation**: Automatic Technician Allocation based on equipment type, workload, and availability.
- **Integrated Maintenance & Calibration**: Unified scheduler, Automated email/notification alerts, Comprehensive service logs.
- **Managerial Performance Dashboard**: Analytics on service completion patterns, Uptime reports and cost-saving estimates.

## Specific UI Components Needed
- **QR Scanner Component**: For mobile users to scan equipment tags.
- **Timeline View**: To see the full service history of a specific machine.
- **Multi-step Form**: For adding new maintenance records with a polished look.
