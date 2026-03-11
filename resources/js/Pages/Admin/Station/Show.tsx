import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Shield,
    FileText,
    Search,
    Filter,
    TrendingUp,
    MapPin,
    Mail,
    ChevronLeft,
    ChevronRight,
    Building2,
} from "lucide-react";
import {
    CheckCircleFill,
    ClockFill,
    FileTextFill,
    GeoAltFill,
    HouseFill,
} from "react-bootstrap-icons";
import getCity from "@/utils/functions/getCity";
import getProvince from "@/utils/functions/getProvince";
import getIncidentType from "@/utils/functions/getIncidentType";

interface StationInfo {
    id: number;
    user_id: number;
    station_name: string;
    email?: string;
    city_code: string;
    province_code: string;
    region_code: string;
}

interface BarangayCoverage {
    user_id: number;
    brgy_name: string;
    barangay_code: string;
    blotter_count: number;
}

interface BlotterEntry {
    id: number;
    entry_number: string;
    incident_type: number | string;
    remarks: number | string;
    date_reported: string;
    created_at: string;
    barangay_name?: string;
    complainant_family_name?: string;
    complainant_first_name?: string;
    respondent_family_name?: string;
    respondent_first_name?: string;
}

interface PaginatedBlotters {
    data: BlotterEntry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Stats {
    total: number;
    pending: number;
    hearing: number;
    settled: number;
    referred: number;
}

interface TrendPoint { month: string; count: number }

interface ShowProps {
    auth: any;
    station: StationInfo;
    barangays: BarangayCoverage[];
    blotters: PaginatedBlotters;
    stats: Stats;
    trend: TrendPoint[];
    filters: { search: string; remark: number; per_page: number };
}

const REMARK_LABELS: Record<number, { label: string; cls: string }> = {
    1: { label: "For Hearing",     cls: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" },
    2: { label: "Settled",         cls: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" },
    3: { label: "Pending",         cls: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" },
    4: { label: "Referred to PNP", cls: "bg-claude-accent/10 dark:bg-claude-accent/20 text-claude-accent" },
    5: { label: "Others",          cls: "bg-gray-100 dark:bg-claude-panel-2 text-gray-600 dark:text-claude-text-muted" },
};

function RemarkBadge({ remark }: { remark: number | string }) {
    const r = Number(remark);
    const cfg = REMARK_LABELS[r] ?? { label: "Unknown", cls: "bg-gray-100 dark:bg-claude-panel-2 text-gray-500 dark:text-claude-text-muted" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
}

export default function StationShow({ auth, station, barangays, blotters, stats, trend, filters }: ShowProps) {
    const [search, setSearch]   = useState(filters.search);
    const [remark, setRemark]   = useState(filters.remark);
    const [perPage, setPerPage] = useState(filters.per_page);

    const applyFilters = (overrides: Record<string, any> = {}) => {
        router.get(route("admin.station.show", station.id), {
            search,
            remark,
            per_page: perPage,
            ...overrides,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); applyFilters(); };

    const maxCount = Math.max(...trend.map(t => t.count), 1);
    const formatMonth = (m: string) => {
        const [y, mo] = m.split("-");
        return new Date(+y, +mo - 1).toLocaleDateString("en-PH", { month: "short", year: "2-digit" });
    };

    const statCards = [
        { label: "Total Blotters",  value: stats.total,    icon: <FileTextFill className="w-4 h-4" />, color: "text-claude-accent",                  bg: "bg-claude-accent/10 dark:bg-claude-accent/20" },
        { label: "For Hearing",     value: stats.hearing,  icon: <ClockFill className="w-4 h-4" />,    color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-100 dark:bg-amber-500/20" },
        { label: "Pending",         value: stats.pending,  icon: <ClockFill className="w-4 h-4" />,    color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-500/20" },
        { label: "Settled",         value: stats.settled,  icon: <CheckCircleFill className="w-4 h-4" />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/20" },
        { label: "Referred to PNP", value: stats.referred, icon: <GeoAltFill className="w-4 h-4" />,   color: "text-claude-accent",                  bg: "bg-claude-accent/10 dark:bg-claude-accent/20" },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${station.station_name} — Station Detail`} />

            <div className="min-h-screen bg-gray-50 dark:bg-claude-bg">
                <div className="p-6 space-y-6">

                    {/* ── Breadcrumb ── */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-claude-text-muted">
                        <Link href={route("admin.station")} className="flex items-center gap-1 hover:text-claude-accent transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" /> Stations
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-claude-text font-medium">{station.station_name}</span>
                    </div>

                    {/* ── Station Header Card ── */}
                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-claude-accent flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-claude-text">{station.station_name}</h1>
                                    <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500 dark:text-claude-text-muted">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {getCity(station.city_code) || "—"}, {getProvince(station.province_code) || "—"}
                                        </span>
                                        {station.email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5" />
                                                {station.email}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <HouseFill className="w-3.5 h-3.5" />
                                            {barangays.length} barangay{barangays.length !== 1 ? "s" : ""} covered
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <Link href={route("admin.station.edit", station.id)}
                                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-claude-panel-2 text-gray-700 dark:text-claude-text rounded-lg hover:bg-gray-200 dark:hover:bg-claude-border transition-colors">
                                    Edit Station
                                </Link>
                                <span className={`px-3 py-2 rounded-lg text-xs font-medium self-center ${station.email ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"}`}>
                                    {station.email ? "Active Account" : "No Account"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {statCards.map(s => (
                            <div key={s.label} className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4">
                                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                                    <span className={s.color}>{s.icon}</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-claude-text">{s.value}</p>
                                <p className="text-xs text-gray-500 dark:text-claude-text-muted mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ── 6-Month Trend ── */}
                        {trend.length > 0 && (
                            <div className="lg:col-span-2 bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-4 h-4 text-claude-accent" />
                                    <h2 className="text-sm font-semibold text-gray-900 dark:text-claude-text">Blotter Activity — Last 6 Months</h2>
                                </div>
                                <div className="flex items-end gap-2 h-24">
                                    {trend.map(t => (
                                        <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-xs text-gray-500 dark:text-claude-text-muted">{t.count}</span>
                                            <div className="w-full bg-claude-accent rounded-t-sm transition-all"
                                                style={{ height: `${Math.round((t.count / maxCount) * 64)}px`, minHeight: t.count > 0 ? "4px" : "0" }} />
                                            <span className="text-[10px] text-gray-400 dark:text-claude-text-muted">{formatMonth(t.month)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Barangay Coverage List ── */}
                        <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-4 h-4 text-claude-accent" />
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-claude-text">Barangay Coverage</h2>
                                <span className="ml-auto text-xs text-gray-400 dark:text-claude-text-muted">{barangays.length} total</span>
                            </div>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                {barangays.length === 0 ? (
                                    <p className="text-xs text-gray-400 dark:text-claude-text-muted text-center py-4">No barangays in jurisdiction</p>
                                ) : barangays.map(b => (
                                    <div key={b.user_id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-claude-panel-2 transition-colors">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <HouseFill className="w-3 h-3 text-claude-accent flex-shrink-0" />
                                            <span className="text-xs text-gray-700 dark:text-claude-text truncate">{b.brgy_name}</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-claude-text-muted flex-shrink-0 ml-2">
                                            {b.blotter_count} blotters
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Blotter List ── */}
                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-claude-border">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-claude-accent" />
                                    <h2 className="text-sm font-semibold text-gray-900 dark:text-claude-text">
                                        Blotter Records
                                        <span className="ml-2 text-xs font-normal text-gray-500 dark:text-claude-text-muted">({blotters.total} total)</span>
                                    </h2>
                                </div>
                                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                            placeholder="Search entry, name..."
                                            className="pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-claude-panel-2 border border-gray-200 dark:border-claude-border rounded-lg text-gray-900 dark:text-claude-text focus:ring-2 focus:ring-claude-accent/50 transition-all w-44" />
                                    </div>
                                    <select value={remark} onChange={e => { setRemark(+e.target.value); applyFilters({ remark: +e.target.value }); }}
                                        className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-claude-panel-2 border border-gray-200 dark:border-claude-border rounded-lg text-gray-900 dark:text-claude-text focus:ring-2 focus:ring-claude-accent/50 transition-all">
                                        <option value={0}>All Dispositions</option>
                                        <option value={1}>For Hearing</option>
                                        <option value={2}>Settled</option>
                                        <option value={3}>Pending</option>
                                        <option value={4}>Referred to PNP</option>
                                        <option value={5}>Others</option>
                                    </select>
                                    <button type="submit"
                                        className="px-3 py-1.5 bg-claude-accent text-white rounded-lg text-sm hover:bg-claude-accent-light transition-colors">
                                        <Filter className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-claude-border bg-gray-50/50 dark:bg-claude-panel-2/30">
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">#</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Entry No.</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Barangay</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Complainant</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Respondent</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Incident Type</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Date Reported</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Disposition</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-claude-border">
                                    {blotters.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-5 py-12 text-center text-gray-500 dark:text-claude-text-muted">
                                                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-claude-border" />
                                                No blotter records found
                                            </td>
                                        </tr>
                                    ) : blotters.data.map((b, i) => (
                                        <tr key={b.id} className="hover:bg-gray-50/60 dark:hover:bg-claude-panel-2/40 transition-colors">
                                            <td className="px-5 py-3 text-xs text-gray-400 dark:text-claude-text-muted">
                                                {(blotters.from ?? 0) + i}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="font-mono text-xs font-medium text-gray-900 dark:text-claude-text bg-gray-100 dark:bg-claude-panel-2 px-2 py-0.5 rounded">
                                                    {b.entry_number || `#${b.id}`}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-xs text-gray-600 dark:text-claude-text-muted">
                                                {b.barangay_name || <span className="text-gray-400">—</span>}
                                            </td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-claude-text">
                                                {b.complainant_family_name
                                                    ? `${b.complainant_family_name}, ${b.complainant_first_name || ""}`
                                                    : <span className="text-gray-400 dark:text-claude-text-muted text-xs">—</span>}
                                            </td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-claude-text">
                                                {b.respondent_family_name
                                                    ? `${b.respondent_family_name}, ${b.respondent_first_name || ""}`
                                                    : <span className="text-gray-400 dark:text-claude-text-muted text-xs">—</span>}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-claude-panel-2 text-gray-700 dark:text-claude-text-muted rounded">
                                                    {getIncidentType(b.incident_type) || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-xs text-gray-600 dark:text-claude-text-muted">
                                                {b.date_reported
                                                    ? new Date(b.date_reported).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
                                                    : "—"}
                                            </td>
                                            <td className="px-5 py-3">
                                                <RemarkBadge remark={b.remarks} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {blotters.last_page > 1 && (
                            <div className="px-5 py-3 border-t border-gray-100 dark:border-claude-border flex items-center justify-between">
                                <p className="text-xs text-gray-500 dark:text-claude-text-muted">
                                    Showing {blotters.from}–{blotters.to} of {blotters.total}
                                </p>
                                <div className="flex gap-1">
                                    <button disabled={blotters.current_page === 1}
                                        onClick={() => applyFilters({ page: blotters.current_page - 1 })}
                                        className="p-1.5 rounded-lg text-gray-500 dark:text-claude-text-muted hover:bg-gray-100 dark:hover:bg-claude-panel-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {Array.from({ length: Math.min(blotters.last_page, 7) }, (_, k) => {
                                        const pg = k + 1;
                                        return (
                                            <button key={pg} onClick={() => applyFilters({ page: pg })}
                                                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${blotters.current_page === pg ? "bg-claude-accent text-white" : "text-gray-600 dark:text-claude-text-muted hover:bg-gray-100 dark:hover:bg-claude-panel-2"}`}>
                                                {pg}
                                            </button>
                                        );
                                    })}
                                    <button disabled={blotters.current_page === blotters.last_page}
                                        onClick={() => applyFilters({ page: blotters.current_page + 1 })}
                                        className="p-1.5 rounded-lg text-gray-500 dark:text-claude-text-muted hover:bg-gray-100 dark:hover:bg-claude-panel-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <select value={perPage} onChange={e => { setPerPage(+e.target.value); applyFilters({ per_page: +e.target.value, page: 1 }); }}
                                    className="px-2 py-1 text-xs bg-gray-50 dark:bg-claude-panel-2 border border-gray-200 dark:border-claude-border rounded-lg text-gray-700 dark:text-claude-text">
                                    <option value={10}>10/page</option>
                                    <option value={15}>15/page</option>
                                    <option value={25}>25/page</option>
                                    <option value={50}>50/page</option>
                                </select>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
