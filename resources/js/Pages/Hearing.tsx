import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { ArrowClockwise, Search, X } from "react-bootstrap-icons";

import { ActionButtons } from "@/Components/ActionButtons";
import useTableExport from "@/Components/Barangay/Breakdown/useTableExport";
import FilterDropdown, { FilterOption } from "@/Components/Blotter/FilterDropdown";
import TableBody from "@/Components/Blotter/TableBody";
import TableHead, { SortDirection, SortKey } from "@/Components/Blotter/TableHead";
import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/Pages/types";

const PER_PAGE_OPTIONS: number[] = [10, 20, 50, 100];
const TABLE_ID = "content-to-export";

/**
 * The four dispositions, in the order a case moves through them. Keep the ids
 * in step with utils/data/disposition.ts and the route map in
 * BlotterController::getBlotterByRemarks().
 */
const TABS: { route: string; url: string; label: string; description: string; accent: string }[] = [
    {
        route: "hearing",
        url: "/hearing",
        label: "For Hearing",
        description: "Cases scheduled for a barangay hearing.",
        accent: "text-primary border-primary",
    },
    {
        route: "pending",
        url: "/pending",
        label: "Pending",
        description: "Cases recorded but not yet acted on.",
        accent: "text-warning border-warning",
    },
    {
        route: "settled",
        url: "/settled",
        label: "Amicably Settled",
        description: "Cases closed by agreement between the parties.",
        accent: "text-success border-success",
    },
    {
        route: "referred",
        url: "/referred",
        label: "Referred to PNP",
        description: "Cases endorsed to the police station.",
        accent: "text-danger border-danger",
    },
];

/**
 * Case disposition list.
 *
 * Both the per-page and the search form used to submit to `blotter.blotters`,
 * which threw the user off this page and onto the unfiltered blotter list on
 * the first interaction. Every request now reloads the current disposition
 * route with its filters intact.
 */
export default function CaseDisposition({ auth, blotters, counts, routeName, pageDisplay, pageNumber, keyword, sort, direction }:
    PageProps<{
        blotters: any;
        counts: Record<string, number>;
        routeName: string;
        pageDisplay: number;
        pageNumber: number;
        keyword: string;
        sort: SortKey;
        direction: SortDirection;
    }>) {

    const active = TABS.find((tab) => tab.route === routeName) ?? TABS[0];

    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(keyword ?? "");

    const { targetRef, handleDownload, handleDownloadExcel, handlePrint } =
        useTableExport(active.label, TABLE_ID);

    const { data, setData, processing, get } = useForm<any>({
        keyword: keyword ?? "",
        per_page: pageDisplay ?? 10,
        page: pageNumber ?? 1,
        sort: sort ?? "id",
        direction: direction ?? "desc",
    });

    const busy = processing || isFetching;

    const applyFilters = (overrides: Record<string, any>) => {
        const next = { ...data, page: 1, ...overrides };

        setOpenFilter(null);
        setData(next);

        router.get(active.url, next, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => setIsFetching(true),
            onFinish: () => setIsFetching(false),
        });
    };

    // Pagination submits this form, so it keeps the useForm path.
    const handleChangePage = (event: any) => {
        event.preventDefault();
        setOpenFilter(null);

        return get(active.url, { preserveScroll: true, preserveState: true, replace: true });
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
        ...(blotters?.total ? [{ value: blotters.total, label: `All (${blotters.total})` }] : []),
    ];

    const from = blotters?.from ?? 0;
    const to = blotters?.to ?? 0;
    const total = blotters?.total ?? 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Case Disposition</h2>
            }
        >
            <Head title={`${active.label} — Case Disposition`} />

            <Breadcrumb pageName="Case Disposition" />

            <div className="flex flex-col gap-4">

                {/** Disposition tabs */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex overflow-x-auto">
                        {TABS.map((tab) => {
                            const isActive = tab.route === active.route;

                            return (
                                <Link
                                    key={tab.route}
                                    href={tab.url}
                                    preserveScroll
                                    className={`flex min-w-[10rem] flex-1 items-center justify-between gap-3 whitespace-nowrap border-b-2 px-5 py-4 text-sm transition ${isActive
                                        ? `${tab.accent} font-semibold`
                                        : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-bodydark1 dark:hover:bg-meta-4"
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${isActive
                                        ? "bg-primary/10 text-primary dark:bg-meta-4 dark:text-white"
                                        : "bg-slate-100 text-slate-500 dark:bg-meta-4 dark:text-bodydark1"
                                        }`}>
                                        {counts?.[tab.route] ?? 0}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/** Toolbar */}
                <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p className="text-sm text-slate-500 dark:text-bodydark1">{active.description}</p>

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

                            {keyword ? (
                                <button
                                    type="button"
                                    onClick={() => { setSearchTerm(""); applyFilters({ keyword: "" }); }}
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
                                onSubmit={(event) => { event.preventDefault(); applyFilters({ keyword: searchTerm }); }}
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
                            <TableBody blotters={blotters?.data} setData={setData} />
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
                        links={blotters?.links}
                        handleChangePage={handleChangePage}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
