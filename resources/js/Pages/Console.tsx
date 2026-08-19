import React, { useEffect, useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";

import ConsoleLayout from "@/Layouts/ConsoleLayout";
import ReportForm from "@/Components/Dashboard/ReportForm";
import Reports from "@/Components/Dashboard/Reports";
import BlotterConsole from "@/Components/Console/BlotterConsole";
import BlotterModal, { BlotterModalMode } from "@/Components/Blotter/BlotterModal";
import AreaChart from "@/Components/Console/AreaChart";
import BreakdownPanel from "@/Components/Console/BreakdownPanel";
import MapPanel from "@/Components/Console/MapPanel";
import OfficialsPanel from "@/Components/Console/OfficialsPanel";
import ProfilePanel from "@/Components/Console/ProfilePanel";
import ReportsPanel from "@/Components/Console/ReportsPanel";
import SettingsPanel from "@/Components/Console/SettingsPanel";
import {
    ConsoleActions,
    ConsolePanel,
} from "@/Components/Console/consoleActions";
import GreetingBar from "@/Components/Console/GreetingBar";
import StatCards from "@/Components/Console/StatCards";
import TrendChart from "@/Components/Console/TrendChart";
import DateRangePicker from "@/Components/Barangay/Dashboard/DateRangePicker";
import IncidentTypeChart from "@/Components/Barangay/Dashboard/IncidentTypeChart";
import useTableExport from "@/Components/Barangay/Breakdown/useTableExport";
import {
    ConsoleScope,
    ConsoleSortKey,
    DashboardData,
    DashboardFilters,
} from "@/Components/Barangay/Dashboard/types";
import { PageProps } from "@/Pages/types";
import getIncidentType from "@/utils/functions/getIncidentType";
import getIncidentTypeShort from "@/utils/functions/getIncidentTypeShort";
import {
    areaFilterValue,
    getAreaName,
    getJurisdictionName,
} from "@/utils/functions/getAreaName";
import { canDeleteBlotter, canEditBlotter } from "@/utils/functions/blotterActions";
import { IncidentProps, IncidentsProps } from "@/utils/types/incident";

/** Query parameters the console route understands. */
type ConsoleQuery = {
    from: string;
    to: string;
    search: string;
    page: number;
    remarks: number;
    incident_type: number;
    purok: string;
    area: number;
    sort: ConsoleSortKey;
    direction: "asc" | "desc";
};

const EMPTY_REPORT: IncidentProps = {
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
};

/**
 * The one console every signed-in level works out of.
 *
 * Barangay, municipal/station, provincial, regional and super admin accounts all
 * render this page: the same layout, the same controls, the same table. What
 * changes is the jurisdiction behind it, which the server resolves and describes
 * in the `console` prop:
 *
 *   - how wide the scope is (own barangay, city, province, region, nationwide)
 *   - what the area breakdown groups by, one level down
 *   - whether the account may file, correct or remove an entry
 *
 * Nothing here decides access. `console` reflects what the server already
 * enforces, so the UI shows only what the account can actually do.
 */
export default function Console({
    auth,
    console: scope,
    dashboard,
    filters,
    nextEntryNumber,
}: PageProps<{
    console: ConsoleScope;
    dashboard: DashboardData;
    filters: DashboardFilters;
    nextEntryNumber: number;
}>) {
    const scopeName = getJurisdictionName(scope);
    const userRole = Number(auth.user?.role);
    const isBarangay = scope.level === "barangay";

    // Every figure below is driven by `filters`, which the server echoes back
    // so the controls always show the range and filters actually applied.
    const [search, setSearch] = useState<string>(filters.search);
    const searchRef = useRef<string>(filters.search);

    const { handleDownloadExcel } = useTableExport("Blotter Entries", "blotter-console");

    // Viewing, correcting and filing an entry all happen over the table, so the
    // console never navigates away from itself.
    const [modal, setModal] = useState<{ id: number | null; mode: BlotterModalMode } | null>(
        null,
    );

    const closeModal = () => setModal(null);

    // Header items float one of these over the console rather than routing to
    // the standalone page each used to have.
    const [panel, setPanel] = useState<ConsolePanel | null>(null);

    const closePanel = () => setPanel(null);

    /** Reload only the console props, keeping the page's own state and scroll. */
    const applyFilters = (changes: Partial<ConsoleQuery>) => {
        router.get(
            window.location.pathname,
            {
                from: filters.from,
                to: filters.to,
                search: searchRef.current,
                remarks: filters.remarks,
                incident_type: filters.incidentType,
                purok: filters.purok,
                area: filters.area,
                sort: filters.sort,
                direction: filters.direction,
                ...changes,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ["dashboard", "filters"],
            },
        );
    };

    // Debounce typing so a search does not fire a request per keystroke. Any
    // change also resets to page 1, otherwise a narrow result set lands on an
    // out-of-range page.
    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timer = setTimeout(() => {
            searchRef.current = search;
            applyFilters({ search, page: 1 });
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    /** Bring the blotter table into view after a header item narrows it. */
    const focusTable = () =>
        window.requestAnimationFrame(() =>
            document
                .getElementById("blotter-console")
                ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        );

    // What the console header can do. Every entry stays on this page.
    const actions: ConsoleActions = {
        openPanel: (next) => setPanel(next),
        filterTable: (changes) => {
            applyFilters({ ...changes, page: 1 } as Partial<ConsoleQuery>);
            focusTable();
        },
        focusTable,
        newEntry: () => setModal({ id: null, mode: "create" }),
    };

    /** Toggle direction when re-sorting the same column, otherwise start descending. */
    const handleSort = (key: ConsoleSortKey) => {
        const direction =
            filters.sort === key && filters.direction === "desc" ? "asc" : "desc";

        applyFilters({ sort: key, direction, page: 1 });
    };

    const handleReset = () => {
        setSearch("");
        searchRef.current = "";

        applyFilters({
            search: "",
            remarks: 0,
            incident_type: 0,
            purok: "",
            area: 0,
            page: 1,
        });
    };

    // Live emergency reports feed, kept below the blotter console.
    const [incidents, setIncidents] = useState<IncidentsProps>([]);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [selectedReport, setSelectedReport] = useState<IncidentProps>(EMPTY_REPORT);

    useEffect(() => {
        const fetchIncidents = async () => {
            const INCIDENT_REPORT_URL = import.meta.env.VITE_INCIDENT_REPORT as string;

            try {
                const response = await axios.get(INCIDENT_REPORT_URL);
                setIncidents(response.data);
            } catch (error) {
                console.error("Error fetching incidents:", error);
            }
        };

        fetchIncidents();

        const interval = setInterval(fetchIncidents, 5000);

        return () => clearInterval(interval);
    }, []);

    if (showReport) {
        return (
            <ConsoleLayout scope={scope} scopeName={scopeName} actions={actions}>
                <Head title="Incident Report" />
                <ReportForm incident={selectedReport} setShowReport={setShowReport} />
            </ConsoleLayout>
        );
    }

    return (
        <ConsoleLayout scope={scope} scopeName={scopeName} actions={actions}>
            <Head title={`${scope.levelLabel} Console`} />

            <div className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                        <GreetingBar name={auth.user?.name} scopeName={scopeName} />
                    </div>

                    <DateRangePicker
                        from={filters.from}
                        to={filters.to}
                        onChange={(from, to) => applyFilters({ from, to, page: 1 })}
                    />
                </div>

                <StatCards summary={dashboard.summary} scope={scope} />

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <TrendChart data={dashboard.monthly} />
                    <IncidentTypeChart data={dashboard.byIncidentType} />
                    <AreaChart data={dashboard.byArea} scope={scope} />
                </div>

                <BlotterConsole
                    records={dashboard.records}
                    filters={filters}
                    areas={dashboard.byArea}
                    scope={scope}
                    search={search}
                    userRole={userRole}
                    // The server is the authority on both; the role maps only
                    // decide which route the standalone pages post to.
                    canDelete={scope.canDelete && canDeleteBlotter(userRole)}
                    canEdit={scope.canEdit && canEditBlotter(userRole)}
                    onView={(id) => setModal({ id, mode: "view" })}
                    onEdit={(id) => setModal({ id, mode: "edit" })}
                    onCreate={() => setModal({ id: null, mode: "create" })}
                    onSearchChange={setSearch}
                    onFilterChange={(changes) => applyFilters({ ...changes, page: 1 } as Partial<ConsoleQuery>)}
                    onSort={handleSort}
                    onPageChange={(page) => applyFilters({ page })}
                    onReset={handleReset}
                    onExport={handleDownloadExcel}
                />

                <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-strokedark dark:bg-boxdark">
                    <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                        Live Emergency Reports
                    </h2>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                        Incoming citizen reports, refreshed every few seconds.
                    </p>

                    <Reports
                        setSelectedReport={setSelectedReport}
                        incidents={incidents}
                        setShowReport={setShowReport}
                    />
                </div>
            </div>

            {modal ? (
                <BlotterModal
                    id={modal.id}
                    mode={modal.mode}
                    nextEntryNumber={nextEntryNumber}
                    canEdit={scope.canEdit && canEditBlotter(userRole)}
                    onClose={closeModal}
                    onSaved={closeModal}
                />
            ) : null}

            {panel === "reports" && (
                <ReportsPanel
                    onClose={closePanel}
                    onOpenEntry={(id) => {
                        closePanel();
                        setModal({ id, mode: "view" });
                    }}
                />
            )}

            {panel === "incidents" && (
                <BreakdownPanel
                    title="Incidents by Type"
                    subtitle="How many entries fall under each offence. Pick one to narrow the table."
                    searchPlaceholder="Search an offence..."
                    selected={filters.incidentType}
                    rows={dashboard.byIncidentType.map((row) => ({
                        value: row.id,
                        label: getIncidentTypeShort(row.id),
                        // The quoted offence title, dropped from the citation above.
                        hint:
                            getIncidentType(row.id)?.split(" - ")[1]?.replace(/[“”]/g, "") ??
                            undefined,
                        count: row.count,
                    }))}
                    onPick={(value) => {
                        closePanel();
                        actions.filterTable({ incident_type: Number(value) || 0 });
                    }}
                    onClose={closePanel}
                />
            )}

            {/* One level down: puroks for a barangay, barangays for a station,
                cities for a province, provinces for a region, regions for the
                super admin. */}
            {panel === "areas" && (
                <BreakdownPanel
                    title={`Cases by ${scope.childLabel}`}
                    subtitle={
                        isBarangay
                            ? "Entries grouped by the complainant's purok. Pick one to narrow the table."
                            : `Entries grouped by ${scope.childLabel.toLowerCase()}. Pick one to narrow the table.`
                    }
                    searchPlaceholder={`Search a ${scope.childLabel.toLowerCase()}...`}
                    selected={isBarangay ? filters.purok : filters.area}
                    rows={dashboard.byArea.map((row) => ({
                        value: isBarangay ? areaFilterValue(scope.level, row) : row.code,
                        label: getAreaName(scope.level, row),
                        count: row.count,
                    }))}
                    onPick={(value) => {
                        closePanel();
                        actions.filterTable(
                            isBarangay
                                ? { purok: String(value) }
                                : { area: Number(value) || 0 },
                        );
                    }}
                    onClose={closePanel}
                />
            )}

            {/* Barangay officials and the incident map are barangay records; the
                rollup levels have no roster of their own. */}
            {panel === "officials" && isBarangay && <OfficialsPanel onClose={closePanel} />}

            {panel === "map" && isBarangay && <MapPanel onClose={closePanel} />}

            {panel === "profile" && <ProfilePanel onClose={closePanel} />}

            {panel === "settings" && (
                <SettingsPanel
                    scope={scope}
                    scopeName={scopeName}
                    userName={auth.user?.name}
                    userEmail={auth.user?.email}
                    onClose={closePanel}
                />
            )}
        </ConsoleLayout>
    );
}
