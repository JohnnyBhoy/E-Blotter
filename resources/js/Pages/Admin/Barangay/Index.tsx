import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    BuildingFillGear,
    Plus,
    PencilSquare,
    Trash,
    Eye,
    Search,
    Funnel,
} from "react-bootstrap-icons";

// Import existing data for display
import provinces from "@/utils/data/provinces";
import cities from "@/utils/data/cities";
import barangays from "@/utils/data/barangays";
import getCity from "@/utils/functions/getCity";
import getProvince from "@/utils/functions/getProvince";
import { PageProps } from "@/Pages/types";
import { ArrowUpDown } from "lucide-react";

interface Barangay {
    id: number;
    brgy_name: string;
    brgy_code: string;
    city_code: string;
    province_code: string;
    blotter_count?: number;
    created_at?: string;
    updated_at?: string;
}

interface BarangayIndexProps {
    auth: PageProps;
    barangays: Barangay[];
    filters?: {
        search?: string;
        province?: string;
        city?: string;
    };
}

export default function BarangayIndex({ barangays, auth, filters }: BarangayIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [sortBy, setSortBy] = useState<'name' | 'city' | 'province' | 'blotters'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedProvince, setSelectedProvince] = useState(filters?.province || '');
    const [selectedCity, setSelectedCity] = useState(filters?.city || '');
    
    // Get unique provinces and cities for filters
    const uniqueProvinces = useMemo(() => {
        return provinces
            .map(province => ({
                code: province.province_code,
                name: province.province_name
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const uniqueCities = useMemo(() => {
        if (!selectedProvince) return [];
        return cities
            .filter(city => city.province_code === selectedProvince)
            .map(city => ({
                code: city.city_code,
                name: city.city_name
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedProvince]);

    // Filter and sort barangays
    const filteredAndSortedBarangays = useMemo(() => {
        let filtered = barangays || [];

        // Apply sorting only (filtering is handled by backend)
        return filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortBy) {
                case 'name':
                    aValue = a.brgy_name;
                    bValue = b.brgy_name;
                    break;
                case 'city':
                    aValue = getCity(a.city_code) || '';
                    bValue = getCity(b.city_code) || '';
                    break;
                case 'province':
                    aValue = getProvince(a.province_code) || '';
                    bValue = getProvince(b.province_code) || '';
                    break;
                case 'blotters':
                    aValue = a.blotter_count || 0;
                    bValue = b.blotter_count || 0;
                    break;
                default:
                    aValue = a.brgy_name;
                    bValue = b.brgy_name;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const comparison = String(aValue).localeCompare(String(bValue));
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [barangays, searchTerm, selectedProvince, selectedCity, sortBy, sortOrder]);

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== filters?.search) {
                router.get(
                    route('admin.barangay'),
                    { search: searchTerm, province: selectedProvince, city: selectedCity },
                    { preserveState: true, preserveScroll: true }
                );
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedProvince, selectedCity]);

    const handleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedProvince('');
        setSelectedCity('');
        router.get(route('admin.barangay'), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin - Barangays" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Barangays Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manage and monitor all barangays in the system
                                </p>
                            </div>
                            <Link
                                href={route("admin.barangay.create")}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-5 h-5" />
                                Add Barangay
                            </Link>
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Funnel className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
                                {(searchTerm || selectedProvince || selectedCity) && (
                                    <button
                                        onClick={clearFilters}
                                        className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search barangay name, city, or province..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                    </div>
                                </div>
                                
                                {/* Province Filter */}
                                <div>
                                    <select
                                        value={selectedProvince}
                                        onChange={(e) => {
                                            setSelectedProvince(e.target.value);
                                            setSelectedCity('');
                                        }}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                    >
                                        <option value="">All Provinces</option>
                                        {uniqueProvinces.map(province => (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Filter */}
                                <div>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        disabled={!selectedProvince}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">All Cities</option>
                                        {uniqueCities.map(city => (
                                            <option key={city.code} value={city.code}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredAndSortedBarangays.length}</span> barangays
                        </p>
                    </div>

                    {/* Barangays Table */}
                    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort('name')}
                                                className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                            >
                                                Barangay
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort('city')}
                                                className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                            >
                                                City
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort('province')}
                                                className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                            >
                                                Province
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort('blotters')}
                                                className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                            >
                                                Total Blotters
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedBarangays.map((barangay, index) => (
                                        <tr
                                            key={barangay.id}
                                            className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${
                                                index === 0 ? 'border-t-0' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {barangay.brgy_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                {getCity(barangay.city_code)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                {getProvince(barangay.province_code)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {barangay.blotter_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route("admin.barangay.edit", barangay.id)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Edit barangay"
                                                    >
                                                        <PencilSquare className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Are you sure you want to delete ${barangay.brgy_name}?`)) {
                                                                router.delete(route("admin.barangay.destroy", barangay.id));
                                                            }
                                                        }}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete barangay"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredAndSortedBarangays.length === 0 && (
                            <div className="text-center py-16">
                                <BuildingFillGear className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No barangays found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {searchTerm || selectedProvince || selectedCity
                                        ? 'Try adjusting your filters or search terms'
                                        : 'Get started by creating your first barangay'}
                                </p>
                                <Link
                                    href={route("admin.barangay.create")}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Barangay
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
