"use client"

import dynamic from "next/dynamic"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function MaintenanceTrendChart() {
  const options = {
    chart: {
      id: "maintenance-trend",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    colors: ["#0056b3"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" as const, width: 2 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
  }

  const series = [
    {
      name: "Maintenance Requests",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 110, 90],
    },
  ]

  return (
    <div className="w-full h-[300px]">
      <Chart options={options} series={series} type="area" height={300} width="100%" />
    </div>
  )
}
