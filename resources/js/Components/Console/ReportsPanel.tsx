import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { CircleHalf, ExclamationTriangleFill, InboxFill } from "react-bootstrap-icons";

import Modal from "@/Components/Blotter/ui/Modal";
import TabBar from "@/Components/Blotter/ui/TabBar";
import { formatDate } from "@/Components/Barangay/Dashboard/format";
import IncidentBadge from "@/Components/Barangay/Dashboard/IncidentBadge";
import { getStatusStyle } from "@/Components/Barangay/Dashboard/status";

type ReportsPanelProps = {
    onClose: () => void;
    /** Open one entry in the blotter modal, so a report row is still actionable. */
    onOpenEntry: (id: number) => void;
};

type MonthCount = { month: number; count: number };

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const TABS = [
    { id: "monthly", label: "Monthly Report" },
    { id: "daily", label: "Daily Report" },
];

const now = new Date();

/**
 * The standalone Monthly and Daily report pages, folded into one panel.
 *
 * Picking a month on the monthly tab used to be a page load that lost the
 * console; here it switches to the daily tab with that month already applied.
 */
const ReportsPanel = ({ onClose, onOpenEntry }: ReportsPanelProps) => {
    const [tab, setTab] = useState<string>("monthly");
    const [year, setYear] = useState<number>(now.getFullYear());
    const [month, setMonth] = useState<number>(now.getMonth() + 1);

    const [monthly, setMonthly] = useState<MonthCount[] | null>(null);
    const [daily, setDaily] = useState<any[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<string>("");

    // Years worth offering: the current one and the four before it.
    const years = useMemo(
        () => Array.from({ length: 5 }, (_, index) => now.getFullYear() - index),
        [],
    );

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setFailed("");

        const request =
            tab === "monthly"
                ? axios.get("/blotter/monthly", { params: { blotterYear: year } })
                : axios.get("/blotter/daily", {
                      params: { blotterYear: year, blotterMonth: month },
                  });

        request
            .then(({ data }) => {
                if (cancelled) return;

                if (tab === "monthly") setMonthly(data.monthlyBlotters ?? []);
                else setDaily(data.dailyBlotters ?? []);
            })
            .catch(() => {
                if (!cancelled) setFailed("The report could not be loaded. Please try again.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [tab, year, month]);

    /** Drill from a month straight into that month's entries. */
    const openMonth = (value: number) => {
        setMonth(value);
        setTab("daily");
    };

    const selectClass =
        "h-10 rounded-lg border border-stroke bg-white px-3 text-sm text-black focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-strokedark dark:bg-form-input dark:text-white";

    const monthlyTotal = (monthly ?? []).reduce((sum, row) => sum + Number(row.count), 0);

    return (
        <Modal
            open
            onClose={onClose}
            title="Blotter Reports"
            subtitle="Entry counts by month, and the entries behind any one of them."
            toolbar={<TabBar tabs={TABS} current={tab} onSelect={setTab} />}
            footer={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-body dark:text-bodydark">
                        {tab === "monthly"
                            ? `${monthlyTotal} entr${monthlyTotal === 1 ? "y" : "ies"} recorded in ${year}`
                            : `${daily?.length ?? 0} entr${daily?.length === 1 ? "y" : "ies"} in ${MONTHS[month - 1]} ${year}`}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 items-center rounded-lg border border-stroke px-4 text-sm font-medium text-black transition hover:bg-whiten dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                        Close
                    </button>
                </div>
            }
        >
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-body dark:text-bodydark" htmlFor="report-year">
                    Year
                </label>
                <select
                    id="report-year"
                    value={year}
                    onChange={(event) => setYear(Number(event.target.value))}
                    className={selectClass}
                >
                    {years.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>

                {tab === "daily" && (
                    <>
                        <label className="ml-2 text-xs font-medium text-body dark:text-bodydark" htmlFor="report-month">
                            Month
                        </label>
                        <select
                            id="report-month"
                            value={month}
                            onChange={(event) => setMonth(Number(event.target.value))}
                            className={selectClass}
                        >
                            {MONTHS.map((label, index) => (
                                <option key={label} value={index + 1}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>

            {loading ? (
                <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3">
                    <CircleHalf size={22} className="animate-spin text-primary" />
                    <p className="text-sm text-body dark:text-bodydark">Loading the report...</p>
                </div>
            ) : failed ? (
                <div className="flex min-h-[14rem] flex-col items-center justify-center gap-2 text-center">
                    <ExclamationTriangleFill size={24} className="text-danger" />
                    <p className="text-sm font-medium text-black dark:text-white">{failed}</p>
                </div>
            ) : tab === "monthly" ? (
                <MonthlyGrid rows={monthly ?? []} onPick={openMonth} />
            ) : (
                <DailyTable rows={daily ?? []} onOpenEntry={onOpenEntry} />
            )}
        </Modal>
    );
};

/** Twelve month cards, each opening that month's entries. */
const MonthlyGrid = ({
    rows,
    onPick,
}: {
    rows: MonthCount[];
    onPick: (month: number) => void;
}) => {
    const byMonth = new Map(rows.map((row) => [Number(row.month), Number(row.count)]));
    const highest = Math.max(1, ...rows.map((row) => Number(row.count)));

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {MONTHS.map((label, index) => {
                const count = byMonth.get(index + 1) ?? 0;

                return (
                    <button
                        key={label}
                        type="button"
                        onClick={() => onPick(index + 1)}
                        className="rounded-xl border border-stroke bg-white p-4 text-left transition hover:border-primary hover:shadow-sm dark:border-strokedark dark:bg-boxdark"
                    >
                        <span className="block text-xs font-medium text-body dark:text-bodydark">
                            {label}
                        </span>
                        <span className="mt-1 block text-2xl font-semibold text-black dark:text-white">
                            {count}
                        </span>

                        {/* Bar against the busiest month, so the year reads at a glance. */}
                        <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9] dark:bg-meta-4">
                            <span
                                className="block h-full rounded-full bg-primary"
                                style={{ width: `${(count / highest) * 100}%` }}
                            />
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

/** The entries behind one month, each opening in the blotter modal. */
const DailyTable = ({
    rows,
    onOpenEntry,
}: {
    rows: any[];
    onOpenEntry: (id: number) => void;
}) => {
    if (!rows.length) {
        return (
            <div className="py-14 text-center">
                <InboxFill size={26} className="mx-auto mb-2 text-[#CBD5E1]" />
                <p className="text-sm font-medium text-black dark:text-white">
                    No entries in this month
                </p>
                <p className="mt-1 text-xs text-body dark:text-bodydark">
                    Pick another month or year above.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <table className="w-full min-w-[44rem] text-left">
                <thead>
                    <tr className="border-b border-stroke dark:border-strokedark">
                        {["Entry No.", "Date", "Type of Case", "Complainant", "Status", ""].map(
                            (heading) => (
                                <th
                                    key={heading}
                                    className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]"
                                >
                                    {heading}
                                </th>
                            ),
                        )}
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row) => {
                        const status = getStatusStyle(row.remarks);

                        return (
                            <tr
                                key={row.id}
                                className="border-b border-[#F1F5F9] last:border-0 dark:border-strokedark"
                            >
                                <td className="whitespace-nowrap px-4 py-2.5 text-sm font-semibold text-[#2563EB]">
                                    {row.entry_number}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2.5 text-sm text-black dark:text-white">
                                    {formatDate(row.date_reported ?? row.created_at)}
                                </td>
                                <td className="max-w-[14rem] px-4 py-2.5">
                                    <IncidentBadge id={Number(row.incident_type)} />
                                </td>
                                <td className="px-4 py-2.5 text-sm text-black dark:text-white">
                                    {[row.complainant_first_name, row.complainant_family_name]
                                        .filter(Boolean)
                                        .join(" ") || "—"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2.5">
                                    <span
                                        className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${status.badge}`}
                                    >
                                        {status.label}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2.5 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onOpenEntry(row.id)}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Open
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsPanel;
