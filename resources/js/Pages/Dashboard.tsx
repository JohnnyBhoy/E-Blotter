import CardDataStats from "@/Components/CardDataStats";
import ChartOne from "@/Components/components/Charts/ChartOne";
import ChartThree from "@/Components/components/Charts/ChartThree";
import ChartTwo from "@/Components/components/Charts/ChartTwo";
import ChatCard from "@/Components/components/Chat/ChatCard";
import MapOne from "@/Components/components/Maps/MapOne";
import TableOne from "@/Components/components/Tables/TableOne";
import BlotterFolder from "@/Components/Dashboard/BlotterFolder";
import SearchInBlotter from "@/Components/Dashboard/SearchInBlotter";
import Sorts from "@/Components/Dashboard/Sorts";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/Pages/types";
import { useBlotterStore } from "@/utils/store/blotterStore";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";
import { JournalAlbum, JournalBookmark, JournalCheck, JournalRichtext } from "react-bootstrap-icons";

export default function Dashboard({ auth, data, lastYearBlotter, thisYearBlotter, thisWeekBlotter, blotterPerYear }
    : PageProps<{
        data: number[];
        lastYearBlotter: any;
        thisYearBlotter: any;
        thisWeekBlotter: any;
        blotterPerYear: any
    }>) {


    console.log('blotterPerYear :', blotterPerYear);

    // Global state
    const { hearing, settled, pending, referred, yearlyBlotter,
        setBlotter, setHearing, setSettled, setPending, setReferred, setYearlyBlotter } = useBlotterStore();

    useEffect(() => {
        setBlotter(data[0]);
        setHearing(data[1]);
        setSettled(data[2]);
        setPending(data[3]);
        setReferred(data[4]);
        setYearlyBlotter(blotterPerYear);
    }, [data]);

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

            <div className="grid place-items-center mb-5">
                <h2 className="text-2xl mb-6">
                    Welcome to Barangay E-Blotter
                </h2>

                <SearchInBlotter />

                <Sorts />

                <BlotterFolder blotterPerYear={yearlyBlotter} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="For Hearing" total={`${hearing}`} rate={`${hearing}`} levelUp>
                    <JournalBookmark size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Amicably Settled" total={`${settled}`} rate={`${settled}`} levelUp>
                    <JournalCheck size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Pending" total={`${pending}`} rate={`${pending}`} levelDown>
                    <JournalRichtext size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Referred to PNP" total={`${referred}`} rate={`${referred}`} levelUp>
                    <JournalAlbum size={24} color="blue" />
                </CardDataStats>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne lastYearBlotter={lastYearBlotter} thisYearBlotter={thisYearBlotter} />

                <ChartTwo data={thisWeekBlotter} />

                <ChartThree />

                <MapOne auth={auth} />

                <div className="col-span-12 xl:col-span-8 hidden">
                    <TableOne />
                </div>

                <ChatCard />
            </div>
        </AuthenticatedLayout >
    );

}
