import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Buildings, Plus, PencilSquare, Trash } from "react-bootstrap-icons";
import { PageProps } from "@/Pages/types";
import regions from "@/utils/data/regions";

interface Province {
    id: number;
    name: string;
    code: number;
    created_at?: string;
    updated_at?: string;
}

interface ProvinceIndexProps {
    auth: PageProps;
    provinces: Province[];
}

export default function ProvinceIndex({ auth, provinces }: ProvinceIndexProps) {
    console.log(provinces);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                            <Buildings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                                Province Management
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Manage all provinces in the system
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route("admin.province.create")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Province
                    </Link>
                </div>
            }
        >
            <Head title="Admin - Provinces" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                <div className="relative z-10 p-6">
                    {/* Stats Cards */}
                   <div className="flex justify-between place-items-center gap-24 pb-6">
                    <input
                    type="text"
                    placeholder="Search provinces..."
                    className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"  
                    />
                   <select name="region" id="region" className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white" onChange={(e) => handleRegionChange(e.target.value)}>
                    {regions.map((region) => (
                        <option key={region.id} value={region.region_code}>
                            {region.region_name}
                        </option>
                    ))}
                   </select>
                   </div>
                    {/* Provinces Table */}
                    <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg border border-blue-200 dark:border-white/20 backdrop-blur-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Province Code
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Province Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {provinces?.map(
                                        (province: Province, key: number) => (
                                            <tr
                                                key={key}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                    {province?.code}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                    {province?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route(
                                                                "admin.province.edit",
                                                                province?.id,
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
                                                                        `Are you sure you want to delete ${province.name}?`,
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        route(
                                                                            "admin.province.destroy",
                                                                            province.id,
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

                        {provinces?.length === 0 && (
                            <div className="text-center py-8">
                                <Buildings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No provinces found.
                                </p>
                                <Link
                                    href={route("admin.province.create")}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Create your first province
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
