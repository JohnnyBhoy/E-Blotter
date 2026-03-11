import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Eye,
    Users,
    MapPin,
    Calendar,
    Loader,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getIncident } from "@/utils/functions/getIncident";
import getIncidentType from "@/utils/functions/getIncidentType";
import getRemark from "@/utils/functions/getRemark";

interface Blotter {
    id: number;
    entry_number: string;
    barangay: string;
    date_reported: string;
    time_of_report: string;
    incident_type: string;
    narrative: string;
    remarks: string;
    status: string;
    created_at: string;
    updated_at: string;
    date_of_incident: string;
    time_of_incident: string;
    uploaded_file: string;
    complainant_signature: string;
    recorded_by_signature: string;
}

interface Stats {
    total: number;
    pending: number;
    resolved: number;
    this_month: number;
}

export default function Dashboard({ auth }: { auth: any }) {
    const [activeTab, setActiveTab] = useState<
        "overview" | "create" | "manage" | "reports"
    >("overview");
    const [blotters, setBlotters] = useState<Blotter[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        resolved: 0,
        this_month: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingBlotter, setEditingBlotter] = useState<Blotter | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        date_reported: new Date().toISOString().split("T")[0],
        time_of_report: new Date().toTimeString().slice(0, 5),
        incident_type: "",
        narrative: "",
        remarks: "",
        date_of_incident: "",
        time_of_incident: "",
        complainant_signature: "",
        recorded_by_signature: "",
    });

    const incidentTypes = [
        "Crime",
        "Fire",
        "Medical Emergency",
        "Traffic Accident",
        "Domestic Violence",
        "Missing Person",
        "Vehicular Accident",
        "Others",
    ];

    const remarksOptions = [
        "Case under investigation",
        "Pending witness statements",
        "Forwarded to PNP",
        "Resolved - No charges filed",
        "Requires follow-up",
        "Closed - Lack of evidence",
        "Referred to higher authority",
        "Settled amicably",
        "Under legal review",
        "Awaiting court appearance",
        "Other",
    ];

    const fetchBlotters = async () => {
        try {
            const response = await axios.get("/api/barangay/blotters");
            console.log("API Response:", response.data); // Debug log
            setBlotters(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching blotters:", error);
            // Set empty array on error to prevent filter errors
            setBlotters([]);
            calculateStats([]);
        }
    };

    const calculateStats = (blotters: Blotter[]) => {
        if (!Array.isArray(blotters)) {
            console.error("blotters is not an array:", blotters);
            setStats({ total: 0, pending: 0, resolved: 0, this_month: 0 });
            return;
        }

        const total = blotters.length;
        const pending = blotters.filter((b) => b.status === "Pending").length;
        const resolved = blotters.filter((b) => b.status === "Resolved").length;
        const thisMonth = blotters.filter((b) => {
            const blotterDate = new Date(b.created_at);
            const currentDate = new Date();
            return (
                blotterDate.getMonth() === currentDate.getMonth() &&
                blotterDate.getFullYear() === currentDate.getFullYear()
            );
        }).length;

        setStats({ total, pending, resolved, this_month: thisMonth });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingBlotter) {
                await axios.put(
                    `/api/barangay/blotters/${editingBlotter.id}`,
                    formData,
                );
                toast.success("Blotter report updated successfully!");
            } else {
                await axios.post("/api/barangay/blotters", formData);
                toast.success("Blotter report created successfully!");
            }

            setFormData({
                date_reported: new Date().toISOString().split("T")[0],
                time_of_report: new Date().toTimeString().slice(0, 5),
                incident_type: "",
                narrative: "",
                remarks: "",
                date_of_incident: "",
                time_of_incident: "",
                complainant_signature: "",
                recorded_by_signature: "",
            });
            setEditingBlotter(null);
            setShowCreateForm(false);
            fetchBlotters();
        } catch (error) {
            console.error("Error saving blotter:", error);
            toast.error("Failed to save blotter report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (blotter: Blotter) => {
        setEditingBlotter(blotter);
        setFormData({
            date_reported: blotter.date_reported,
            time_of_report: blotter.time_of_report,
            incident_type: blotter.incident_type,
            narrative: blotter.narrative,
            remarks: blotter.remarks,
            date_of_incident: blotter.date_of_incident,
            time_of_incident: blotter.time_of_incident,
            complainant_signature: blotter.complainant_signature || "",
            recorded_by_signature: blotter.recorded_by_signature || "",
        });
        setShowCreateForm(true);
        setActiveTab("create");
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this blotter report?")) {
            try {
                await axios.delete(`/api/barangay/blotters/${id}`);
                toast.success("Blotter report deleted successfully!");
                fetchBlotters();
            } catch (error) {
                console.error("Error deleting blotter:", error);
                toast.error(
                    "Failed to delete blotter report. Please try again.",
                );
            }
        }
    };

    const filteredBlotters = Array.isArray(blotters)
        ? blotters.filter(
              (blotter) =>
                  (blotter.barangay?.toLowerCase() || "").includes(
                      searchTerm.toLowerCase(),
                  ) ||
                  (blotter.incident_type?.toLowerCase() || "").includes(
                      searchTerm.toLowerCase(),
                  ) ||
                  (blotter.narrative?.toLowerCase() || "").includes(
                      searchTerm.toLowerCase(),
                  ),
          )
        : [];

    useEffect(() => {
        fetchBlotters();
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-claude-accent rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-black dark:text-claude-text leading-tight">
                            Barangay Blotter System
                        </h2>
                        <p className="text-sm text-claude-accent dark:text-claude-text-muted">
                            {auth.user.name} • {auth.user.email}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Barangay Blotter Dashboard - E-Blotter" />

            <div className="min-h-screen bg-gradient-to-br bg-gray-50 dark:bg-claude-bg transition-all duration-500">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 p-6">
                    {/* Stats Cards - Enhanced with Gradients */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-claude-panel border border-gray-100 dark:border-claude-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-claude-accent dark:text-claude-text-muted text-sm font-medium">
                                        Total Reports
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-claude-text mt-1">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-claude-accent rounded-xl shadow-lg">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-claude-panel border border-gray-100 dark:border-claude-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-600 dark:text-amber-300 text-sm font-medium">
                                        Pending
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-claude-text mt-1">
                                        {stats.pending}
                                    </p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-claude-panel border border-gray-100 dark:border-claude-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-600 dark:text-emerald-300 text-sm font-medium">
                                        Resolved
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-claude-text mt-1">
                                        {stats.resolved}
                                    </p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-claude-panel border border-gray-100 dark:border-claude-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                                        This Month
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-claude-text mt-1">
                                        {stats.this_month}
                                    </p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs - Enhanced */}
                    <div className="bg-white dark:bg-claude-panel rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 border-0">
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 p-2">
                            {[
                                {
                                    id: "overview",
                                    label: "Overview",
                                    icon: <Eye className="w-4 h-4" />,
                                },
                                {
                                    id: "create",
                                    label: "Create Report",
                                    icon: <Plus className="w-4 h-4" />,
                                },
                                {
                                    id: "manage",
                                    label: "Manage",
                                    icon: <Edit className="w-4 h-4" />,
                                },
                                {
                                    id: "reports",
                                    label: "All Reports",
                                    icon: <FileText className="w-4 h-4" />,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 min-w-fit px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? "bg-claude-accent text-white shadow-lg transform scale-105"
                                            : "text-gray-600 dark:text-claude-text-muted dark:hover:bg-claude-panel-2 hover:text-claude-accent dark:hover:text-claude-accent"
                                    }`}
                                >
                                    <span className="flex place-items-center justify-center gap-x-3">
                                        {tab.icon}
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content - Enhanced */}
                    <div className="bg-white dark:bg-claude-panel rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0">
                        {activeTab === "overview" && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-claude-text mb-6">
                                    System Overview
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 dark:bg-claude-panel-2 rounded-xl p-4 border-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-claude-text mb-3">
                                            Recent Activity
                                        </h4>
                                        <div className="space-y-2">
                                            {blotters
                                                ?.slice(0, 5)
                                                ?.map((blotter) => (
                                                    <div
                                                        key={blotter.id}
                                                        className="flex items-center justify-between p-3 bg-white/50 dark:bg-claude-panel-2 rounded-xl hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-200 border-0"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="w-4 h-4 text-claude-accent dark:text-claude-text-muted" />
                                                            <span className="text-sm text-gray-900 dark:text-claude-text">
                                                                {getIncidentType(
                                                                    blotter.incident_type,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-600 dark:text-claude-text-muted">
                                                            {new Date(
                                                                blotter.created_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-500/10 dark:to-emerald-600/20 rounded-xl p-4 border-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-claude-text mb-3">
                                            Quick Actions
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => {
                                                    setActiveTab("create");
                                                    setShowCreateForm(true);
                                                }}
                                                className="p-3 bg-claude-accent text-white rounded-xl hover:bg-claude-accent-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-0"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span className="ml-2">
                                                    New Report
                                                </span>
                                            </button>
                                            <Link
                                                href="/blotter/blotters"
                                                className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center border-0"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span className="ml-2">
                                                    View All
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "create" && (
                            <div>
                                <h3 className="text-xl font-bold text-black dark:text-claude-text mb-6">
                                    {editingBlotter
                                        ? "Edit Blotter Report"
                                        : "Create New Blotter Report"}
                                </h3>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                                Date Reported
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.date_reported}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        date_reported:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                                Time Reported
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.time_of_report}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        time_of_report:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                                Incident Type
                                            </label>
                                            <select
                                                value={formData.incident_type}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        incident_type:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text"
                                                required
                                            >
                                                <option value="">
                                                    Select incident type
                                                </option>
                                                {incidentTypes.map((type) => (
                                                    <option
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                                    Date of Incident
                                                </label>
                                                <input
                                                    type="date"
                                                    value={
                                                        formData.date_of_incident
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            date_of_incident:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                                    Time of Incident
                                                </label>
                                                <input
                                                    type="time"
                                                    value={
                                                        formData.time_of_incident
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            time_of_incident:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                            Narrative
                                        </label>
                                        <textarea
                                            value={formData.narrative}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    narrative: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                            placeholder="Describe the incident details..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                            Remarks
                                        </label>
                                        <select
                                            value={formData.remarks}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    remarks: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text"
                                        >
                                            <option value="">
                                                Select remark status
                                            </option>
                                            {remarksOptions.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                                Complainant Signature
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    formData.complainant_signature
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        complainant_signature:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                                placeholder="Complainant name (optional)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-claude-accent dark:text-claude-text-muted mb-2">
                                                Recorded By Signature
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    formData.recorded_by_signature
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        recorded_by_signature:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                                placeholder="Recording officer signature (optional)"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setEditingBlotter(null);
                                            }}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2 bg-claude-accent text-white rounded-lg hover:bg-claude-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    <span>
                                                        {editingBlotter
                                                            ? "Updating..."
                                                            : "Creating..."}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>
                                                    {editingBlotter
                                                        ? "Update"
                                                        : "Create"}{" "}
                                                    Report
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "manage" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-black dark:text-claude-text">
                                        Manage Blotter Reports
                                    </h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-claude-accent dark:text-claude-text-muted absolute left-3 top-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search reports..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    )
                                                }
                                                className="pl-10 pr-4 py-2 bg-white border border-claude-border rounded-lg text-gray-900 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-accent/50 dark:bg-claude-panel-2 dark:border-claude-border dark:text-claude-text dark:placeholder-claude-text-muted"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-black dark:text-claude-text">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-claude-border">
                                                <th className="text-left p-3 font-semibold text-gray-800 dark:text-claude-text">
                                                    Entry #
                                                </th>
                                                <th className="text-left p-3 font-semibold text-gray-800 dark:text-claude-text">
                                                    Incident Type
                                                </th>
                                                <th className="text-left p-3 font-semibold text-gray-800 dark:text-claude-text">
                                                    Date Reported
                                                </th>
                                                <th className="text-left p-3 font-semibold text-gray-800 dark:text-claude-text">
                                                    Case Status
                                                </th>
                                                <th className="text-left p-3 font-semibold text-gray-800 dark:text-claude-text">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBlotters.map((blotter) => (
                                                <tr
                                                    key={blotter.id}
                                                    className="border-b border-gray-100 dark:border-claude-border hover:bg-gray-50 dark:hover:bg-claude-panel-2"
                                                >
                                                    <td className="p-3">
                                                        {blotter.entry_number}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="px-2 py-1 bg-orange-100 dark:bg-claude-accent/20 rounded text-xs text-gray-800 dark:text-claude-accent">
                                                            {getIncidentType(
                                                                blotter.incident_type,
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        {new Date(
                                                            blotter.date_reported,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs ${
                                                                blotter.remarks
                                                                    ?.toLowerCase()
                                                                    .includes(
                                                                        "resolved",
                                                                    )
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                                                                    : blotter.remarks
                                                                            ?.toLowerCase()
                                                                            .includes(
                                                                                "pending",
                                                                            )
                                                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                                                                      : blotter.remarks
                                                                              ?.toLowerCase()
                                                                              .includes(
                                                                                  "closed",
                                                                              )
                                                                        ? "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-claude-text-muted"
                                                                        : blotter.remarks
                                                                                ?.toLowerCase()
                                                                                .includes(
                                                                                    "investigation",
                                                                                )
                                                                          ? "bg-orange-100 text-gray-800 dark:bg-claude-accent/20 dark:text-claude-accent"
                                                                          : blotter.remarks
                                                                                  ?.toLowerCase()
                                                                                  .includes(
                                                                                      "court",
                                                                                  )
                                                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400"
                                                                            : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-claude-text-muted"
                                                            }`}
                                                        >
                                                            {getRemark(
                                                                blotter.remarks,
                                                            ) || "No Status"}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        blotter,
                                                                    )
                                                                }
                                                                className="p-1 bg-claude-accent text-white rounded hover:bg-claude-accent-light transition-colors"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        blotter.id,
                                                                    )
                                                                }
                                                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "reports" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-black dark:text-claude-text">
                                        All Blotter Reports
                                    </h3>
                                    <Link
                                        href="/barangay/reports/export"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Reports
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {blotters.map((blotter) => (
                                        <div
                                            key={blotter.id}
                                            className="bg-gray-50 dark:bg-claude-panel rounded-lg p-4 border border-gray-200 dark:border-claude-border"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-black dark:text-claude-text">
                                                    #{blotter.entry_number}
                                                </h4>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${
                                                        blotter.status ===
                                                        "Resolved"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                                                            : blotter.status ===
                                                                "Pending"
                                                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                                                              : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-claude-text-muted"
                                                    }`}
                                                >
                                                    {blotter.status}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-black dark:text-claude-text">
                                                    <span className="font-medium text-gray-800 dark:text-claude-text-muted">
                                                        Type:
                                                    </span>{" "}
                                                    {getIncidentType(
                                                        blotter.incident_type,
                                                    )}
                                                </p>
                                                <p className="text-sm text-black dark:text-claude-text">
                                                    <span className="font-medium text-gray-800 dark:text-claude-text-muted">
                                                        Date:
                                                    </span>{" "}
                                                    {new Date(
                                                        blotter.date_reported,
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-black dark:text-claude-text">
                                                    <span className="font-medium text-gray-800 dark:text-claude-text-muted">
                                                        Barangay:
                                                    </span>{" "}
                                                    {blotter.barangay}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-claude-text-muted line-clamp-2">
                                                    {blotter.narrative}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3 justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(blotter)
                                                    }
                                                    className="flex-1 min-w-fit px-3 py-1 bg-claude-accent text-white rounded text-sm hover:bg-claude-accent-light transition-colors flex items-center justify-center"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(blotter.id)
                                                    }
                                                    className="flex-1 min-w-fit px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
