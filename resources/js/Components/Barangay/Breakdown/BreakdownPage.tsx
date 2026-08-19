import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { ArrowClockwise, Search, X } from "react-bootstrap-icons";

import { ActionButtons } from "@/Components/ActionButtons";
import FilterDropdown, { FilterOption } from "@/Components/Blotter/FilterDropdown";
import TableBody from "@/Components/Blotter/TableBody";
import TableHead, { SortDirection, SortKey } from "@/Components/Blotter/TableHead";
import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreakdownList, { BreakdownItem } from "./BreakdownList";
import useTableExport from "./useTableExport";

const PER_PAGE_OPTIONS: number[] = [10, 20, 50, 100];
const TABLE_ID = "content-to-export";

/**
 * Shared shell for the two barangay drill-down pages (by incident type, by
 * purok). Both show the same thing: a breakdown rail on the left, and the
 * matching blotter entries -- searchable, sortable and server-paginated -- on
 * the right.
 */
export default function BreakdownPage({
    user,
    title,
    subtitle,
    breadcrumb,
    url,
    filterKey,
    filterLabel,
    items,
    selected,
    selectedLabel,
    entries,
    pageDisplay,
    pageNumber,
    keyword,
    sort,
    direction,
    exportName,
}: {
    user: any;
    title: string;
    subtitle: string;
    breadcrumb: string;
    /** Server route this page reloads through, e.g. "/barangay-incidents". */
    url: string;
    /** Query-string key carrying the selection, e.g. "incident_type". */
    filterKey: string;
    filterLabel: string;
    items: BreakdownItem[];
    selected: string | number | null;
    selectedLabel: string | null;
    entries: any;
    pageDisplay: number;
    pageNumber: number;
    keyword: string;
    sort: SortKey;
    direction: SortDirection;
    exportName: string;
}) {
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(keyword ?? "");

    const { targetRef, handleDownload, handleDownloadExcel, handlePrint } =
        useTableExport(exportName, TABLE_ID);

    // Mirrors the active query string so Pagination (which submits this form)
    // keeps the selection and the search when it moves between pages.
    const { data, setData, processing, get } = useForm<any>({
        [filterKey]: selected ?? "",
        keyword: keyword ?? "",
        per_page: pageDisplay ?? 10,
        page: pageNumber ?? 1,
        sort: sort ?? "id",
        direction: direction ?? "desc",
    });

    const busy = processing || isFetching;

    /** Any filter change resets to page 1 -- narrowing while on page 7 would
     *  otherwise land on an empty page. */
    const applyFilters = (overrides: Record<string, any>) => {
        const next = { ...data, page: 1, ...overrides };

        setOpenFilter(null);
        setData(next);

        router.get(url, next, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => setIsFetching(true),
            onFinish: () => setIsFetching(false),
        });
    };

    const handleChangePage = (event: any) => {
        event.preventDefault();
        setOpenFilter(null);

        return get(url, { preserveScroll: true, preserveState: true, replace: true });
    };

    const handleSort = (key: SortKey) => {
        const isSameColumn = data.sort === key;

        applyFilters({
            sort: key,
            direction: isSameColumn && data.direction === "asc" ? "desc" : "asc",
        });
    };

    const perPageOptions: FilterOption[] = [
        ...PER_PAGE_OPTIONS.map((entry) => ({ value: entry, label: `${entry} per page` })),
        ...(entries?.total ? [{ value: entries.total, label: `All (${entries.total})` }] : []),
    ];

    const from = entries?.from ?? 0;
    const to = entries?.to ?? 0;
    const total = entries?.total ?? 0;

    const hasFilters = Boolean(selected) || Boolean(keyword);

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">{title}</h2>
            }
        >
            <Head title={title} />

            <Breadcrumb pageName={breadcrumb} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[19rem_minmax(0,1fr)]">

                <BreakdownList
                    title={filterLabel}
                    items={items}
                    selected={selected}
                    onSelect={(value) => applyFilters({ [filterKey]: value ?? "" })}
                    searchPlaceholder={`Find ${filterLabel.toLowerCase()}...`}
                    busy={busy}
                />

                <div className="flex min-w-0 flex-col gap-4">

                    {/** Heading + toolbar */}
                    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-base font-semibold text-black dark:text-white">
                                {selectedLabel ?? `All ${breadcrumb.toLowerCase()}`}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-bodydark1">{subtitle}</p>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 border-t border-stroke pt-3 dark:border-strokedark lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex flex-wrap items-center gap-2">
                                <FilterDropdown
                                    id="per-page"
                                    label="Rows"
                                    options={perPageOptions}
                                    selected={data.per_page}
                                    openId={openFilter}
                                    setOpenId={setOpenFilter}
                                    onSelect={(value) => applyFilters({ per_page: value })}
                                    widthClass="w-[9rem]"
                                    disabled={busy}
                                />

                                {hasFilters ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm("");
                                            applyFilters({ [filterKey]: "", keyword: "" });
                                        }}
                                        disabled={busy}
                                        className="flex items-center gap-1 rounded border border-danger px-3 py-2 text-sm text-danger transition hover:bg-danger hover:text-white disabled:opacity-60"
                                    >
                                        <ArrowClockwise size={13} /> Reset
                                    </button>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex">
                                    <ActionButtons
                                        onDownload={handleDownload}
                                        onExportToExcel={handleDownloadExcel}
                                        onPrint={handlePrint}
                                    />
                                </div>

                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        applyFilters({ keyword: searchTerm });
                                    }}
                                    className="flex items-stretch"
                                >
                                    <div className="relative">
                                        <input
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            type="text"
                                            placeholder="Search keywords..."
                                            className="w-full rounded-l border border-slate-300 py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-primary focus:ring-0 dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1 sm:w-52"
                                        />
                                        {searchTerm ? (
                                            <button
                                                type="button"
                                                aria-label="Clear search"
                                                onClick={() => { setSearchTerm(""); applyFilters({ keyword: "" }); }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        ) : null}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={busy}
                                        aria-label="Search entries"
                                        className="rounded-r bg-primary px-3 text-white transition hover:opacity-90 disabled:opacity-60"
                                    >
                                        <Search size={14} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/** Table */}
                    <div className="relative rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        {busy ? (
                            <div className="absolute inset-0 z-99 flex items-center justify-center bg-white/70 dark:bg-boxdark/70">
                                <span className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent" />
                            </div>
                        ) : null}

                        <div className="max-w-full overflow-x-auto" id={TABLE_ID} ref={targetRef}>
                            <table className="w-full min-w-[60rem] border-collapse">
                                <TableHead sort={data.sort} direction={data.direction} onSort={handleSort} />
                                <TableBody blotters={entries?.data} setData={setData} />
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                        <h6 className="text-sm text-slate-600 dark:text-bodydark1">
                            {total > 0
                                ? <>Showing <b>{from}</b> to <b>{to}</b> of <b>{total}</b> entries</>
                                : <>No entries to show</>}
                        </h6>

                        <Pagination
                            setData={setData}
                            links={entries?.links}
                            handleChangePage={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
