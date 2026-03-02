import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Shield, Plus, PencilSquare, Trash } from "react-bootstrap-icons";
import { PageProps } from "@/Pages/types";

// Import existing data
import regions from "@/utils/data/regions";
import provinces from "@/utils/data/provinces";
import cities from "@/utils/data/cities";
import getProvince from "@/utils/functions/getProvince";
import getCity from "@/utils/functions/getCity";
import { ArrowUpDown, ArrowUpDownIcon, Funnel, Search } from "lucide-react";

interface Station {
    id: number;
    user_id: number;
    station_name: string;
    station_code: string;
    city_code: string;
    province_code: string;
    region_code: string;
    blotter_count?: number;
    created_at?: string;
    updated_at?: string;
}

interface StationIndexProps extends PageProps {
    stations: Station[];
    filters?: {
        search?: string;
        province?: string;
        city?: string;
    };
}

export default function StationIndex({
    stations,
    auth,
    filters,
}: StationIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [sortBy, setSortBy] = useState<
        "name" | "city" | "province" | "blotters"
    >("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedProvince, setSelectedProvince] = useState(
        filters?.province || "",
    );
    const [selectedCity, setSelectedCity] = useState(filters?.city || "");

    // Get unique provinces and cities for filters
    const uniqueProvinces = useMemo(() => {
        return provinces
            .map((province) => ({
                code: province.province_code,
                name: province.province_name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const uniqueCities = useMemo(() => {
        if (!selectedProvince) return [];
        return cities
            .filter((city) => city.province_code === selectedProvince)
            .map((city) => ({
                code: city.city_code,
                name: city.city_name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedProvince]);

    // Filter and sort stations
    const filteredAndSortedStations = useMemo(() => {
        let filtered = stations || [];

        // Apply sorting only (filtering is handled by backend)
        return filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortBy) {
                case "name":
                    aValue = a.station_name;
                    bValue = b.station_name;
                    break;
                case "city":
                    aValue = getCity(a.city_code) || "";
                    bValue = getCity(b.city_code) || "";
                    break;
                case "province":
                    aValue = getProvince(a.province_code) || "";
                    bValue = getProvince(b.province_code) || "";
                    break;
                case "blotters":
                    aValue = a.blotter_count || 0;
                    bValue = b.blotter_count || 0;
                    break;
                default:
                    aValue = a.station_name;
                    bValue = b.station_name;
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
            }

            const comparison = String(aValue).localeCompare(String(bValue));
            return sortOrder === "asc" ? comparison : -comparison;
        });
    }, [stations, sortBy, sortOrder]);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        router.get(
            route("admin.station"),
            {
                search: value,
                province: selectedProvince,
                city: selectedCity,
            },
            { preserveState: true },
        );
    };

    // Handle province filter
    const handleProvinceFilter = (value: string) => {
        setSelectedProvince(value);
        setSelectedCity("");
        router.get(
            route("admin.station"),
            {
                search: searchTerm,
                province: value,
                city: "",
            },
            { preserveState: true },
        );
    };

    // Handle city filter
    const handleCityFilter = (value: string) => {
        setSelectedCity(value);
        router.get(
            route("admin.station"),
            {
                search: searchTerm,
                province: selectedProvince,
                city: value,
            },
            { preserveState: true },
        );
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedProvince("");
        setSelectedCity("");
        router.get(route("admin.station"), {}, { preserveState: true });
    };

    // Handle sort
    const handleSort = (field: "name" | "city" | "province" | "blotters") => {
        const newOrder =
            sortBy === field && sortOrder === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortOrder(newOrder);
    };
    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Admin - Stations" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                <div className="relative z-10 p-6">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Stations Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manage and monitor all police stations in
                                    the system
                                </p>
                            </div>
                            <Link
                                href={route("admin.station.create")}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-5 h-5" />
                                Add Station
                            </Link>
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Funnel className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Filters
                                </span>
                                {(searchTerm ||
                                    selectedProvince ||
                                    selectedCity) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedProvince("");
                                            setSelectedCity("");
                                            router.get(
                                                route("admin.station"),
                                                {},
                                                { preserveState: true },
                                            );
                                        }}
                                        className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        placeholder="Search station name, code, city, or province..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                    />
                                </div>

                                {/* Province Filter */}
                                <div>
                                    <select
                                        value={selectedProvince}
                                        onChange={(e) => {
                                            setSelectedProvince(e.target.value);
                                            setSelectedCity("");
                                        }}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                    >
                                        <option value="">All Provinces</option>
                                        {uniqueProvinces.map((province) => (
                                            <option
                                                key={province.code}
                                                value={province.code}
                                            >
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Filter */}
                                <div>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) =>
                                            handleCityFilter(e.target.value)
                                        }
                                        disabled={!selectedProvince}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing{" "}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {stations.length}
                            </span>{" "}
                            stations
                        </p>
                    </div>

                    {/* Stations Table */}
                    <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg border border-blue-200 dark:border-white/20 backdrop-blur-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            <button
                                                onClick={() =>
                                                    handleSort("name")
                                                }
                                                className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                Station Name
                                                <ArrowUpDownIcon className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <button
                                                onClick={() =>
                                                    handleSort("city")
                                                }
                                                className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                City/Municipality
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <button
                                                onClick={() =>
                                                    handleSort("province")
                                                }
                                                className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                Province
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <button
                                                onClick={() =>
                                                    handleSort("blotters")
                                                }
                                                className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                Blotters
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedStations.map(
                                        (station: Station, key: number) => (
                                            <tr
                                                key={key}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                    {station.station_name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                    {getCity(station.city_code)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                    {getProvince(
                                                        station.province_code,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                    {station.blotter_count || 0}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route(
                                                                "admin.station.edit",
                                                                station.id,
                                                            )}
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline flex items-center gap-1"
                                                        >
                                                            <PencilSquare className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        `Are you sure you want to delete ${station.station_name}?`,
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        route(
                                                                            "admin.station.destroy",
                                                                            station.id,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline flex items-center gap-1"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredAndSortedStations.length === 0 && (
                            <div className="text-center py-8">
                                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No stations found.
                                </p>
                                <Link
                                    href={route("admin.station.create")}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Create your first station
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
