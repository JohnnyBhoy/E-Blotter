import CardDataStats from "@/Components/CardDataStats";
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

export default function Dashboard({ auth, data, lastYearBlotter, thisYearBlotter }: PageProps<{ data: number[]; lastYearBlotter: any; thisYearBlotter: any }>) {

    // Global state
    const { blotter, hearing, settled, pending, setBlotter, setHearing, setSettled, setPending } = useBlotterStore();

    useEffect(() => {
        setBlotter(data[0]);
        setHearing(data[1]);
        setSettled(data[2]);
        setPending(data[3]);
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="Total Blotters" total={`${blotter}`} rate={`${blotter}`} levelUp>
                    <JournalAlbum size={24} color="blue" />
                </CardDataStats>
                <CardDataStats title="For Hearing" total={`${hearing}`} rate={`${hearing}`} levelUp>
                    <JournalBookmark size={24} color="blue" />
                </CardDataStats>
                <CardDataStats title="Amicably Settled" total={`${settled}`} rate={`${settled}`} levelUp>
                    <JournalCheck size={24} color="blue" />
                </CardDataStats>
                <CardDataStats title="Pending" total={`${pending}`} rate={`${pending}`} levelDown>
                    <JournalRichtext size={24} color="blue" />
                </CardDataStats>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne lastYearBlotter={lastYearBlotter} thisYearBlotter={thisYearBlotter} />
                <ChartTwo />
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
