import { PageProps } from "@/Pages/types";
import { router, useForm } from "@inertiajs/react";
import React, { useMemo, useState } from "react";

import FilterDropdown, { FilterOption } from "@/Components/Blotter/FilterDropdown";
import TableBody from "@/Components/Blotter/TableBody";
import TableHead, { SortDirection, SortKey } from "@/Components/Blotter/TableHead";
import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import barangays from "@/utils/data/barangays";
import disposition from "@/utils/data/disposition";
import incidentTypes from "@/utils/data/incidentTypes";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getBarangayByCityCode from "@/utils/functions/getBarangayByCityCode";
import getIncidentType from "@/utils/functions/getIncidentType";
import getRemark from "@/utils/functions/getRemark";
import getUserRole from "@/utils/functions/getUserRole";
import { ArrowClockwise, FunnelFill, Search, X } from "react-bootstrap-icons";

import { ActionButtons } from "@/Components/ActionButtons";
import { usePDF } from 'react-to-pdf';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

// Each role reaches the blotter list through its own route group. Regional
// accounts (5) have no blotter route at all, so they get an empty string and
// every fetch is skipped rather than blowing up inside route().
const LIST_ROUTE_BY_ROLE: Record<number, string> = {
    1: 'blotter.admin.blotters',
    2: 'blotter.blotters',
    3: 'blotter.municipal.blotters',
    4: 'blotter.province.blotters',
};

const PER_PAGE_OPTIONS: number[] = [10, 20, 50, 100];

export default function Blotters({ auth, blotters, message, pageDisplay, pageNumber, keyword, cityCode, brgyCode, remark, incidentType, brgyWithRecords, sort, direction }:
    PageProps<{
        blotters: any;
        message: string;
        pageDisplay: string;
        pageNumber: string;
        keyword: string;
        cityCode: number;
        brgyCode: number;
        remark: number;
        incidentType: number;
        brgyWithRecords: object[];
        sort: SortKey;
        direction: SortDirection;
    }>) {

    // User details
    const userRole = Number(getUserRole());

    // React to PDF
    const { toPDF, targetRef } = usePDF({ filename: `Blotter_Copy.pdf` });

    // Get barangays with blotter records
    const barangayWithBlotterRecords = brgyWithRecords?.map((item: any) => item?.barangay_code);

    const redirectUrl = LIST_ROUTE_BY_ROLE[userRole] ?? "";

    // Local state
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(keyword ?? "");

    // Form data. It stays in sync with every filter change so the pagination
    // links (which submit this form) carry the active filters with them.
    const { data, setData, processing, get } = useForm({
        id: 0,
        keyword: keyword ?? "",
        per_page: pageDisplay ?? 10,
        page: pageNumber ?? 1,
        brgy_code: brgyCode,
        remarks: remark,
        incident_type: incidentType,
        sort: sort ?? 'id',
        direction: direction ?? 'desc',
    });

    const busy = processing || isFetching;

    const barangayOptions: FilterOption[] = useMemo(() => {
        const source: any[] = cityCode == null
            ? barangays
                ?.filter((item: any) => barangayWithBlotterRecords?.includes(parseInt(item?.brgy_code)))
                ?.sort((a: any, b: any) => a.brgy_name.localeCompare(b.brgy_name))
            : getBarangayByCityCode(cityCode);

        return source?.map((item: any) => ({
            value: parseInt(item?.brgy_code),
            label: item?.brgy_name,
        })) ?? [];
    }, [cityCode, brgyWithRecords]);

    const remarkOptions: FilterOption[] = disposition.map((item: any) => ({
        value: item.id,
        label: item.value,
    }));

    const incidentOptions: FilterOption[] = incidentTypes.map((item: any) => ({
        value: item.id,
        // Strip the statute prefix so the list reads as plain offence names.
        label: item?.value?.split(" - ")[1] ?? item?.value,
    }));

    const perPageOptions: FilterOption[] = [
        ...PER_PAGE_OPTIONS.map((entry) => ({ value: entry, label: `${entry} per page` })),
        ...(blotters?.total ? [{ value: blotters.total, label: `All (${blotters.total})` }] : []),
    ];

    /**
     * Push a filter change to the server. Any filter change resets to page 1 --
     * otherwise narrowing the results while on page 7 lands on an empty page.
     */
    const applyFilters = (overrides: Record<string, any>) => {
        if (!redirectUrl) return;

        const next: any = { ...data, page: 1, ...overrides };

        setOpenFilter(null);
        setData(next);

        router.get(route(redirectUrl), next, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => setIsFetching(true),
            onFinish: () => setIsFetching(false),
        });
    };

    // Pagination submits the form itself, so it keeps the useForm path.
    const handleFetchBlotters = (e: any) => {
        e.preventDefault();

        if (!redirectUrl) return;

        setOpenFilter(null);

        return get(route(redirectUrl), { preserveScroll: true, preserveState: true, replace: true });
    }

    const handleSort = (key: SortKey) => {
        const isSameColumn = data.sort === key;

        applyFilters({
            sort: key,
            direction: isSameColumn && data.direction === 'asc' ? 'desc' : 'asc',
        });
    }

    const handleResetFilters = () => {
        setSearchTerm("");
        applyFilters({ keyword: "", brgy_code: 0, remarks: 0, incident_type: 0 });
    }

    // Chips summarising what is currently narrowing the list.
    const activeFilters = [
        keyword ? { key: 'keyword', label: `Search: "${keyword}"`, clear: () => { setSearchTerm(""); applyFilters({ keyword: "" }); } } : null,
        brgyCode ? { key: 'brgy', label: `Barangay: ${getBarangayByBrgyCode(brgyCode)}`, clear: () => applyFilters({ brgy_code: 0 }) } : null,
        remark ? { key: 'remark', label: `Remark: ${getRemark(Number(remark))}`, clear: () => applyFilters({ remarks: 0 }) } : null,
        incidentType ? { key: 'type', label: `Type: ${getIncidentType(incidentType)?.split(" - ")[1] ?? getIncidentType(incidentType)}`, clear: () => applyFilters({ incident_type: 0 }) } : null,
    ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

    // Download a PDF copy
    const handleDownload = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will save PDF copy to your local computer!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!"
        }).then((result) => {
            if (result.isConfirmed) {
                toPDF();
                Swal.fire({
                    title: "Downloaded!",
                    text: "Your PDF file has been downloaded.",
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                });
            }
        });
    }

    // Download excel copy
    const handleDownloadExcel = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will save copy to your local computer!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const table = document.getElementById('content-to-export');
                const ws = XLSX.utils.table_to_sheet(table); // Convert table to worksheet
                const wb = XLSX.utils.book_new(); // Create a new workbook
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append worksheet to workbook

                // Generate a downloadable Excel file
                XLSX.writeFile(wb, 'Blotter Reports.xlsx');

                Swal.fire({
                    title: "Downloaded!",
                    text: "Your file has been downloaded.",
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                });
            }
        });
    };

    /**
     * Print the table through a throwaway iframe.
     *
     * The previous implementation assigned the table markup to
     * `document.body.innerHTML`, which tore the React tree out of the DOM -- the
     * app was dead until the user reloaded the page.
     */
    const handlePrint = (divId: string) => {
        const node = document.getElementById(divId);

        if (!node) return;

        const frame = document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
        document.body.appendChild(frame);

        const frameDoc = frame.contentWindow?.document;

        if (!frameDoc) {
            document.body.removeChild(frame);
            return;
        }

        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map((element) => element.outerHTML)
            .join('');

        frameDoc.open();
        frameDoc.write(`<html><head><title>Blotter Records</title>${styles}</head><body class="bg-white p-4">${node.innerHTML}</body></html>`);
        frameDoc.close();

        const triggerPrint = () => {
            frame.contentWindow?.focus();
            frame.contentWindow?.print();
            window.setTimeout(() => frame.parentNode && document.body.removeChild(frame), 1000);
        };

        // Give the copied stylesheets a moment to resolve before printing.
        window.setTimeout(triggerPrint, 400);
    }

    const from = blotters?.from ?? 0;
    const to = blotters?.to ?? 0;
    const total = blotters?.total ?? 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Blotter
                </h2>
            }
        >

            <Breadcrumb pageName="Entries" />

            <div className="flex flex-col gap-4">

                {/** Toolbar */}
                <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">

                        {/** Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-bodydark1">
                                <FunnelFill size={14} /> Filters
                            </span>

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

                            {userRole !== 2 ? (
                                <FilterDropdown
                                    id="barangay"
                                    label="All barangays"
                                    options={barangayOptions}
                                    selected={brgyCode || null}
                                    openId={openFilter}
                                    setOpenId={setOpenFilter}
                                    onSelect={(value) => applyFilters({ brgy_code: value })}
                                    onClear={() => applyFilters({ brgy_code: 0 })}
                                    searchable
                                    widthClass="w-[12rem]"
                                    disabled={busy}
                                />
                            ) : null}

                            <FilterDropdown
                                id="remarks"
                                label="All remarks"
                                options={remarkOptions}
                                selected={remark || null}
                                openId={openFilter}
                                setOpenId={setOpenFilter}
                                onSelect={(value) => applyFilters({ remarks: value })}
                                onClear={() => applyFilters({ remarks: 0 })}
                                widthClass="w-[11rem]"
                                disabled={busy}
                            />

                            <FilterDropdown
                                id="incident-type"
                                label="All incident types"
                                options={incidentOptions}
                                selected={incidentType || null}
                                openId={openFilter}
                                setOpenId={setOpenFilter}
                                onSelect={(value) => applyFilters({ incident_type: value })}
                                onClear={() => applyFilters({ incident_type: 0 })}
                                searchable
                                widthClass="w-[13rem]"
                                disabled={busy}
                            />

                            {activeFilters.length ? (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    disabled={busy}
                                    className="flex items-center gap-1 rounded border border-danger px-3 py-2 text-sm text-danger transition hover:bg-danger hover:text-white disabled:opacity-60"
                                >
                                    <ArrowClockwise size={13} /> Reset
                                </button>
                            ) : null}
                        </div>

                        {/** Exports + search */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex">
                                <ActionButtons
                                    onDownload={handleDownload}
                                    onExportToExcel={handleDownloadExcel}
                                    onPrint={() => handlePrint('content-to-export')}
                                />
                            </div>

                            <form
                                onSubmit={(e) => { e.preventDefault(); applyFilters({ keyword: searchTerm }); }}
                                className="flex items-stretch"
                            >
                                <div className="relative">
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        type="text"
                                        placeholder="Search keywords..."
                                        className="w-full rounded-l border border-slate-300 py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-primary focus:ring-0 dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1 sm:w-56"
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
                                    aria-label="Search blotter entries"
                                    className="rounded-r bg-primary px-3 text-white transition hover:opacity-90 disabled:opacity-60"
                                >
                                    <Search size={14} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/** Active filter chips */}
                    {activeFilters.length ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stroke pt-3 dark:border-strokedark">
                            {activeFilters.map((filter) => (
                                <span
                                    key={filter.key}
                                    className="flex max-w-full items-center gap-1 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs text-primary dark:bg-meta-4 dark:text-white"
                                >
                                    <span className="truncate">{filter.label}</span>
                                    <button type="button" aria-label={`Remove ${filter.label}`} onClick={filter.clear}>
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/** Table */}
                <div className="relative rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    {busy ? (
                        <div className="absolute inset-0 z-99 flex items-center justify-center bg-white/70 dark:bg-boxdark/70">
                            <span className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent" />
                        </div>
                    ) : null}

                    <div className="max-w-full overflow-x-auto" id="content-to-export" ref={targetRef}>
                        <table className="w-full min-w-[60rem] border-collapse">
                            <TableHead
                                sort={data.sort}
                                direction={data.direction}
                                onSort={handleSort}
                            />
                            <TableBody
                                blotters={blotters?.data}
                                setData={setData}
                            />
                        </table>
                    </div>
                </div>
                {/** End Table */}

                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                    <h6 className="text-sm text-slate-600 dark:text-bodydark1">
                        {total > 0
                            ? <>Showing <b>{from}</b> to <b>{to}</b> of <b>{total}</b> entries</>
                            : <>No entries to show</>}
                    </h6>

                    {/** Pagination */}
                    <Pagination
                        setData={setData}
                        links={blotters?.links}
                        handleChangePage={handleFetchBlotters}
                    />
                    {/** End Pagination */}
                </div>
            </div>
        </AuthenticatedLayout >
    );

}
