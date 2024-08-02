import { BlotterProps } from '@/Pages/types/blotter';
import disposition from '@/utils/data/disposition';
import incidentTypes from '@/utils/data/incidentTypes';
import dateToString from '@/utils/functions/dataToString';
import getUserRole from '@/utils/functions/getUserRole';
import { router } from '@inertiajs/react';
import React, { FormEvent, useState } from 'react';
import { usePDF } from 'react-to-pdf';
import Swal from 'sweetalert2';

const TableBody = ({ blotters, setData, handleDelete }: { blotters: any; setData: CallableFunction; handleDelete: CallableFunction }) => {

    const [showIncidentDescription, setShowIncidentDescription] = useState<boolean>(false);
    const [activeHoverId, setActiveHoverId] = useState<number>(0);
    const [selectedBlotter, setSelectedBlotter] = useState<object>({});

    // User Role and redirect edit route
    const userRole = getUserRole();
    const editBlotterUrl = userRole == 1 ? '/blotter/admin-edit'
        : userRole == 2 ? '/blotter/edit'
            : userRole == 3 ? '/blotter/municipal-edit'
                : "dashboard";

    // React to PDF
    const { toPDF, targetRef } = usePDF({ filename: `Blotter_Copy.pdf` });

    const handleEdit = (id: number) => {
        router.visit(editBlotterUrl, {
            method: 'get',
            data: {
                id: id,
            },
        })
    }

    const handleConfirmDelete = (e: FormEvent) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete();

                return Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2500,
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Your blotter file is safe :)",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
        });
    }

    // Get incident type
    const getIncidentType = (type: number) => {
        const incident = incidentTypes?.filter((item: any) => item?.id == type)[0];
        return incident?.value;
    };

    const formatCaseDisposition = (remarks: string) => {
        if (remarks > '4') return 'Other';

        const result = disposition?.filter((item: any) => item?.id == parseInt(remarks))

        return result[0]?.value;
    }

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
                    text: "Your file has been downloaded.",
                    icon: "success",
                    timer: 2500,
                });
            }
        });
    }

    return (
        <>
            <tbody>
                {blotters?.map((blotter: BlotterProps, i: number) => (
                    <tr key={i} className="hover:bg-slate-100 cursor-pointer z-20 bg-white dark:bg-meta-4">
                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white text-sm">
                                {blotter?.entry_number}
                            </h5>
                        </td>
                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark ">
                            <p className="text-black dark:text-white text-sm">
                                {blotter?.complainant_family_name},  {blotter?.complainant_first_name}  {blotter?.complainant_middle_name?.charAt(0)}.
                            </p>
                        </td>

                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark">
                            <p className="text-black dark:text-white text-sm">
                                {blotter?.respondent_family_name},  {blotter?.respondent_first_name}  {blotter?.complainant_middle_name?.charAt(0)}.
                            </p>
                        </td>

                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark">
                            <p className="text-black dark:text-white  grid place-items-center  text-sm" onMouseEnter={() => {
                                setShowIncidentDescription(true);
                                setActiveHoverId(blotter.id);
                            }} onMouseLeave={() => setShowIncidentDescription(false)}>
                                {getIncidentType(blotter?.incident_type)?.split(" - ")[0]}
                            </p>
                            {showIncidentDescription && activeHoverId == blotter.id
                                ? <button className='bg-green-500 text-white rounded py-0 px-2 absolute z-50 mt-[-3rem]'>
                                    {getIncidentType(blotter?.incident_type)?.split(" - ")[1]}
                                </button>
                                : null}
                        </td>

                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark">
                            <p className="text-black dark:text-white text-sm  grid place-items-center ">
                                {dateToString(blotter?.created_at)}
                            </p>
                        </td>

                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark">
                            <p
                                className={`inline-flex rounded-full grid place-items-center bg-opacity-10 py-1 px-3 text-xs font-medium ${blotter?.remarks === '1'
                                    ? 'bg-success text-success'
                                    : blotter?.remarks === '2'
                                        ? 'bg-danger text-danger'
                                        : 'bg-warning text-warning'
                                    }`}
                            >
                                {formatCaseDisposition(blotter?.remarks)}
                            </p>
                        </td>
                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark">
                            <div className="grid place-items-center space-x-3.5">
                                <button
                                    onClick={() => handleEdit(blotter.id)}
                                    className="bg-success text-white rounded-3xl px-5 flex justify-center text-xs py-1 gap-1">
                                    View
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </>
    )
}

export default TableBody