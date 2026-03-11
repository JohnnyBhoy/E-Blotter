import getIncidentType from "@/utils/functions/getIncidentType";
import { getStatus } from "@/utils/functions/getStatus";
import { IncidentProps, IncidentsProps } from "@/utils/types/incident";
import React, { useState } from "react";

const Reports = ({
    incidents,
    setSelectedReport,
    setShowReport,
}: {
    incidents: IncidentsProps;
    setSelectedReport: CallableFunction;
    setShowReport: CallableFunction;
}) => {
    const [incidentFilter, setIncidentFilter] = useState("");
    const [showReportForm, setShowReportForm] = useState(false);

    //For data reported
    const formatDateReported = (dated: string) => {
        // Create a Date object from the timestamp
        const date = new Date(dated);

        // Format the date to the desired output
        const options: any = {
            weekday: "long", // Full day name (e.g., Tuesday)
            year: "numeric",
            month: "long", // Full month name (e.g., August)
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true, // Use 12-hour clock
        };

        const formattedDate = date.toLocaleString("en-US", options);

        // To match your example format exactly (e.g., "1:11 PM on August 08, 2025, Tuesday")
        return formattedDate.replace(",", "");
    };

    //Show report details in modal
    const handleShowReportDetails = (incident: IncidentProps) => {
        setShowReportForm(true);
        setSelectedReport(incident);
        setShowReport(true);
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10 border border-1 border-slate-300">
            <div className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-claude-panel-2 dark:text-claude-text-muted flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4 p-2 bg-white">
                <select
                    name=""
                    id=""
                    className="rounded-lg py-1 text-slate-700 text-sm"
                >
                    <option value="">This day</option>
                    <option value="">Last 3 days</option>
                    <option value="">Last 7 days</option>
                    <option value="">Last 1 month</option>
                </select>
                <label htmlFor="table-search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-500 dark:text-claude-text-muted"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <input
                        value={incidentFilter}
                        type="text"
                        id="table-search"
                        onChange={(e: any) => setIncidentFilter(e.target.value)}
                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-claude-panel-2 dark:border-claude-border dark:placeholder-claude-text-muted dark:text-claude-text dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for incident..."
                    />
                </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-claude-text-muted">
                <thead className="text-xs text-gray-700 uppercase dark:bg-claude-panel-2 dark:text-claude-text-muted">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-claude-panel-2 dark:border-claude-border"
                                />
                                <label
                                    htmlFor="checkbox-all-search"
                                    className="sr-only"
                                >
                                    checkbox
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Incident Location
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Incident Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status Of Incident
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Respondent
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date Happened
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {incidents
                        ?.filter(
                            (incident) =>
                                incident.location.includes(incidentFilter) ||
                                incident.coordinates.includes(incidentFilter) ||
                                incident.created_at.includes(incidentFilter) ||
                                incident.description.includes(incidentFilter),
                        )
                        ?.map((incident: IncidentProps, i: number) => (
                            <tr
                                key={i}
                                className="text-xs text-gray-700 uppercase dark:bg-claude-panel-2 dark:text-claude-text-muted bg-white"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-claude-panel-2 dark:border-claude-border"
                                        />
                                        <label
                                            htmlFor="checkbox-table-search-1"
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </div>
                                </td>
                                <td
                                    scope="row"
                                    className="dark:bg-claude-panel text-xs px-6 py-4 text-gray-900 whitespace-nowrap dark:text-claude-text"
                                >
                                    📍{incident.location?.substring(0, 30)}...
                                </td>
                                <td className="px-6 py-4">
                                    {getIncidentType(incident.incident_type)}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatus(incident.status)}
                                </td>
                                <td className="px-6 py-4">
                                    {incident.incident_responder ??
                                        "⚠️ Please assign"}
                                </td>
                                <td className="py-4 text-xs">
                                    🕒{formatDateReported(incident.created_at)}
                                </td>
                                <td className="px-6 py-4">
                                    <a
                                        href="#"
                                        onClick={() =>
                                            handleShowReportDetails(incident)
                                        }
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        👁️View
                                    </a>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
