import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Shield, Plus, PencilSquare, Trash, Eye, Search, Funnel, CheckCircleFill, XCircleFill, FileTextFill, ClockFill, GeoAltFill } from "react-bootstrap-icons";
import { ArrowUpDown, Building2, Users } from "lucide-react";
import provinces from "@/utils/data/provinces";
import cities from "@/utils/data/cities";
import getCity from "@/utils/functions/getCity";
import getProvince from "@/utils/functions/getProvince";
import { PageProps } from "@/Pages/types";

interface Station {
    id: number;
    user_id: number;
    station_name: string;
    email?: string;
    city_code: string;
    province_code: string;
    region_code?: string;
    blotter_count: number;
    pending_count: number;
    hearing_count: number;
    settled_count: number;
    referred_count: number;
    barangay_count: number;
    last_blotter_at?: string | null;
}

interface Summary { total: number; active: number; inactive: number; blotters: number }

interface StationIndexProps extends PageProps {
    stations: Station[];
    summary: Summary;
    filters?: { search?: string; province?: string; city?: string };
}

function DispositionBar({ pending, hearing, settled, referred, total }: { pending: number; hearing: number; settled: number; referred: number; total: number }) {
    if (total === 0) return <span className="text-xs text-gray-400 dark:text-claude-text-muted">—</span>;
    const pct = (v: number) => Math.round((v / total) * 100);
    return (
        <div className="flex flex-col gap-1">
            <div className="flex h-1.5 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-claude-panel-2">
                <div style={{ width: `${pct(hearing)}%` }}  className="bg-amber-500" title={`Hearing: ${hearing}`} />
                <div style={{ width: `${pct(pending)}%` }}  className="bg-yellow-400" title={`Pending: ${pending}`} />
                <div style={{ width: `${pct(settled)}%` }}  className="bg-emerald-500" title={`Settled: ${settled}`} />
                <div style={{ width: `${pct(referred)}%` }} className="bg-claude-accent" title={`Referred: ${referred}`} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
                {hearing  > 0 && <span className="text-[10px] text-amber-600 dark:text-amber-400">{hearing} hrg</span>}
                {pending  > 0 && <span className="text-[10px] text-yellow-600 dark:text-yellow-400">{pending} pnd</span>}
                {settled  > 0 && <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{settled} stl</span>}
                {referred > 0 && <span className="text-[10px] text-claude-accent">{referred} ref</span>}
            </div>
        </div>
    );
}

export default function StationIndex({ stations, auth, filters, summary }: StationIndexProps) {
    const [searchTerm, setSearchTerm]             = useState(filters?.search || "");
    const [selectedProvince, setSelectedProvince] = useState(filters?.province || "");
    const [selectedCity, setSelectedCity]         = useState(filters?.city || "");
    const [sortBy, setSortBy]                     = useState<"name" | "city" | "province" | "blotters" | "pending" | "barangays" | "last_active">("blotters");
    const [sortOrder, setSortOrder]               = useState<"asc" | "desc">("desc");
    const [activeFilter, setActiveFilter]         = useState<"all" | "active" | "inactive" | "no_blotters">("all");

    const uniqueProvinces = useMemo(() =>
        provinces.map(p => ({ code: p.province_code, name: p.province_name }))
                 .sort((a, b) => a.name.localeCompare(b.name)), []);

    const uniqueCities = useMemo(() => {
        if (!selectedProvince) return [];
        return cities.filter(c => c.province_code === selectedProvince)
                     .map(c => ({ code: c.city_code, name: c.city_name }))
                     .sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedProvince]);

    const filteredAndSorted = useMemo(() => {
        let list = [...(stations || [])];
        if (activeFilter === "active")      list = list.filter(s => !!s.email);
        if (activeFilter === "inactive")    list = list.filter(s => !s.email);
        if (activeFilter === "no_blotters") list = list.filter(s => s.blotter_count === 0);
        list.sort((a, b) => {
            let av: string | number, bv: string | number;
            switch (sortBy) {
                case "name":        av = a.station_name; bv = b.station_name; break;
                case "city":        av = getCity(a.city_code) || ""; bv = getCity(b.city_code) || ""; break;
                case "province":    av = getProvince(a.province_code) || ""; bv = getProvince(b.province_code) || ""; break;
                case "blotters":    av = a.blotter_count; bv = b.blotter_count; break;
                case "pending":     av = a.pending_count; bv = b.pending_count; break;
                case "barangays":   av = a.barangay_count; bv = b.barangay_count; break;
                case "last_active": av = a.last_blotter_at || ""; bv = b.last_blotter_at || ""; break;
                default:            av = a.blotter_count; bv = b.blotter_count;
            }
            if (typeof av === "number") return sortOrder === "asc" ? av - (bv as number) : (bv as number) - av;
            return sortOrder === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });
        return list;
    }, [stations, activeFilter, sortBy, sortOrder]);

    useEffect(() => {
        const t = setTimeout(() => {
            if (searchTerm !== filters?.search || selectedProvince !== filters?.province || selectedCity !== filters?.city) {
                router.get(route("admin.station"), { search: searchTerm, province: selectedProvince, city: selectedCity }, { preserveState: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(t);
    }, [searchTerm, selectedProvince, selectedCity]);

    const handleSort = (field: typeof sortBy) => {
        if (sortBy === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
        else { setSortBy(field); setSortOrder("desc"); }
    };

    const clearFilters = () => {
        setSearchTerm(""); setSelectedProvince(""); setSelectedCity(""); setActiveFilter("all");
        router.get(route("admin.station"), {}, { preserveState: true, preserveScroll: true });
    };

    const formatDate = (d: string | null | undefined) =>
        d ? new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : null;

    const SortBtn = ({ field, label }: { field: typeof sortBy; label: string }) => (
        <button onClick={() => handleSort(field)}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${sortBy === field ? "text-claude-accent" : "text-gray-600 dark:text-claude-text-muted hover:text-claude-accent"}`}>
            {label} <ArrowUpDown className={`w-3 h-3 ${sortBy === field ? "text-claude-accent" : ""}`} />
        </button>
    );

    const quickFilters = [
        { key: "all",         label: `All (${summary.total})` },
        { key: "active",      label: `Active (${summary.active})` },
        { key: "inactive",    label: `Inactive (${summary.inactive})` },
        { key: "no_blotters", label: `No Reports (${stations.filter(s => s.blotter_count === 0).length})` },
    ] as const;

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Admin — Station Management" />
            <div className="min-h-screen bg-gray-50 dark:bg-claude-bg">
                <div className="p-6 space-y-6">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-2 bg-claude-accent rounded-lg">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-claude-text">Station Management</h1>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-claude-text-muted ml-11">
                                Monitor all police stations and their jurisdiction blotter activity
                            </p>
                        </div>
                        <Link href={route("admin.station.create")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-claude-accent text-white rounded-xl hover:bg-claude-accent-light transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium whitespace-nowrap">
                            <Plus className="w-4 h-4" /> Add Station
                        </Link>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4 flex items-center gap-3">
                            <div className="p-2.5 bg-claude-accent/10 dark:bg-claude-accent/20 rounded-lg">
                                <Shield className="w-5 h-5 text-claude-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-claude-text">{summary.total}</p>
                                <p className="text-xs text-gray-500 dark:text-claude-text-muted">Total Stations</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4 flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                                <CheckCircleFill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-claude-text">{summary.active}</p>
                                <p className="text-xs text-gray-500 dark:text-claude-text-muted">Active Accounts</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4 flex items-center gap-3">
                            <div className="p-2.5 bg-orange-100 dark:bg-claude-accent/20 rounded-lg">
                                <FileTextFill className="w-5 h-5 text-claude-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-claude-text">{summary.blotters}</p>
                                <p className="text-xs text-gray-500 dark:text-claude-text-muted">Total Blotters</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4 flex items-center gap-3">
                            <div className="p-2.5 bg-red-100 dark:bg-red-500/20 rounded-lg">
                                <XCircleFill className="w-5 h-5 text-red-500 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-claude-text">{summary.inactive}</p>
                                <p className="text-xs text-gray-500 dark:text-claude-text-muted">No Account</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Funnel className="w-4 h-4 text-claude-accent" />
                            <span className="text-sm font-medium text-gray-700 dark:text-claude-text-muted">Filters</span>
                            {(searchTerm || selectedProvince || selectedCity || activeFilter !== "all") && (
                                <button onClick={clearFilters} className="ml-auto text-xs text-claude-accent hover:text-claude-accent-light font-medium">Clear All</button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {quickFilters.map(f => (
                                <button key={f.key} onClick={() => setActiveFilter(f.key)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${activeFilter === f.key ? "bg-claude-accent text-white" : "bg-gray-100 dark:bg-claude-panel-2 text-gray-600 dark:text-claude-text-muted hover:bg-gray-200 dark:hover:bg-claude-border"}`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input type="text" placeholder="Search station name, city, province..."
                                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-claude-panel-2 border border-gray-200 dark:border-claude-border rounded-lg text-sm text-gray-900 dark:text-claude-text focus:ring-2 focus:ring-claude-accent/50 transition-all" />
                            </div>
                            <select value={selectedProvince} onChange={e => { setSelectedProvince(e.target.value); setSelectedCity(""); }}
                                className="px-3 py-2.5 bg-gray-50 dark:bg-claude-panel-2 border border-gray-200 dark:border-claude-border rounded-lg text-sm text-gray-900 dark:text-claude-text focus:ring-2 focus:ring-claude-accent/50 transition-all">
                                <option value="">All Provinces</option>
                                {uniqueProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>
                            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                                disabled={!selectedProvince}
                                className="px-3 py-2.5 bg-gray-50 dark:bg-claude-panel-2 border border-gray-200 dark:border-claude-border rounded-lg text-sm text-gray-900 dark:text-claude-text focus:ring-2 focus:ring-claude-accent/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <option value="">All Cities</option>
                                {uniqueCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Legend + count */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-claude-text-muted">
                        <span className="font-medium">Disposition bar:</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" /> Hearing</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-400 inline-block" /> Pending</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Settled</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-claude-accent inline-block" /> Referred</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-claude-text-muted -mt-2">
                        Showing <span className="font-semibold text-gray-900 dark:text-claude-text">{filteredAndSorted.length}</span> of {summary.total} stations
                    </p>

                    {/* Table */}
                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-claude-border bg-gray-50/70 dark:bg-claude-panel-2/50">
                                        <th className="px-5 py-3 text-left"><SortBtn field="name" label="Station" /></th>
                                        <th className="px-5 py-3 text-left"><SortBtn field="city" label="City / Municipality" /></th>
                                        <th className="px-5 py-3 text-left"><SortBtn field="province" label="Province" /></th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Account</th>
                                        <th className="px-5 py-3 text-left"><SortBtn field="barangays" label="Barangays" /></th>
                                        <th className="px-5 py-3 text-left"><SortBtn field="blotters" label="Blotters" /></th>
                                        <th className="px-5 py-3 text-left"><SortBtn field="pending" label="Pending" /></th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Disposition</th>
                                        <th className="px-5 py-3 text-left"><SortBtn field="last_active" label="Last Report" /></th>
                                        <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-claude-border">
                                    {filteredAndSorted.map((station) => (
                                        <tr key={station.id} className="hover:bg-gray-50/60 dark:hover:bg-claude-panel-2/40 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-claude-accent/10 dark:bg-claude-accent/20 flex items-center justify-center flex-shrink-0">
                                                        <Shield className="w-3.5 h-3.5 text-claude-accent" />
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-claude-text">{station.station_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600 dark:text-claude-text-muted">{getCity(station.city_code) || "—"}</td>
                                            <td className="px-5 py-3.5 text-gray-600 dark:text-claude-text-muted">{getProvince(station.province_code) || "—"}</td>
                                            <td className="px-5 py-3.5">
                                                {station.email ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                                        <CheckCircleFill className="w-2.5 h-2.5" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                                        <XCircleFill className="w-2.5 h-2.5" /> No Account
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs text-gray-700 dark:text-claude-text-muted">{station.barangay_count}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${station.blotter_count > 0 ? "bg-claude-accent/10 dark:bg-claude-accent/20 text-claude-accent" : "bg-gray-100 dark:bg-claude-panel-2 text-gray-500 dark:text-claude-text-muted"}`}>
                                                    {station.blotter_count}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {station.pending_count > 0 ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 font-medium">
                                                        <ClockFill className="w-2.5 h-2.5" /> {station.pending_count}
                                                    </span>
                                                ) : <span className="text-xs text-gray-400 dark:text-claude-text-muted">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <DispositionBar pending={station.pending_count} hearing={station.hearing_count} settled={station.settled_count} referred={station.referred_count} total={station.blotter_count} />
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {station.last_blotter_at
                                                    ? <span className="text-xs text-gray-600 dark:text-claude-text-muted">{formatDate(station.last_blotter_at)}</span>
                                                    : <span className="text-xs text-gray-400 dark:text-claude-text-muted">No reports yet</span>}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link href={route("admin.station.show", station.id)}
                                                        className="p-1.5 text-gray-500 dark:text-claude-text-muted hover:text-claude-accent hover:bg-orange-50 dark:hover:bg-claude-accent/10 rounded-lg transition-colors" title="View details">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={route("admin.station.edit", station.id)}
                                                        className="p-1.5 text-gray-500 dark:text-claude-text-muted hover:text-claude-accent hover:bg-orange-50 dark:hover:bg-claude-accent/10 rounded-lg transition-colors" title="Edit station">
                                                        <PencilSquare className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => { if (confirm(`Delete "${station.station_name}"? This cannot be undone.`)) router.delete(route("admin.station.destroy", station.id)); }}
                                                        className="p-1.5 text-gray-500 dark:text-claude-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete station">
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredAndSorted.length === 0 && (
                            <div className="text-center py-16">
                                <Shield className="w-12 h-12 text-gray-300 dark:text-claude-border mx-auto mb-3" />
                                <h3 className="text-base font-semibold text-gray-900 dark:text-claude-text mb-1">No stations found</h3>
                                <p className="text-sm text-gray-500 dark:text-claude-text-muted mb-5">
                                    {searchTerm || selectedProvince ? "Try adjusting your filters" : "Get started by adding a station"}
                                </p>
                                <Link href={route("admin.station.create")} className="inline-flex items-center gap-2 px-5 py-2.5 bg-claude-accent text-white rounded-xl hover:bg-claude-accent-light transition-colors text-sm">
                                    <Plus className="w-4 h-4" /> Add Station
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
