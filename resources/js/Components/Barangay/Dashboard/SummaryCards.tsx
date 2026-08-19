import React from "react";
import {
    ArrowRepeat,
    CheckCircle,
    FileEarmarkText,
    HourglassSplit,
} from "react-bootstrap-icons";
import StatCard from "./StatCard";
import { DashboardSummary } from "./types";

/**
 * The four headline figures. Every value is scoped to the selected date range,
 * and the three case buckets roll up the five stored dispositions.
 */
const SummaryCards = ({ summary }: { summary: DashboardSummary }) => {
    const trend = summary.trend;
    const trendLabel =
        trend === 0
            ? "No change vs previous period"
            : `${trend > 0 ? "+" : ""}${trend} vs previous period`;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                label="Total Blotters"
                value={summary.total}
                subtext={trendLabel}
                subtextClass={
                    trend > 0
                        ? "text-[#16A34A]"
                        : trend < 0
                            ? "text-[#EF4444]"
                            : "text-[#64748B]"
                }
                icon={<FileEarmarkText size={20} className="text-[#2563EB]" />}
                iconClass="bg-[#EFF6FF]"
            />

            <StatCard
                label="Pending"
                value={summary.pending}
                subtext="Awaiting action"
                subtextClass="text-[#D97706]"
                icon={<HourglassSplit size={20} className="text-[#F59E0B]" />}
                iconClass="bg-[#FEF3C7]"
            />

            <StatCard
                label="In Progress"
                value={summary.inProgress}
                subtext="Under investigation"
                subtextClass="text-[#2563EB]"
                icon={<ArrowRepeat size={20} className="text-[#3B82F6]" />}
                iconClass="bg-[#EFF6FF]"
            />

            <StatCard
                label="Resolved"
                value={summary.resolved}
                subtext={`${summary.resolvedRate}% of total`}
                subtextClass="text-[#16A34A]"
                icon={<CheckCircle size={20} className="text-[#16A34A]" />}
                iconClass="bg-[#DCFCE7]"
            />
        </div>
    );
};

export default SummaryCards;
