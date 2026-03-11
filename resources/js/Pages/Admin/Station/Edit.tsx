import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Shield, ArrowLeft } from "react-bootstrap-icons";

// Import existing data
import regions from "@/utils/data/regions";
import provinces from "@/utils/data/provinces";
import cities from "@/utils/data/cities";
import { PageProps } from "@/Pages/types";

interface Station {
    id: number;
    user_id: number;
    station_name: string;
    station_code: string;
    city_code: string;
    province_code: string;
    region_code: string;
    email?: string;
    lang?: string;
    lat?: string;
    avatar?: string;
    banner?: string;
    created_at?: string;
    updated_at?: string;
}

interface StationEditProps extends PageProps {
    station: Station;
}

export default function StationEdit({ auth, station }: StationEditProps) {
    console.log('Station data received:', station);
    
    const [selectedRegion, setSelectedRegion] = useState(station?.region_code?.toString() || "");
    const [selectedProvince, setSelectedProvince] = useState(station?.province_code?.toString() || "");
    const [selectedCity, setSelectedCity] = useState(station?.city_code?.toString() || "");
    const [selectedStationName, setSelectedStationName] = useState(station?.station_name || "");
    const [availableProvinces, setAvailableProvinces] = useState<any[]>([]);
    const [availableCities, setAvailableCities] = useState<any[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | null;
    }>({ message: "", type: null });

    const { data, setData, post, processing, errors } = useForm({
        station_name: station?.station_name || "",
        city_code: station?.city_code || "",
        station_code: station?.station_code || "",
        province_code: station?.province_code || "",
        region_code: station?.region_code || "",
        email: station?.email || "",
        password: "",
        lang: station?.lang || "",
        lat: station?.lat || "",
        avatar: station?.avatar || "",
        banner: station?.banner || "",
    });

    // Initialize data on component mount
    useEffect(() => {
        if (station) {
            if (station.region_code) {
                const regionCode = station.region_code.toString();
                setSelectedRegion(regionCode);
                setData("region_code", regionCode);
            }
            if (station.province_code) {
                const provinceCode = station.province_code.toString();
                setSelectedProvince(provinceCode);
                setData("province_code", provinceCode);
            }
            if (station.city_code) {
                const cityCode = station.city_code.toString();
                setSelectedCity(cityCode);
                setData("city_code", cityCode);
            }
            if (station.station_name) {
                setSelectedStationName(station.station_name);
                setData("station_name", station.station_name);
            }
        }
    }, [station]);

    // Sync form data with selected states
    useEffect(() => {
        setData("region_code", selectedRegion);
    }, [selectedRegion]);

    useEffect(() => {
        setData("province_code", selectedProvince);
    }, [selectedProvince]);

    useEffect(() => {
        setData("city_code", selectedCity);
    }, [selectedCity]);

    // Sync station_name with selectedStationName
    useEffect(() => {
        setData("station_name", selectedStationName);
    }, [selectedStationName]);

    // Filter provinces when region changes
    useEffect(() => {
        if (selectedRegion) {
            const filtered = provinces.filter(
                (p) => p.region_code === selectedRegion,
            );
            setAvailableProvinces(filtered);
        } else {
            setAvailableProvinces([]);
        }
    }, [selectedRegion]);

    // Filter cities when province changes
    useEffect(() => {
        if (selectedProvince) {
            const filtered = cities.filter(
                (c) => c.province_code === selectedProvince,
            );
            setAvailableCities(filtered);
        } else {
            setAvailableCities([]);
        }
    }, [selectedProvince]);

    const handleRegionChange = (value: string) => {
        console.log("Region changed to:", value);
        setSelectedRegion(value);
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedStationName("");
        setData("region_code", value);
        setData("province_code", "");
        setData("city_code", "");
        setData("station_name", "");
        setData("station_code", "");
    };

    const handleProvinceChange = (value: string) => {
        console.log("Province changed to:", value);
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedStationName("");
        setData("province_code", value);
        setData("city_code", "");
        setData("station_name", "");
        setData("station_code", "");
    };

    const handleCityChange = (value: string) => {
        console.log("City changed to:", value);
        setSelectedCity(value);
        setSelectedStationName("");
        setData("city_code", value);
        setData("station_name", "");
        setData("station_code", "");
    };

    const handleStationNameChange = (value: string) => {
        console.log("Station name changed to:", value);
        setSelectedStationName(value);
        setData("station_name", value);
        
        // Auto-generate station code based on city code and station name
        if (value && selectedCity) {
            const stationCode = `${selectedCity}${value.toLowerCase().replace(/\s+/g, '_').substring(0, 10)}`;
            setData("station_code", stationCode);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Show loading toast
        setToast({ message: "Updating station...", type: null });

        post(route("admin.station.update", station.id), {
            onSuccess: () => {
                setToast({
                    message: "Station updated successfully!",
                    type: "success",
                });
                // Hide toast after 3 seconds
                setTimeout(() => setToast({ message: "", type: null }), 3000);
                // Redirect to station index
                setTimeout(() => router.get(route("admin.station")), 1000);
            },
            onError: (errors) => {
                setToast({
                    message:
                        "Failed to update station. Please check the form.",
                    type: "error",
                });
                // Hide toast after 5 seconds
                setTimeout(() => setToast({ message: "", type: null }), 5000);
            },
        });
    };

    console.log("data :", data);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("admin.station")}
                        className="p-2 bg-gray-200 dark:bg-claude-panel-2 rounded-lg hover:bg-gray-300 dark:hover:bg-claude-panel-2 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-claude-text-muted" />
                    </Link>
                    <div className="p-3 bg-gradient-to-r from-claude-accent to-claude-accent-light rounded-xl shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-claude-text leading-tight">
                            Edit Station
                        </h2>
                        <p className="text-gray-600 dark:text-claude-text-muted text-sm">
                            Update station information and settings
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Admin - Edit Station" />

            <div className="min-h-screen bg-gray-50 dark:bg-claude-bg">
                <div className="relative z-10 p-6">
                    <div className="max-w-full mx-auto">
                        <div className="bg-white dark:bg-claude-panel rounded-xl shadow-lg border border-gray-200 dark:border-claude-border backdrop-blur-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Region Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Region
                                        </label>
                                        <select
                                            value={selectedRegion}
                                            onChange={(e) =>
                                                handleRegionChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text"
                                            required
                                        >
                                            <option value="">
                                                {station?.region_code ? regions.find(r => r.region_code === station.region_code)?.region_name : "Select Region"}
                                            </option>
                                            {regions.map((region) => (
                                                <option
                                                    key={region.region_code}
                                                    value={region.region_code}
                                                >
                                                    {region.region_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.region_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.region_code}
                                            </p>
                                        )}
                                    </div>

                                    {/* Province Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Province
                                        </label>
                                        <select
                                            value={selectedProvince}
                                            onChange={(e) =>
                                                handleProvinceChange(
                                                    e.target.value,
                                                )
                                            }
                                            disabled={!selectedRegion}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                        >
                                            <option value="">
                                                {station?.province_code ? provinces.find(p => p.province_code === station.province_code)?.province_name : "Select Province"}
                                            </option>
                                            {availableProvinces.map(
                                                (province: any) => (
                                                    <option
                                                        key={province.province_code}
                                                        value={province.province_code}
                                                    >
                                                        {
                                                            province.province_name
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {errors.province_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.province_code}
                                            </p>
                                        )}
                                    </div>

                                    {/* City Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            City/Municipality
                                        </label>
                                        <select
                                            value={selectedCity}
                                            onChange={(e) =>
                                                handleCityChange(
                                                    e.target.value,
                                                )
                                            }
                                            disabled={!selectedProvince}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                        >
                                            <option value="">
                                                {station?.city_code ? cities.find(c => c.city_code === station.city_code)?.city_name : "Select City/Municipality"}
                                            </option>
                                            {availableCities.map(
                                                (city: any) => (
                                                    <option
                                                        key={city.city_code}
                                                        value={city.city_code}
                                                    >
                                                        {city.city_name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {errors.city_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.city_code}
                                            </p>
                                        )}
                                    </div>

                                    {/* Station Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Station Name
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedStationName}
                                            onChange={(e) =>
                                                handleStationNameChange(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., San Pedro Police Station"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text"
                                            required
                                        />
                                        {errors.station_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.station_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Station Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Station Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.station_code}
                                            onChange={(e) =>
                                                setData("station_code", e.target.value)
                                            }
                                            placeholder="Station code"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text"
                                            required
                                        />
                                        {errors.station_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.station_code}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="station@email.com"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData("password", e.target.value)
                                            }
                                            placeholder="Leave blank to keep current password"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Language
                                        </label>
                                        <select
                                            value={data.lang}
                                            onChange={(e) =>
                                                setData("lang", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text"
                                        >
                                            <option value="">Select Language</option>
                                            <option value="en">English</option>
                                            <option value="tl">Filipino</option>
                                        </select>
                                        {errors.lang && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.lang}
                                            </p>
                                        )}
                                    </div>

                                    {/* Latitude */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-claude-text-muted mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            value={data.lat}
                                            onChange={(e) =>
                                                setData("lat", e.target.value)
                                            }
                                            placeholder="e.g., 10.1234"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-claude-border rounded-lg focus:ring-2 focus:ring-claude-accent/50 focus:border-transparent dark:bg-claude-panel dark:text-claude-text"
                                        />
                                        {errors.lat && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.lat}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <Link
                                        href={route("admin.station")}
                                        className="px-6 py-2 border border-gray-300 dark:border-claude-border text-gray-700 dark:text-claude-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-claude-panel-2 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-claude-accent text-white hover:bg-claude-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? "Updating..." : "Update Station"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast.message && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                        toast.type === "success"
                            ? "bg-green-500 text-white"
                            : toast.type === "error"
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
