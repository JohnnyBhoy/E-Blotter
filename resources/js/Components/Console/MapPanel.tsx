import axios from "axios";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { CircleHalf, ExclamationTriangleFill, GeoAltFill } from "react-bootstrap-icons";

import Modal from "@/Components/Blotter/ui/Modal";
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

/** Marker colour per report status, matching the labels in getStatus. */
const STATUS_COLORS: Record<number, string> = {
    1: "#D97706", // In progress
    2: "#3C50E0", // On the way
    3: "#8B5CF6", // Arrived at area
    4: "#16A34A", // Resolved
};

/**
 * Leaflet's bundled marker images resolve to a CDN path Vite does not ship, so
 * the stock pins render broken. An inline pin avoids the asset entirely and
 * carries the status colour.
 */
const pinFor = (status: number) =>
    L.divIcon({
        className: "",
        html:
            `<span style="display:block;width:1.5rem;height:1.5rem;border-radius:9999px 9999px 9999px 2px;` +
            `transform:rotate(45deg);background:${STATUS_COLORS[status] ?? "#64748B"};` +
            `border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -22],
    });

/** The barangay incident map, floated over the console instead of routed to. */
const MapPanel = ({ onClose }: { onClose: () => void }) => {
    const [center, setCenter] = useState<[number, number]>([12.8797, 121.774]);
    const [hasOwnLocation, setHasOwnLocation] = useState(false);
    const [reports, setReports] = useState<MapReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState("");

    useEffect(() => {
        let cancelled = false;

        axios
            .get("/map")
            .then(({ data }) => {
                if (cancelled) return;

                setCenter(data.center ?? [12.8797, 121.774]);
                setHasOwnLocation(Boolean(data.hasOwnLocation));
                setReports(data.reports ?? []);
            })
            .catch(() => {
                if (!cancelled) setFailed("The map could not be loaded. Please try again.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Modal
            open
            onClose={onClose}
            title="Incident Map"
            subtitle={
                hasOwnLocation
                    ? "Emergency reports plotted around your barangay."
                    : "Your barangay has no saved coordinates, so the map opens on the national centre."
            }
            footer={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        {Object.entries(STATUS_COLORS).map(([status, color]) => (
                            <span
                                key={status}
                                className="flex items-center gap-1.5 text-xs text-body dark:text-bodydark"
                            >
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ background: color }}
                                />
                                {getStatus(Number(status))}
                            </span>
                        ))}
                    </div>

                    <span className="text-xs text-body dark:text-bodydark">
                        {reports.length} plotted report{reports.length === 1 ? "" : "s"}
                    </span>
                </div>
            }
        >
            {loading ? (
                <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3">
                    <CircleHalf size={22} className="animate-spin text-primary" />
                    <p className="text-sm text-body dark:text-bodydark">Loading the map...</p>
                </div>
            ) : failed ? (
                <div className="flex min-h-[20rem] flex-col items-center justify-center gap-2 text-center">
                    <ExclamationTriangleFill size={24} className="text-danger" />
                    <p className="text-sm font-medium text-black dark:text-white">{failed}</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-stroke dark:border-strokedark">
                    <MapContainer
                        center={center}
                        zoom={hasOwnLocation ? 14 : 6}
                        scrollWheelZoom
                        style={{ height: "28rem", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {reports.map((report) => (
                            <Marker
                                key={report.id}
                                position={[report.lat, report.lng]}
                                icon={pinFor(report.status)}
                            >
                                <Popup>
                                    <span className="block text-sm font-semibold">
                                        {getIncident(report.incidentTypes)}
                                    </span>
                                    <span className="mt-1 flex items-start gap-1 text-xs">
                                        <GeoAltFill size={11} className="mt-0.5 shrink-0" />
                                        {report.location || "No location given"}
                                    </span>
                                    {report.description ? (
                                        <span className="mt-1 block text-xs">{report.description}</span>
                                    ) : null}
                                    <span className="mt-1 block text-xs font-medium">
                                        {getStatus(report.status)}
                                        {report.responder ? ` · ${report.responder}` : ""}
                                    </span>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </Modal>
    );
};

export default MapPanel;
