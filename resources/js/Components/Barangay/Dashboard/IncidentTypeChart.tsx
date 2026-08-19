import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { PieChart } from "react-bootstrap-icons";
import getIncidentType from "@/utils/functions/getIncidentType";
import getIncidentTypeShort from "@/utils/functions/getIncidentTypeShort";
import { percentOf } from "./format";
import { IncidentTypeCount } from "./types";

/** Five named slices plus a grey "Others" bucket, as in the reference layout. */
const TOP_SLICES = 5;

const SLICE_COLORS = ["#EF4444", "#8B5CF6", "#F59E0B", "#16A34A", "#2563EB"];
const OTHERS_COLOR = "#CBD5E1";

type Slice = {
    label: string;
    title: string;
    count: number;
    color: string;
};

/** Donut of blotter entries by incident type for the selected date range. */
const IncidentTypeChart = ({ data }: { data: IncidentTypeCount[] }) => {
    const slices = useMemo<Slice[]>(() => {
        const top = data.slice(0, TOP_SLICES).map((item, index) => ({
            label: getIncidentTypeShort(item.id),
            title: getIncidentType(item.id),
            count: item.count,
            color: SLICE_COLORS[index],
        }));

        const othersCount = data
            .slice(TOP_SLICES)
            .reduce((sum, item) => sum + item.count, 0);

        if (othersCount > 0) {
            top.push({
                label: "Others",
                title: `${data.length - TOP_SLICES} other incident types`,
                count: othersCount,
                color: OTHERS_COLOR,
            });
        }

        return top;
    }, [data]);

    const total = slices.reduce((sum, slice) => sum + slice.count, 0);

    const options = useMemo<ApexOptions>(
        () => ({
            chart: {
                type: "donut",
                fontFamily: "Satoshi, sans-serif",
                toolbar: { show: false },
            },
            colors: slices.map((slice) => slice.color),
            labels: slices.map((slice) => slice.label),
            stroke: { width: 0 },
            dataLabels: { enabled: false },
            legend: { show: false },
            tooltip: {
                y: { formatter: (value: number) => `${value} entries` },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "72%",
                        labels: {
                            show: true,
                            value: {
                                fontSize: "26px",
                                fontWeight: 700,
                                color: "#0F172A",
                                offsetY: 4,
                            },
                            total: {
                                show: true,
                                label: "Total",
                                fontSize: "12px",
                                color: "#64748B",
                                formatter: () => `${total}`,
                            },
                        },
                    },
                },
            },
        }),
        [slices, total],
    );

    return (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                Cases by Type
            </h2>

            {total === 0 ? (
                <div className="flex flex-col items-center justify-center py-14">
                    <PieChart size={28} className="mb-3 text-[#CBD5E1]" />
                    <p className="text-sm text-[#64748B]">
                        No entries in the selected range
                    </p>
                </div>
            ) : (
                <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row">
                    <div className="w-full max-w-[13rem] flex-shrink-0">
                        <ReactApexChart
                            options={options}
                            series={slices.map((slice) => slice.count)}
                            type="donut"
                        />
                    </div>

                    <ul className="w-full space-y-2.5">
                        {slices.map((slice) => (
                            <li
                                key={slice.label}
                                className="flex items-center gap-2 text-sm"
                                title={slice.title}
                            >
                                <span
                                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                    style={{ backgroundColor: slice.color }}
                                />

                                <span className="min-w-0 flex-1 truncate text-[#334155] dark:text-bodydark1">
                                    {slice.label}
                                </span>

                                <span className="font-semibold text-[#0F172A] dark:text-white">
                                    {slice.count}
                                </span>

                                <span className="w-12 text-right text-xs text-[#64748B]">
                                    ({percentOf(slice.count, total)}%)
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default IncidentTypeChart;
