import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { BuildingFillGear, ArrowLeft } from "react-bootstrap-icons";

// Import existing data
import regions from "@/utils/data/regions";
import provinces from "@/utils/data/provinces";
import cities from "@/utils/data/cities";
import barangays from "@/utils/data/barangays";
import { PageProps } from "@/Pages/types";
import getRegionByRegionCode from "@/utils/functions/getRegionByRegionCode";
import getProvince from "@/utils/functions/getProvince";
import getCity from "@/utils/functions/getCity";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";

interface Barangay {
    id: number;
    user_id: number;
    brgy_name: string;
    brgy_code: string;
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

interface BarangayEditProps {
    auth: PageProps;
    barangay: Barangay;
}

export default function BarangayEdit({ auth, barangay }: BarangayEditProps) {
    console.log('Barangay data received:', barangay);
    
    const [selectedRegion, setSelectedRegion] = useState(barangay?.region_code?.toString() || "");
    const [selectedProvince, setSelectedProvince] = useState(barangay?.province_code?.toString() || "");
    const [selectedCity, setSelectedCity] = useState(barangay?.city_code?.toString() || "");
    const [selectedBarangayCode, setSelectedBarangayCode] = useState(barangay?.brgy_code?.toString() || "");
    const [selectedBarangayName, setSelectedBarangayName] = useState(barangay?.brgy_name || "");
    const [availableProvinces, setAvailableProvinces] = useState<any[]>([]);
    const [availableCities, setAvailableCities] = useState<any[]>([]);
    const [availableBarangays, setAvailableBarangays] = useState<any[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | null;
    }>({ message: "", type: null });

    const { data, setData, post, processing, errors } = useForm({
        brgy_name: barangay?.brgy_name || "",
        city_code: barangay?.city_code || "",
        brgy_code: barangay?.brgy_code || "",
        province_code: barangay?.province_code || "",
        region_code: barangay?.region_code || "",
        email: barangay?.email || "",
        password: "",
        lang: barangay?.lang || "",
        lat: barangay?.lat || "",
        avatar: barangay?.avatar || "",
        banner: barangay?.banner || "",
    });

    // Filter provinces when region changes
    useEffect(() => {
        if (selectedRegion) {
            const filtered = provinces.filter(
                (p) => p.region_code === selectedRegion,
            );
            setAvailableProvinces(filtered);
        } else {
            setAvailableProvinces([]);
            setAvailableCities([]);
            setAvailableBarangays([]);
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
            setAvailableBarangays([]);
        }
    }, [selectedProvince]);

    // Filter barangays when city changes
    useEffect(() => {
        if (selectedCity) {
            const filtered = barangays.filter(
                (b) => b.city_code === selectedCity,
            );
            setAvailableBarangays(filtered);
        } else {
            setAvailableBarangays([]);
        }
    }, [selectedCity]);

    // Initialize cascading dropdowns on component mount
    useEffect(() => {
        if (barangay?.region_code) {
            const regionCode = barangay.region_code.toString();
            const filteredProvinces = provinces.filter(
                (p) => p.region_code === regionCode,
            );
            setAvailableProvinces(filteredProvinces);
        }
        
        if (barangay?.province_code) {
            const provinceCode = barangay.province_code.toString();
            const filteredCities = cities.filter(
                (c) => c.province_code === provinceCode,
            );
            setAvailableCities(filteredCities);
        }
        
        if (barangay?.city_code) {
            const cityCode = barangay.city_code.toString();
            const filteredBarangays = barangays.filter(
                (b) => b.city_code === cityCode,
            );
            setAvailableBarangays(filteredBarangays);
        }
    }, [barangay]);

    const handleRegionChange = (value: string) => {
        console.log("Region changed to:", value);
        setSelectedRegion(value);
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedBarangayCode("");
        setData("region_code", value);
        setData("province_code", "");
        setData("city_code", "");
        setData("brgy_name", "");
        setData("brgy_code", "");
    };

    const handleProvinceChange = (value: string) => {
        console.log("Province changed to:", value);
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedBarangayCode("");
        setData("province_code", value);
        setData("city_code", "");
        setData("brgy_name", "");
        setData("brgy_code", "");
    };

    const handleCityChange = (value: string) => {
        console.log("City changed to:", value);
        setSelectedCity(value);
        setSelectedBarangayCode("");
        setData("city_code", value);
        setData("brgy_name", "");
        setData("brgy_code", "");
    };

    const handleBarangayChange = (value: string) => {
        console.log("Barangay changed to:", value);
        setSelectedBarangayCode(value);
        const selectedBarangay = availableBarangays.find(
            (b) => b.brgy_code === value,
        );
        console.log("Found barangay:", selectedBarangay);

        if (selectedBarangay) {
            console.log(
                "Setting selectedBarangayName to:",
                selectedBarangay.brgy_name,
            );
            setSelectedBarangayName(selectedBarangay.brgy_name);
            setData("brgy_name", selectedBarangay.brgy_name);
            setData("brgy_code", selectedBarangay.brgy_code);
        } else {
            console.log("No barangay found with code:", value);
            setSelectedBarangayName("");
        }
    };

    // Initialize states from form data on component mount
    useEffect(() => {
        if (barangay?.region_code) {
            const regionCode = barangay.region_code.toString();
            setSelectedRegion(regionCode);
            setData("region_code", regionCode);
        }
        if (barangay?.province_code) {
            const provinceCode = barangay.province_code.toString();
            setSelectedProvince(provinceCode);
            setData("province_code", provinceCode);
        }
        if (barangay?.city_code) {
            const cityCode = barangay.city_code.toString();
            setSelectedCity(cityCode);
            setData("city_code", cityCode);
        }
        if (barangay?.brgy_code) {
            const brgyCode = barangay.brgy_code.toString();
            setSelectedBarangayCode(brgyCode);
            setData("brgy_code", brgyCode);
        }
        if (barangay?.brgy_name) {
            setSelectedBarangayName(barangay.brgy_name);
            setData("brgy_name", barangay.brgy_name);
        }
    }, [barangay]);

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

    // Sync brgy_name with selectedBarangayName
    useEffect(() => {
        setData("brgy_name", selectedBarangayName);
    }, [selectedBarangayName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Show loading toast
        setToast({ message: "Updating barangay...", type: null });

        post(route("admin.barangay.update", barangay.id), {
            onSuccess: () => {
                setToast({
                    message: "Barangay updated successfully!",
                    type: "success",
                });
                // Hide toast after 3 seconds
                setTimeout(() => setToast({ message: "", type: null }), 3000);
            },
            onError: (errors) => {
                setToast({
                    message:
                        "Failed to update barangay. Please check the form.",
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
            auth={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("admin.barangay")}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                        <BuildingFillGear className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                            Edit Barangay
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Update barangay information and settings
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Admin - Edit Barangay" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                <div className="relative z-10 p-6">
                    <div className="max-w-full mx-auto">
                        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg border border-blue-200 dark:border-white/20 backdrop-blur-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Region Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Region
                                        </label>
                                        <select
                                            value={selectedRegion}
                                            onChange={(e) =>
                                                handleRegionChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            required
                                        >
                                            <option value="">
                                                {barangay?.region_code ? getRegionByRegionCode(barangay.region_code) : "Select Region"}
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
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            required
                                            disabled={!selectedRegion}
                                        >
                                            <option value="">
                                                {barangay?.province_code ? getProvince(barangay.province_code) : "Select Province"}
                                            </option>
                                            {availableProvinces.map(
                                                (province) => (
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
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            required
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">
                                                {barangay?.city_code ? getCity(barangay.city_code) : "Select City/Municipality"}
                                            </option>
                                            {availableCities.map((city) => (
                                                <option
                                                    key={city.city_code}
                                                    value={city.city_code}
                                                >
                                                    {city.city_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.city_code && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.city_code}
                                            </p>
                                        )}
                                    </div>

                                    {/* Barangay Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Barangay
                                        </label>
                                        <select
                                            value={selectedBarangayCode}
                                            onChange={(e) =>
                                                handleBarangayChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white bg-gray-50"
                                            required
                                            disabled={true}
                                        >
                                            <option value="">
                                                {barangay?.brgy_name }
                                            </option>
                                            {availableBarangays.map(
                                                (barangay) => (
                                                    <option
                                                        key={barangay.brgy_code}
                                                        value={
                                                            barangay.brgy_code
                                                        }
                                                    >
                                                        {barangay.brgy_name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {errors.brgy_code && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.brgy_code}
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Barangay selection is disabled in edit mode
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email || ""}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            placeholder="barangay@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password (leave empty to keep current)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.password || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Longtitude
                                        </label>
                                        <input
                                            type="number"
                                            value={data.lang || ""}
                                            onChange={(e) =>
                                                setData("lang", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            placeholder="14.5995"
                                        />
                                        {errors.lang && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
                                            type="number"
                                            step="any"
                                            value={data.lat || ""}
                                            onChange={(e) =>
                                                setData("lat", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            placeholder="14.5995"
                                        />
                                        {errors.lat && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.lat}
                                            </p>
                                        )}
                                    </div>

                                    {/* Avatar URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Avatar URL
                                        </label>
                                        <input
                                            type="url"
                                            value={data.avatar || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "avatar",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                        {errors.avatar && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.avatar}
                                            </p>
                                        )}
                                    </div>

                                    {/* Banner URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Banner URL
                                        </label>
                                        <input
                                            type="url"
                                            value={data.banner || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "banner",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            placeholder="https://example.com/banner.jpg"
                                        />
                                        {errors.banner && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.banner}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6">
                                    <Link
                                        href={route("admin.barangay")}
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Update Barangay"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Toast Notification */}
                {toast.message && (
                    <div className="fixed bottom-4 right-4 z-50 animate-pulse">
                        <div
                            className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
                                toast.type === "success"
                                    ? "bg-green-500"
                                    : toast.type === "error"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                            }`}
                        >
                            {toast.message}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
