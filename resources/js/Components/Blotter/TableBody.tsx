import disposition from '@/utils/data/disposition';
import incidentTypes from '@/utils/data/incidentTypes';
import dateToString from '@/utils/functions/dataToString';
import { router } from '@inertiajs/react';
import React, { FormEvent } from 'react';
import { Download, Eye, Trash } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

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

const TableBody = ({ blotters, setData, handleDelete }: { blotters: any; setData: CallableFunction; handleDelete: CallableFunction }) => {

    const handleEdit = (id: number) => {
        router.visit('/blotter/edit', {
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
        return incident?.value?.split(' - ')[0];
    };

    const formatCaseDisposition = (remarks: string) => {
        const result = disposition?.filter((item: any) => item?.id == parseInt(remarks))

        return result[0]?.value;
    }


    return (
        <tbody>
            {blotters?.map((blotter: BlotterProps, i: number) => (
                <tr key={i} className="hover:bg-slate-100">
                    <td className="border-b border-[#eee] py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                            {blotter?.entry_number}
                        </h5>
                    </td>
                    <td className="border-b border-[#eee] py-1.5 px-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            {blotter?.complainant_family_name},  {blotter?.complainant_first_name}  {blotter?.complainant_middle_name?.charAt(0)}.
                        </p>
                    </td>

                    <td className="border-b border-[#eee] py-1.5 px-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            {blotter?.respondent_family_name},  {blotter?.respondent_first_name}  {blotter?.complainant_middle_name?.charAt(0)}.
                        </p>
                    </td>

                    <td className="border-b border-[#eee] py-1.5 px-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            {getIncidentType(blotter?.incident_type)}
                        </p>
                    </td>

                    <td className="border-b border-[#eee] py-1.5 px-2 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            {dateToString(blotter?.created_at)}
                        </p>
                    </td>

                    <td className="border-b border-[#eee] py-1.5 px-2 dark:border-strokedark">
                        <p
                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${blotter?.remarks === '1'
                                ? 'bg-success text-success'
                                : blotter?.remarks === '2'
                                    ? 'bg-danger text-danger'
                                    : 'bg-warning text-warning'
                                }`}
                        >
                            {formatCaseDisposition(blotter?.remarks)}
                        </p>
                    </td>
                    <td className="border-b border-[#eee] py-1.5 px-2 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                            <button onClick={() => handleEdit(blotter.id)} className="hover:text-primary">
                                <Eye size={16} />
                            </button>
                            <form onSubmit={handleConfirmDelete}>
                                <button
                                    className="hover:text-primary"
                                    onClick={() => setData('id', blotter.id)} >
                                    <Trash size={16} />
                                </button>
                            </form>
                            <button className="hover:text-primary">
                                <Download size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default TableBody