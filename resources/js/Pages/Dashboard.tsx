import CardDataStats from "@/Components/CardDataStats";
import ChartFour from "@/Components/components/Charts/ChartFour";
import ChartOne from "@/Components/components/Charts/ChartOne";
import ChartThree from "@/Components/components/Charts/ChartThree";
import ChartTop10PrevalentCrimes from "@/Components/components/Charts/ChartTop10PrevalentCrimes";
import ChartTop10PurokWithIncidentReported from "@/Components/components/Charts/ChartTop10PurokWithIncidentReported";
import ChartTwo from "@/Components/components/Charts/ChartTwo";
import ChatCard from "@/Components/components/Chat/ChatCard";
import MapOne from "@/Components/components/Maps/MapOne";
import TableOne from "@/Components/components/Tables/TableOne";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
import { useBlotterStore } from "@/utils/store/blotterStore";
import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";
import { BagCheck, BootstrapReboot, Ear, Fingerprint, Intersect, Upload } from "react-bootstrap-icons";

export default function Dashboard({ auth, datas, lastYearBlotter, thisYearBlotter, thisWeekBlotter, blotterPerYear, monthlyIncidents, top10Cases, top10Purok }
    : PageProps<{
        datas: number[];
        lastYearBlotter: object[];
        thisYearBlotter: object[];
        thisWeekBlotter: object[];
        blotterPerYear: object[];
        monthlyIncidents: object[];
        top10Cases: object[];
        top10Purok: object[];
    }>) {

    console.log('top 10 purok : ', top10Purok);

    // Global state
    const { blotter, hearing, pending, settled, referred, setBlotter, setHearing, setSettled, setPending, setReferred, setYearlyBlotter, setTop10Cases, setTop10Sitio } = useBlotterStore();

    useEffect(() => {
        setBlotter(datas[0]);
        setHearing(datas[1]);
        setSettled(datas[2]);
        setPending(datas[3]);
        setReferred(datas[4]);
        setYearlyBlotter(blotterPerYear);
        setTop10Cases(top10Cases);
        setTop10Sitio(top10Purok);
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-6 2xl:gap-4 animate-fadeinbouncedown">
                <CardDataStats
                    title="Total Uploaded"
                    total={`${blotter}`}
                    rate={`${blotter}`}
                    remark={1}
                    routeTo="blotter.blotters"
                    levelUp
                >
                    <Upload size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Subject For Hearing"
                    total={`${hearing}`}
                    rate={`${hearing}`}
                    remark={2}
                    routeTo="cities"
                    levelUp
                >
                    <Ear size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Pending Incidents"
                    total={`${pending}`}
                    rate={`${pending}`}
                    remark={3}
                    routeTo="Pending"
                    levelDown
                >
                    <BootstrapReboot size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Referred to PNP"
                    total={`${referred}`}
                    rate={`${referred}`}
                    remark={4}
                    routeTo="Referred"
                    levelUp
                >
                    <Fingerprint size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Amicably Settled"
                    total={`${referred}`}
                    rate={`${referred}`}
                    remark={4}
                    routeTo="Referred"
                    levelUp
                >
                    <BagCheck size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Other Incidents"
                    total={`${referred}`}
                    rate={`${referred}`}
                    remark={4}
                    routeTo="Referred"
                    levelUp
                >
                    <Intersect size={24} color="blue" />
                </CardDataStats>
            </div>


            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne lastYearBlotter={lastYearBlotter} thisYearBlotter={thisYearBlotter} />

                <ChartTwo data={thisWeekBlotter} />

                <ChartTop10PrevalentCrimes />

                <ChartTop10PurokWithIncidentReported />

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
