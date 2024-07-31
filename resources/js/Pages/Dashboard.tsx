import CardDataStats from "@/Components/CardDataStats";
import ChartFour from "@/Components/components/Charts/ChartFour";
import ChartOne from "@/Components/components/Charts/ChartOne";
import ChartThree from "@/Components/components/Charts/ChartThree";
import ChartTwo from "@/Components/components/Charts/ChartTwo";
import ChatCard from "@/Components/components/Chat/ChatCard";
import MapOne from "@/Components/components/Maps/MapOne";
import TableOne from "@/Components/components/Tables/TableOne";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
import { useBlotterStore } from "@/utils/store/blotterStore";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";
import { JournalAlbum, JournalBookmark, JournalCheck, JournalRichtext } from "react-bootstrap-icons";

export default function Dashboard({ auth, datas, lastYearBlotter, thisYearBlotter, thisWeekBlotter, blotterPerYear, monthlyIncidents }
    : PageProps<{
        datas: number[];
        lastYearBlotter: any;
        thisYearBlotter: any;
        thisWeekBlotter: any;
        blotterPerYear: any;
        monthlyIncidents: any;
    }>) {

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="For Hearing" total={`${hearing}`} rate={`${hearing}`} remark={1} routeTo="hearing" levelUp>
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
