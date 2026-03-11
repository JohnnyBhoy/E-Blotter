import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    MapPin,
    ChevronUp,
    ChevronDown,
    Building2,
    Shield,
    FileText,
    Clock,
} from "lucide-react";
import { Buildings } from "react-bootstrap-icons";

interface Province {
    id: number;
    name: string;
    code: number;
    province_code?: string;
    blotter_count: number;
    pending_count: number;
    hearing_count: number;
    settled_count: number;
    referred_count: number;
    last_blotter_at?: string;
    barangay_count: number;
    station_count: number;
    created_at?: string;
}

interface Summary {
    total: number;
    blotters: number;
    stations: number;
    barangays: number;
}

interface ProvinceIndexProps {
    auth: any;
    provinces: Province[];
    summary: Summary;
    filters: { search: string };
}

type SortKey = "name" | "blotters" | "pending" | "stations" | "barangays" | "last_active";
type SortDir = "asc" | "desc";

function DispositionBar({ hearing, pending, settled, referred }: {
    hearing: number; pending: number; settled: number; referred: number;
}) {
    const total = hearing + pending + settled + referred;
    if (total === 0) return <span className="text-xs text-gray-400 dark:text-claude-text-muted">No records</span>;
    const pct = (n: number) => `${Math.round((n / total) * 100)}%`;
    return (
        <div className="space-y-1 min-w-[120px]">
            <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                {hearing  > 0 && <div className="bg-amber-400"   style={{ width: pct(hearing)  }} title={`Hearing: ${hearing}`} />}
                {pending  > 0 && <div className="bg-yellow-400"  style={{ width: pct(pending)  }} title={`Pending: ${pending}`} />}
                {settled  > 0 && <div className="bg-emerald-400" style={{ width: pct(settled)  }} title={`Settled: ${settled}`} />}
                {referred > 0 && <div className="bg-orange-500"  style={{ width: pct(referred) }} title={`Referred: ${referred}`} />}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                {hearing  > 0 && <span className="text-[10px] text-amber-600 dark:text-amber-400">{hearing} hearing</span>}
                {pending  > 0 && <span className="text-[10px] text-yellow-600 dark:text-yellow-400">{pending} pending</span>}
                {settled  > 0 && <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{settled} settled</span>}
                {referred > 0 && <span className="text-[10px] text-orange-600 dark:text-orange-400">{referred} referred</span>}
            </div>
        </div>
    );
}

export default function ProvinceIndex({ auth, provinces, summary, filters }: ProvinceIndexProps) {
    const [search, setSearch]       = useState(filters.search ?? "");
    const [sortKey, setSortKey]     = useState<SortKey>("name");
    const [sortDir, setSortDir]     = useState<SortDir>("asc");
    const [activeFilter, setFilter] = useState<"all" | "active" | "no_reports">("all");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("admin.province"), { search }, { preserveState: true, preserveScroll: true });
    };

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    };

    const SortIcon = ({ col }: { col: SortKey }) => {
        if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
        return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-claude-accent" /> : <ChevronDown className="w-3 h-3 text-claude-accent" />;
    };

    const filtered = provinces.filter(p => {
        if (activeFilter === "active")     return p.blotter_count > 0;
        if (activeFilter === "no_reports") return p.blotter_count === 0;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        let av: any, bv: any;
        if (sortKey === "name")        { av = a.name; bv = b.name; }
        else if (sortKey === "blotters")   { av = a.blotter_count;  bv = b.blotter_count; }
        else if (sortKey === "pending")    { av = a.pending_count;  bv = b.pending_count; }
        else if (sortKey === "stations")   { av = a.station_count;  bv = b.station_count; }
        else if (sortKey === "barangays")  { av = a.barangay_count; bv = b.barangay_count; }
        else if (sortKey === "last_active") { av = a.last_blotter_at ?? ""; bv = b.last_blotter_at ?? ""; }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const handleDelete = (p: Province) => {
        if (confirm(`Delete province "${p.name}"? This cannot be undone.`)) {
            router.delete(route("admin.province.destroy", p.id));
        }
    };

    const summaryCards = [
        { label: "Total Provinces", value: summary.total,    icon: <Buildings className="w-5 h-5" />, color: "text-claude-accent",                  bg: "bg-claude-accent/10 dark:bg-claude-accent/20" },
        { label: "Total Stations",  value: summary.stations, icon: <Shield className="w-5 h-5" />,    color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-500/10" },
        { label: "Total Barangays", value: summary.barangays,icon: <Building2 className="w-5 h-5" />, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
        { label: "Total Blotters",  value: summary.blotters, icon: <FileText className="w-5 h-5" />,  color: "text-emerald-600 dark:text-emerald-400",bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    ];

    const filterTabs: { key: typeof activeFilter; label: string }[] = [
        { key: "all",        label: `All (${provinces.length})` },
        { key: "active",     label: `Has Reports (${provinces.filter(p => p.blotter_count > 0).length})` },
        { key: "no_reports", label: `No Reports (${provinces.filter(p => p.blotter_count === 0).length})` },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin - Provinces" />

            <div className="min-h-screen bg-gray-50 dark:bg-claude-bg">
                <div className="p-6 space-y-5">

                    {/* ── Page Header ── */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-claude-accent flex items-center justify-center">
                                <Buildings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-claude-text">Province Management</h1>
                                <p className="text-sm text-gray-500 dark:text-claude-text-muted">Overview of all provinces and their activity</p>
                            </div>
                        </div>
                        <Link href={route("admin.province.create")}
                            className="flex items-center gap-2 px-4 py-2 bg-claude-accent text-white rounded-lg text-sm hover:bg-claude-accent-light transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Province
                        </Link>
                    </div>

                    {/* ── KPI Cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {summaryCards.map(c => (
                            <div key={c.label} className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4 flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${c.bg} flex-shrink-0`}>
                                    <span className={c.color}>{c.icon}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-claude-text">{c.value.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 dark:text-claude-text-muted">{c.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Filters Row ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Quick filter tabs */}
                        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-claude-panel-2 rounded-lg">
                            {filterTabs.map(t => (
                                <button key={t.key} onClick={() => setFilter(t.key)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeFilter === t.key ? "bg-claude-accent text-white shadow-sm" : "text-gray-600 dark:text-claude-text-muted hover:text-gray-900 dark:hover:text-claude-text"}`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search provinces..."
                                    className="pl-8 pr-3 py-2 text-sm bg-white dark:bg-claude-panel border border-gray-200 dark:border-claude-border rounded-lg text-gray-900 dark:text-claude-text focus:ring-2 focus:ring-claude-accent/50 transition-all w-52" />
                            </div>
                            <button type="submit"
                                className="px-3 py-2 bg-claude-accent text-white rounded-lg text-sm hover:bg-claude-accent-light transition-colors">
                                <Search className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>

                    {/* ── Table ── */}
                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-claude-border bg-gray-50/50 dark:bg-claude-panel-2/30">
                                        <th className="px-5 py-3 text-left">
                                            <button onClick={() => toggleSort("name")} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-claude-text-muted hover:text-claude-accent transition-colors">
                                                Province <SortIcon col="name" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            <button onClick={() => toggleSort("stations")} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-claude-text-muted hover:text-claude-accent transition-colors">
                                                Stations <SortIcon col="stations" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            <button onClick={() => toggleSort("barangays")} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-claude-text-muted hover:text-claude-accent transition-colors">
                                                Barangays <SortIcon col="barangays" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            <button onClick={() => toggleSort("blotters")} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-claude-text-muted hover:text-claude-accent transition-colors">
                                                Blotters <SortIcon col="blotters" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            <button onClick={() => toggleSort("pending")} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-claude-text-muted hover:text-claude-accent transition-colors">
                                                Disposition <SortIcon col="pending" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            <button onClick={() => toggleSort("last_active")} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-claude-text-muted hover:text-claude-accent transition-colors">
                                                Last Report <SortIcon col="last_active" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-claude-text-muted">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-claude-border">
                                    {sorted.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-12 text-center text-gray-500 dark:text-claude-text-muted">
                                                <Buildings className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-claude-border" />
                                                No provinces found
                                            </td>
                                        </tr>
                                    ) : sorted.map(province => (
                                        <tr key={province.id} className="hover:bg-gray-50/60 dark:hover:bg-claude-panel-2/40 transition-colors">
                                            {/* Province Name */}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-claude-accent/10 dark:bg-claude-accent/20 flex items-center justify-center flex-shrink-0">
                                                        <MapPin className="w-3.5 h-3.5 text-claude-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-claude-text text-sm">{province.name}</p>
                                                        <p className="text-xs text-gray-400 dark:text-claude-text-muted">Code: {province.code}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Stations */}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-claude-text">{province.station_count}</span>
                                                </div>
                                            </td>
                                            {/* Barangays */}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-purple-500" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-claude-text">{province.barangay_count}</span>
                                                </div>
                                            </td>
                                            {/* Blotters */}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-claude-text">{province.blotter_count.toLocaleString()}</span>
                                                    {province.pending_count > 0 && (
                                                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                                                            {province.pending_count} pending
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            {/* Disposition Bar */}
                                            <td className="px-5 py-3">
                                                <DispositionBar
                                                    hearing={province.hearing_count}
                                                    pending={province.pending_count}
                                                    settled={province.settled_count}
                                                    referred={province.referred_count}
                                                />
                                            </td>
                                            {/* Last Report */}
                                            <td className="px-5 py-3 text-xs text-gray-500 dark:text-claude-text-muted">
                                                {province.last_blotter_at ? (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(province.last_blotter_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300 dark:text-claude-border">—</span>
                                                )}
                                            </td>
                                            {/* Actions */}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Link href={route("admin.province.show", province.id)}
                                                        className="p-1.5 rounded-lg text-gray-500 dark:text-claude-text-muted hover:bg-gray-100 dark:hover:bg-claude-panel-2 hover:text-claude-accent transition-colors"
                                                        title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={route("admin.province.edit", province.id)}
                                                        className="p-1.5 rounded-lg text-gray-500 dark:text-claude-text-muted hover:bg-gray-100 dark:hover:bg-claude-panel-2 hover:text-blue-500 transition-colors"
                                                        title="Edit">
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(province)}
                                                        className="p-1.5 rounded-lg text-gray-500 dark:text-claude-text-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                        title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
