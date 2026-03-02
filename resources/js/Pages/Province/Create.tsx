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
    const [selectedProvinceName, setSelectedProvinceName] = useState("");
    const [availableProvinces, setAvailableProvinces] = useState<any[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | null;
    }>({ message: "", type: null });

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        role: 3,
        is_admin: false,
        lang: "",
        lat: "",
        long: "",
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
        setSelectedRegion(value);
        setSelectedProvinceName("");
        setData("region_code", value);
        setData("province_code", "");
        setData("name", "");
    };

    const handleProvinceNameChange = (value: string) => {
        console.log("Province name changed to:", value);
        setSelectedProvinceName(value);
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
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                <div className="relative z-10 p-6">
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

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto">
                        {/* Form Card */}
                        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                                <h3 className="text-xl font-semibold text-white">
                                    Province Information
                                </h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    Fill in the details below to create a new province
                                </p>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* User Information Section */}
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        User Information
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Province Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Province Name
                                            </label>
                                            <select
                                                value={selectedProvinceName}
                                                onChange={(e) => handleProvinceNameChange(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                                placeholder="province@example.com"
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
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                placeholder="Enter password"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Language */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Language
                                            </label>
                                            <select
                                                value={data.lang}
                                                onChange={(e) =>
                                                    setData("lang", e.target.value)
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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

                                        {/* Longitude */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Longitude
                                            </label>
                                            <input
                                                type="text"
                                                value={data.long}
                                                onChange={(e) =>
                                                    setData("long", e.target.value)
                                                }
                                                placeholder="e.g., 122.1234"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                            />
                                            {errors.long && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.long}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information Section */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Address Information
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Region */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Region
                                            </label>
                                            <select
                                                value={selectedRegion}
                                                onChange={(e) => handleRegionChange(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
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
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.region_code}
                                                </p>
                                            )}
                                        </div>

                                        {/* Province Code */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Province Code
                                            </label>
                                            <input
                                                type="text"
                                                value={data.province_code}
                                                onChange={(e) =>
                                                    setData("province_code", e.target.value)
                                                }
                                                placeholder="e.g., 0606"
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                                required
                                            />
                                            {errors.province_code && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.province_code}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("admin.province")}
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? "Creating..." : "Create Province"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
