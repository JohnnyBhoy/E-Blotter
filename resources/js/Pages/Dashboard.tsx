import ChartFour from "@/Components/components/Charts/ChartFour";
import ChartOne from "@/Components/components/Charts/ChartOne";
import ChartThree from "@/Components/components/Charts/ChartThree";
import ChartTwo from "@/Components/components/Charts/ChartTwo";
import ChatCard from "@/Components/components/Chat/ChatCard";
import MapOne from "@/Components/components/Maps/MapOne";
import TableBarangayDashboard from "@/Components/components/Tables/TableBarangayDashboard";
import TableOne from "@/Components/components/Tables/TableOne";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
import { useBlotterStore } from "@/utils/store/blotterStore";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";

export default function Dashboard({ auth, datas, lastYearBlotter, thisYearBlotter, thisWeekBlotter, blotterPerYear, monthlyIncidents, top10Cases }
    : PageProps<{
        datas: number[];
        lastYearBlotter: object[];
        thisYearBlotter: object[];
        thisWeekBlotter: object[];
        blotterPerYear: object[];
        monthlyIncidents: object[];
        top10Cases: object[];
    }>) {

    console.log(top10Cases);

    // Global state
    const { setBlotter, setHearing, setSettled, setPending, setReferred, setYearlyBlotter, setTop10Cases } = useBlotterStore();

    useEffect(() => {
        setBlotter(datas[0]);
        setHearing(datas[1]);
        setSettled(datas[2]);
        setPending(datas[3]);
        setReferred(datas[4]);
        setYearlyBlotter(blotterPerYear);
        setTop10Cases(top10Cases);
    }, [datas]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="col-span-12 xl:col-span-8">
                <TableBarangayDashboard />
            </div>


            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne lastYearBlotter={lastYearBlotter} thisYearBlotter={thisYearBlotter} />

                <ChartTwo data={thisWeekBlotter} />

                <ChartThree />

                <MapOne auth={auth} level="Barangay " />

                <ChartFour monthlyIncidents={monthlyIncidents?.sort((a: any, b: any) => a.incident_type - b.incident_type)} />

                <div className="col-span-12 xl:col-span-8 hidden">
                    <TableOne />
                </div>

                <ChatCard />
            </div>
        </AuthenticatedLayout >
    );

}
