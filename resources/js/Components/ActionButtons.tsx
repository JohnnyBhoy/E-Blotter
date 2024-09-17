import React from "react";
import { FileExcel, FiletypeCsv, FiletypePdf, Printer } from "react-bootstrap-icons";

export const ActionButtons = ({ onDownload, onExportToExcel, onPrint }:
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