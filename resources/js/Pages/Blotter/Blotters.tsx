import { PageProps } from "@/Pages/types";
import { useForm } from "@inertiajs/react";
import React, { FormEventHandler, useState } from "react";

import TableBody from "@/Components/Blotter/TableBody";
import TableHead from "@/Components/Blotter/TableHead";
import Pagination from "@/Components/Pagination";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import disposition from "@/utils/data/disposition";
import incidentTypes from "@/utils/data/incidentTypes";
import SweetAlert from "@/utils/functions/Sweetalert";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getBarangayByCityCode from "@/utils/functions/getBarangayByCityCode";
import getIncidentType from "@/utils/functions/getIncidentType";
import getRemark from "@/utils/functions/getRemark";
import { ChevronDown, Search } from "react-bootstrap-icons";
import getUserRole from "@/utils/functions/getUserRole";
import barangays from "@/utils/data/barangays";

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

    console.log(barangayOptions);

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

    const handleDelete = () => {
        destroy(route("blotter"));
        SweetAlert('Blotter remove successfully.', 'Deleted blotter from database', 'success', 2500)
    }

    const handleFetchBlotters = (e: any) => {
        e.preventDefault();
        setShowEntries(false);
        return get(route(redirectUrl));
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

                        <div className="flex gap-2">
                            <div className="flex">
                                <h6 className="mt-1 mr-1">Show :</h6>
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
                                ? <div className="ml-12 flex">
                                    <h6 className="mt-1 w-[10rem] ml-6 mr-1">Barangay : </h6>
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


                            <div className="ml-28 flex">
                                <h6 className="mt-1 w-[8rem]">Remark : </h6>
                                <RemarksFilter
                                    entries={disposition}
                                    showEntries={showRemarks}
                                    setShowEntries={setShowRemarks}
                                    data={data}
                                    setData={setData}
                                    handleFetchBlotters={handleFetchBlotters}
                                />
                            </div>

                            <div className="ml-28 flex">
                                <h6 className="mt-1 w-[8rem]">Type : </h6>
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



                        <div className="flex">
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
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1 mt-2">
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full z-20 border border-[#eee]">
                                <TableHead />
                                <TableBody
                                    blotters={blotters?.data}
                                    setData={setData}
                                    handleDelete={handleDelete}
                                />
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
    return <div className="flex relative">
        <div className="absolute z-20 flex gap-2">
            <div className="flex flex-col bg-white shadow-sm">
                <button
                    className="w-ful px-3 py-1 border border-solid border-slate-300 flex gap-1"
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
                                    className="place-items-center w-full hover:bg-slate-200 px-2 border  border-solid border-slate-300  grid gap-2"
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
                    className="w-[12rem] px-2 py-1 border border-solid border-slate-300 flex justify-between gap-1"
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
                                        className="w-full text-start hover:bg-slate-200 px-2 border border-solid border-slate-300  gap-2"
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


    return <div className="flex relative w-full">
        <div className="absolute z-20 flex gap-2 w-full">
            <div className="bg-white shadow-sm">
                <button
                    className="w-[10rem] px-2 py-1 border border-solid border-slate-300 flex justify-between gap-1"
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
                                    className="w-full text-start hover:bg-slate-200 px-2 border border-solid border-slate-300  gap-2"
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
            <div className="bg-white">
                <button
                    className="w-[9rem] px-2 py-1 border border-solid border-slate-300 flex justify-between gap-1"
                    key={0}
                    onClick={() => setShowEntries(!showEntries)}>
                    {data.incident_type == null ? "Select Type" : getIncidentType(data.incident_type)?.split("-")[0]}
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
                                    className="w-full text-start hover:bg-slate-200 px-2 border border-solid border-slate-300  gap-2 text-xs"
                                    onClick={() => setData('incident_type', parseInt(entry?.id))}>
                                    {entry?.value?.split("-")[1]}
                                </button>
                            </form>

                        ))}
            </div>
        </div>
    </div>
}