import React from "react";
import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    InboxFill,
    PlusLg,
    Search,
    ThreeDots,
} from "react-bootstrap-icons";
import IncidentBadge from "./IncidentBadge";
import { formatBlotterNo, formatDate, formatTime } from "./format";
import { getStatusStyle } from "./status";
import { BlotterRecord, Paginated } from "./types";

type RecentBlotterRecordsProps = {
    records: Paginated<BlotterRecord>;
    search: string;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
};

const HEADINGS = [
    "Blotter No.",
    "Incident",
    "Complainant",
    "Respondent",
    "Location",
    "Date & Time",
    "Status",
    "Action",
];

/** Paginated, searchable feed of the barangay's most recent blotter entries. */
const RecentBlotterRecords = ({
    records,
    search,
    onSearchChange,
    onPageChange,
}: RecentBlotterRecordsProps) => {
    const { data, current_page: currentPage, last_page: lastPage, from, to, total } = records;

    return (
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-3 border-b border-[#E5E7EB] p-5 dark:border-strokedark lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">
                    Recent Blotter Records
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                        <Search
                            size={14}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Search blotter, complainant, address..."
                            aria-label="Search blotter records"
                            className="w-full rounded-lg border-[#E5E7EB] py-2 pl-9 pr-3 text-sm text-[#334155] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-[#2563EB] dark:border-strokedark dark:bg-form-input dark:text-bodydark1 sm:w-72"
                        />
                    </div>

                    <Link
                        href="/blotter"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                    >
                        <PlusLg size={12} />
                        New Blotter
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[64rem] text-left">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-strokedark">
                            {HEADINGS.map((heading) => (
                                <th
                                    key={heading}
                                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={HEADINGS.length} className="px-5 py-14 text-center">
                                    <InboxFill size={28} className="mx-auto mb-3 text-[#CBD5E1]" />
                                    <p className="text-sm font-medium text-[#334155] dark:text-bodydark1">
                                        No blotter records found
                                    </p>
                                    <p className="mt-1 text-xs text-[#64748B]">
                                        Try a wider date range or a different search term.
                                    </p>
                                </td>
                            </tr>
                        )}

                        {data.map((record) => {
                            const status = getStatusStyle(record.remarks);

                            return (
                                <tr
                                    key={record.id}
                                    className="border-b border-[#F1F5F9] last:border-0 transition hover:bg-[#F8FAFC] dark:border-strokedark dark:hover:bg-meta-4"
                                >
                                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#2563EB]">
                                        <Link href={`/blotter/edit?id=${record.id}`}>
                                            {formatBlotterNo(record)}
                                        </Link>
                                    </td>

                                    <td className="max-w-[14rem] px-5 py-4">
                                        <IncidentBadge id={record.incident_type} />
                                    </td>

                                    <td className="px-5 py-4 text-sm text-[#334155] dark:text-bodydark1">
                                        {record.complainant || "—"}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-[#334155] dark:text-bodydark1">
                                        {record.respondent || "Unknown"}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-[#334155] dark:text-bodydark1">
                                        {record.location || "—"}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4">
                                        <p className="text-sm text-[#334155] dark:text-bodydark1">
                                            {formatDate(record.date_reported || record.created_at)}
                                        </p>
                                        <p className="text-xs text-[#64748B]">
                                            {formatTime(record.time_of_report)}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.badge}`}
                                        >
                                            {status.label}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <Link
                                            href={`/blotter/edit?id=${record.id}`}
                                            title="Open entry"
                                            aria-label={`Open ${formatBlotterNo(record)}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                                        >
                                            <ThreeDots size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E5E7EB] p-5 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#64748B]">
                    {total > 0
                        ? `Showing ${from} to ${to} of ${total} entries`
                        : "No entries to show"}
                </p>

                <div className="flex items-center gap-4">
                    {lastPage > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                aria-label="Previous page"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#64748B] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-strokedark"
                            >
                                <ChevronLeft size={12} />
                            </button>

                            <span className="px-2 text-xs font-medium text-[#334155] dark:text-bodydark1">
                                {currentPage} / {lastPage}
                            </span>

                            <button
                                type="button"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= lastPage}
                                aria-label="Next page"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#64748B] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-strokedark"
                            >
                                <ChevronRight size={12} />
                            </button>
                        </div>
                    )}

                    <Link
                        href="/blotter/blotters"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                        View all blotter records
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecentBlotterRecords;
