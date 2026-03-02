import CardDataStats from "@/Components/CardDataStats";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/Pages/types";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getCity from "@/utils/functions/getCity";
import { useBlotterStore } from "@/utils/store/blotterStore";
import { Head, router } from "@inertiajs/react";
import { TrendingUp, TrendingUpDown, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { 
    BuildingFillGear, 
    Buildings, 
    BuildingUp, 
    ChevronLeft, 
    ChevronRight, 
    FolderFill, 
    Upload,
    Globe,
    Activity,
    Search,
    Funnel,
    BarChart,
    Calendar,
    Clock,
    CheckCircle,
    Eye,
    Gear
} from "react-bootstrap-icons";

export default function Dashboard({ auth, provinces, cities, barangays, blotters }
    : PageProps<{
        provinces: object[];
        cities: { city_code: number; province_code: number }[];
        barangays: object[];
        blotters: number;
    }>) {

    // Global states
    const { setBlotter } = useBlotterStore();
    
    useEffect(() => {
        setBlotter(blotters);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                                Admin Dashboard
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                System Administration Panel
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="p-2 bg-white dark:bg-white/10 rounded-lg border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 bg-white dark:bg-white/10 rounded-lg border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                            <Gear className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Admin - Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20">
                    <div className="absolute inset-0 dark:hidden" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 px-6 mt-7">
                        <CardDataStats
                            title="Provinces"
                            total={`${provinces?.length || 0}`}
                            rate={`${provinces?.length || 0}`}
                            remark={1}
                            routeTo="provinces"
                            levelUp
                        >
                            <Buildings size={24} color="blue" />
                        </CardDataStats>

                        <CardDataStats
                            title="Cities / Municipalities"
                            total={`${cities?.length || 0}`}
                            rate={`${cities?.length || 0}`}
                            remark={2}
                            routeTo="cities"
                            levelUp
                        >
                            <BuildingUp size={24} color="blue" />
                        </CardDataStats>

                        <CardDataStats
                            title="Barangays"
                            total={`${barangays?.length || 0}`}
                            rate={`${barangays?.length || 0}`}
                            remark={3}
                            routeTo="barangays"
                            levelDown
                        >
                            <BuildingFillGear size={24} color="blue" />
                        </CardDataStats>

                        <CardDataStats
                            title="Total Reports"
                            total={`${blotters || 0}`}
                            rate={`${blotters || 0}`}
                            remark={4}
                            routeTo="blotters"
                            levelUp
                        >
                            <Upload size={24} color="blue" />
                        </CardDataStats>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="px-6 mt-8">
                        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg border border-blue-200 dark:border-white/20 backdrop-blur-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all flex items-center gap-3">
                                    <BarChart className="w-5 h-5 text-blue-600" />
                                    <span className="text-gray-900 dark:text-white font-medium">View Reports</span>
                                </button>
                                <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-900 dark:text-white font-medium">Analytics</span>
                                </button>
                                <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all flex items-center gap-3">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    <span className="text-gray-900 dark:text-white font-medium">User Management</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="px-6 mt-8 mb-8">
                        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg border border-blue-200 dark:border-white/20 backdrop-blur-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">System Status</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">All systems operational</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Database Sync</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Last sync: 2 mins ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const Cities = ({ cities, provinces, selectedProvince, selectedCity, setSelected, barangays, setSelectedProvince }
    : { cities: object[], provinces: any, selectedProvince: number, selectedCity: number, setSelected: CallableFunction, barangays: object[]; setSelectedProvince: CallableFunction }) => {

    return (
        <>
            {/** City / Municipality Card */}
            <div className="my-6 mt-10 border border-solid border-slate-300 shadow-sm rounded p-6 h-[21rem] overflow-scroll  overflow-x-hidden bg-white">
                <h2 className="font-bold text-slate-700">
                    {cities?.filter((item: any) => item?.province_code == selectedProvince)?.length} City / Municipalities
                </h2>

                <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 mt-6">
                    {cities?.filter((item: any) => item?.province_code == selectedProvince)?.length > 0
                        ? cities?.filter((item: any) => item?.province_code == selectedProvince)
                            ?.map((city: any, key: number) => (
                                <button
                                    className={`${selectedCity == city?.city_code
                                        ? 'bg-blue-400 text-blue-400'
                                        : 'text-green-400'} 
                                w-full bg-white text place-items-center rounded-lg py-2 uppercase hover:text-blue-400 hover:text-blue-500 font-bold flex flex-col`}
                                    onClick={() => setSelected(city?.city_code)}
                                >
                                    <FolderFill size={72} />
                                    <h6 className="text-slate-500 text-xs">
                                        {getCity(city?.city_code)}
                                    </h6>
                                </button >
                            ))
                        : <button className="bg-none text-green-400 w-full text place-items-center rounded-lg py-2 uppercase bg-white hover:text-blue-400 font-bold flex flex-col"
                        >
                            <FolderFill size={72} />
                            <h6 className="text-slate-500 text-xs">
                                No data found
                            </h6>
                        </button >}
                </div>
            </div >
            {/** End City / Municipality Card */}
        </>
    )
}

const Barangays = ({ selectedCity, barangays }
    : { selectedCity: number, barangays: object[] }) => {
    // Local states
    const [activePage, setActivePage] = useState<number>(1);
    const [limitBarangay, setLimitBarangay] = useState<number[]>([0, 10]);

    // Handle redirect to blotters page by barangay code
    const redirectToBlottersPerBarangayPage = (code: number) => {
        router.visit('/blotter/admin-blotters', {
            data: {
                brgy_code: code,
            },
        });
    }

    // Handle redirect to barangay page by city code
    const redirectToBarangaysOfCity = (cityId: number) => {
        router.visit('/admin-barangays', {
            data: {
                city_id: cityId,
            },
        });
    }

    const tableHeaders = ['Barangay', 'Total Uploaded', 'Amicably Settled', 'Pending', 'For Hearing', 'Referred To PNP', 'Others', 'Action'];
    return (
        <>
            {/** Barangay Table */}
            <div className="rounded-sm  bg-white shadow-sm dark:border-strokedark dark:bg-boxdark xl:pb-1 px-6">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full z-20 border border-[#eee]">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4 ">
                                {tableHeaders.map((header, key) => (
                                    <th className="border border-[#eee] min-w-[120px] py-3 px-2 font-medium text-xs text-black dark:text-white xl:pl-11" key={key}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {barangays
                                ?.filter((item: any) => item?.city_code == selectedCity)
                                ?.slice(limitBarangay[0], limitBarangay[1])
                                ?.map((barangay: any, key: number) => (
                                    <tr key={key} className="hover:bg-slate-100 cursor-pointer z-20 bg-white dark:bg-meta-4">
                                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="text-black dark:text-white text-xs">
                                                {getBarangayByBrgyCode(barangay?.barangay_code)}
                                            </h5>
                                        </td>

                                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11 text-xs">
                                            {barangay?.total}
                                        </td>

                                        {barangay
                                            ?.blotters
                                            ?.map((remark: any, key: number) => (
                                                <td
                                                    className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11 text-xs"
                                                    key={key}>
                                                    {remark?.count}
                                                </td>
                                            ))}

                                        <td className="border border-[#eee] dark:border-white py-1.5 px-4 pl-9 dark:border-strokedark xl:pl-5">
                                            <button
                                                className="bg-green-600 hover:bg-green-800 text-white px-4 py-0 rounded-3xl"
                                                onClick={() => redirectToBlottersPerBarangayPage(barangay?.barangay_code)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    <div className="flex gap-4 px-6  py-3 justify-end">
                        <button
                            className="flex"
                            onClick={() => {
                                setActivePage(activePage == 1 ? 1 : activePage - 1);
                                setLimitBarangay([0, 10]);
                            }}>
                            <ChevronLeft className="mt-1 cursor-pointer" />
                            Previous
                        </button>

                        <button
                            className={activePage == 1 ? `bg-slate-700 rounded-full text-white w-6 h-6` : 'hover:font-bold'}
                            onClick={() => {
                                setLimitBarangay([0, 10]);
                                setActivePage(1);
                            }}>
                            1
                        </button>
                        <button
                            className={activePage == 2 ? `bg-slate-700 rounded-full text-white w-6 h-6` : 'hover:font-bold'}
                            onClick={() => {
                                setLimitBarangay([10, 20]);
                                setActivePage(2);
                            }}>
                            2
                        </button>
                        <button
                            className={activePage == 3 ? `bg-slate-700 rounded-full text-white w-6 h-6` : 'hover:font-bold'}
                            onClick={() => {
                                setLimitBarangay([20, 30]);
                                setActivePage(3);
                            }}>
                            3
                        </button>
                        <button
                            className="flex"
                            onClick={() => {
                                setActivePage(activePage == 3 ? activePage : activePage + 1);
                                setLimitBarangay([20, 30]);
                            }}>
                            Next <ChevronRight className="mt-1 cursor-pointer" />
                        </button>

                    </div>
                </div>
            </div>
            {/** End Table */}
        </>
    )
}
