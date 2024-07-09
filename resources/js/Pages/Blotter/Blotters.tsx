import { PageProps } from "@/Pages/types";
import { Link, router, useForm } from "@inertiajs/react";
import React, { FormEvent } from "react";

import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import incidentTypes from "@/utils/data/incidentTypes";
import SweetAlert from "@/utils/functions/Sweetalert";
import dateToString from "@/utils/functions/dataToString";
import { Download, Eye, Trash } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";

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

export default function Blotters({ auth, blotters, message }: PageProps<{ blotters: any; message: string }>) {
    // Get incident type
    const getIncidentType = (type: number) => {
        const incident = incidentTypes?.filter((item: any) => item?.id == type)[0];
        return incident?.value?.split(' - ')[0];
    };

    // Form data
    const { data, setData, errors, processing, delete: destroy, get } = useForm({
        id: 0,
        keyword: "",
        per_page: 10,
        page: 1,
    });

    const handleDelete = () => {
        destroy(route("blotter"));
        SweetAlert('Blotter remove successfully.', 'Deleted blotter from database', 'success', 2500)
    }

    const handleChangePerPage = (e: any) => {
        e.preventDefault();

        get(route("blotter.blotters"));
    }

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
            title: 'You are about to delete entry.',
            text: 'Deleting will removed this records to your database',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
        }).then(function (res: any) {
            if (res.isDismissed) {
                return;
            }

            return handleDelete();
        });
    }

    console.log(data.per_page)

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
                    <div className="flex justify-between my-2">
                        <div className="flex gap-2">
                            <h6 className="m-1">Show</h6>
                            <form onChange={handleChangePerPage}>
                                <select name=""
                                    onChange={(e) => setData('per_page', parseInt(e.target.value))}
                                    id=""
                                    className="rounded-lg py-1 px-4"
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </form>

                            <h6 className="m-1">Entries</h6>
                        </div>

                        <input
                            type="text"
                            placeholder="Search..."
                            className="rounded-3xl py-1 px-2"
                        />
                    </div>
                    {/**Table */}
                    <div className="rounded-sm border border-stroke bg-white px-3 pt-3 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1 mt-2">
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[120px] py-4 px-2 font-medium text-black dark:text-white xl:pl-11">
                                            Entry No.
                                        </th>
                                        <th className="min-w-[150px] py-4 px-2 font-medium text-black dark:text-white">
                                            Complainant
                                        </th>
                                        <th className="min-w-[120px] py-4 px-2 font-medium text-black dark:text-white">
                                            Respondent
                                        </th>
                                        <th className="py-4 px-2 font-medium text-black dark:text-white">
                                            Type
                                        </th>
                                        <th className="py-4 px-2 font-medium text-black dark:text-white">
                                            Entry Date
                                        </th>
                                        <th className="py-4 px-2 font-medium text-black dark:text-white">
                                            Remarks
                                        </th>
                                        <th className="py-4 px-2 font-medium text-black dark:text-white">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blotters?.data?.map((blotter: BlotterProps, i: number) => (
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
                                                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${blotter?.remarks === 'Settled'
                                                        ? 'bg-success text-success'
                                                        : blotter?.remarks === 'Pending'
                                                            ? 'bg-danger text-danger'
                                                            : 'bg-warning text-warning'
                                                        }`}
                                                >
                                                    {blotter?.remarks}
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
                            </table>
                        </div>
                    </div>
                    {/** End Table */}


                    <div className="flex justify-between">
                        <h6 className="m-3">
                            Showing <b>{(data.page - 1) * data.per_page + 1}</b> to <b>{data.per_page * data.page}</b> of <b>{blotters?.total}</b> entries
                        </h6>

                        {/** Pagination */}
                        <Pagination
                            setPage={setData}
                            links={blotters?.links}
                        />
                        {/** End Pagination */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );

}
