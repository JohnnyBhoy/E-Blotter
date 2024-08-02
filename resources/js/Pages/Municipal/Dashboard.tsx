import CardDataStats from "@/Components/CardDataStats";
import ChartFour from "@/Components/components/Charts/ChartFour";
import ChartOne from "@/Components/components/Charts/ChartOne";
import ChartThree from "@/Components/components/Charts/ChartThree";
import ChartTopBarangay from "@/Components/components/Charts/ChartTopBarangay";
import ChartTwo from "@/Components/components/Charts/ChartTwo";
import ChatCard from "@/Components/components/Chat/ChatCard";
import MapOne from "@/Components/components/Maps/MapOne";
import TableOne from "@/Components/components/Tables/TableOne";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
//import barangays from "@/utils/data/barangays";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import { useBlotterStore } from "@/utils/store/blotterStore";
import { Head, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, JournalAlbum, JournalBookmark, JournalCheck, JournalRichtext } from "react-bootstrap-icons";

export default function Dashboard({ auth, datas, lastYearBlotter, thisYearBlotter, thisWeekBlotter, blotterPerYear, monthlyIncidents, topBarangay, barangays }
    : PageProps<{
        datas: number[];
        lastYearBlotter: any;
        thisYearBlotter: any;
        thisWeekBlotter: any;
        blotterPerYear: any;
        monthlyIncidents: any;
        topBarangay: Object[];
        barangays: Object[];
    }>) {


    console.log(barangays);

    // Global state
    const { hearing, settled, pending, referred, yearlyBlotter,
        setBlotter, setHearing, setSettled, setPending, setReferred, setYearlyBlotter } = useBlotterStore();

    useEffect(() => {
        setBlotter(datas[0]);
        setHearing(datas[1]);
        setSettled(datas[2]);
        setPending(datas[3]);
        setReferred(datas[4]);
        setYearlyBlotter(blotterPerYear);
    }, [datas]);

    console.log(barangays
        ?.filter((item: any) => parseInt(item?.city_code) == 60613)
        ?.map((data: any) => data.brgy_name));

    const tableHeaders = ['Barangay', 'Total Uploaded', 'Amicably Settled', 'Pending', 'For Hearing', 'Referred To PNP', 'Others', 'Action'];

    // Local states
    const [activePage, setActivePage] = useState<number>(1);
    const [limitBarangay, setLimitBarangay] = useState<number[]>([0, 10]);

    // Handle redirect to blotters page by barangay code
    const redirectToBlottersPerBarangayPage = (code: number) => {
        router.visit('/blotter/municipal-blotters', {
            data: {
                brgy_code: code,
            },
        });
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Municipal Dashboard
                </h2>
            }
        >
            <Head title="Municipal - Dashboard" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="For Hearing" total={`${hearing / 1000}k`} rate={`${hearing}`} remark={1} routeTo="hearing" levelUp>
                    <JournalBookmark size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Amicably Settled" total={`${settled}`} rate={`${settled}`} remark={2} routeTo="settled" levelUp>
                    <JournalCheck size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Pending" total={`${pending}`} rate={`${pending}`} remark={3} routeTo="pending" levelDown>
                    <JournalRichtext size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Referred to PNP" total={`${referred}`} rate={`${referred}`} remark={4} routeTo="referred" levelUp>
                    <JournalAlbum size={24} color="blue" />
                </CardDataStats>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">

                <ChartOne lastYearBlotter={lastYearBlotter} thisYearBlotter={thisYearBlotter} />

                <ChartTwo data={thisWeekBlotter} />

                {/** Barangay Table */}
                <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1">
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full z-20 border border-[#eee]">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4 ">
                                        {tableHeaders.map((header, key) => (
                                            <th className="border border-[#eee] min-w-[120px] py-3 px-2 font-medium text-sm text-black dark:text-white xl:pl-11" key={key}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {barangays
                                        ?.filter((item: any) => item?.city_code == 60613)
                                        ?.slice(limitBarangay[0], limitBarangay[1])
                                        ?.map((barangay: any, key: number) => (
                                            <tr key={key} className="hover:bg-slate-100 cursor-pointer z-20 bg-white dark:bg-meta-4">
                                                <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-bold text-black dark:text-white text-xs">
                                                        {getBarangayByBrgyCode(barangay?.barangay_code)}
                                                    </h5>
                                                </td>

                                                <td className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark text-xs text-center">
                                                    {barangay?.total}
                                                </td>

                                                {barangay
                                                    ?.blotters
                                                    ?.map((remark: any, key: number) => (
                                                        <td
                                                            className="border border-[#eee] dark:border-white py-1.5 px-2 dark:border-strokedark text-xs  text-center"
                                                            key={key}>
                                                            {remark?.count}
                                                        </td>
                                                    ))}

                                                <td className="border border-[#eee] dark:border-white py-1.5 px-4 pl-9 dark:border-strokedark xl:pl-5">
                                                    <button
                                                        className="bg-green-600 hover:bg-green-800 text-white px-4 py-0 rounded-3xl"
                                                        onClick={() => redirectToBlottersPerBarangayPage(barangay?.barangay_code)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>

                            <div className="flex gap-4 px-6  py-3 justify-end">
                                <button
                                    className="flex"
                                    onClick={() => {
                                        setActivePage(activePage == 1 ? 1 : activePage - 1);
                                        setLimitBarangay([0, 10]);
                                    }}>
                                    <ChevronLeft className="mt-1 cursor-pointer" />
                                    Previous
                                </button>

                                <button
                                    className={activePage == 1 ? `bg-slate-700 rounded-full text-white w-6 h-6` : 'hover:font-bold'}
                                    onClick={() => {
                                        setLimitBarangay([0, 10]);
                                        setActivePage(1);
                                    }}>
                                    1
                                </button>
                                <button
                                    className={activePage == 2 ? `bg-slate-700 rounded-full text-white w-6 h-6` : 'hover:font-bold'}
                                    onClick={() => {
                                        setLimitBarangay([10, 20]);
                                        setActivePage(2);
                                    }}>
                                    2
                                </button>
                                <button
                                    className={activePage == 3 ? `bg-slate-700 rounded-full text-white w-6 h-6` : 'hover:font-bold'}
                                    onClick={() => {
                                        setLimitBarangay([20, 30]);
                                        setActivePage(3);
                                    }}>
                                    3
                                </button>
                                <button
                                    className="flex"
                                    onClick={() => {
                                        setActivePage(activePage == 3 ? activePage : activePage + 1);
                                        setLimitBarangay([20, 30]);
                                    }}>
                                    Next <ChevronRight className="mt-1 cursor-pointer" />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
                {/** End Table */}

                <ChartTopBarangay datas={topBarangay} />

                <ChartThree />

                <MapOne auth={auth} level="Municipality" />

                <ChartFour monthlyIncidents={monthlyIncidents?.sort((a: any, b: any) => a.incident_type - b.incident_type)} />

                <div className="col-span-12 xl:col-span-8 hidden">
                    <TableOne />
                </div>

                <ChatCard />
            </div>
        </AuthenticatedLayout >
    );

}
