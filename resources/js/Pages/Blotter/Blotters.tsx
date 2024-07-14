import { PageProps } from "@/Pages/types";
import { router, useForm } from "@inertiajs/react";
import React, { FormEvent } from "react";

import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import disposition from "@/utils/data/disposition";
import incidentTypes from "@/utils/data/incidentTypes";
import SweetAlert from "@/utils/functions/Sweetalert";
import dateToString from "@/utils/functions/dataToString";
import { Download, Eye, Hypnotize, Search, Trash } from "react-bootstrap-icons";
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
}

export default function Blotters({ auth, blotters, message, pageDisplay, pageNumber, keyword }:
    PageProps<{ blotters: any; message: string; pageDisplay: string, pageNumber: string; keyword: string }>) {

    // Get incident type
    const getIncidentType = (type: number) => {
        const incident = incidentTypes?.filter((item: any) => item?.id == type)[0];
        return incident?.value?.split(' - ')[0];
    };

    // Form data
    const { data, setData, errors, processing, delete: destroy, get } = useForm({
        id: 0,
        keyword: keyword,
        per_page: pageDisplay,
        page: pageNumber,
    });

    const handleDelete = () => {
        destroy(route("blotter"));
        SweetAlert('Blotter remove successfully.', 'Deleted blotter from database', 'success', 2500)
    }

    const handleChangePerPage = (e: any) => {
        e.preventDefault();
        get(route("blotter.blotters"));
    }

    const handleFetchBlotters = (e: any) => {
        e.preventDefault();
        return get(route("blotter.blotters"));
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
                    icon: "success"
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Your blotter file is safe :)",
                    icon: "error"
                });
            }
        });
    }

    const formatCaseDisposition = (remarks: string) => {
        console.log(remarks);
        const result = disposition?.filter((item: any) => item?.id == parseInt(remarks))

        return result[0]?.value;
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
                    <div className="flex justify-between my-2">
                        <div className="flex">
                            <select
                                value={data.per_page}
                                name="perPage"
                                onChange={(e) => setData('per_page', e.target.value)}
                                className="rounded-l py-1 h-8 pr-7"
                            >
                                <option value="10">10 Entries</option>
                                <option value="20">20 Entries</option>
                                <option value="50">50 Entries</option>
                                <option value="100">100 Entries</option>
                            </select>

                            <form onSubmit={handleChangePerPage}>
                                <button className="bg-blue-500 text-white rounded-r  py-1 px-2">
                                    {processing
                                        ? <p className="flex gap-1">Showing <Hypnotize className="animate-spin" size={24} /></p>
                                        : 'Show'}
                                </button>
                            </form>
                        </div>

                        <div className="flex">
                            <input
                                value={data?.keyword}
                                onChange={(e) => setData('keyword', e.target.value)}
                                type="text"
                                placeholder="Search keywords..."
                                className="rounded-l py-1 px-2"
                            />
                            <form onSubmit={handleFetchBlotters} className="bg-blue-500 text-white px-2 rounded-r hover:bg-blue-700">
                                <button className="mt-2">
                                    <Search className="" />
                                </button>
                            </form>

                        </div>

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
                            </table>
                        </div>
                    </div>
                    {/** End Table */}


                    <div className="flex justify-between">
                        <h6 className="my-3 mt-4">
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
