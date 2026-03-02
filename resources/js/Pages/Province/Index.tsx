import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Shield, Plus, Search, ArrowUpDown, ArrowLeft, BuildingFillGear } from "react-bootstrap-icons";

// Import existing data
import provinces from "@/utils/data/provinces";
import { PageProps } from "@/Pages/types";

interface Province {
    id: number;
    user_id: number;
    province_name: string;
    province_code: string;
    region_code: string;
    blotter_count?: number;
}

interface ProvinceIndexProps {
    provinces: Province[];
    auth: any;
    filters?: {
        search?: string;
        region?: string;
    };
}

export default function ProvinceIndex({ provinces, auth, filters }: ProvinceIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [sortBy, setSortBy] = useState<'name' | 'code' | 'blotters'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedRegion, setSelectedRegion] = useState(filters?.region || '');

    // Get unique regions for filters
    const uniqueRegions = useMemo(() => {
        const regions = [...new Set(provinces?.map(p => p.region_code) || [])];
        return regions.sort();
    }, [provinces]);

    // Filter and sort provinces
    const filteredAndSortedProvinces = useMemo(() => {
        let filtered = provinces || [];

        // Apply client-side search if needed (backup for backend filtering)
        if (searchTerm) {
            filtered = filtered.filter(province =>
                province.province_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                province.province_code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply region filter if needed (backup for backend filtering)
        if (selectedRegion) {
            filtered = filtered.filter(province => province.region_code === selectedRegion);
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortBy) {
                case 'name':
                    aValue = a.province_name;
                    bValue = b.province_name;
                    break;
                case 'code':
                    aValue = a.province_code;
                    bValue = b.province_code;
                    break;
                case 'blotters':
                    aValue = a.blotter_count || 0;
                    bValue = b.blotter_count || 0;
                    break;
                default:
                    aValue = a.province_name;
                    bValue = b.province_name;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const comparison = String(aValue).localeCompare(String(bValue));
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [provinces, searchTerm, sortBy, sortOrder, selectedRegion]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.province'), {
            search: searchTerm,
            region: selectedRegion,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleRegionFilter = (value: string) => {
        setSelectedRegion(value);
        router.get(route('admin.province'), {
            search: searchTerm,
            region: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedRegion('');
        router.get(route('admin.province'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (field: 'name' | 'code' | 'blotters') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getRegionName = (regionCode: string) => {
        const regionMap: { [key: string]: string } = {
            '01': 'Region I (Ilocos Region)',
            '02': 'Region II (Cagayan Valley)',
            '03': 'Region III (Central Luzon)',
            '04': 'Region IV-A (CALABARZON)',
            '05': 'Region V (Bicol Region)',
            '06': 'Region VI (Western Visayas)',
            '07': 'Region VII (Central Visayas)',
            '08': 'Region VIII (Eastern Visayas)',
            '09': 'Region IX (Zamboanga Peninsula)',
            '10': 'Region X (Northern Mindanao)',
            '11': 'Region XI (Davao Region)',
            '12': 'Region XII (SOCCSKSARGEN)',
            '13': 'Region XIII (Caraga)',
            '14': 'NCR (National Capital Region)',
            '15': 'CAR (Cordillera Administrative Region)',
            '16': 'BARMM (Bangsamoro Autonomous Region)',
        };
        return regionMap[regionCode] || regionCode;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                            <BuildingFillGear className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                                Province Management
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Manage province accounts and their information
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route("admin.province.create")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Province</span>
                    </Link>
                </div>
            }
        >
            <Head title="Admin - Province Management" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                <div className="relative z-10 p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Provinces</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {provinces?.length || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <BuildingFillGear className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Active Regions</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {uniqueRegions.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Blotters</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {provinces?.reduce((sum, p) => sum + (p.blotter_count || 0), 0) || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Filtered Results</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {filteredAndSortedProvinces.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Search className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6 mb-8">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search Input */}
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search provinces..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Region Filter */}
                                <div>
                                    <select
                                        value={selectedRegion}
                                        onChange={(e) => handleRegionFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">All Regions</option>
                                        {uniqueRegions.map(region => (
                                            <option key={region} value={region}>
                                                {getRegionName(region)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters Button */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Results Summary */}
                    <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-4 mb-6">
                        <p className="text-gray-700 dark:text-gray-300">
                            Showing <span className="font-semibold">{filteredAndSortedProvinces.length}</span> of{' '}
                            <span className="font-semibold">{provinces?.length || 0}</span> provinces
                        </p>
                    </div>

                    {/* Provinces Table */}
                    <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <button
                                                onClick={() => handleSort('name')}
                                                className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                                            >
                                                <span>Province Name</span>
                                                <ArrowUpDown className="w-4 h-4" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <button
                                                onClick={() => handleSort('code')}
                                                className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                                            >
                                                <span>Province Code</span>
                                                <ArrowUpDown className="w-4 h-4" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Region
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <button
                                                onClick={() => handleSort('blotters')}
                                                className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                                            >
                                                <span>Blotters</span>
                                                <ArrowUpDown className="w-4 h-4" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredAndSortedProvinces.map((province) => (
                                        <tr key={province.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                                                        <BuildingFillGear className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {province.province_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            ID: {province.user_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full">
                                                    {province.province_code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                                                    {getRegionName(province.region_code)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {province.blotter_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('admin.province.edit', province.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this province?')) {
                                                                router.delete(route('admin.province.destroy', province.id));
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredAndSortedProvinces.length === 0 && (
                            <div className="text-center py-12">
                                <BuildingFillGear className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No provinces found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Get started by creating your first province.
                                </p>
                                <Link
                                    href={route("admin.province.create")}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Province
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}