import { PageProps } from "@/Pages/types";
import React, { useState } from 'react';

import { ActionButtons } from "@/Components/ActionButtons";
import TableBody from '@/Components/Blotter/TableBody';
import TableHead from '@/Components/Blotter/TableHead';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import getIncidentType from "@/utils/functions/getIncidentType";
import { ArrowReturnLeft, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { usePDF } from "react-to-pdf";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { Link } from "@inertiajs/react";

const Incidents = ({ auth, incidents }:
    PageProps<{ incidents: any }>) => {
    const incidentId = parseInt(window.location.search?.split("=")[1]);

    // Local states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [keyword, setKeyword] = useState<string>("");

    // React to PDF
    const { toPDF, targetRef } = usePDF({ filename: `${getIncidentType(incidentId)}.pdf` });

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
                XLSX.writeFile(wb, `${getIncidentType(incidentId)}.xlsx`);

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
        const printContents: any = document?.getElementById(divId)?.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        setTimeout(() => {
            location.reload();
        }, 100);

        return window.print();
    }

    const totalPages = Math.ceil(incidents?.length / rowsPerPage);


    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPageNumbers = () => {
        let pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }


        return pageNumbers.map(number => (
            <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={currentPage === number ? 'bg-slate-500 text-white h-6 w-6 rounded shadow' : ''}
            >
                {number}
            </button>
        ));
    };

    console.log(incidents);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Blotter
                </h2>
            }
        >
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-[-.5rem] h-auto mb-20">

                <div className="p-6 bg-white mt-3">
                    <div className="flex justify-between mb-6">
                        <div className="flex">
                            <Link href="/">
                                <ArrowReturnLeft className="hover:font-bold mr-6 mt-2" size={20} />
                            </Link>

                            <ActionButtons
                                onDownload={handleDownload}
                                onExportToExcel={handleDownloadExcel}
                                onPrint={() => printDiv('content-to-export')}
                            />
                        </div>

                        <div className="">
                            Per Page: <select
                                name=""
                                id=""
                                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                                className="py-1 rounded text-slate-500 mr-5"
                            >
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={incidents?.length}>{incidents?.length}</option>
                            </select>

                            Search : <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="rounded py-1"
                                placeholder="Enter keywords..."
                            />
                        </div>
                    </div>
                    {/**Table */}
                    <div className="rounded-sm border-stroke bg-white dark:border-strokedark dark:bg-boxdark xl:pb-1 mt-2 animate-slideinright">
                        <div className="max-w-full overflow-x-auto" id="content-to-export" ref={targetRef}>
                            <table className="w-full z-20 rounded-lg border border-[#eee]">
                                <TableHead />
                                <TableBody
                                    blotters={incidents
<<<<<<< HEAD
                                        ?.sort((a: any, b: any) => b.entry_number - a.entry_number)
                                        ?.filter((item: any) => item?.complainant_first_name?.toLowerCase().includes(keyword?.toLocaleLowerCase())
                                            || item?.complainant_family_name?.toLowerCase()?.includes(keyword?.toLocaleLowerCase())
                                            || item?.respondent_family_name?.toLowerCase()?.includes(keyword?.toLocaleLowerCase())
                                            || item?.respondent_first_name?.toLowerCase()?.includes(keyword?.toLocaleLowerCase()))
=======
                                        ?.filter((item: any) => item?.complainant_first_name?.toLowerCase().includes(keyword?.toLocaleLowerCase)
                                            || item?.complainant_family_name?.toLowerCase()?.includes(keyword?.toLocaleLowerCase())
                                            || item?.respondent_family_name?.toLowerCase()?.includes(keyword?.toLocaleLowerCase())
                                            || item?.respondent_family_name?.toLowerCase()?.includes(keyword?.toLocaleLowerCase()))
>>>>>>> a72769b0f33fc3b3821546bbe82c95cca7c63ee1
                                        .slice(currentPage == 1 ? 0 : ((currentPage - 1) * 10), rowsPerPage * currentPage)}
                                    setData={() => { }}
                                />
                            </table>

                            <div className="flex justify-between py-6 ">
                                <div className="text-slate-600">
                                    <h6>Showing <b>{currentPage == 1 ? 1 : ((currentPage) * 10)} -  {currentPage == 1
                                        ? currentPage * rowsPerPage
                                        : (currentPage + 1) * rowsPerPage} of {incidents?.length}</b> results</h6>
                                </div>
                                <div className="flex justify-end gap-5 place-items-center">
                                    <div className="flex place-items-center  gap-1 hover:fontbold cursor-pointer" onClick={() => setCurrentPage(currentPage - 1)} >
                                        <ChevronLeft />
                                        <h6>Previous</h6>
                                    </div>
                                    {renderPageNumbers()}
                                    <div
                                        className="flex place-items-center  gap-1 hover:fontbold cursor-pointer"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        <h6>Next</h6>
                                        <ChevronRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** End Table */}
                </div>

            </div>
        </AuthenticatedLayout >
    )
}

export default Incidents