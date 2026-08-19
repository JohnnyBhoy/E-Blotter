import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { ExclamationTriangleFill, GeoAltFill, Search, X } from "react-bootstrap-icons";

import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "../types";
import { getIncident } from "@/utils/functions/getIncident";
import { getStatus } from "@/utils/functions/getStatus";

type MapReport = {
    id: number;
    lat: number;
    lng: number;
    location: string;
    description: string;
    incidentTypes: number;
    status: number;
    responder: string | null;
    created_at: string | null;
};

/** Marker colour per report status, matching the status labels in getStatus. */
const STATUS_COLORS: Record<number, string> = {
    1: "#D97706", // In progress
    2: "#3C50E0", // On the way
    3: "#8B5CF6", // Arrived at area
    4: "#16A34A", // Resolved
};

/**
 * Leaflet's default marker images resolve to a CDN path that Vite does not
 * bundle, so markers render as broken images. A small inline pin avoids the
 * asset problem entirely and lets each status carry its own colour.
 */
const pinFor = (status: number) => L.divIcon({
    className: "",
    html:
        `<span style="display:block;width:1.5rem;height:1.5rem;border-radius:9999px 9999px 9999px 2px;` +
        `transform:rotate(45deg);background:${STATUS_COLORS[status] ?? "#64748B"};` +
        `border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22],
});

/** Pans the map when a report is picked from the list beside it. */
const PanTo = ({ target }: { target: [number, number] | null }) => {
    const map = useMap();

    React.useEffect(() => {
        if (target) {
            map.flyTo(target, Math.max(map.getZoom(), 16), { duration: 0.8 });
        }
    }, [target, map]);

    return null;
};

const formatDate = (value: string | null) => {
    if (!value) return "—";

    return new Date(value).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export default function MapPage({ auth, center, hasOwnLocation, reports }:
    PageProps<{ center: [number, number]; hasOwnLocation: boolean; reports: MapReport[] }>) {

    const [statusFilter, setStatusFilter] = useState<number | null>(null);
    const [term, setTerm] = useState<string>("");
    const [focus, setFocus] = useState<[number, number] | null>(null);

    const visible = useMemo(() => {
        const needle = term.trim().toLowerCase();

        return (reports ?? []).filter((report) => {
            if (statusFilter !== null && report.status !== statusFilter) return false;
            if (!needle) return true;

            return report.location?.toLowerCase().includes(needle)
                || report.description?.toLowerCase().includes(needle);
        });
    }, [reports, statusFilter, term]);

    const counts = useMemo(() => {
        const tally: Record<number, number> = {};

        (reports ?? []).forEach((report) => {
            tally[report.status] = (tally[report.status] ?? 0) + 1;
        });

        return tally;
    }, [reports]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Incident Map</h2>
            }
        >
            <Head title="Incident Map" />

            <Breadcrumb pageName="Map" />

            {!hasOwnLocation ? (
                <div className="mb-4 flex items-start gap-3 rounded-sm border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
                    <ExclamationTriangleFill size={16} className="mt-0.5 shrink-0" />
                    <p>
                        This barangay has no coordinates saved, so the map opens on the
                        national view. Set them on your{" "}
                        <a href="/profile" className="font-semibold underline">profile</a> to
                        centre it on your area.
                    </p>
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">

                {/** Report list */}
                <aside className="flex h-fit flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-black dark:text-white">Reports</h3>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-meta-4 dark:text-white">
                                {visible.length}
                            </span>
                        </div>

                        <div className="relative mt-3">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={term}
                                onChange={(event) => setTerm(event.target.value)}
                                type="text"
                                placeholder="Search location..."
                                className="w-full rounded border border-slate-300 py-1.5 pl-8 pr-7 text-sm text-slate-700 focus:border-primary focus:ring-0 dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                            />
                            {term ? (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    onClick={() => setTerm("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={15} />
                                </button>
                            ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                            <button
                                type="button"
                                onClick={() => setStatusFilter(null)}
                                className={`rounded-full px-2.5 py-1 text-xs transition ${statusFilter === null
                                    ? "bg-primary text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-meta-4 dark:text-bodydark1"
                                    }`}
                            >
                                All
                            </button>

                            {[1, 2, 3, 4].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition ${statusFilter === status
                                        ? "bg-primary text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-meta-4 dark:text-bodydark1"
                                        }`}
                                >
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: STATUS_COLORS[status] }}
                                    />
                                    {getStatus(status).replace(/[^\x00-\x7F]/g, "")}
                                    <span className="opacity-60">{counts[status] ?? 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="max-h-[24rem] overflow-y-auto p-2 xl:max-h-[32rem]">
                        {visible.length ? visible.map((report) => (
                            <button
                                key={report.id}
                                type="button"
                                onClick={() => setFocus([report.lat, report.lng])}
                                className="mb-1 w-full rounded px-3 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-meta-4"
                            >
                                <span className="flex items-center justify-between gap-2">
                                    <span className="truncate text-sm font-medium text-slate-700 dark:text-white">
                                        {getIncident(report.incidentTypes)}
                                    </span>
                                    <span
                                        className="h-2 w-2 shrink-0 rounded-full"
                                        style={{ background: STATUS_COLORS[report.status] ?? "#64748B" }}
                                    />
                                </span>
                                <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500 dark:text-bodydark1">
                                    <GeoAltFill size={10} className="shrink-0" />
                                    {report.location || "Unnamed location"}
                                </span>
                                <span className="block text-xs text-slate-400">{formatDate(report.created_at)}</span>
                            </button>
                        )) : (
                            <p className="px-3 py-8 text-center text-sm text-slate-400">
                                No reports match this view.
                            </p>
                        )}
                    </div>
                </aside>

                {/** Map */}
                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <MapContainer
                        center={center}
                        zoom={hasOwnLocation ? 14 : 6}
                        scrollWheelZoom
                        className="h-[28rem] w-full xl:h-[38rem]"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        <PanTo target={focus} />

                        {visible.map((report) => (
                            <Marker
                                key={report.id}
                                position={[report.lat, report.lng]}
                                icon={pinFor(report.status)}
                            >
                                <Popup>
                                    <span className="block text-sm font-semibold">
                                        {getIncident(report.incidentTypes)}
                                    </span>
                                    <span className="mt-1 block text-xs">{report.location}</span>
                                    <span className="mt-1 block text-xs text-slate-500">{report.description}</span>
                                    <span className="mt-2 block text-xs">
                                        <b>Status:</b> {getStatus(report.status)}
                                    </span>
                                    {report.responder ? (
                                        <span className="block text-xs"><b>Responder:</b> {report.responder}</span>
                                    ) : null}
                                    <span className="block text-xs text-slate-400">{formatDate(report.created_at)}</span>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
