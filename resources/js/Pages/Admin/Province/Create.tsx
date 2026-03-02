import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Shield, ArrowLeft } from "react-bootstrap-icons";

// Import existing data
import regions from "@/utils/data/regions";
import provinces from "@/utils/data/provinces";
import { PageProps } from "@/Pages/types";

interface ProvinceCreateProps {}

export default function ProvinceCreate({ auth }: PageProps) {
    const [selectedRegion, setSelectedRegion] = useState("06");
    const [availableProvinces, setAvailableProvinces] = useState<any[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | null;
    }>({ message: "", type: null });

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        role: 2, // Province role based on User model
        is_admin: false,
        longitude: "",
        lat: "",
        avatar: "",
        banner: "",
        barangay_code: "0",
        city_code: "0", 
        province_code: "",
        region_code: "06",
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

    const handleRegionChange = (value: string) => {
        console.log("Region changed to:", value);
        
        // Update form data
        setData("region_code", value);
        setData("province_code", "");
        setData("name", "");
        
        // Update available provinces
        const filtered = provinces.filter(
            (p) => p.region_code === value,
        );
        setAvailableProvinces(filtered);
    };

    const handleProvinceNameChange = (value: string) => {
        console.log("Province name changed to:", value);
        setData("name", value);
        
        // Auto-generate province code based on selected province
        if (value && selectedRegion) {
            const selectedProvinceData = availableProvinces.find(
                (p) => p.province_name.toLowerCase() === value.toLowerCase()
            );
            if (selectedProvinceData) {
                setData("province_code", selectedProvinceData.province_code);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Show loading toast
        setToast({ message: "Creating province...", type: null });

        post(route("admin.province.store"), {
            onSuccess: () => {
                setToast({
                    message: "Province created successfully!",
                    type: "success",
                });
                // Hide toast after 3 seconds
                setTimeout(() => setToast({ message: "", type: null }), 3000);
                // Redirect to province index
                setTimeout(() => router.get(route("admin.province")), 1000);
            },
            onError: (errors) => {
                setToast({
                    message: "Failed to create province. Please check form.",
                    type: "error",
                });
                // Hide toast after 5 seconds
                setTimeout(() => setToast({ message: "", type: null }), 5000);
            },
        });
    };

    console.log('data :', data);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("admin.province")}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                            Create Province
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Add a new province to the system using existing data
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Admin - Create Province" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800 flex justify-center p-4">
                <div className="relative z-10 w-full max-w-6xl">
                    {/* Toast Notification */}
                    {toast.message && (
                        <div
                            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
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

                    {/* Main Content - No Scroll */}
                    <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden">
                        {/* Form Body - Compact Layout */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white pb-2 dark:border-gray-700">
                                        User Information
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                                        {/* Province Name */}
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Province Name
                                            </label>
                                            <select
                                                value={data.name}
                                                onChange={(e) => handleProvinceNameChange(e.target.value)}
                                                className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                                required
                                            >
                                                <option value="">Select Province</option>
                                                {availableProvinces.map((province) => (
                                                    <option key={province.province_code} value={province.province_name}>
                                                        {province.province_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                                placeholder="province@example.com"
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                placeholder="Enter password"
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Longitude */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Longitude
                                            </label>
                                            <input
                                                type="text"
                                                value={data.longitude}
                                                onChange={(e) =>
                                                    setData("longitude", e.target.value)
                                                }
                                                placeholder="e.g., 122.1234"
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            />
                                            {errors.longitude && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.longitude}
                                                </p>
                                            )}
                                        </div>

                                        {/* Latitude */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Latitude
                                            </label>
                                            <input
                                                type="text"
                                                value={data.lat}
                                                onChange={(e) =>
                                                    setData("lat", e.target.value)
                                                }
                                                placeholder="e.g., 10.1234"
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            />
                                            {errors.lat && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.lat}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white pb-2 dark:border-gray-700">
                                        Address Information
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                                        {/* Region */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Region
                                            </label>
                                            <select
                                                value={selectedRegion}
                                                onChange={(e) => handleRegionChange(e.target.value)}
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                                required
                                            >
                                                <option value="">Select Region</option>
                                                {regions.map((region) => (
                                                    <option key={region.region_code} value={region.region_code}>
                                                        {region.region_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.region_code && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.region_code}
                                                </p>
                                            )}
                                        </div>

                                        {/* Province Code */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Province Code
                                            </label>
                                            <input
                                                type="text"
                                                value={data.province_code}
                                                onChange={(e) =>
                                                    setData("province_code", e.target.value)
                                                }
                                                placeholder="e.g., 0606"
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                                required
                                            />
                                            {errors.province_code && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.province_code}
                                                </p>
                                            )}
                                        </div>

                                        {/* Barangay Code (Fixed to 0) */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Barangay Code
                                            </label>
                                            <input
                                                type="text"
                                                value="0"
                                                disabled
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                                title="Fixed value for provinces"
                                            />
                                        </div>

                                        {/* City Code (Fixed to 0) */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                City Code
                                            </label>
                                            <input
                                                type="text"
                                                value="0"
                                                disabled
                                                className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                                title="Fixed value for provinces"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions - Compact */}
                            <div className="flex justify-end space-x-3 pt-4 mt-4  dark:border-gray-700">
                                <Link
                                    href={route("admin.province")}
                                    className="p-3 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="p-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "Creating..." : "Create Province"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}