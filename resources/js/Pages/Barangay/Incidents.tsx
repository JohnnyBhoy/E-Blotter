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
    TrendingUp
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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
    by_type: { [key: string]: number };
}

export default function Incidents({ auth }: { auth: any }) {
    const [blotters, setBlotters] = useState<Blotter[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        resolved: 0,
        this_month: 0,
        by_type: {}
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlotters = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/barangay/blotters');
            console.log('API Response:', response.data);
            console.log('Response type:', typeof response.data);
            console.log('Is array:', Array.isArray(response.data));
            console.log('Data length:', response.data?.length);
            
            setBlotters(response.data);
            calculateStats(response.data);
        } catch (error: any) {
            console.error('Error fetching blotters:', error);
            
            if (error.response?.status === 401) {
                toast.error('Please log in to access blotter reports');
            } else if (error.response?.status === 403) {
                toast.error('You do not have permission to access blotter reports');
            } else {
                toast.error('Failed to load blotter reports. Please try again.');
            }
            
            setBlotters([]);
            calculateStats([]);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (blotters: Blotter[]) => {
        if (!Array.isArray(blotters)) {
            console.error('blotters is not an array:', blotters);
            setStats({ total: 0, pending: 0, resolved: 0, this_month: 0, by_type: {} });
            return;
        }
        
        const total = blotters.length;
        const pending = blotters.filter(b => b.remarks?.toLowerCase().includes('pending')).length;
        const resolved = blotters.filter(b => b.remarks?.toLowerCase().includes('resolved')).length;
        const thisMonth = blotters.filter(b => {
            const blotterDate = new Date(b.created_at);
            const currentDate = new Date();
            return blotterDate.getMonth() === currentDate.getMonth() && 
                   blotterDate.getFullYear() === currentDate.getFullYear();
        }).length;

        // Calculate incidents by type
        const byType: { [key: string]: number } = {};
        blotters.forEach(blotter => {
            const type = blotter.incident_type || 'Unknown';
            byType[type] = (byType[type] || 0) + 1;
        });

        setStats({ total, pending, resolved, this_month: thisMonth, by_type: byType });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this blotter report?')) {
            try {
                await axios.delete(`/api/barangay/blotters/${id}`);
                toast.success('Blotter report deleted successfully!');
                fetchBlotters();
            } catch (error) {
                console.error('Error deleting blotter:', error);
                toast.error('Failed to delete blotter report. Please try again.');
            }
        }
    };

    const filteredBlotters = Array.isArray(blotters) ? blotters.filter(blotter => 
        (blotter.barangay?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (blotter.incident_type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (blotter.narrative?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ).filter(blotter => 
        selectedType === '' || blotter.incident_type === selectedType
    ) : [];

    // Debug filtering
    console.log('Original blotters count:', blotters.length);
    console.log('Search term:', searchTerm);
    console.log('Selected type:', selectedType);
    console.log('Filtered blotters count:', filteredBlotters.length);
    console.log('Sample blotter:', blotters[0]);

    const incidentTypes = Array.isArray(blotters) ? [...new Set(blotters.map(b => b.incident_type).filter(Boolean))] : [];

    useEffect(() => {
        fetchBlotters();
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-black dark:text-white leading-tight">
                            Barangay Incidents
                        </h2>
                        <p className="text-sm text-blue-600 dark:text-blue-200">
                            {auth.user.name} • {auth.user.email}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Barangay Incidents - E-Blotter" />

            <div className="min-h-screen bg-white dark:bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-colors duration-300">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20">
                    <div className="absolute inset-0 dark:hidden" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10 p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl p-6 border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-200 text-sm">Total Incidents</p>
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stats.total}</p>
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
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stats.pending}</p>
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
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stats.resolved}</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl p-6 border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-200 text-sm">This Month</p>
                                    <p className="text-2xl font-bold text-black dark:text-white mt-1">{stats.this_month}</p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg p-6 mb-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4">
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
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-white/10 border border-blue-300 dark:border-white/20 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {incidentTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Incident Types Summary */}
                    <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg p-6 mb-6 shadow-sm">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-4">Incidents by Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(stats.by_type).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-white/5 rounded-lg">
                                    <span className="text-sm font-medium text-black dark:text-white">{type}</span>
                                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Incidents Table */}
                    <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-black dark:text-white">All Incidents</h3>
                            {!isLoading && blotters.length === 0 && (
                                <button
                                    onClick={fetchBlotters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Retry</span>
                                </button>
                            )}
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : blotters.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mb-4">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    No incidents available
                                </h4>
                                <p className="text-gray-500 dark:text-gray-500 mb-4">
                                    {searchTerm || selectedType 
                                        ? 'Try adjusting your search or filters' 
                                        : 'Unable to load blotter reports. Please check your connection and try again.'}
                                </p>
                                <button
                                    onClick={fetchBlotters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Refresh Data
                                </button>
                            </div>
                        ) : filteredBlotters.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mb-4">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    No incidents match your filters
                                </h4>
                                <p className="text-gray-500 dark:text-gray-500 mb-4">
                                    Try adjusting your search or filters to see more results
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedType(''); }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-2"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    onClick={fetchBlotters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Refresh Data
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-black dark:text-white">
                                    <thead>
                                        <tr className="border-b border-blue-200 dark:border-white/20">
                                            <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Entry #</th>
                                            <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Incident Type</th>
                                            <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Date Reported</th>
                                            <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Case Status</th>
                                            <th className="text-left p-3 font-semibold text-blue-800 dark:text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {console.log('Rendering table - filteredBlotters.length:', filteredBlotters.length)}
                                        {filteredBlotters.length > 0 ? (
                                            filteredBlotters.map(blotter => (
                                                <tr key={blotter.id} className="border-b border-blue-100 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-white/5">
                                                    <td className="p-3">{blotter.entry_number}</td>
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
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={`/barangay/dashboard`}
                                                                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(blotter.id)}
                                                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
                                                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    No incidents found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}