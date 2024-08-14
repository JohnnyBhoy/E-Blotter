import { PageProps } from "@/Pages/types";
import { router, useForm } from "@inertiajs/react";
import React, { FormEventHandler, useRef, useState } from "react";

import TableBody from "@/Components/Blotter/TableBody";
import TableHead from "@/Components/Blotter/TableHead";
import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import barangays from "@/utils/data/barangays";
import disposition from "@/utils/data/disposition";
import incidentTypes from "@/utils/data/incidentTypes";
import SweetAlert from "@/utils/functions/Sweetalert";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getBarangayByCityCode from "@/utils/functions/getBarangayByCityCode";
import getIncidentType from "@/utils/functions/getIncidentType";
import getRemark from "@/utils/functions/getRemark";
import getUserRole from "@/utils/functions/getUserRole";
import { ChevronDown, FileEarmark, FileExcel, FileSpreadsheet, FiletypeCsv, FiletypePdf, Printer, Search } from "react-bootstrap-icons";

import Swal from "sweetalert2";
import { usePDF } from 'react-to-pdf';
import * as XLSX from 'xlsx';

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
}

export default function Blotters({ auth, blotters, message, pageDisplay, pageNumber, keyword, cityCode, brgyCode, remark, incidentType, brgyWithRecords }:
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
    }>) {

    // User details
    const userRole = getUserRole();

    // React to PDF
    const { toPDF, targetRef } = usePDF({ filename: `Blotter_Copy.pdf` });

    // Get barangays with blotter records
    const barangayWithBlotterRecords = brgyWithRecords?.map((item: any) => item?.barangay_code);

    // Route redirection based on user role
    const redirectUrl = userRole === 1 ? "blotter.admin.blotters"
        : userRole === 2 ? "blotter.blotters"
            : userRole == 3 ? "blotter.municipal.blotters" : "";

    // Dropdown entries
    const entries: number[] = [10, 20, 50, 100, blotters?.total];

    const barangayOptions: object[] = cityCode == null
        ? barangays
            ?.filter((item: any) => barangayWithBlotterRecords?.includes(parseInt(item?.brgy_code)))
            ?.sort((a: any, b: any) => a.brgy_name.localeCompare(b.brgy_name))
        : getBarangayByCityCode(cityCode);

    // Local state
    const [showEntries, setShowEntries] = useState<boolean>(false);
    const [showBarangay, setShowBarangay] = useState<boolean>(false);
    const [showRemarks, setShowRemarks] = useState<boolean>(false);
    const [showIncident, setShowIncident] = useState<boolean>(false);

    // Form data
    const { data, setData, errors, processing, delete: destroy, get } = useForm({
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
    }


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

    const printDiv = (divId: any) => {
        var printContents: any = document?.getElementById(divId)?.innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        return window.print();
    }

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


            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-[-.5rem]">

                <div className="flex flex-col lg:gap-0 gap-4">
                    <div className="flex justify-between my-2 animate-fadeindown">
                        <div className="flex gap-2">
                            <div className="flex">
                                <PerPage
                                    entries={entries}
                                    showEntries={showEntries}
                                    setShowEntries={setShowEntries}
                                    data={data}
                                    setData={setData}
                                    handleFetchBlotters={handleFetchBlotters}
                                />
                            </div>

                            {userRole != 2
                                ? <div className="mr-[10rem] ml-[3.5rem] flex">
                                    <BarangayFilter
                                        entries={barangayOptions}
                                        showEntries={showBarangay}
                                        setShowEntries={setShowBarangay}
                                        data={data}
                                        setData={setData}
                                        handleFetchBlotters={handleFetchBlotters}
                                    />
                                </div>
                                : null}


                            <div className="ml-11 flex">
                                <RemarksFilter
                                    entries={disposition}
                                    showEntries={showRemarks}
                                    setShowEntries={setShowRemarks}
                                    data={data}
                                    setData={setData}
                                    handleFetchBlotters={handleFetchBlotters}
                                />
                            </div>

                            <div className="ml-26 flex">
                                <TypeFilter
                                    entries={incidentTypes}
                                    showEntries={showIncident}
                                    setShowEntries={setShowIncident}
                                    data={data}
                                    setData={setData}
                                    handleFetchBlotters={handleFetchBlotters}
                                />
                            </div>

                        </div>



                        <div className="flex ">
                            <ActionButtons
                                onDownload={handleDownload}
                                onExportToExcel={handleDownloadExcel}
                                onPrint={() => printDiv('content-to-export')}
                            />

                            <input
                                value={data?.keyword}
                                onChange={(e) => setData('keyword', e.target.value)}
                                type="text"
                                placeholder="Search keywords..."
                                className="rounded-l py-1 px-2 dark:bg-meta-4"
                            />
                            <form
                                onSubmit={handleFetchBlotters}
                                className="dark:bg-meta-4 bg-blue-500 text-white px-2 rounded-r hover:bg-blue-700" >
                                <button className="mt-2">
                                    <Search className="" />
                                </button>
                            </form>

                        </div>

                    </div>
                    {/**Table */}
                    <div className="rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1 mt-2 animate-slideinright">
                        <div className="max-w-full overflow-x-auto" id="content-to-export" ref={targetRef}>
                            <table className="w-full z-20 rounded-lg border border-[#eee]">
                                <TableHead />
                                <TableBody
                                    blotters={blotters?.data}
                                    setData={setData}
                                />
                            </table>
                        </div>
                    </div>
                    {/** End Table */}


                    <div className="flex justify-between mt-2 animate-fadeinup">
                        <h6 className="my-3 text-slate-600">
                            Showing <b>{(parseInt(data.page) - 1) * parseInt(data.per_page) + 1}</b> to <b>{parseInt(data.per_page) * parseInt(data.page)}</b> of <b>{blotters?.total}</b> entries
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
            </div>
        </AuthenticatedLayout >
    );

}

const PerPage = ({ entries, showEntries, setShowEntries, data, setData, handleFetchBlotters }
    : {
        entries: number[],
        showEntries: boolean,
        setShowEntries: CallableFunction,
        data: any,
        setData: CallableFunction,
        handleFetchBlotters: FormEventHandler,
    }
) => {
    return <div className="flex relative mr-[2rem]">
        <div className="absolute z-20 flex gap-2">
            <div className="flex flex-col bg-white shadow-sm">
                <button
                    className="w-ful px-5 py-1 border border-solid border-slate-300 flex gap-1 rounded"
                    key={0}
                    onClick={() => setShowEntries(!showEntries)}>
                    {data?.per_page} <ChevronDown className="mt-1" />
                </button>

                {showEntries
                    && entries
                        ?.map((entry: any, i: number) => (
                            <form onSubmit={handleFetchBlotters} key={i + 1}>
                                <input
                                    type="number"
                                    value={data.per_page}
                                    hidden
                                />

                                <button
                                    className="place-items-center border w-full hover:bg-slate-200 px-2 py-1   border-solid border-slate-300  grid gap-2"
                                    onClick={() => setData('per_page', entry)}>
                                    {entry}
                                </button>
                            </form>
                        ))}
            </div>
        </div>
    </div>
}

const BarangayFilter = ({ entries, showEntries, setShowEntries, data, setData, handleFetchBlotters }
    : {
        entries: any,
        showEntries: boolean,
        setShowEntries: CallableFunction,
        data: any,
        setData: CallableFunction,
        handleFetchBlotters: FormEventHandler,
    }
) => {

    return <div className="flex relative w-full">
        <div className="absolute z-20 flex gap-2 w-full">
            <div className="bg-white shadow-sm">
                <button
                    className="w-[12rem] px-2 py-1 rounded border border-solid border-slate-300 flex justify-between gap-1"
                    key={0}
                    onClick={() => setShowEntries(!showEntries)}>
                    {data.brgy_code == null ? "Select Barangay" : getBarangayByBrgyCode(data.brgy_code)}
                    <ChevronDown className="mt-1" />
                </button>


                {showEntries
                    &&
                    <div className="overflow-y-scroll h-[30rem]">
                        {entries
                            ?.map((entry: any, i: number) => (
                                <form onSubmit={handleFetchBlotters} key={i + 1}>
                                    <input
                                        type="number"
                                        value={data.user_id}
                                        hidden
                                    />

                                    <button
                                        className="w-full text-start hover:bg-slate-200 px-2 py-1 border border-solid border-slate-300  gap-2"
                                        onClick={() => setData('brgy_code', parseInt(entry?.brgy_code))}>
                                        {entry?.brgy_name}
                                    </button>
                                </form>

                            ))}
                    </div>
                }
            </div>
        </div>
    </div>
}


const RemarksFilter = ({ entries, showEntries, setShowEntries, data, setData, handleFetchBlotters }
    : {
        entries: any,
        showEntries: boolean,
        setShowEntries: CallableFunction,
        data: any,
        setData: CallableFunction,
        handleFetchBlotters: FormEventHandler,
    }
) => {


    return <div className="flex relative w-full mr-[3.5rem]">
        <div className="absolute z-20 flex gap-2 w-full">
            <div className="bg-white shadow-sm">
                <button
                    className="w-[10rem] px-2 py-1 rounded border border-solid border-slate-300 flex justify-between gap-1"
                    key={0}
                    onClick={() => setShowEntries(!showEntries)}>
                    {data.remarks == 0 ? "Select Remark" : getRemark(parseInt(data.remarks))}
                    <ChevronDown className="mt-1" />
                </button>

                {showEntries
                    && entries
                        ?.map((entry: any, i: number) => (
                            <form onSubmit={handleFetchBlotters} key={i + 1}>
                                <input
                                    type="number"
                                    value={data.remark}
                                    hidden
                                />

                                <button
                                    className="w-full text-start hover:bg-slate-200 px-2 py-1 border border-solid border-slate-300 gap-2"
                                    onClick={() => setData('remarks', entry.id)}>
                                    {entry?.value}
                                </button>
                            </form>

                        ))}
            </div>
        </div>
    </div>
}

const TypeFilter = ({ entries, showEntries, setShowEntries, data, setData, handleFetchBlotters }
    : {
        entries: any,
        showEntries: boolean,
        setShowEntries: CallableFunction,
        data: any,
        setData: CallableFunction,
        handleFetchBlotters: FormEventHandler,
    }
) => {

    return <div className="flex relative w-full">
        <div className="absolute z-20 flex gap-2 w-full">
            <div className="bg-white ">
                <button
                    className="w-[9rem] px-2 py-1 rounded border border-solid border-slate-300 flex justify-between gap-1"
                    key={0}
                    onClick={() => setShowEntries(!showEntries)}>
                    {data.incident_type == null ? "Select Type" : getIncidentType(data.incident_type)?.split("-")[0]}
                    <ChevronDown className="mt-1" />
                </button>

                {showEntries
                    &&
                    <div className="h-[33rem] overflow-y-scroll">
                        {entries
                            ?.map((entry: any, i: number) => (
                                <form onSubmit={handleFetchBlotters} key={i + 1}>
                                    <input
                                        type="number"
                                        value={data.remark}
                                        hidden
                                    />

                                    <button
                                        className="place-items-center border w-full hover:bg-slate-200 px-2 py-1   border-solid border-slate-300  grid gap-2 text-xs"
                                        onClick={() => setData('incident_type', parseInt(entry?.id))}>
                                        {entry?.value?.split("-")[1]}
                                    </button>
                                </form>

                            ))}
                    </div>
                }
            </div>
        </div>
    </div>
}

const ActionButtons = ({ onDownload, onExportToExcel, onPrint }:
    { onDownload: CallableFunction; onExportToExcel: CallableFunction; onPrint: CallableFunction }) => {
    return (
        <>
            <button
                className="p-2 border border-slate-400 px-2 py-1 flex gap-1 rounded-l text-slate-700 hover:bg-slate-200"
                onClick={() => onExportToExcel()}
            >
                <FiletypeCsv className="mt-1" /> CSV
            </button>

            <button
                className="p-2 border border-slate-400 px-2 py-1 flex gap-1 text-slate-700 hover:bg-slate-200"
                onClick={() => onExportToExcel()}
            >
                <FileExcel className="mt-1" onClick={() => onDownload} /> Excel
            </button>

            <button
                className="p-2 border border-slate-400 px-2 py-1 flex gap-1 text-slate-700 hover:bg-slate-200"
                onClick={() => onDownload()}
            >
                <FiletypePdf className="mt-1" /> PDF
            </button>
            <button
                className="p-2 rounded-r border border-slate-400 px-2 py-1 flex gap-1 mr-4 text-slate-700 hover:bg-slate-200"
                onClick={() => onPrint()}
            >
                <Printer className="mt-1" /> Print
            </button>
        </>
    )
}