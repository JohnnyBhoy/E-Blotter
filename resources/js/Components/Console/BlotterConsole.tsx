import React from "react";
import {
    CaretDownFill,
    CaretUpFill,
    ChevronLeft,
    ChevronRight,
    Download,
    EyeFill,
    InboxFill,
    PencilSquare,
    PlusLg,
    Search,
    Trash,
} from "react-bootstrap-icons";
import disposition from "@/utils/data/disposition";
import incidentTypes from "@/utils/data/incidentTypes";
import { confirmDeleteBlotter } from "@/utils/functions/blotterActions";
import IncidentBadge from "@/Components/Barangay/Dashboard/IncidentBadge";
import { formatBlotterNo, formatDate, formatTime } from "@/Components/Barangay/Dashboard/format";
import { getStatusStyle } from "@/Components/Barangay/Dashboard/status";
import {
    AreaCount,
    BlotterRecord,
    ConsoleScope,
    ConsoleSortKey,
    DashboardFilters,
    Paginated,
} from "@/Components/Barangay/Dashboard/types";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import { areaFilterValue, getAreaName } from "@/utils/functions/getAreaName";

type Column = {
    label: string;
    /** Columns without a key are not sortable server-side. */
    key?: ConsoleSortKey;
    align?: string;
};

/**
 * A barangay knows every entry is its own, so it gets the purok. Every rollup
 * level needs to know which barangay filed the entry instead -- one table there
 * holds entries from many of them.
 */
const columnsFor = (scope: ConsoleScope): Column[] => [
    { label: "Blotter No.", key: "entry_number" },
    { label: "Date & Time", key: "date" },
    { label: "Type of Case", key: "incident_type" },
    { label: "Complainant", key: "complainant" },
    { label: "Accused / Respondent", key: "respondent" },
    scope.level === "barangay"
        ? { label: "Purok", key: "purok" }
        : { label: "Barangay", align: "" },
    { label: "Status", key: "remarks" },
    { label: "Action", align: "text-right" },
];

type BlotterConsoleProps = {
    records: Paginated<BlotterRecord>;
    filters: DashboardFilters;
    /** Puroks for a barangay, the level below for everyone above it. */
    areas: AreaCount[];
    scope: ConsoleScope;
    search: string;
    userRole: number;
    canDelete: boolean;
    /** Whether this account may correct entries from the modal. */
    canEdit: boolean;
    /** Open the read-only modal for one entry. */
    onView: (id: number) => void;
    /** Open the edit modal for one entry. */
    onEdit: (id: number) => void;
    /** Open the modal on a blank entry. */
    onCreate: () => void;
    onSearchChange: (value: string) => void;
    onFilterChange: (changes: Record<string, string | number>) => void;
    onSort: (key: ConsoleSortKey) => void;
    onPageChange: (page: number) => void;
    onReset: () => void;
    onExport: () => void;
};

const selectClass =
    "rounded-lg border-[#E5E7EB] bg-white py-2 text-sm text-[#334155] focus:border-[#2563EB] focus:ring-[#2563EB] dark:border-strokedark dark:bg-form-input dark:text-bodydark1";

const labelClass = "mb-1 block text-[11px] font-medium text-[#64748B]";

/**
 * The main working area: every blotter entry inside the viewer's jurisdiction,
 * filtered and sorted on the server. Search, filters, sorting and pagination all
 * round-trip to the console route, so nothing is narrowed in the browser.
 */
const BlotterConsole = ({
    records,
    filters,
    areas,
    scope,
    search,
    userRole,
    canDelete,
    canEdit,
    onView,
    onEdit,
    onCreate,
    onSearchChange,
    onFilterChange,
    onSort,
    onPageChange,
    onReset,
    onExport,
}: BlotterConsoleProps) => {
    const { data, current_page: currentPage, last_page: lastPage, from, to, total } = records;
    const columns = columnsFor(scope);
    const isBarangay = scope.level === "barangay";

    // A barangay narrows by purok name; every level above narrows by the PSGC
    // code of one unit below it.
    const areaValue = isBarangay ? filters.purok : String(filters.area || "");

    const hasFilters =
        Boolean(filters.search) ||
        filters.remarks > 0 ||
        filters.incidentType > 0 ||
        Boolean(filters.purok) ||
        filters.area > 0;

    // A short window of page buttons either side of the current page: a
    // barangay with hundreds of entries would otherwise render every number.
    const pages = Array.from({ length: lastPage }, (_, index) => index + 1).filter(
        (page) =>
            page === 1 ||
            page === lastPage ||
            (page >= currentPage - 1 && page <= currentPage + 1),
    );

    return (
        <div
            id="blotter-console"
            className="rounded-lg border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-strokedark dark:bg-boxdark"
        >
            <div className="flex flex-col gap-3 border-b border-[#E5E7EB] p-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                    Blotter Entries
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={onExport}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#334155] transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-strokedark dark:text-bodydark1"
                    >
                        <Download size={13} />
                        Export Report
                    </button>

                    {/* Only a barangay encodes entries; the rollup levels read them. */}
                    {scope.canEncode && (
                        <button
                            type="button"
                            onClick={onCreate}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                        >
                            <PlusLg size={12} />
                            New Blotter Entry
                        </button>
                    )}
                </div>
            </div>

            {/* Search and filters. Every control narrows the same server query. */}
            <div className="border-b border-[#E5E7EB] p-4 dark:border-strokedark">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <label className={labelClass} htmlFor="console-search">
                            Search
                        </label>

                        <div className="relative">
                            <Search
                                size={13}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                            />

                            <input
                                id="console-search"
                                type="search"
                                value={search}
                                onChange={(event) => onSearchChange(event.target.value)}
                                placeholder="Search by Blotter No., Complainant, Accused, or Incident..."
                                className="w-full rounded-lg border-[#E5E7EB] py-2 pl-9 pr-3 text-sm text-[#334155] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-[#2563EB] dark:border-strokedark dark:bg-form-input dark:text-bodydark1"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <label className={labelClass} htmlFor="console-type">
                            Case Type
                        </label>

                        <select
                            id="console-type"
                            value={filters.incidentType}
                            onChange={(event) =>
                                onFilterChange({ incident_type: Number(event.target.value) })
                            }
                            className={`w-full ${selectClass}`}
                        >
                            <option value={0}>All</option>
                            {incidentTypes.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item?.value?.split(" - ")[1] ?? item?.value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="lg:col-span-2">
                        <label className={labelClass} htmlFor="console-area">
                            {scope.childLabel}
                        </label>

                        <select
                            id="console-area"
                            value={areaValue}
                            onChange={(event) =>
                                onFilterChange(
                                    isBarangay
                                        ? { purok: event.target.value }
                                        : { area: Number(event.target.value) || 0 },
                                )
                            }
                            className={`w-full ${selectClass}`}
                        >
                            <option value="">All</option>
                            {areas.map((item) => (
                                <option
                                    key={`${item.code}-${item.name ?? ""}`}
                                    value={areaFilterValue(scope.level, item)}
                                >
                                    {getAreaName(scope.level, item)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="lg:col-span-2">
                        <label className={labelClass} htmlFor="console-status">
                            Status
                        </label>

                        <select
                            id="console-status"
                            value={filters.remarks}
                            onChange={(event) =>
                                onFilterChange({ remarks: Number(event.target.value) })
                            }
                            className={`w-full ${selectClass}`}
                        >
                            <option value={0}>All</option>
                            {disposition.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item.value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end lg:col-span-2">
                        <button
                            type="button"
                            onClick={onReset}
                            disabled={!hasFilters}
                            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#334155] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-strokedark dark:text-bodydark1"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[68rem] text-left">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-strokedark">
                            {columns.map((column) => {
                                const isSorted = Boolean(column.key) && column.key === filters.sort;

                                return (
                                    <th
                                        key={column.label}
                                        scope="col"
                                        aria-sort={
                                            isSorted
                                                ? filters.direction === "asc"
                                                    ? "ascending"
                                                    : "descending"
                                                : undefined
                                        }
                                        className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#64748B] ${column.align ?? ""}`}
                                    >
                                        {column.key ? (
                                            <button
                                                type="button"
                                                onClick={() => onSort(column.key!)}
                                                className={`flex items-center gap-1 whitespace-nowrap transition hover:text-[#2563EB] ${isSorted ? "text-[#2563EB]" : ""}`}
                                            >
                                                {column.label}
                                                <span className="flex flex-col leading-none">
                                                    <CaretUpFill
                                                        size={6}
                                                        className={
                                                            isSorted && filters.direction === "asc"
                                                                ? "opacity-100"
                                                                : "opacity-30"
                                                        }
                                                    />
                                                    <CaretDownFill
                                                        size={6}
                                                        className={
                                                            isSorted && filters.direction === "desc"
                                                                ? "opacity-100"
                                                                : "opacity-30"
                                                        }
                                                    />
                                                </span>
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-14 text-center">
                                    <InboxFill size={26} className="mx-auto mb-2 text-[#CBD5E1]" />
                                    <p className="text-sm font-medium text-[#334155] dark:text-bodydark1">
                                        No blotter entries found
                                    </p>
                                    <p className="mt-1 text-xs text-[#64748B]">
                                        Try a wider date range, a different search term, or reset the filters.
                                    </p>
                                </td>
                            </tr>
                        )}

                        {data.map((record) => {
                            const status = getStatusStyle(record.remarks);

                            return (
                                <tr
                                    key={record.id}
                                    className="border-b border-[#F1F5F9] transition last:border-0 hover:bg-[#F8FAFC] dark:border-strokedark dark:hover:bg-meta-4"
                                >
                                    <td className="whitespace-nowrap px-4 py-2.5 text-sm font-semibold text-[#2563EB]">
                                        <button
                                            type="button"
                                            onClick={() => onView(record.id)}
                                            className="hover:underline"
                                        >
                                            {formatBlotterNo(record)}
                                        </button>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2.5 text-sm text-[#334155] dark:text-bodydark1">
                                        {formatDate(record.date_reported || record.created_at)}
                                        <span className="ml-1 text-xs text-[#64748B]">
                                            {formatTime(record.time_of_report)}
                                        </span>
                                    </td>

                                    <td className="max-w-[13rem] px-4 py-2.5">
                                        <IncidentBadge id={record.incident_type} />
                                    </td>

                                    <td className="px-4 py-2.5 text-sm text-[#334155] dark:text-bodydark1">
                                        {record.complainant || "—"}
                                    </td>

                                    <td className="px-4 py-2.5 text-sm text-[#334155] dark:text-bodydark1">
                                        {record.respondent || "—"}
                                    </td>

                                    <td className="px-4 py-2.5 text-sm text-[#334155] dark:text-bodydark1">
                                        {isBarangay
                                            ? record.purok || "—"
                                            : getBarangayByBrgyCode(record.barangay_code) || "—"}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2.5">
                                        <span
                                            className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${status.badge}`}
                                        >
                                            {status.label}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2.5 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => onView(record.id)}
                                                title="View entry"
                                                aria-label={`View ${formatBlotterNo(record)}`}
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                                            >
                                                <EyeFill size={13} />
                                            </button>

                                            {canEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(record.id)}
                                                    title="Edit entry"
                                                    aria-label={`Edit ${formatBlotterNo(record)}`}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                                                >
                                                    <PencilSquare size={13} />
                                                </button>
                                            )}

                                            {/* Barangay accounts have never been able to remove
                                                entries -- removal is escalated to the municipal
                                                admin -- so the button is withheld rather than
                                                shown and refused. */}
                                            {canDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => confirmDeleteBlotter(record.id, userRole)}
                                                    title="Delete entry"
                                                    aria-label={`Delete ${formatBlotterNo(record)}`}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                                                >
                                                    <Trash size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E5E7EB] p-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#64748B]">
                    {total > 0
                        ? `Showing ${from} to ${to} of ${total} entries`
                        : "No entries to show"}
                </p>

                {lastPage > 1 && (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            aria-label="Previous page"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E7EB] text-[#64748B] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-strokedark"
                        >
                            <ChevronLeft size={11} />
                        </button>

                        {pages.map((page, index) => (
                            <React.Fragment key={page}>
                                {index > 0 && page - pages[index - 1] > 1 && (
                                    <span className="px-1 text-xs text-[#94A3B8]">…</span>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onPageChange(page)}
                                    aria-current={page === currentPage ? "page" : undefined}
                                    className={`inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md px-1.5 text-xs font-medium transition ${
                                        page === currentPage
                                            ? "bg-[#2563EB] text-white"
                                            : "border border-[#E5E7EB] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] dark:border-strokedark"
                                    }`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        ))}

                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= lastPage}
                            aria-label="Next page"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E7EB] text-[#64748B] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-strokedark"
                        >
                            <ChevronRight size={11} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlotterConsole;
