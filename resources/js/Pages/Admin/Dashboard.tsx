import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/Pages/types";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import Chart from "react-apexcharts";
import getIncidentType from "@/utils/functions/getIncidentType";
import getRemark from "@/utils/functions/getRemark";
import {
    Globe,
    FileEarmarkText,
    Building,
    People,
    CalendarCheck,
    ExclamationTriangle,
    CheckCircle,
    HourglassSplit,
    ArrowUpRight,
    ArrowDownRight,
    PersonBadge,
    ShieldCheck,
    JournalText,
    BarChartFill,
    ClockHistory,
    PersonPlusFill,
} from "react-bootstrap-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentBlotter {
    id: number;
    entry_number: string;
    incident_type: number;
    date_reported: string;
    remarks: number;
    created_at: string;
    barangay_name: string;
    complainant_family_name: string | null;
    complainant_first_name: string | null;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Reports {
    totalBlotters: number;
    totalActiveUsers: number;
    totalStations: number;
    thisMonthBlotters: number;
    lastMonthBlotters: number;
    thisWeekBlotters: number;
    hearingCount: number;
    settledCount: number;
    pendingCount: number;
    referredCount: number;
    monthlyThisYear: number[];
    monthlyLastYear: number[];
    incidentTypeBreakdown: { incident_type: number; total: number }[];
    topBarangayUsers: { id: number; name: string; total: number }[];
    blottersOverTime: { date: string; total: number }[];
    recentBlotters: RecentBlotter[];
    recentRegistrations: RecentUser[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function pctChange(curr: number, prev: number) {
    if (prev === 0) return { value: curr > 0 ? 100 : 0, up: true };
    const diff = ((curr - prev) / prev) * 100;
    return { value: Math.abs(Math.round(diff)), up: diff >= 0 };
}

const DISPOSITION_BADGE: Record<number, string> = {
    1: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    2: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    4: "bg-orange-100 text-orange-700 dark:bg-claude-accent/20 dark:text-claude-accent",
    5: "bg-gray-100 text-gray-600 dark:bg-claude-panel-2 dark:text-claude-text-muted",
};

function shortLabel(full: string, max = 30) {
    const m = full.match(/Art\s+\d+\s+-\s+"(.+)"/);
    const s = m ? m[1] : full;
    return s.length > max ? s.substring(0, max) + "…" : s;
}

// ─── Small Components ─────────────────────────────────────────────────────────

function KpiCard({
    icon, label, value, sub, pct, up, color,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    sub?: string;
    pct?: number;
    up?: boolean;
    color: string;
}) {
    return (
        <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
                {pct !== undefined && (
                    <span className={`flex items-center gap-0.5 text-xs font-bold ${up ? "text-green-500" : "text-red-400"}`}>
                        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {pct}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-claude-text">
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-claude-text-muted mt-0.5">{label}</p>
                {sub && <p className="text-xs text-gray-400 dark:text-claude-text-muted mt-1">{sub}</p>}
            </div>
        </div>
    );
}

function GradCard({ value, label, color }: { value: number; label: string; color: string }) {
    return (
        <div className={`rounded-xl p-5 text-white shadow-md ${color}`}>
            <p className="text-3xl font-extrabold">{value}</p>
            <p className="text-sm opacity-80 mt-1">{label}</p>
        </div>
    );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 dark:text-claude-text mb-4">
            {icon}{title}
        </h3>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({
    auth,
    provinces,
    cities,
    barangays,
    reports,
}: PageProps<{
    provinces: object[];
    cities: object[];
    barangays: object[];
    blotters: number;
    reports: Reports;
}>) {
    const currentYear = new Date().getFullYear();
    const monthChange = pctChange(reports.thisMonthBlotters, reports.lastMonthBlotters);

    const last30Total = reports.blottersOverTime.reduce((s, d) => s + d.total, 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-claude-accent rounded-xl">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-claude-text leading-tight">
                            Admin Dashboard
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-claude-text-muted">
                            E-Blotter System — Administration &amp; Reports Overview
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8 px-4 sm:px-6 space-y-6">

                {/* ── KPI Row ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
                    <KpiCard icon={<FileEarmarkText className="w-4 h-4 text-claude-accent"/>}
                        label="Total Blotters" value={reports.totalBlotters}
                        color="bg-orange-50 dark:bg-claude-accent/10" />
                    <KpiCard icon={<CalendarCheck className="w-4 h-4 text-claude-accent"/>}
                        label="This Month" value={reports.thisMonthBlotters}
                        sub={`Last month: ${reports.lastMonthBlotters}`}
                        pct={monthChange.value} up={monthChange.up}
                        color="bg-orange-50 dark:bg-claude-accent/10" />
                    <KpiCard icon={<ClockHistory className="w-4 h-4 text-cyan-600"/>}
                        label="This Week" value={reports.thisWeekBlotters}
                        color="bg-cyan-50 dark:bg-cyan-900/20" />
                    <KpiCard icon={<ExclamationTriangle className="w-4 h-4 text-yellow-600"/>}
                        label="For Hearing" value={reports.hearingCount}
                        color="bg-yellow-50 dark:bg-yellow-900/20" />
                    <KpiCard icon={<CheckCircle className="w-4 h-4 text-green-600"/>}
                        label="Settled" value={reports.settledCount}
                        color="bg-green-50 dark:bg-green-900/20" />
                    <KpiCard icon={<HourglassSplit className="w-4 h-4 text-orange-600"/>}
                        label="Pending" value={reports.pendingCount}
                        color="bg-orange-50 dark:bg-orange-900/20" />
                    <KpiCard icon={<ShieldCheck className="w-4 h-4 text-purple-600"/>}
                        label="Referred to PNP" value={reports.referredCount}
                        color="bg-purple-50 dark:bg-purple-900/20" />
                    <KpiCard icon={<People className="w-4 h-4 text-rose-600"/>}
                        label="Brgy Officers" value={reports.totalActiveUsers}
                        sub={`Stations: ${reports.totalStations}`}
                        color="bg-rose-50 dark:bg-rose-900/20" />
                </div>

                {/* ── Jurisdiction Gradient Cards ─────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <GradCard value={provinces?.length ?? 0} label="Provinces" color="bg-gradient-to-br from-claude-accent to-claude-accent-light" />
                    <GradCard value={cities?.length ?? 0} label="Cities / Municipalities" color="bg-gradient-to-br from-violet-500 to-violet-700" />
                    <GradCard value={barangays?.length ?? 0} label="Barangays" color="bg-gradient-to-br from-fuchsia-500 to-fuchsia-700" />
                    <GradCard value={reports.totalStations} label="Police Stations" color="bg-gradient-to-br from-rose-500 to-rose-700" />
                </div>

                {/* ── Monthly Trend ────────────────────────────────────── */}
                <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-6">
                    <SectionTitle
                        icon={<BarChartFill className="text-claude-accent" size={16} />}
                        title={`Monthly Blotter Trend — ${currentYear} vs ${currentYear - 1}`}
                    />
                    <Chart
                        type="bar" height={300}
                        options={{
                            chart: { toolbar: { show: false }, stacked: false },
                            plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
                            dataLabels: { enabled: false },
                            xaxis: { categories: MONTHS },
                            yaxis: { title: { text: "Blotters" } },
                            colors: ["#d4622a","#9b9b9b"],
                            theme: { mode: "dark" },
                            legend: { position: "top" },
                            grid: { strokeDashArray: 4 },
                            tooltip: { shared: true, intersect: false },
                        }}
                        series={[
                            { name: `${currentYear}`, data: reports.monthlyThisYear },
                            { name: `${currentYear - 1}`, data: reports.monthlyLastYear },
                        ]}
                    />
                </div>

                {/* ── Incident Type + Case Disposition ─────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-6">
                        <SectionTitle
                            icon={<JournalText className="text-green-600" size={16} />}
                            title="Top Incident Types"
                        />
                        {reports.incidentTypeBreakdown.length > 0 ? (
                            <Chart type="donut" height={300}
                                options={{
                                    labels: reports.incidentTypeBreakdown.map((d) => shortLabel(getIncidentType(d.incident_type))),
                                    legend: { position: "bottom", fontSize: "11px" },
                                    dataLabels: {
                                        enabled: true,
                                        formatter: (_v: any, opts: any) => opts.w.config.series[opts.seriesIndex],
                                    },
                                    plotOptions: { pie: { donut: { size: "65%" } } },
                                    tooltip: { y: { formatter: (v: number) => `${v} case${v !== 1 ? "s" : ""}` } },
                                }}
                                series={reports.incidentTypeBreakdown.map((d) => d.total)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-6">
                        <SectionTitle
                            icon={<CheckCircle className="text-purple-600" size={16} />}
                            title="Case Disposition Summary"
                        />
                        <Chart type="bar" height={300}
                            options={{
                                chart: { toolbar: { show: false } },
                                plotOptions: { bar: { horizontal: true, borderRadius: 6, distributed: true } },
                                dataLabels: { enabled: true },
                                xaxis: { categories: ["For Hearing","Amicably Settled","Pending","Referred to PNP"] },
                                colors: ["#f59e0b","#10b981","#f97316","#6366f1"],
                                legend: { show: false },
                                grid: { strokeDashArray: 4 },
                                tooltip: { y: { formatter: (v: number) => `${v} case${v !== 1 ? "s" : ""}` } },
                            }}
                            series={[{ name: "Cases", data: [reports.hearingCount, reports.settledCount, reports.pendingCount, reports.referredCount] }]}
                        />
                    </div>
                </div>

                {/* ── Top 10 Barangays + 30-day Sparkline ─────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-6">
                        <SectionTitle
                            icon={<BarChartFill className="text-fuchsia-600" size={16} />}
                            title="Top 10 Barangays by Blotter Count"
                        />
                        {reports.topBarangayUsers.length > 0 ? (
                            <Chart type="bar" height={300}
                                options={{
                                    chart: { toolbar: { show: false } },
                                    plotOptions: { bar: { horizontal: true, borderRadius: 4, distributed: true } },
                                    dataLabels: { enabled: true },
                                    xaxis: { categories: reports.topBarangayUsers.map((b) => b.name) },
                                    legend: { show: false },
                                    grid: { strokeDashArray: 4 },
                                    tooltip: { y: { formatter: (v: number) => `${v} blotter${v !== 1 ? "s" : ""}` } },
                                }}
                                series={[{ name: "Blotters", data: reports.topBarangayUsers.map((b) => b.total) }]}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-6">
                        <SectionTitle
                            icon={<ClockHistory className="text-claude-accent" size={16} />}
                            title="Last 30 Days"
                        />
                        <Chart type="area" height={240}
                            options={{
                                chart: { toolbar: { show: false } },
                                dataLabels: { enabled: false },
                                stroke: { curve: "smooth", width: 2 },
                                xaxis: {
                                    type: "datetime",
                                    categories: reports.blottersOverTime.map((d) => d.date),
                                    labels: { datetimeUTC: false, format: "dd MMM" },
                                },
                                colors: ["#d4622a"],
                                fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.02 } },
                                grid: { strokeDashArray: 4 },
                                tooltip: { x: { format: "dd MMM yyyy" } },
                            }}
                            series={[{ name: "Reports", data: reports.blottersOverTime.map((d) => d.total) }]}
                        />
                        <div className="mt-4 text-center">
                            <p className="text-4xl font-extrabold text-gray-900 dark:text-claude-text">{last30Total}</p>
                            <p className="text-sm text-gray-500 dark:text-claude-text-muted">blotters in last 30 days</p>
                        </div>
                    </div>
                </div>

                {/* ── Recent Blotters Table ────────────────────────────── */}
                <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <SectionTitle
                            icon={<FileEarmarkText className="text-red-500" size={16} />}
                            title="Recent Blotter Reports"
                        />
                        <Link href={route("blotter.admin.blotters")}
                            className="text-sm text-claude-accent hover:underline font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-claude-border text-xs uppercase text-gray-500 dark:text-claude-text-muted">
                                    <th className="py-3 px-3 font-semibold">Entry No.</th>
                                    <th className="py-3 px-3 font-semibold">Complainant</th>
                                    <th className="py-3 px-3 font-semibold">Incident Type</th>
                                    <th className="py-3 px-3 font-semibold">Barangay</th>
                                    <th className="py-3 px-3 font-semibold">Date Reported</th>
                                    <th className="py-3 px-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-claude-border">
                                {reports.recentBlotters.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                                            No blotter records yet
                                        </td>
                                    </tr>
                                ) : (
                                    reports.recentBlotters.map((b) => (
                                        <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-claude-panel-2/60 transition-colors">
                                            <td className="py-3 px-3 font-bold text-gray-900 dark:text-claude-text whitespace-nowrap">
                                                #{b.entry_number}
                                            </td>
                                            <td className="py-3 px-3 text-gray-700 dark:text-claude-text-muted whitespace-nowrap">
                                                {b.complainant_family_name
                                                    ? `${b.complainant_family_name}, ${b.complainant_first_name ?? ""}`
                                                    : <span className="italic text-gray-400">—</span>}
                                            </td>
                                            <td className="py-3 px-3 max-w-xs">
                                                <span className="block truncate text-gray-700 dark:text-claude-text-muted"
                                                    title={getIncidentType(b.incident_type)}>
                                                    {shortLabel(getIncidentType(b.incident_type), 38)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-gray-700 dark:text-claude-text-muted whitespace-nowrap">
                                                {b.barangay_name ?? "—"}
                                            </td>
                                            <td className="py-3 px-3 text-gray-500 dark:text-claude-text-muted whitespace-nowrap">
                                                {new Date(b.date_reported).toLocaleDateString("en-PH", {
                                                    year: "numeric", month: "short", day: "numeric",
                                                })}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${DISPOSITION_BADGE[b.remarks] ?? "bg-gray-100 text-gray-600"}`}>
                                                    {getRemark(b.remarks) ?? "Unset"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Recent Registrations ─────────────────────────────── */}
                <div className="bg-white dark:bg-claude-panel rounded-xl border border-gray-100 dark:border-claude-border p-6">
                    <SectionTitle
                        icon={<PersonPlusFill className="text-emerald-600" size={16} />}
                        title="Recently Registered Barangay Officers"
                    />
                    {reports.recentRegistrations.length === 0 ? (
                        <p className="text-gray-400 text-sm">No recent registrations</p>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-claude-border">
                            {reports.recentRegistrations.map((u) => (
                                <li key={u.id} className="flex items-center gap-3 py-3">
                                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                        <PersonBadge className="text-emerald-600" size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-claude-text truncate">{u.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-claude-text-muted truncate">{u.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-claude-text-muted whitespace-nowrap">
                                        {new Date(u.created_at).toLocaleDateString("en-PH", {
                                            month: "short", day: "numeric", year: "numeric",
                                        })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
