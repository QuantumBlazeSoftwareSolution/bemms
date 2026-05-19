"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MaintenanceTrendProps {
  completed?: number[];
  faults?: number[];
  months?: string[];
}

export function MaintenanceTrendChart({ 
  completed = [18, 24, 20, 30, 28, 35, 40, 52, 60, 48, 55, 45], 
  faults = [12, 10, 15, 18, 14, 20, 22, 30, 25, 20, 28, 22],
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
}: MaintenanceTrendProps) {
  const options = {
    chart: { id: "maintenance-trend", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#0056b3", "#ef4444"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" as const, width: 2 },
    xaxis: { categories: months, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val: number) => val.toFixed(0) } },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    legend: { position: "top" as const },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  };
  const series = [
    { name: "Completed Tasks", data: completed },
    { name: "Fault Reports", data: faults },
  ];
  return <Chart options={options} series={series} type="area" height={280} width="100%" />;
}

interface UptimeBarProps {
  data?: { dept: string; uptime: number }[];
}

export function UptimeBarChart({ 
  data = [
    { dept: "ICU", uptime: 98.5 },
    { dept: "Emergency", uptime: 99.1 },
    { dept: "Radiology", uptime: 91.2 },
    { dept: "Cardiology", uptime: 87.4 },
    { dept: "OT", uptime: 96.8 }
  ]
}: UptimeBarProps) {
  const options = {
    chart: { id: "uptime", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#0056b3"],
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    dataLabels: { enabled: true, formatter: (val: number) => `${val}%` },
    xaxis: { categories: data.map(d => d.dept), min: 80, max: 100 },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
  };
  const series = [{ name: "Uptime %", data: data.map(d => d.uptime) }];
  return <Chart options={options} series={series} type="bar" height={220} width="100%" />;
}

interface DonutProps {
  series?: number[]; // [completed, in_progress, pending]
}

export function TechnicianDonutChart({ 
  series = [37, 8, 5] 
}: DonutProps) {
  const options = {
    chart: { id: "tech-donut", fontFamily: "inherit" },
    colors: ["#10b981", "#f59e0b", "#ef4444"], // Emerald, Amber, Red for statuses
    labels: ["Completed", "In Progress", "Pending"],
    dataLabels: { enabled: true },
    legend: { position: "bottom" as const },
  };
  return <Chart options={options} series={series} type="donut" height={220} width="100%" />;
}
