import React, { useState, useMemo } from "react";
import { PageProps } from "@/Pages/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import getIncidentType from "@/utils/functions/getIncidentType";
import {
    Building,
    BarChart3,
    FileText,
    Users,
    TrendingUp,
    MapPin,
    Activity,
    Download,
    Filter,
    Calendar,
    Shield,
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    PieChart,
    TrendingDown,
    UserCheck,
    FileWarning,
    RefreshCw,
    Search,
    ChevronDown,
    X,
} from "lucide-react";

interface MunicipalReportsProps {
    auth: PageProps["auth"];
    municipal: {
        id: number;
        name: string;
        email: string;
    };
    barangays: Array<{ id: number; name: string }>;
    blotters: Array<{
        id: number;
        entry_number: string;
        complainant: string;
        respondent: string;
        incident_type: string;
        incident_date: string;
        incident_location: string;
        barangay: string;
        remarks: string;
        status: string;
        date_reported: string;
        reported_by: string;
        days_pending: number;
    }>;
    stats: {
        total_cases: number;
        resolved: number;
        pending: number;
        for_hearing: number;
        referred: number;
        resolution_rate: number;
    };
    incident_types: Record<string, number>;
    barangay_stats: Array<{
        name: string;
        total: number;
        resolved: number;
        pending: number;
        for_hearing: number;
    }>;
    monthly_data: Array<{
        month: string;
        cases: number;
        resolved: number;
    }>;
}

export default function MunicipalReports({
    auth,
    municipal,
    barangays,
    blotters,
    stats,
    incident_types,
    barangay_stats,
    monthly_data,
    municipalities,
}: MunicipalReportsProps & {
    municipalities?: Array<{ id: number; name: string }>;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedBarangay, setSelectedBarangay] = useState("all");
    const [selectedIncidentType, setSelectedIncidentType] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter blotters based on search and filters
    const filteredBlotters = useMemo(() => {
        return blotters.filter((blotter) => {
            const matchesSearch =
                searchTerm === "" ||
                blotter.entry_number
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                blotter.complainant
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                blotter.respondent
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                blotter.incident_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                blotter.barangay
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                selectedStatus === "all" || blotter.status === selectedStatus;
            const matchesBarangay =
                selectedBarangay === "all" ||
                blotter.barangay === selectedBarangay;
            const matchesIncidentType =
                selectedIncidentType === "all" ||
                blotter.incident_type === selectedIncidentType;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesBarangay &&
                matchesIncidentType
            );
        });
    }, [
        blotters,
        searchTerm,
        selectedStatus,
        selectedBarangay,
        selectedIncidentType,
    ]);

    // Pagination
    const totalPages = Math.ceil(filteredBlotters.length / itemsPerPage);
    const paginatedBlotters = filteredBlotters.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Amicably Settled":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "For Hearing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "Referred to PNP":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-claude-bg/30 dark:text-claude-text-muted";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Amicably Settled":
                return <CheckCircle className="w-4 h-4" />;
            case "Pending":
                return <Clock className="w-4 h-4" />;
            case "For Hearing":
                return <Calendar className="w-4 h-4" />;
            case "Referred to PNP":
                return <ArrowUp className="w-4 h-4" />;
            default:
                return <FileWarning className="w-4 h-4" />;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} municipalities={municipalities}>
            <Head title={`${municipal.name} Reports`} />

            <div className="min-h-screen bg-transparent px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                                <Building className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-claude-text">
                                    {municipal.name} Reports
                                </h1>
                                <p className="text-gray-600 dark:text-claude-text-muted">
                                    Comprehensive blotter records and analytics
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-gray-100 dark:bg-graydark text-gray-700 dark:text-claude-text-muted rounded-lg hover:bg-gray-200 dark:hover:bg-graydark/50 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-claude-text-muted">
                                    Total Cases
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-claude-text">
                                    {stats.total_cases}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-claude-text-muted">
                                    Resolved
                                </p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {stats.resolved}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-claude-text-muted">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {stats.pending}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-claude-text-muted">
                                    Resolution Rate
                                </p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {stats.resolution_rate}%
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Trends */}
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-claude-text mb-4">
                            Monthly Trends
                        </h3>
                        <div className="space-y-3">
                            {monthly_data.map((month, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm text-gray-600 dark:text-claude-text-muted">
                                        {month.month}
                                    </span>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                            <span className="text-sm text-gray-700 dark:text-claude-text-muted">
                                                {month.cases}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                                            <span className="text-sm text-gray-700 dark:text-claude-text-muted">
                                                {month.resolved}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Incident Types */}
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-claude-text mb-4">
                            Top Incident Types
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(incident_types).map(
                                ([type, count], index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm text-gray-600 dark:text-claude-text-muted">
                                            {type}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-claude-text">
                                            {count}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl p-6 mb-6 border border-slate-200 dark:border-strokedark">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by entry number, complainant, respondent, incident type, or barangay..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-strokedark rounded-lg bg-white dark:bg-boxdark text-gray-900 dark:!text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm dark:shadow-md"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-gray-100 dark:bg-graydark text-gray-700 dark:text-claude-text-muted rounded-lg hover:bg-gray-200 dark:hover:bg-graydark/50 transition-colors flex items-center gap-2 border border-slate-200 dark:border-strokedark shadow-sm dark:shadow-md"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {showFilters ? (
                                    <X className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-strokedark">
                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                }
                                className="px-4 py-2 border border-slate-200 dark:border-strokedark rounded-lg bg-white dark:bg-boxdark text-gray-900 dark:!text-white focus:ring-2 focus:ring-blue-500 shadow-sm dark:shadow-md"
                            >
                                <option value="all">All Status</option>
                                <option value="Amicably Settled">
                                    Amicably Settled
                                </option>
                                <option value="Pending">Pending</option>
                                <option value="For Hearing">For Hearing</option>
                                <option value="Referred to PNP">
                                    Referred to PNP
                                </option>
                            </select>

                            <select
                                value={selectedBarangay}
                                onChange={(e) =>
                                    setSelectedBarangay(e.target.value)
                                }
                                className="px-4 py-2 border border-slate-200 dark:border-strokedark rounded-lg bg-white dark:bg-boxdark text-gray-900 dark:!text-white focus:ring-2 focus:ring-blue-500 shadow-sm dark:shadow-md"
                            >
                                <option value="all">All Barangays</option>
                                {barangays.map((barangay) => (
                                    <option
                                        key={barangay.id}
                                        value={barangay.name}
                                    >
                                        {barangay.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedIncidentType}
                                onChange={(e) =>
                                    setSelectedIncidentType(e.target.value)
                                }
                                className="px-4 py-2 border border-slate-200 dark:border-strokedark rounded-lg bg-white dark:bg-boxdark text-gray-900 dark:!text-white focus:ring-2 focus:ring-blue-500 shadow-sm dark:shadow-md"
                            >
                                <option value="all">All Incident Types</option>
                                {Object.keys(incident_types).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-claude-text-muted">
                        Showing {filteredBlotters.length} of {blotters.length}{" "}
                        records
                    </p>
                </div>

                {/* Blotter Table */}
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg dark:shadow-xl overflow-hidden border border-slate-200 dark:border-strokedark">
                    <div className="overflow-x-auto">
                        <table className="w-full border border-slate-200 dark:border-strokedark">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-graydark/50 dark:to-graydark/30">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-strokedark">
                                        Entry #
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-strokedark">
                                        Complainant
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-strokedark">
                                        Respondent
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-strokedark">
                                        Incident Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-strokedark">
                                        Barangay
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-strokedark">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider border-r border-slate-200 dark:border-strokedark">
                                        Date Reported
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:!text-slate-300 uppercase tracking-wider">
                                        Days Pending
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-strokedark">
                                {paginatedBlotters.map((blotter, index) => (
                                    <tr
                                        key={blotter.id}
                                        className={`hover:bg-slate-50 dark:hover:bg-graydark/20 transition-all duration-200 ${index % 2 === 0 ? "bg-slate-50/50 dark:bg-graydark/10" : ""}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:!text-white border-r border-slate-100 dark:border-strokedark">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="font-mono text-xs text-slate-500 dark:!text-slate-400 bg-slate-100 dark:bg-graydark/30 px-2 py-1 rounded">
                                                    {blotter.entry_number}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:!text-slate-300 border-r border-slate-100 dark:border-strokedark">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                <span className="truncate">
                                                    {blotter.complainant}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:!text-slate-300 border-r border-slate-100 dark:border-strokedark">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>
                                                    {blotter.respondent}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:!text-slate-300 border-r border-slate-100 dark:border-strokedark">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                                <span className="truncate">
                                                    {blotter.complainant}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:!text-slate-300 border-r border-slate-100 dark:border-strokedark">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400 dark:!text-slate-500" />
                                                <span
                                                    className={`font-medium ${blotter.days_pending > 30 ? "text-red-600 dark:!text-red-400" : "text-slate-600 dark:!text-slate-400"}`}
                                                >
                                                    {blotter.days_pending}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-strokedark">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-claude-text-muted">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(1, currentPage - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-graydark text-gray-700 dark:text-claude-text-muted rounded hover:bg-gray-200 dark:hover:bg-graydark/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1,
                                                ),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-graydark text-gray-700 dark:text-claude-text-muted rounded hover:bg-gray-200 dark:hover:bg-graydark/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
