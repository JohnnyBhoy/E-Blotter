import ReportForm from "@/Components/Dashboard/ReportForm";
import Reports from "@/Components/Dashboard/Reports";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
import { IncidentProps, IncidentsProps } from "@/utils/types/incident";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { ExclamationCircleFill, Fire, Plus, Tornado } from "react-bootstrap-icons";
import axios from 'axios';

export default function Dashboard({ auth, incidentCounts, }
    : PageProps<{
        incidentCounts: number[];
    }>) {

    const [incidents, setIncidents] = useState<IncidentsProps>([]);

    //Local state
    const [showReport, setShowReport] = useState<boolean>(false);
    const [selectedReport, setSelectedReport] = useState<IncidentProps>({
        coordinates: "",
        created_at: "",
        description: "",
        file: "",
        id: 0,
        incidentTypes: 0,
        location: "",
        status: 0,
        incident_responder: "",
        updated_at: "",
    });

    // Global state

    const reportingOptions = [{
        id: 1,
        name: 'CRIME',
        pic: <ExclamationCircleFill size={32} />,
        color: 'bg-red-500',
        count: 0,
    }, {
        id: 2,
        name: 'FIRE',
        pic: <Fire size={32} />,
        color: 'bg-green-500',
        count: 0,
    }, {
        id: 3,
        name: 'MEDICAL',
        pic: <Plus size={32} />,
        color: 'bg-red-300',
        count: 0,
    }, {
        id: 4,
        name: 'DISASTER',
        pic: <Tornado size={32} />,
        color: 'bg-blue-500',
        count: 0,
    }];

    const fetchIncidents = async () => {
        const INCIDENT_REPORT_URL = import.meta.env.VITE_INCIDENT_REPORT as string;
        try {
            const response = await axios.get(INCIDENT_REPORT_URL);
            // If using Laravel Resources, use response.data.data instead
            setIncidents(response.data);
        } catch (error) {
            console.error('Error fetching incidents:', error);
        }
    };


    useEffect(() => {
        fetchIncidents(); // Fetch once on mount

        const interval = setInterval(() => {
            fetchIncidents(); // Fetch every 5 seconds
        }, 5000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

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

            {!showReport ? (
                <>
                    <div className="grid grid-cols-4 lg:gap-10 gap-x-2 mt-6">
                        {reportingOptions.map((o, i: number) => (
                            <div
                                className={`lg:p-6 p-1 grid place-items-center text-white rounded ${o.color}`}
                                key={i}
                            >
                                {o.pic}
                                <h2 className='lg:text-lg text-xs mt-2 font-bold'>{o.name} : {incidentCounts[i]}</h2>
                            </div>
                        ))}
                    </div>

                    <Reports
                        setSelectedReport={setSelectedReport}
                        incidents={incidents}
                        setShowReport={setShowReport}
                    />
                </>
            ) : (
                <ReportForm
                    incident={selectedReport}
                    setShowReport={setShowReport}
                />
            )}


        </AuthenticatedLayout >
    );

}
