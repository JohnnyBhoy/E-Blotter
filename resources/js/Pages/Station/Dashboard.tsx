import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import axios from 'axios';
import { toast } from 'sonner';
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
    TrendingUp,
    Building,
    Shield,
    Activity
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Blotter {
    id: number;
    entry_number: string;
    barangay: string;
    barangay_name: string; // Added for station dashboard
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
    user_id: number;
}

interface BarangayStats {
    barangay_name: string;
    total_cases: number;
    pending: number;
    resolved: number;
    this_month: number;
}

interface StationStats {
    total_cases: number;
    pending: number;
    resolved: number;
    this_month: number;
    barangays_covered: number;
    top_crime_types: { [key: string]: number };
}

export default function StationDashboard({ auth }: { auth: any }) {
    const [blotters, setBlotters] = useState<Blotter[]>([]);
    const [barangayStats, setBarangayStats] = useState<BarangayStats[]>([]);
    const [stationStats, setStationStats] = useState<StationStats>({
        total_cases: 0,
        pending: 0,
        resolved: 0,
        this_month: 0,
        barangays_covered: 0,
        top_crime_types: {}
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'incidents' | 'barangays' | 'reports'>('overview');

    const fetchStationData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/station/blotters');
            console.log('Station API Response:', response.data);
            
            setBlotters(response.data.blotters || []);
            setBarangayStats(response.data.barangay_stats || []);
            setStationStats(response.data.station_stats || {
                total_cases: 0,
                pending: 0,
                resolved: 0,
                this_month: 0,
                barangays_covered: 0,
                top_crime_types: {}
            });
        } catch (error: any) {
            console.error('Error fetching station data:', error);
            
            if (error.response?.status === 401) {
                toast.error('Please log in to access station dashboard');
            } else if (error.response?.status === 403) {
                toast.error('You do not have permission to access station dashboard');
            } else {
                toast.error('Failed to load station data. Please try again.');
            }
            
            setBlotters([]);
            setBarangayStats([]);
            setStationStats({
                total_cases: 0,
                pending: 0,
                resolved: 0,
                this_month: 0,
                barangays_covered: 0,
                top_crime_types: {}
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this blotter report?')) {
            try {
                await axios.delete(`/api/station/blotters/${id}`);
                toast.success('Blotter report deleted successfully!');
                fetchStationData();
            } catch (error) {
                console.error('Error deleting blotter:', error);
                toast.error('Failed to delete blotter report. Please try again.');
            }
        }
    };

    const filteredBlotters = Array.isArray(blotters) ? blotters.filter(blotter => 
        (blotter.barangay_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (blotter.incident_type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (blotter.narrative?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ).filter(blotter => 
        selectedBarangay === '' || blotter.barangay_name === selectedBarangay
    ) : [];

    const barangays = Array.isArray(barangayStats) ? barangayStats.map(b => b.barangay_name) : [];

    useEffect(() => {
        fetchStationData();
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-black dark:text-white leading-tight">
                            Police Station Dashboard
                        </h2>
                        <p className="text-sm text-blue-600 dark:text-blue-200">
                            {auth.user.name} • {auth.user.email}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Police Station Dashboard - E-Blotter" />

            <div className="min-h-screen bg-white dark:bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-colors duration-300">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20">
                    <div className="absolute inset-0 dark:hidden" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10 p-6">
                    {/* Station Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl p-6 border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-200 text-sm">Total Cases</p>
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stationStats.total_cases}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl p-6 border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-200 text-sm">Pending</p>
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stationStats.pending}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
                                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl p-6 border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-200 text-sm">Resolved</p>
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stationStats.resolved}</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl p-6 border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-200 text-sm">Barangays Covered</p>
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stationStats.barangays_covered}</p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                                    <Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg mb-6 shadow-sm">
                        <div className="flex flex-wrap sm:flex-nowrap gap-1 p-1">
                            {[
                                { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
                                { id: 'incidents', label: 'All Incidents', icon: <FileText className="w-4 h-4" /> },
                                { id: 'barangays', label: 'Barangays', icon: <Building className="w-4 h-4" /> },
                                { id: 'reports', label: 'Reports', icon: <TrendingUp className="w-4 h-4" /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : 'text-blue-600 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-800 dark:hover:text-white'
                                    }`}
                                >
                                    <span className="flex items-center space-x-2">
                                        {tab.icon}
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg p-6 shadow-sm">
                        {activeTab === 'overview' && (
                            <div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-6">Station Overview</h3>
                                
                                {/* Top Crime Types */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Top Crime Types</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(stationStats.top_crime_types).map(([type, count]) => (
                                            <div key={type} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-white/5 rounded-lg">
                                                <span className="text-sm font-medium text-black dark:text-white">{type}</span>
                                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-blue-50 dark:bg-white/5 rounded-lg p-4 border border-blue-200 dark:border-none">
                                    <h4 className="font-semibold text-black dark:text-white mb-3">Recent Activity</h4>
                                    <div className="space-y-2">
                                        {blotters.slice(0, 5).map(blotter => (
                                            <div key={blotter.id} className="flex items-center justify-between p-2 bg-white dark:bg-white/10 rounded border border-blue-100 dark:border-none">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    <span className="text-sm text-black dark:text-white">
                                                        {blotter.incident_type} - {blotter.barangay_name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(blotter.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'incidents' && (
                            <div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-6">All Incidents</h3>
                                
                                {/* Filters */}
                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-blue-600 dark:text-blue-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search incidents..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/10 border border-blue-300 dark:border-white/20 rounded-lg text-black dark:text-white placeholder-blue-400 dark:placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:w-64">
                                        <select
                                            value={selectedBarangay}
                                            onChange={(e) => setSelectedBarangay(e.target.value)}
                                            className="w-full px-4 py-2 bg-white dark:bg-white/10 border border-blue-300 dark:border-white/20 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All Barangays</option>
                                            {barangays.map(barangay => (
                                                <option key={barangay} value={barangay}>{barangay}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Incidents Table */}
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <Loader className="w-8 h-8 animate-spin text-blue-600" />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-black dark:text-white">
                                            <thead>
                                                <tr className="border-b border-blue-200 dark:border-white/20">
                                                    <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Entry #</th>
                                                    <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Barangay</th>
                                                    <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Incident Type</th>
                                                    <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Date Reported</th>
                                                    <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Status</th>
                                                    <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredBlotters.length > 0 ? (
                                                    filteredBlotters.map(blotter => (
                                                        <tr key={blotter.id} className="border-b border-blue-100 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-white/5">
                                                            <td className="p-3">{blotter.entry_number}</td>
                                                            <td className="p-3">{blotter.barangay_name}</td>
                                                            <td className="p-3">
                                                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 rounded text-xs text-blue-800 dark:text-blue-400">
                                                                    {blotter.incident_type}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">{new Date(blotter.date_reported).toLocaleDateString()}</td>
                                                            <td className="p-3">
                                                                <span className={`px-2 py-1 rounded text-xs ${
                                                                    blotter.remarks?.toLowerCase().includes('resolved') ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                                                                    blotter.remarks?.toLowerCase().includes('pending') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
                                                                    blotter.remarks?.toLowerCase().includes('closed') ? 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400' :
                                                                    blotter.remarks?.toLowerCase().includes('investigation') ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400' :
                                                                    blotter.remarks?.toLowerCase().includes('court') ? 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400' :
                                                                    'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400'
                                                                }`}>
                                                                    {blotter.remarks || 'No Status'}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="flex gap-2 justify-center">
                                                                    <button
                                                                        className="flex-1 min-w-fit p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                                        title="View Details"
                                                                    >
                                                                        <Eye className="w-3 h-3" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(blotter.id)}
                                                                        className="flex-1 min-w-fit p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                            No incidents found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'barangays' && (
                            <div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-6">Barangay Statistics</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {barangayStats.map((barangay, index) => (
                                        <div key={index} className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-semibold text-black dark:text-white">{barangay.barangay_name}</h4>
                                                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Cases</span>
                                                    <span className="font-medium text-black dark:text-white">{barangay.total_cases}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                                                    <span className="font-medium text-yellow-600 dark:text-yellow-400">{barangay.pending}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
                                                    <span className="font-medium text-green-600 dark:text-green-400">{barangay.resolved}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                                                    <span className="font-medium text-blue-600 dark:text-blue-400">{barangay.this_month}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-6">Reports & Analytics</h3>
                                
                                {/* Report Period Selector */}
                                <div className="bg-blue-50 dark:bg-white/5 rounded-lg p-4 border border-blue-200 dark:border-none mb-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <label className="text-sm font-medium text-black dark:text-white">Report Period:</label>
                                            <select className="px-4 py-2 bg-white dark:bg-white/10 border border-blue-300 dark:border-white/20 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="this-month">This Month</option>
                                                <option value="last-month">Last Month</option>
                                                <option value="this-quarter">This Quarter</option>
                                                <option value="last-quarter">Last Quarter</option>
                                                <option value="this-year">This Year</option>
                                                <option value="last-year">Last Year</option>
                                                <option value="custom">Custom Range</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            <button className="flex-1 min-w-fit px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                                                <Download className="w-4 h-4" />
                                                <span>Export PDF</span>
                                            </button>
                                            <button className="flex-1 min-w-fit px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                                                <Download className="w-4 h-4" />
                                                <span>Export Excel</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Metrics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Cases</p>
                                                <p className="text-2xl font-bold text-black dark:text-white">{stationStats.total_cases}</p>
                                                <p className="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
                                            </div>
                                            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
                                                <p className="text-2xl font-bold text-black dark:text-white">
                                                    {stationStats.total_cases > 0 ? Math.round((stationStats.resolved / stationStats.total_cases) * 100) : 0}%
                                                </p>
                                                <p className="text-xs text-green-600 dark:text-green-400">+5% from last month</p>
                                            </div>
                                            <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-lg">
                                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Response Time</p>
                                                <p className="text-2xl font-bold text-black dark:text-white">2.4 hrs</p>
                                                <p className="text-xs text-green-600 dark:text-green-400">-30 min from last month</p>
                                            </div>
                                            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                                                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Cases</p>
                                                <p className="text-2xl font-bold text-black dark:text-white">{stationStats.pending}</p>
                                                <p className="text-xs text-yellow-600 dark:text-yellow-400">-8% from last month</p>
                                            </div>
                                            <div className="p-3 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
                                                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* Incident Trends Chart */}
                                    <div className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Incident Trends</h4>
                                        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-center">
                                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-500 dark:text-gray-400">Chart visualization coming soon</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">Monthly incident trends</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Crime Type Distribution */}
                                    <div className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Crime Type Distribution</h4>
                                        <div className="space-y-3">
                                            {Object.entries(stationStats.top_crime_types).slice(0, 5).map(([type, count], index) => (
                                                <div key={type} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                                        <span className="text-sm text-black dark:text-white">{type}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full" 
                                                                style={{ width: `${Math.min((count / Math.max(...Object.values(stationStats.top_crime_types))) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Statistics Table */}
                                <div className="bg-white dark:bg-white/10 rounded-xl p-6 border border-blue-200 dark:border-white/20">
                                    <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Detailed Statistics</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-black dark:text-white">
                                            <thead>
                                                <tr className="border-b border-blue-200 dark:border-white/20">
                                                    <th className="text-left p-2 font-medium text-blue-800 dark:text-white">Metric</th>
                                                    <th className="text-center p-2 font-medium text-blue-800 dark:text-white">Current Period</th>
                                                    <th className="text-center p-2 font-medium text-blue-800 dark:text-white">Previous Period</th>
                                                    <th className="text-center p-2 font-medium text-blue-800 dark:text-white">Change</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="p-2">Total Incidents</td>
                                                    <td className="p-2 text-center">{stationStats.total_cases}</td>
                                                    <td className="p-2 text-center">142</td>
                                                    <td className="p-2 text-center">
                                                        <span className="text-green-600 dark:text-green-400">+8.5%</span>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="p-2">Resolved Cases</td>
                                                    <td className="p-2 text-center">{stationStats.resolved}</td>
                                                    <td className="p-2 text-center">98</td>
                                                    <td className="p-2 text-center">
                                                        <span className="text-green-600 dark:text-green-400">+12.2%</span>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="p-2">Pending Cases</td>
                                                    <td className="p-2 text-center">{stationStats.pending}</td>
                                                    <td className="p-2 text-center">44</td>
                                                    <td className="p-2 text-center">
                                                        <span className="text-red-600 dark:text-red-400">-9.1%</span>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="p-2">This Month</td>
                                                    <td className="p-2 text-center">{stationStats.this_month}</td>
                                                    <td className="p-2 text-center">28</td>
                                                    <td className="p-2 text-center">
                                                        <span className="text-green-600 dark:text-green-400">+7.7%</span>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="p-2">Avg. Resolution Time</td>
                                                    <td className="p-2 text-center">2.4 hrs</td>
                                                    <td className="p-2 text-center">3.1 hrs</td>
                                                    <td className="p-2 text-center">
                                                        <span className="text-green-600 dark:text-green-400">-22.6%</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Export Options */}
                                <div className="bg-blue-50 dark:bg-white/5 rounded-lg p-4 border border-blue-200 dark:border-none">
                                    <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Export Options</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button className="p-4 bg-white dark:bg-white/10 rounded-lg border border-blue-200 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/20 transition-colors">
                                            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                                            <h5 className="font-medium text-black dark:text-white">Monthly Report</h5>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Comprehensive monthly statistics</p>
                                        </button>
                                        <button className="p-4 bg-white dark:bg-white/10 rounded-lg border border-blue-200 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/20 transition-colors">
                                            <Activity className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                            <h5 className="font-medium text-black dark:text-white">Analytics Report</h5>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Trends and patterns analysis</p>
                                        </button>
                                        <button className="p-4 bg-white dark:bg-white/10 rounded-lg border border-blue-200 dark:border-white/20 hover:bg-blue-50 dark:hover:bg-white/20 transition-colors">
                                            <Building className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                                            <h5 className="font-medium text-black dark:text-white">Barangay Report</h5>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Per-barangay breakdown</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
