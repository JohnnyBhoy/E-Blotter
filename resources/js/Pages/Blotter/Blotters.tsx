import { PageProps } from "@/Pages/types";
import { useForm } from "@inertiajs/react";
import React, { FormEventHandler, useState } from "react";
import * as XLSX from "xlsx";

import TableBody from "@/Components/Blotter/TableBody";
import TableHead from "@/Components/Blotter/TableHead";
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
import { ChevronDown, Search } from "react-bootstrap-icons";

import { ActionButtons } from "@/Components/ActionButtons";
import { usePDF } from "react-to-pdf";
import Swal from "sweetalert2";

type BlotterProps = {
    id: number;
    entry_number: number;
    complainant_family_name: string;
    complainant_first_name: string;
    complainant_middle_name: string;
    respondent_family_name: string;
    respondent_first_name: string;
    respondent_middle_name: string;
    incident_type: number;
    created_at: string;
    remarks: string;
};

export default function Blotters({
    auth,
    blotters,
    message,
    pageDisplay,
    pageNumber,
    keyword,
    cityCode,
    brgyCode,
    remark,
    incidentType,
    brgyWithRecords,
}: PageProps<{
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
}>) {
    // User details
    const userRole = getUserRole();

    // React to PDF
    const { toPDF, targetRef } = usePDF({ filename: `Blotter_Copy.pdf` });

    // Get barangays with blotter records
    const barangayWithBlotterRecords = brgyWithRecords?.map(
        (item: any) => item?.barangay_code,
    );

    // Route redirection based on user role
    const redirectUrl =
        userRole === 1
            ? "blotter.admin.blotters"
            : userRole === 2
              ? "blotter.blotters"
              : userRole == 3
                ? "blotter.municipal.blotters"
                : "";

    // Dropdown entries
    const entries: number[] = [10, 20, 50, 100, blotters?.total];

    const barangayOptions: object[] =
        cityCode == null
            ? barangays
                  ?.filter((item: any) =>
                      barangayWithBlotterRecords?.includes(
                          parseInt(item?.brgy_code),
                      ),
                  )
                  ?.sort((a: any, b: any) =>
                      a.brgy_name.localeCompare(b.brgy_name),
                  )
            : getBarangayByCityCode(cityCode);

    // Local state
    const [showEntries, setShowEntries] = useState<boolean>(false);
    const [showBarangay, setShowBarangay] = useState<boolean>(false);
    const [showRemarks, setShowRemarks] = useState<boolean>(false);
    const [showIncident, setShowIncident] = useState<boolean>(false);

    // Form data
    const {
        data,
        setData,
        errors,
        processing,
        delete: destroy,
        get,
    } = useForm({
        id: 0,
        keyword: keyword,
        per_page: pageDisplay ?? 10,
        page: pageNumber ?? 0,
        brgy_code: brgyCode,
        remarks: remark,
        incident_type: incidentType,
    });

    // Get the blotters
    const handleFetchBlotters = (e: any) => {
        e.preventDefault();
        setShowEntries(false);
        return get(route(redirectUrl));
    };

    // Download a PDF copy
    const handleDownload = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will save PDF copy to your local computer!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!",
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
    };

    // Download excel copy
    const handleDownloadExcel = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will save copy to your local computer!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const table = document.getElementById("content-to-export");
                if (table) {
                    const ws = XLSX.utils.table_to_sheet(table); // Convert table to worksheet
                    const wb = XLSX.utils.book_new(); // Create a new workbook
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Append worksheet to workbook

                    // Generate a downloadable Excel file
                    XLSX.writeFile(wb, "Blotter Reports.xlsx");

                    Swal.fire({
                        title: "Downloaded!",
                        text: "Your file has been downloaded.",
                        icon: "success",
                        timer: 2500,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    const printDiv = (divId: any) => {
        const printContents: any = document?.getElementById(divId)?.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        return window.print();
    };

    console.log("blotters from blotter lists :", blotters);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                        <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                            Blotter Records
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Manage and view all blotter entries
                        </p>
                    </div>
                </div>
            }
        >
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:gap-0 gap-4">
                            {/* Filters Section - Enhanced */}
                            <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0">
                                {/* Search and Actions - Enhanced */}
                                <div className="flex justify-between items-center gap-6">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <input
                                            value={data?.keyword}
                                            onChange={(e) =>
                                                setData(
                                                    "keyword",
                                                    e.target.value,
                                                )
                                            }
                                            type="text"
                                            placeholder="Search blotter records..."
                                            className="border border-gray-300 dark:border-gray-600 flex-1 px-4 py-2 rounded-xl border-0 bg-white/50 dark:bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                                        />
                                        <button
                                            onClick={handleFetchBlotters}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-0"
                                        >
                                            <Search className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <ActionButtons
                                            onDownload={handleDownload}
                                            onExportToExcel={
                                                handleDownloadExcel
                                            }
                                            onPrint={() =>
                                                printDiv("content-to-export")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Section - Enhanced */}
                        <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0 mt-4">
                            <div
                                className="max-w-full overflow-x-auto"
                                id="content-to-export"
                                ref={targetRef}
                            >
                                <table className="w-full border-0">
                                    <TableHead />
                                    <TableBody
                                        blotters={blotters}
                                        setData={setData}
                                    />
                                </table>
                            </div>
                        </div>

                        {/* Pagination - Enhanced */}
                        <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border-0 mt-4">
                            <div className="flex justify-between items-center">
                                <h6 className="text-gray-700 dark:text-gray-300 font-medium">
                                    Showing{" "}
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {(parseInt(data.page) - 1) *
                                            parseInt(data.per_page) +
                                            1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {parseInt(data.per_page) *
                                            parseInt(data.page)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {blotters?.total}
                                    </span>{" "}
                                    entries
                                </h6>
                                <Pagination
                                    setData={setData}
                                    links={blotters?.links}
                                    handleChangePage={handleFetchBlotters}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const PerPage = ({
    entries,
    showEntries,
    setShowEntries,
    data,
    setData,
    handleFetchBlotters,
}: {
    entries: number[];
    showEntries: boolean;
    setShowEntries: CallableFunction;
    data: any;
    setData: CallableFunction;
    handleFetchBlotters: FormEventHandler;
}) => {
    return (
        <div className="relative">
            <button
                className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-0 flex items-center justify-between"
                onClick={() => setShowEntries(!showEntries)}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data?.per_page} per page
                </span>
                <svg
                    className="w-4 h-4 text-gray-500 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7 7"
                    />
                </svg>
            </button>
            {showEntries && (
                <div className="absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-0 z-50 min-w-[120px]">
                    {entries.map((entry: any, i: number) => (
                        <button
                            key={i + 1}
                            onClick={() => setData("per_page", entry)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-0"
                        >
                            {entry}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const BarangayFilter = ({
    entries,
    showEntries,
    setShowEntries,
    data,
    setData,
    handleFetchBlotters,
}: {
    entries: any;
    showEntries: boolean;
    setShowEntries: CallableFunction;
    data: any;
    setData: CallableFunction;
    handleFetchBlotters: FormEventHandler;
}) => {
    return (
        <div className="relative">
            <button
                className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-0 flex items-center justify-between"
                onClick={() => setShowEntries(!showEntries)}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data.brgy_code == null
                        ? "Select Barangay"
                        : getBarangayByBrgyCode(data.brgy_code)}
                </span>
                <svg
                    className="w-4 h-4 text-gray-500 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7 7"
                    />
                </svg>
            </button>
            {showEntries && (
                <div className="absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-0 z-50 min-w-[150px] max-h-60 overflow-y-auto">
                    {entries.map((entry: any, i: number) => (
                        <button
                            key={i + 1}
                            onClick={() =>
                                setData("brgy_code", parseInt(entry?.brgy_code))
                            }
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-0"
                        >
                            {entry?.brgy_name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const RemarksFilter = ({
    entries,
    showEntries,
    setShowEntries,
    data,
    setData,
    handleFetchBlotters,
}: {
    entries: any;
    showEntries: boolean;
    setShowEntries: CallableFunction;
    data: any;
    setData: CallableFunction;
    handleFetchBlotters: FormEventHandler;
}) => {
    return (
        <div className="relative">
            <button
                className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-0 flex items-center justify-between"
                onClick={() => setShowEntries(!showEntries)}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data.remarks == 0
                        ? "Select Remark"
                        : getRemark(parseInt(data.remarks))}
                </span>
                <svg
                    className="w-4 h-4 text-gray-500 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7 7"
                    />
                </svg>
            </button>
            {showEntries && (
                <div className="absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-0 z-50 min-w-[120px] max-h-60 overflow-y-auto">
                    {entries.map((entry: any, i: number) => (
                        <button
                            key={i + 1}
                            onClick={() => setData("remarks", entry.id)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-0"
                        >
                            {entry?.value}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const TypeFilter = ({
    entries,
    showEntries,
    setShowEntries,
    data,
    setData,
    handleFetchBlotters,
}: {
    entries: any;
    showEntries: boolean;
    setShowEntries: CallableFunction;
    data: any;
    setData: CallableFunction;
    handleFetchBlotters: FormEventHandler;
}) => {
    return (
        <div className="relative">
            <button
                className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-0 flex items-center justify-between"
                onClick={() => setShowEntries(!showEntries)}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data.incident_type == null
                        ? "Select Type"
                        : getIncidentType(data.incident_type)?.split("-")[0]}
                </span>
                <svg
                    className="w-4 h-4 text-gray-500 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7 7"
                    />
                </svg>
            </button>
            {showEntries && (
                <div className="absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-0 z-50 min-w-[120px] max-h-60 overflow-y-auto">
                    {entries.map((entry: any, i: number) => (
                        <button
                            key={i + 1}
                            onClick={() =>
                                setData("incident_type", parseInt(entry?.id))
                            }
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-0"
                        >
                            {entry?.value?.split("-")[1]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
