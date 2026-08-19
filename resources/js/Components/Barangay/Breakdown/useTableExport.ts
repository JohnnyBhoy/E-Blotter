import { usePDF } from "react-to-pdf";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

/**
 * PDF / spreadsheet / print actions for a table rendered inside `targetRef`.
 *
 * Every list page carried its own copy of these three handlers. The print copy
 * in particular assigned the table markup to `document.body.innerHTML`, which
 * tore the React tree out of the DOM and left the app dead until the user
 * reloaded; printing here goes through a throwaway iframe instead.
 *
 * @param fileName Base name for the exported file, no extension
 * @param nodeId DOM id of the element holding the table
 */
export default function useTableExport(fileName: string, nodeId: string) {
    const { toPDF, targetRef } = usePDF({ filename: `${fileName}.pdf` });

    const confirmThen = (run: () => void) => {
        Swal.fire({
            title: "Are you sure?",
            text: "A copy will be saved to your computer.",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3C50E0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!",
        }).then((result) => {
            if (!result.isConfirmed) return;

            run();

            Swal.fire({
                title: "Downloaded!",
                text: "Your file has been downloaded.",
                icon: "success",
                timer: 2500,
                showConfirmButton: false,
            });
        });
    };

    const handleDownload = () => confirmThen(() => toPDF());

    const handleDownloadExcel = () => confirmThen(() => {
        const table = document.getElementById(nodeId)?.querySelector("table");

        if (!table) return;

        const sheet = XLSX.utils.table_to_sheet(table);
        const book = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(book, sheet, "Sheet1");
        XLSX.writeFile(book, `${fileName}.xlsx`);
    });

    const handlePrint = () => {
        const node = document.getElementById(nodeId);

        if (!node) return;

        const frame = document.createElement("iframe");
        frame.setAttribute("aria-hidden", "true");
        frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
        document.body.appendChild(frame);

        const frameDoc = frame.contentWindow?.document;

        if (!frameDoc) {
            document.body.removeChild(frame);
            return;
        }

        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map((element) => element.outerHTML)
            .join("");

        frameDoc.open();
        frameDoc.write(
            `<html><head><title>${fileName}</title>${styles}</head>` +
            `<body class="bg-white p-4">${node.innerHTML}</body></html>`
        );
        frameDoc.close();

        window.setTimeout(() => {
            frame.contentWindow?.focus();
            frame.contentWindow?.print();
            window.setTimeout(() => frame.parentNode && document.body.removeChild(frame), 1000);
        }, 400);
    };

    return { targetRef, handleDownload, handleDownloadExcel, handlePrint };
}
