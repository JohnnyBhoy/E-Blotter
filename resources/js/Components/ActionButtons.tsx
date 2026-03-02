import React from "react";
import { FileExcel, FiletypeCsv, FiletypePdf, Printer } from "react-bootstrap-icons";

export const ActionButtons = ({ onDownload, onExportToExcel, onPrint }:
    { onDownload: CallableFunction; onExportToExcel: CallableFunction; onPrint: CallableFunction }) => {
    return (
        <>
            <button
                className="p-2 border-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                onClick={() => onExportToExcel()}
            >
                <FiletypeCsv className="w-5 h-5" /> CSV
            </button>

            <button
                className="p-2 border-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                onClick={() => onExportToExcel()}
            >
                <FileExcel className="w-5 h-5" /> Excel
            </button>

            <button
                className="p-2 border-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                onClick={() => onDownload()}
            >
                <FiletypePdf className="w-5 h-5" /> PDF
            </button>

            <button
                className="p-2 border-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                onClick={() => onPrint()}
            >
                <Printer className="w-5 h-5" /> Print
            </button>
        </>
    )
}