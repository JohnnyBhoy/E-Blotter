import React, { ReactNode } from "react";

type StatCardProps = {
    label: string;
    value: number | string;
    /** Short line under the value, e.g. "Awaiting action". */
    subtext: ReactNode;
    /** Colour of the subtext, one of the style guide accents. */
    subtextClass?: string;
    icon: ReactNode;
    /** Background of the icon tile. */
    iconClass: string;
};

/** One of the four summary cards across the top of the dashboard. */
const StatCard = ({ label, value, subtext, subtextClass = "text-[#64748B]", icon, iconClass }: StatCardProps) => (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#64748B] dark:text-bodydark">
                    {label}
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0F172A] dark:text-white">
                    {value}
                </p>
            </div>

            <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                {icon}
            </span>
        </div>

        <p className={`mt-3 text-xs font-medium ${subtextClass}`}>{subtext}</p>
    </div>
);

export default StatCard;
