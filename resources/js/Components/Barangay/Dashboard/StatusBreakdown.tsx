import React from "react";
import { percentOf } from "./format";
import { getStatusStyle } from "./status";
import { StatusCount } from "./types";

/**
 * Horizontal bar list of entries per case disposition. Shows all five
 * dispositions rather than the three rolled-up buckets, so a barangay can see
 * exactly how its cases were closed.
 */
const StatusBreakdown = ({ data }: { data: StatusCount[] }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">
                Blotters by Status
            </h2>

            <ul className="mt-4 space-y-3">
                {data.map((item) => {
                    const status = getStatusStyle(item.id);

                    return (
                        <li key={item.id} className="flex items-center gap-3">
                            <span className="w-32 flex-shrink-0 truncate text-sm text-[#334155] dark:text-bodydark1">
                                {status.label}
                            </span>

                            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#F1F5F9] dark:bg-meta-4">
                                <span
                                    className="block h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${percentOf(item.count, total)}%`,
                                        backgroundColor: status.color,
                                    }}
                                />
                            </span>

                            <span className="w-8 flex-shrink-0 text-right text-sm font-semibold text-[#0F172A] dark:text-white">
                                {item.count}
                            </span>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-[#E5E7EB] pt-3 dark:border-strokedark">
                <span className="text-sm font-semibold text-[#334155] dark:text-bodydark1">
                    Total
                </span>
                <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                    {total}
                </span>
            </div>
        </div>
    );
};

export default StatusBreakdown;
