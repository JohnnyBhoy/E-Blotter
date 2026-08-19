import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { MonthlySeries } from "@/Components/Barangay/Dashboard/types";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Blotter entries per month, this year against last, so a barangay can see at
 * a glance whether cases are rising or falling. Always a full-year comparison,
 * independent of the dashboard's date range.
 */
const TrendChart = ({ data }: { data: MonthlySeries }) => {
    const options = useMemo<ApexOptions>(
        () => ({
            chart: {
                type: "line",
                fontFamily: "Satoshi, sans-serif",
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            colors: ["#2563EB", "#CBD5E1"],
            stroke: { width: [3, 2], curve: "smooth", dashArray: [0, 5] },
            markers: { size: 4, strokeWidth: 0, hover: { size: 6 } },
            dataLabels: { enabled: false },
            grid: {
                borderColor: "#F1F5F9",
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                fontSize: "12px",
                markers: { radius: 12 },
                labels: { colors: "#64748B" },
            },
            xaxis: {
                categories: MONTHS,
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
            },
            yaxis: {
                min: 0,
                forceNiceScale: true,
                labels: {
                    style: { colors: "#94A3B8", fontSize: "11px" },
                    formatter: (value: number) => `${Math.round(value)}`,
                },
            },
            tooltip: { y: { formatter: (value: number) => `${value} entries` } },
        }),
        [],
    );

    const series = useMemo(
        () => [
            { name: `This Year (${data.year})`, data: data.current },
            { name: `Last Year (${data.previousYear})`, data: data.previous },
        ],
        [data],
    );

    return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                Blotter Entries Overview
            </h2>

            <div className="-ml-3 mt-1">
                <ReactApexChart options={options} series={series} type="line" height={230} />
            </div>
        </div>
    );
};

export default TrendChart;
