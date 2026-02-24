import React, { useEffect, useState } from 'react';
import { PageProps } from '@/Pages/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
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
    RefreshCw
} from 'lucide-react';

interface City {
    city_code: number;
    province_code: number;
    city_name: string;
}

interface Barangay {
    barangay_code: number;
    city_code: number;
    brgy_name: string;
    total?: number;
}

interface ProvinceStats {
    total_cases: number;
    amicably_settled: number;
    pending: number;
    for_hearing: number;
    referred_to_pnp: number;
    resolution_rate: number;
    this_month: number;
    high_priority: number;
    under_investigation: number;
    weekly_change: number;
}

interface TopCity {
    city_name: string;
    total_cases: number;
    growth: number;
    status: 'high' | 'medium' | 'low';
}

interface MonthlyData {
    month: string;
    cases: number;
    resolved: number;
}

interface MunicipalStationData {
    name: string;
    role: string;
    blotter_count: number;
    resolved: number;
    pending: number;
    for_hearing: number;
}

interface RecentBlotter {
    id: number;
    entry_number: string;
    barangay: string;
    incident_type: string;
    date_reported: string;
    remarks: number;
    reported_by: string;
    status: string;
}

interface HighPriorityCase {
    id: number;
    entry_number: string;
    barangay: string;
    incident_type: string;
    days_pending: number;
    reported_by: string;
}

export default function Dashboard({ auth, provinces, cities, barangays, totalBlotters, counts, municipalStationData, monthlyData, recentBlotters, highPriorityCases, municipalities }: PageProps<{
    provinces: any[];
    cities: City[];
    barangays: any[];
    totalBlotters: number;
    counts: {
        for_hearing: number;
        amicably_settled: number;
        pending: number;
        referred_to_pnp: number;
    };
    municipalStationData: any[];
    monthlyData: any[];
    recentBlotters: any[];
    highPriorityCases: any[];
    municipalities?: Array<{id: number, name: string}>;
}>) {
    console.log('Dashboard - Municipalities prop:', municipalities);
    console.log('Dashboard - Auth user:', auth.user);
    console.log('Dashboard - User role:', auth.user?.role);
    
    const [selectedPeriod, setSelectedPeriod] = useState('this-month');
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Calculate derived statistics
    const stats: ProvinceStats = {
        total_cases: totalBlotters || 0,
        amicably_settled: counts?.amicably_settled || 0,
        pending: counts?.pending || 0,
        for_hearing: counts?.for_hearing || 0,
        referred_to_pnp: counts?.referred_to_pnp || 0,
        resolution_rate: totalBlotters > 0 ? Math.round(((counts?.amicably_settled || 0) / totalBlotters) * 100) : 0,
        this_month: (counts?.for_hearing || 0) + (counts?.amicably_settled || 0) + (counts?.pending || 0) + (counts?.referred_to_pnp || 0),
        high_priority: highPriorityCases?.length || 0,
        under_investigation: counts?.for_hearing || 0,
        weekly_change: Math.floor(Math.random() * 20) - 10 // Mock weekly change
    };

    // Debug: Log the data to see what we're getting
    console.log('Monthly Data:', monthlyData);
    console.log('Municipal Station Data:', municipalStationData);
    console.log('Stats:', stats);

    // Calculate top cities by blotter count
    const topCities: TopCity[] = (municipalStationData || [])
        .slice(0, 10)
        .map((station, index) => {
            const totalCases = station.blotter_count || 0;
            const growth = Math.floor(Math.random() * 40) - 20; // Mock growth data
            
            // Determine status based on case count
            let status: 'high' | 'medium' | 'low' = 'low';
            if (totalCases > 50) status = 'high';
            else if (totalCases > 20) status = 'medium';
            
            return {
                city_name: station.name,
                total_cases: totalCases,
                growth,
                status
            };
        })
        .sort((a, b) => b.total_cases - a.total_cases)
        .slice(0, 5);

    const getPeriodLabel = () => {
        switch(selectedPeriod) {
            case 'this-month': return 'This Month';
            case 'last-month': return 'Last Month';
            case 'this-quarter': return 'This Quarter';
            case 'this-year': return 'This Year';
            default: return 'This Month';
        }
    };

    const getStatCard = (title: string, value: string | number, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral', color: string, subtitle?: string) => (
        <div className="group bg-white dark:bg-boxdark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent dark:from-blue-900/20 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 dark:text-bodydark uppercase tracking-wider">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 dark:text-bodydark1 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className={`p-4 rounded-xl ${color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                </div>
                
                {trend !== 'neutral' && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {trend === 'up' ? (
                                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {trend === 'up' ? '+' : '-'}{Math.abs(Math.floor(Math.random() * 20))}% from last month
                            </span>
                        </div>
                        <RefreshCw className="w-4 h-4 text-gray-400 animate-spin-slow" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            municipalities={municipalities}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Province Dashboard
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Antique Province - Real-time Crime Monitoring
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">Live Data</span>
                        </div>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md hover:shadow-lg transition-shadow"
                        >
                            <option value="this-month">This Month</option>
                            <option value="last-month">Last Month</option>
                            <option value="this-quarter">This Quarter</option>
                            <option value="this-year">This Year</option>
                        </select>
                        <div className="relative">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Report
                            </button>
                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-10 overflow-hidden">
                                    <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center">
                                            <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>Export as PDF</span>
                                        </div>
                                    </button>
                                    <button className="block w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center">
                                            <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>Export as Excel</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Province Dashboard - E-Blotter" />

            <div className="min-h-screen bg-transparent dark:bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {getStatCard(
                            'Total Cases',
                            stats.total_cases,
                            <FileText className="w-6 h-6 text-blue-600" />,
                            'up',
                            'bg-blue-100 dark:bg-blue-900',
                            `${stats.weekly_change > 0 ? '+' : ''}${stats.weekly_change}% this week`
                        )}
                        {getStatCard(
                            'Resolved',
                            stats.amicably_settled,
                            <CheckCircle className="w-6 h-6 text-green-600" />,
                            'up',
                            'bg-green-100 dark:bg-green-900',
                            'Success rate: ' + stats.resolution_rate + '%'
                        )}
                        {getStatCard(
                            'Pending',
                            stats.pending,
                            <Clock className="w-6 h-6 text-yellow-600" />,
                            'down',
                            'bg-yellow-100 dark:bg-yellow-900',
                            'High priority: ' + stats.high_priority
                        )}
                        {getStatCard(
                            'Resolution Rate',
                            `${stats.resolution_rate}%`,
                            <TrendingUp className="w-6 h-6 text-purple-600" />,
                            'up',
                            'bg-purple-100 dark:bg-purple-900',
                            'Above target'
                        )}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Incident Trends Chart */}
                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Incident Trends</h3>
                                    <p className="text-sm text-gray-600 dark:text-bodydark mt-1">6-month overview</p>
                                </div>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shadow-md">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            
                            {/* Debug info */}
                            <div className="mb-4 p-2 bg-gray-100 dark:bg-graydark rounded text-xs">
                                Debug: Monthly data points: {monthlyData?.length || 0}
                                {monthlyData?.length > 0 && (
                                    <span> - Total cases: {monthlyData.reduce((sum, d) => sum + d.cases, 0)}</span>
                                )}
                            </div>
                            
                            <div className="h-64 flex items-center justify-center">
                                <div className="w-full">
                                    {/* Real bar chart visualization */}
                                    <div className="flex items-end justify-between h-48 px-2">
                                        {(monthlyData || []).length > 0 ? (
                                            (monthlyData || []).map((data, index) => {
                                                const maxCases = Math.max(...(monthlyData || []).map(d => d.cases), 1);
                                                const barHeight = Math.max((data.cases / maxCases) * 100, 5);
                                                const resolvedHeight = Math.max((data.resolved / maxCases) * 100, 5);
                                                return (
                                                    <div key={index} className="flex flex-col items-center flex-1 mx-1">
                                                        <div className="w-full flex flex-col items-center">
                                                            <div 
                                                                className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 shadow-md hover:shadow-lg"
                                                                style={{ height: `${barHeight}%`, minHeight: '20px' }}
                                                                title={`${data.month}: ${data.cases} cases`}
                                                            ></div>
                                                            <div 
                                                                className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-700 hover:to-green-500 mt-1 shadow-md hover:shadow-lg"
                                                                style={{ height: `${resolvedHeight}%`, minHeight: '15px' }}
                                                                title={`${data.month}: ${data.resolved} resolved`}
                                                            ></div>
                                                            {/* Show counts above bars */}
                                                            <div className="text-xs font-bold text-gray-700 dark:text-white mt-1">
                                                                {data.cases}
                                                            </div>
                                                            <div className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">
                                                                {data.resolved}
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-600 dark:text-bodydark mt-2 font-medium">{data.month}</span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-6 text-center py-8">
                                                <p className="text-sm text-gray-500 dark:text-bodydark">No monthly data available</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-center space-x-6 mt-4">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-600 rounded mr-2 shadow-sm"></div>
                                            <span className="text-xs text-gray-600 dark:text-bodydark">Cases</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-600 rounded mr-2 shadow-sm"></div>
                                            <span className="text-xs text-gray-600 dark:text-bodydark">Resolved</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Municipal/Station Breakdown */}
                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Municipal/Station Breakdown</h3>
                                    <p className="text-sm text-gray-600 dark:text-bodydark mt-1">Records by jurisdiction</p>
                                </div>
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg shadow-md">
                                    <Building className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                            
                            {/* Debug info */}
                            <div className="mb-4 p-2 bg-gray-100 dark:bg-graydark rounded text-xs">
                                Debug: Found {municipalStationData?.length || 0} stations/municipalities
                                {municipalStationData?.length > 0 && (
                                    <span> - Max cases: {Math.max(...municipalStationData.map(d => d.blotter_count))}</span>
                                )}
                            </div>
                            
                            <div className="h-64 flex items-center justify-center">
                                <div className="w-full">
                                    {/* Municipal/Station bar chart */}
                                    <div className="flex items-end justify-between h-48 px-2 overflow-x-auto">
                                        {(municipalStationData || []).length > 0 ? (
                                            (municipalStationData || []).map((station, index) => {
                                                const maxStationCases = Math.max(...(municipalStationData || []).map(d => d.blotter_count), 1);
                                                const barHeight = Math.max((station.blotter_count / maxStationCases) * 100, 5);
                                                return (
                                                    <div key={index} className="flex flex-col items-center flex-shrink-0 mx-1" style={{ minWidth: '60px' }}>
                                                        <div className="w-full flex flex-col items-center">
                                                            <div 
                                                                className={`w-6 bg-gradient-to-t rounded-t-lg transition-all duration-500 hover:shadow-lg ${
                                                                    station.role === 'Municipal' 
                                                                        ? 'from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500' 
                                                                        : 'from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500'
                                                                } shadow-md`}
                                                                style={{ height: `${barHeight}%`, minHeight: '15px' }}
                                                                title={`${station.name}: ${station.blotter_count} cases`}
                                                            ></div>
                                                            {/* Show case count above bar for debugging */}
                                                            <div className="text-xs font-bold text-gray-700 dark:text-white mt-1">
                                                                {station.blotter_count}
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-600 dark:text-bodydark mt-2 font-medium text-center truncate max-w-[55px]">
                                                            {station.name.split(' ').slice(0, 2).join(' ')}
                                                        </span>
                                                        <span className={`text-xs px-1 rounded ${
                                                            station.role === 'Municipal' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                                        }`}>
                                                            {station.role === 'Municipal' ? 'Mun' : 'Stn'}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-6 text-center py-8">
                                                <p className="text-sm text-gray-500 dark:text-bodydark">No station data available</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-center space-x-6 mt-4">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-purple-600 rounded mr-2 shadow-sm"></div>
                                            <span className="text-xs text-gray-600 dark:text-bodydark">Municipal</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-indigo-600 rounded mr-2 shadow-sm"></div>
                                            <span className="text-xs text-gray-600 dark:text-bodydark">Station</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* High Priority Cases and Recent Records Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* High Priority Cases */}
                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">High Priority Cases</h3>
                                    <p className="text-sm text-gray-600 dark:text-bodydark mt-1">Pending cases requiring attention</p>
                                </div>
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg shadow-md">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {(highPriorityCases || []).length > 0 ? (
                                    highPriorityCases.map((case_item) => (
                                        <div key={case_item.id} className="group flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 hover:shadow-lg">
                                            <div className="p-2 rounded-lg mr-3 shadow-sm bg-red-100 dark:bg-red-900">
                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        Case #{case_item.entry_number}
                                                    </p>
                                                    <span className="text-xs text-red-600 font-medium">
                                                        {case_item.days_pending} days pending
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-bodydark mt-1">
                                                    {case_item.incident_type} • {case_item.barangay}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-bodydark1 mt-1">
                                                    Reported by: {case_item.reported_by}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                        <p className="text-sm text-gray-600 dark:text-bodydark">No high priority cases</p>
                                        <p className="text-xs text-gray-500 dark:text-bodydark1 mt-1">All caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Blotter Records */}
                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Blotter Records</h3>
                                    <p className="text-sm text-gray-600 dark:text-bodydark mt-1">Latest incident reports</p>
                                </div>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shadow-md">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {(recentBlotters || []).map((blotter) => (
                                    <div key={blotter.id} className="group flex items-center p-4 bg-gray-50 dark:bg-graydark rounded-xl hover:bg-gray-100 dark:hover:bg-graydark-2 transition-all duration-300 hover:shadow-lg">
                                        <div className={`p-2 rounded-lg mr-3 shadow-sm ${
                                            blotter.status === 'Amicably Settled' ? 'bg-green-100 dark:bg-green-900' :
                                            blotter.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                            blotter.status === 'For Hearing' ? 'bg-blue-100 dark:bg-blue-900' :
                                            'bg-gray-100 dark:bg-gray-900'
                                        }`}>
                                            {blotter.status === 'Amicably Settled' ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : blotter.status === 'Pending' ? (
                                                <Clock className="w-5 h-5 text-yellow-600" />
                                            ) : blotter.status === 'For Hearing' ? (
                                                <Eye className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <FileWarning className="w-5 h-5 text-gray-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    #{blotter.entry_number}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    blotter.status === 'Amicably Settled' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                                    blotter.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                                    blotter.status === 'For Hearing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                    {blotter.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-bodydark mt-1">
                                                {blotter.incident_type}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-bodydark1 mt-1">
                                                {blotter.barangay} • {blotter.date_reported} • {blotter.reported_by}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
