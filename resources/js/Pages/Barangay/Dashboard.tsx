import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
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
    Loader
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
}

export default function Dashboard({ auth }: { auth: any }) {
    const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'manage' | 'reports'>('overview');
    const [blotters, setBlotters] = useState<Blotter[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        resolved: 0,
        this_month: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingBlotter, setEditingBlotter] = useState<Blotter | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        date_reported: new Date().toISOString().split('T')[0],
        time_of_report: new Date().toTimeString().slice(0, 5),
        incident_type: '',
        narrative: '',
        remarks: '',
        date_of_incident: '',
        time_of_incident: '',
        complainant_signature: '',
        recorded_by_signature: ''
    });

    const incidentTypes = [
        'Crime',
        'Fire',
        'Medical Emergency',
        'Traffic Accident',
        'Domestic Violence',
        'Missing Person',
        'Vehicular Accident',
        'Others'
    ];

    const remarksOptions = [
        'Case under investigation',
        'Pending witness statements',
        'Forwarded to PNP',
        'Resolved - No charges filed',
        'Requires follow-up',
        'Closed - Lack of evidence',
        'Referred to higher authority',
        'Settled amicably',
        'Under legal review',
        'Awaiting court appearance',
        'Other'
    ];

    const fetchBlotters = async () => {
        try {
            const response = await axios.get('/api/barangay/blotters');
            console.log('API Response:', response.data); // Debug log
            setBlotters(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error('Error fetching blotters:', error);
            // Set empty array on error to prevent filter errors
            setBlotters([]);
            calculateStats([]);
        }
    };

    const calculateStats = (blotters: Blotter[]) => {
        if (!Array.isArray(blotters)) {
            console.error('blotters is not an array:', blotters);
            setStats({ total: 0, pending: 0, resolved: 0, this_month: 0 });
            return;
        }
        
        const total = blotters.length;
        const pending = blotters.filter(b => b.status === 'Pending').length;
        const resolved = blotters.filter(b => b.status === 'Resolved').length;
        const thisMonth = blotters.filter(b => {
            const blotterDate = new Date(b.created_at);
            const currentDate = new Date();
            return blotterDate.getMonth() === currentDate.getMonth() && 
                   blotterDate.getFullYear() === currentDate.getFullYear();
        }).length;

        setStats({ total, pending, resolved, this_month: thisMonth });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (editingBlotter) {
                await axios.put(`/api/barangay/blotters/${editingBlotter.id}`, formData);
                toast.success('Blotter report updated successfully!');
            } else {
                await axios.post('/api/barangay/blotters', formData);
                toast.success('Blotter report created successfully!');
            }
            
            setFormData({
                date_reported: new Date().toISOString().split('T')[0],
                time_of_report: new Date().toTimeString().slice(0, 5),
                incident_type: '',
                narrative: '',
                remarks: '',
                date_of_incident: '',
                time_of_incident: '',
                complainant_signature: '',
                recorded_by_signature: ''
            });
            setEditingBlotter(null);
            setShowCreateForm(false);
            fetchBlotters();
        } catch (error) {
            console.error('Error saving blotter:', error);
            toast.error('Failed to save blotter report. Please try again.');
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
            complainant_signature: blotter.complainant_signature || '',
            recorded_by_signature: blotter.recorded_by_signature || ''
        });
        setShowCreateForm(true);
        setActiveTab('create');
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
    ) : [];

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
                            Barangay Blotter System
                        </h2>
                        <p className="text-sm text-blue-600 dark:text-blue-200">
                            {auth.user.name} • {auth.user.email}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Barangay Blotter Dashboard - E-Blotter" />

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
                                    <p className="text-blue-600 dark:text-blue-200 text-sm">Total Reports</p>
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

                    {/* Navigation Tabs */}
                    <div className="bg-white dark:bg-white/10 dark:shadow-lg rounded-xl border border-blue-200 dark:border-white/20 backdrop-blur-none dark:backdrop-blur-lg mb-6 shadow-sm">
                        <div className="flex flex-wrap sm:flex-nowrap gap-1 p-1">
                            {[
                                { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
                                { id: 'create', label: 'Create Report', icon: <Plus className="w-4 h-4" /> },
                                { id: 'manage', label: 'Manage Reports', icon: <Edit className="w-4 h-4" /> },
                                { id: 'reports', label: 'All Reports', icon: <FileText className="w-4 h-4" /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 min-w-fit px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
                                <h3 className="text-xl font-bold text-black dark:text-white mb-6">System Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 dark:bg-white/5 rounded-lg p-4 border border-blue-200 dark:border-none">
                                        <h4 className="font-semibold text-black dark:text-white mb-3">Recent Activity</h4>
                                        <div className="space-y-2">
                                            {blotters?.slice(0, 5)?.map(blotter => (
                                                <div key={blotter.id} className="flex items-center justify-between p-2 bg-white dark:bg-white/10 rounded border border-blue-100 dark:border-none">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        <span className="text-sm text-black dark:text-blue-200">{blotter.incident_type}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-600 dark:text-blue-300">{new Date(blotter.created_at).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-white/5 rounded-lg p-4 border border-blue-200 dark:border-none">
                                        <h4 className="font-semibold text-black dark:text-white mb-3">Quick Actions</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => { setActiveTab('create'); setShowCreateForm(true); }}
                                                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span className="ml-2">New Report</span>
                                            </button>
                                            <Link
                                                href="/barangay/reports"
                                                className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span className="ml-2">View All</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'create' && (
                            <div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                                    {editingBlotter ? 'Edit Blotter Report' : 'Create New Blotter Report'}
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Date Reported</label>
                                            <input
                                                type="date"
                                                value={formData.date_reported}
                                                onChange={(e) => setFormData({...formData, date_reported: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Time Reported</label>
                                            <input
                                                type="time"
                                                value={formData.time_of_report}
                                                onChange={(e) => setFormData({...formData, time_of_report: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Incident Type</label>
                                            <select
                                                value={formData.incident_type}
                                                onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white"
                                                required
                                            >
                                                <option value="">Select incident type</option>
                                                {incidentTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Date of Incident</label>
                                            <input
                                                type="date"
                                                value={formData.date_of_incident}
                                                onChange={(e) => setFormData({...formData, date_of_incident: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Time of Incident</label>
                                            <input
                                                type="time"
                                                value={formData.time_of_incident}
                                                onChange={(e) => setFormData({...formData, time_of_incident: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                            />
                                        </div>
                                    </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Narrative</label>
                                        <textarea
                                            value={formData.narrative}
                                            onChange={(e) => setFormData({...formData, narrative: e.target.value})}
                                            rows={4}
                                            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                            placeholder="Describe the incident details..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Remarks</label>
                                        <select
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                                            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white"
                                        >
                                            <option value="">Select remark status</option>
                                            {remarksOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Complainant Signature</label>
                                            <input
                                                type="text"
                                                value={formData.complainant_signature}
                                                onChange={(e) => setFormData({...formData, complainant_signature: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                                placeholder="Complainant name (optional)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-600 dark:text-blue-200 mb-2">Recorded By Signature</label>
                                            <input
                                                type="text"
                                                value={formData.recorded_by_signature}
                                                onChange={(e) => setFormData({...formData, recorded_by_signature: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                                placeholder="Recording officer signature (optional)"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => { setShowCreateForm(false); setEditingBlotter(null); }}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    <span>{editingBlotter ? 'Updating...' : 'Creating...'}</span>
                                                </>
                                            ) : (
                                                <span>{editingBlotter ? 'Update' : 'Create'} Report</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'manage' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-black dark:text-white">Manage Blotter Reports</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-blue-600 dark:text-blue-300 absolute left-3 top-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search reports..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 bg-white border border-blue-300 rounded-lg text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-blue-300"
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                            {filteredBlotters.map(blotter => (
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
                                                            <button
                                                                onClick={() => handleEdit(blotter)}
                                                                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(blotter.id)}
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

                        {activeTab === 'reports' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-black dark:text-white">All Blotter Reports</h3>
                                    <Link
                                        href="/barangay/reports/export"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Reports
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {blotters.map(blotter => (
                                        <div key={blotter.id} className="bg-blue-50 dark:bg-white/5 rounded-lg p-4 border border-blue-200 dark:border-white/10">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-black dark:text-white">#{blotter.entry_number}</h4>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    blotter.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                                                    blotter.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400'
                                                }`}>
                                                    {blotter.status}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-black dark:text-blue-200">
                                                    <span className="font-medium text-blue-800 dark:text-blue-300">Type:</span> {blotter.incident_type}
                                                </p>
                                                <p className="text-sm text-black dark:text-blue-200">
                                                    <span className="font-medium text-blue-800 dark:text-blue-300">Date:</span> {new Date(blotter.date_reported).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-black dark:text-blue-200">
                                                    <span className="font-medium text-blue-800 dark:text-blue-300">Barangay:</span> {blotter.barangay}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-blue-300 line-clamp-2">{blotter.narrative}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3 justify-center">
                                                <button
                                                    onClick={() => handleEdit(blotter)}
                                                    className="flex-1 min-w-fit px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blotter.id)}
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
