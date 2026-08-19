import React, { ReactNode } from "react";
import {
    Buildings,
    CheckCircle,
    FileEarmarkText,
    Activity,
    People,
    PersonLinesFill,
} from "react-bootstrap-icons";
import { ConsoleScope, DashboardSummary } from "@/Components/Barangay/Dashboard/types";

type Stat = {
    label: string;
    value: number;
    /** Small supporting line under the number. */
    note: string;
    noteClass?: string;
    icon: ReactNode;
    iconClass: string;
};

/**
 * One statistic, deliberately three rows tall -- label, number, supporting
 * line -- so five of them fit across the console without pushing the charts
 * and the blotter table below the fold.
 */
const Card = ({ stat }: { stat: Stat }) => (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${stat.iconClass}`}>
                {stat.icon}
            </span>

            <p className="min-w-0 truncate text-xs font-medium text-[#64748B] dark:text-bodydark">
                {stat.label}
            </p>
        </div>

        <p className="mt-1.5 text-2xl font-bold leading-none text-[#0F172A] dark:text-white">
            {stat.value.toLocaleString()}
        </p>

        <p className={`mt-1 text-[11px] ${stat.noteClass ?? "text-[#64748B]"}`}>{stat.note}</p>
    </div>
);

/**
 * The headline figures, all scoped to the selected date range and to the
 * viewer's jurisdiction.
 *
 * A barangay sees five: it is the only unit reporting, so a coverage card would
 * always read 1 of 1. Every rollup level gets a sixth showing how many of the
 * units below it actually filed anything in the range -- the quickest way to see
 * which barangays have gone quiet.
 */
const StatCards = ({
    summary,
    scope,
}: {
    summary: DashboardSummary;
    scope: ConsoleScope;
}) => {
    const trend = summary.trend;

    const stats: Stat[] = [
        {
            label: "Total Blotter Entries",
            value: summary.total,
            note:
                trend === 0
                    ? "No change vs previous period"
                    : `${trend > 0 ? "+" : ""}${trend} vs previous period`,
            noteClass:
                trend > 0 ? "text-[#16A34A]" : trend < 0 ? "text-[#EF4444]" : "text-[#64748B]",
            icon: <FileEarmarkText size={14} className="text-[#2563EB]" />,
            iconClass: "bg-[#EFF6FF]",
        },
        {
            label: "Active Cases",
            value: summary.active,
            note: "Pending & ongoing",
            noteClass: "text-[#D97706]",
            icon: <Activity size={14} className="text-[#16A34A]" />,
            iconClass: "bg-[#DCFCE7]",
        },
        {
            label: "Resolved Cases",
            value: summary.resolved,
            note: `${summary.resolvedRate}% of total`,
            noteClass: "text-[#16A34A]",
            icon: <CheckCircle size={14} className="text-[#D97706]" />,
            iconClass: "bg-[#FEF3C7]",
        },
        {
            label: "Total Complainants",
            value: summary.complainants,
            note: "In selected period",
            icon: <People size={14} className="text-[#7C3AED]" />,
            iconClass: "bg-[#EDE9FE]",
        },
        {
            label: "Persons Involved",
            value: summary.personsInvolved,
            note: "Complainants & respondents",
            icon: <PersonLinesFill size={14} className="text-[#0891B2]" />,
            iconClass: "bg-[#CFFAFE]",
        },
    ];

    if (scope.level !== "barangay") {
        stats.push({
            label: `${scope.childLabelPlural} Reporting`,
            value: summary.areasReporting,
            note: `Of ${summary.barangayCount.toLocaleString()} barangay accounts`,
            icon: <Buildings size={14} className="text-[#1E40AF]" />,
            iconClass: "bg-[#DBEAFE]",
        });
    }

    return (
        <div
            className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${
                stats.length > 5 ? "xl:grid-cols-6" : "xl:grid-cols-5"
            }`}
        >
            {stats.map((stat) => (
                <Card key={stat.label} stat={stat} />
            ))}
        </div>
    );
};

export default StatCards;
