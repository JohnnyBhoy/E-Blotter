import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Shield, ArrowLeft } from "react-bootstrap-icons";

// Import existing data
import regions from "@/utils/data/regions";
import provinces from "@/utils/data/provinces";
import cities from "@/utils/data/cities";
import { PageProps } from "@/Pages/types";
import getCity from "@/utils/functions/getCity";

interface StationCreateProps {}

export default function StationCreate({ auth }: PageProps) {
    const [selectedRegion, setSelectedRegion] = useState("06");
    const [selectedProvince, setSelectedProvince] = useState("0606");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedStationName, setSelectedStationName] = useState("");
    const [availableProvinces, setAvailableProvinces] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | null;
    }>({ message: "", type: null });

    const { data, setData, post, processing, errors } = useForm({
        user: {
            name: "",
            email: "",
            password: "",
            role: 4,
            lang: "",
            lat: "",
            avatar: "",
            banner: "",
            is_admin: false,
        },
        user_address: {
            barangay_code: "0",
            city_code: "",
            province_code: "0606",
            region_code: "06",
        },
    });

    // Initialize provinces on component mount
    useEffect(() => {
        if (selectedRegion) {
            const filtered = provinces.filter(
                (p) => p.region_code === selectedRegion,
            );
            setAvailableProvinces(filtered);
        }
    }, []);

    // Initialize cities on component mount
    useEffect(() => {
        if (selectedProvince) {
            const filtered = cities.filter(
                (c) => c.province_code === selectedProvince,
            );
            setAvailableCities(filtered);
        }
    }, []);

    // Filter provinces when region changes
    useEffect(() => {
        if (selectedRegion) {
            const filtered = provinces.filter(
                (p) => p.region_code === selectedRegion,
            );
            setAvailableProvinces(filtered);
            // Clear dependent data
            setAvailableCities([]);
        } else {
            setAvailableProvinces([]);
            setAvailableCities([]);
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
    };

    const handleProvinceChange = (value: string) => {
        console.log("Province changed to:", value);
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedStationName("");
    };

    const handleCityChange = (value: string) => {
        console.log("City changed to:", value);
        setSelectedStationName(getCity(value));
        setData("user", {
            ...data.user,
            name: getCity(value),
        });
        setData("user_address", {
            ...data.user_address,
            city_code: value,
        });
    };

    const handleStationNameChange = (value: string) => {
        console.log("Station name changed to:", value);
        setData("user", {
            ...data.user,
            name: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Show loading toast
        setToast({ message: "Creating station...", type: null });

        post(route("admin.station.store"), {
            onSuccess: () => {
                setToast({
                    message: "Station created successfully!",
                    type: "success",
                });
                // Hide toast after 3 seconds
                setTimeout(() => setToast({ message: "", type: null }), 3000);
                // Redirect to station index
                setTimeout(() => router.get(route("admin.station")), 1000);
            },
            onError: (errors) => {
                setToast({
                    message: "Failed to create station. Please check form.",
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
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                            Create Station
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Add a new police station to the system using
                            existing data
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Admin - Create Station" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                <div className="relative z-10 p-6">
                    <div className="max-w-full mx-auto">
                        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg border border-blue-200 dark:border-white/20 backdrop-blur-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {/* Region Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Region
                                        </label>
                                        <select
                                            value="06"
                                            onChange={(e) =>
                                                handleRegionChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            required
                                        >
                                            <option value="">
                                                Select Region
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                        >
                                            <option value="">
                                                Select Province
                                            </option>
                                            {availableProvinces.map(
                                                (province: any) => (
                                                    <option
                                                        key={
                                                            province.province_code
                                                        }
                                                        value={
                                                            province.province_code
                                                        }
                                                    >
                                                        {province.province_name}
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City/Municipality
                                        </label>
                                        <select
                                            value={selectedCity}
                                            onChange={(e) =>
                                                handleCityChange(e.target.value)
                                            }
                                            disabled={!selectedProvince}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">
                                                {selectedStationName ||
                                                    "Select City/Municipality"}
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Station Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.user.name}
                                            onChange={(e) =>
                                                handleStationNameChange(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., San Pedro Police Station"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            required
                                        />
                                        {errors.station_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.station_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Station Code (Auto-generated) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Station Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.user_address.city_code}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                            placeholder="Auto-generated"
                                        />
                                        {errors.station_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.station_code}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.user.email}
                                            onChange={(e) =>
                                                setData("user", {
                                                    ...data.user,
                                                    email: e.target.value,
                                                })
                                            }
                                            placeholder="station@email.com"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="text"
                                            value={data.user.password}
                                            onChange={(e) =>
                                                setData("user", {
                                                    ...data.user,
                                                    password: e.target.value,
                                                })
                                            }
                                            placeholder="Enter password"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                        />
                                        {errors?.user?.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors?.user?.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Longitude */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            type="text"
                                            value={data.lang}
                                            onChange={(e) =>
                                                setData("lang", e.target.value)
                                            }
                                            placeholder="e.g., 122.1234"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                        />
                                        {errors.lang && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.lang}
                                            </p>
                                        )}
                                    </div>

                                    {/* Latitude */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            value={data.lat}
                                            onChange={(e) =>
                                                setData("lat", e.target.value)
                                            }
                                            placeholder="e.g., 10.1234"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Station"}
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
