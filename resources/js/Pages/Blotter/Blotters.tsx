import { PageProps } from "@/Pages/types";
import { useForm } from "@inertiajs/react";
import React from "react";

import TableBody from "@/Components/Blotter/TableBody";
import TableHead from "@/Components/Blotter/TableHead";
import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SweetAlert from "@/utils/functions/Sweetalert";
import { Hypnotize, Search } from "react-bootstrap-icons";
import BlotterFolder from "@/Components/Dashboard/BlotterFolder";
import { useBlotterStore } from "@/utils/store/blotterStore";

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

    // Global state
    const { yearlyBlotter } = useBlotterStore();

    // Form data
    const { data, setData, errors, processing, delete: destroy, get } = useForm({
        id: 0,
        keyword: keyword,
        per_page: pageDisplay ?? 10,
        page: pageNumber ?? 0,
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

                <BlotterFolder blotterPerYear={yearlyBlotter} />

                <div className="flex flex-col lg:gap-0 gap-4">
                    <div className="flex justify-between my-2">
                        <div className="flex">
                            <select
                                value={data.per_page}
                                name="perPage"
                                onChange={(e) => setData('per_page', e.target.value)}
                                className="rounded-l py-1 h-8 pr-7 dark:bg-meta-4"
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
                                className="rounded-l py-1 px-2 dark:bg-meta-4"
                            />
                            <form onSubmit={handleFetchBlotters} className="dark:bg-meta-4 bg-blue-500 text-white px-2 rounded-r hover:bg-blue-700">
                                <button className="mt-2">
                                    <Search className="" />
                                </button>
                            </form>

                        </div>

                    </div>
                    {/**Table */}
                    <div className="rounded-sm border border-stroke bg-white px-3 pt-3 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1 mt-2">
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full z-20">
                                <TableHead />
                                <TableBody blotters={blotters?.data} setData={setData} handleDelete={handleDelete} />
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
