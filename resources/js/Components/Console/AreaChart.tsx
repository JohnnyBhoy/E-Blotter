import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { BarChartLine } from "react-bootstrap-icons";
import { AreaCount, ConsoleScope } from "@/Components/Barangay/Dashboard/types";
import { getAreaName } from "@/utils/functions/getAreaName";

/** Beyond this the axis labels stop being readable, so the tail is dropped. */
const MAX_BARS = 6;

/**
 * Blotter entries per area, one level below the viewer: puroks for a barangay,
 * barangays for a station, cities for a province, provinces for a region and
 * regions for the super admin.
 *
 * A barangay's puroks are the complainant's recorded village, so entries with a
 * blank village never appear -- see BlotterRepository::getPurokBreakdown().
 * Everything above is grouped by PSGC code and named here, from utils/data.
 */
const AreaChart = ({ data, scope }: { data: AreaCount[]; scope: ConsoleScope }) => {
    const top = useMemo(
        () =>
            data.slice(0, MAX_BARS).map((row) => ({
                name: getAreaName(scope.level, row),
                count: row.count,
            })),
        [data, scope.level],
    );

    const options = useMemo<ApexOptions>(
        () => ({
            chart: {
                type: "bar",
                fontFamily: "Satoshi, sans-serif",
                toolbar: { show: false },
            },
            colors: ["#2563EB"],
            plotOptions: {
                bar: { borderRadius: 4, columnWidth: "45%", distributed: false },
            },
            dataLabels: {
                enabled: true,
                offsetY: -18,
                style: { fontSize: "11px", colors: ["#334155"] },
            },
            grid: {
                borderColor: "#F1F5F9",
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
            },
            legend: { show: false },
            xaxis: {
                categories: top.map((item) => item.name),
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                    style: { colors: "#94A3B8", fontSize: "11px" },
                    // Long area names would otherwise overlap on a narrow column.
                    formatter: (value: string) =>
                        value?.length > 12 ? `${value.slice(0, 11)}…` : value,
                },
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
        [top],
    );

    return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                Cases by {scope.childLabel}
            </h2>

            {top.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <BarChartLine size={26} className="mb-2 text-[#CBD5E1]" />
                    <p className="text-sm text-[#64748B]">
                        No {scope.childLabel.toLowerCase()} recorded in this range
                    </p>
                </div>
            ) : (
                <div className="-ml-3 mt-1">
                    <ReactApexChart
                        options={options}
                        series={[{ name: "Entries", data: top.map((item) => item.count) }]}
                        type="bar"
                        height={230}
                    />
                </div>
            )}
        </div>
    );
};

export default AreaChart;
