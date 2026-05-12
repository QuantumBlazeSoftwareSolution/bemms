"use client"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

import { maintenanceTrendData, deptUptime } from "@/lib/data"

export function MaintenanceTrendChart() {
  const options = {
    chart: { id: "maintenance-trend", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#0056b3", "#ef4444"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" as const, width: 2 },
    xaxis: { categories: maintenanceTrendData.months, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val: number) => val.toFixed(0) } },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    legend: { position: "top" as const },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  }
  const series = [
    { name: "Completed Tasks", data: maintenanceTrendData.completed },
    { name: "Fault Reports", data: maintenanceTrendData.faults },
  ]
  return <Chart options={options} series={series} type="area" height={280} width="100%" />
}

export function UptimeBarChart() {
  const options = {
    chart: { id: "uptime", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#0056b3"],
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    dataLabels: { enabled: true, formatter: (val: number) => `${val}%` },
    xaxis: { categories: deptUptime.map(d => d.dept), min: 80, max: 100 },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
  }
  const series = [{ name: "Uptime %", data: deptUptime.map(d => d.uptime) }]
  return <Chart options={options} series={series} type="bar" height={220} width="100%" />
}

export function TechnicianDonutChart() {
  const options = {
    chart: { id: "tech-donut", fontFamily: "inherit" },
    colors: ["#0056b3", "#f59e0b", "#ef4444"],
    labels: ["Completed", "In Progress", "Pending"],
    dataLabels: { enabled: true },
    legend: { position: "bottom" as const },
  }
  const series = [37, 8, 5]
  return <Chart options={options} series={series} type="donut" height={220} width="100%" />
}
