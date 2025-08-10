import { agencies } from '@/utils/data/agencies';
import { getAssignment } from '@/utils/functions/getAssingment';
import { getIncident } from '@/utils/functions/getIncident';
import { getStatus } from '@/utils/functions/getStatus';
import getUserId from '@/utils/functions/getUserId';
import SweetAlert from '@/utils/functions/Sweetalert';
import { IncidentProps } from '@/utils/types/incident';
import axios from 'axios';
import React, { useState } from 'react';
import { ArrowClockwise, ArrowLeft, GeoAltFill, Save } from 'react-bootstrap-icons';
import Maps from './Map';


type Station = {
    name: string;
    contact: string;
};

type UpdateData = {
    userId: number;
    status: number;
    incident_responder: string;
};

const ReportForm = ({ incident, setShowReport }: { incident: IncidentProps, setShowReport: CallableFunction }) => {
    const userId = getUserId();
    const incidentCoordinate = incident?.coordinates?.split(",");
    const lat = incidentCoordinate[0];
    const long = incidentCoordinate[1];
    const coordinates: [number, number] = [parseFloat(lat), parseFloat(long)];
    const INCIDENT_REPORT_URL = import.meta.env.VITE_INCIDENT_REPORT as string;

    //Local state
    const [loading, setLoading] = useState<boolean>(false);
    const [reportData, setReportData] = useState<UpdateData>({
        userId: userId,
        status: incident.status,
        incident_responder: incident.incident_responder,
    });

    // Find matching agency
    const selectedAgency = agencies.find(agency => agency.type === incident.incidentTypes);


    //Update incidente report
    const handleUpdateIncident = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.patch(`${INCIDENT_REPORT_URL}/${incident.id}`, reportData)
                .then(response => {
                    SweetAlert('Update saved', 'Incident report updated successfully', 'success', 1500);
                    setShowReport(false);
                    setLoading(false);
                })
        } catch (error) {
            SweetAlert('Update Failed', 'Incident report update failed', 'error', 1500);
            setLoading(false);
        }
    };


    console.log(incident);

    return (
        <div className="space-y-6 bg-gray-50">
            <form onSubmit={handleUpdateIncident}>
                <div className="flex justify-between">
                    <div className="flex place-items-center gap-1 hover:cursor-pointer text-sm font-semibold" onClick={() => setShowReport(false)}>
                        <ArrowLeft /> Back
                    </div>

                    <button className='text-sm bg-success text-white py-2 px-3 rounded-lg flex gap-2 place-items-center font-semibold hover:bg-green-800'>
                        {loading ? <ArrowClockwise className='animate animate-spin' /> : <Save />}
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>



            <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-3 gap-x-6">
                <div className="">
                    <label htmlFor="incident type" className="font-semibold text-sm">Incident Type</label>
                    <input
                        type="text"
                        value={getIncident(incident.incidentTypes)}
                        className='w-full rounded text-sm border border-slate-300'
                    />
                </div>


                <div className="">
                    <label htmlFor="incident type" className="font-semibold text-sm">Assigned To</label>
                    <input
                        type="text"
                        value={getAssignment(incident.incidentTypes)}
                        className='w-full rounded text-sm border border-slate-300'
                    />
                </div>

                <div className="">
                    <label htmlFor="status" className='font-semibold text-sm'>Incident Status</label>
                    <select
                        name="status"
                        value={reportData.status}
                        id="status"
                        className='w-full rounded border border-slate-300'
                        onChange={(e: any) => setReportData({ ...reportData, status: e.target.value })}
                    >
                        <option className='text-sm' value={reportData.status}>{getStatus(reportData.status)}</option>
                        <option className='text-sm' value={1}>In Progress</option>
                        <option className='text-sm' value={2}>Help on the way</option>
                        <option className='text-sm' value={3}>Arrive at incident area</option>
                        <option className='text-sm' value={4}>Resolve / completed</option>
                    </select>
                </div>

                <div className="">
                    <label htmlFor="responders" className='font-semibold text-sm'>Select Responders</label>
                    <select
                        id="responders"
                        value={reportData.incident_responder}
                        onChange={(e: any) => setReportData({ ...reportData, incident_responder: e.target.value })}
                    >
                        <option value={incident.incident_responder}>{incident.incident_responder}</option>
                        {selectedAgency?.stations.map((station, index) => (
                            <option key={index} value={station.name}>
                                {station.name} ({station.contact})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <h1 className="font-semibold text-sm mb-2 flex gap-2 place-items-center">
                    Location : <GeoAltFill /> {incident.location}
                </h1>

                {/* Give the map a fixed but responsive height */}
                <div className="w-full h-[300px] rounded overflow-hidden">
                    <Maps coordinates={coordinates} zoomLevel={13} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-6">
                <div>
                    <h1 className="font-semibold mb-2 text-sm">Media</h1>
                    <img
                        src={`storage/${incident.file}`}
                        alt="Media"
                        className="w-full h-[15rem] object-fit rounded"
                    />
                </div>

                <div>
                    <h1 className="font-semibold text-sm mb-2">Description / Details</h1>
                    <textarea
                        value={incident.description}
                        name="description"
                        id="description"
                        className="w-full h-[15rem] rounded p-2 border text-sm border border-slate-300"
                        readOnly
                    />
                </div>
            </div>
        </div>

    )
}

export default ReportForm