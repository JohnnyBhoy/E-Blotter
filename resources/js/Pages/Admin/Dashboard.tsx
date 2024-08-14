import CardDataStats from "@/Components/CardDataStats";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
import barangays from "@/utils/data/barangays";
import cities from "@/utils/data/cities";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getCity from "@/utils/functions/getCity";
import getProvince from "@/utils/functions/getProvince";
import { useBlotterStore } from "@/utils/store/blotterStore";
import { Head, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { BookHalf, BookmarkCheck, BookmarkCheckFill, Bookshelf, BuildingFillGear, Buildings, BuildingUp, ChevronLeft, ChevronRight, Ear, EvStation, File, FileCheck, Folder2, FolderFill, LayoutSidebarInset, PersonFillCheck, Upload } from "react-bootstrap-icons";

export default function Dashboard({ auth, provinces, cities, barangays, blotters }
    : PageProps<{
        provinces: object[];
        cities: { city_code: number; province_code: number }[];
        barangays: object[];
        blotters: number;
    }>) {

    // Global states
    const { setBlotter } = useBlotterStore();

    // Local states
    const [selectedCity, setSelectedCity] = useState<number>(cities[0].city_code);
    const [selectedProvince, setSelectedProvince] = useState<number>(cities[0].province_code);

    useEffect(() => {
        setBlotter(blotters);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin - Dashboard" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats
                    title="Provinces"
                    total={`${provinces?.length}`}
                    rate={`${provinces?.length}`}
                    remark={1}
                    routeTo="provinces"
                    levelUp
                >
                    <Buildings size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Cities / Municipalities"
                    total={`${cities?.length}`}
                    rate={`${cities?.length}`}
                    remark={2}
                    routeTo="cities"
                    levelUp
                >
                    <BuildingUp size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Barangays"
                    total={`${barangays?.length}`}
                    rate={`${barangays?.length}`}
                    remark={3}
                    routeTo="barangays"
                    levelDown
                >
                    <BuildingFillGear size={24} color="blue" />
                </CardDataStats>

                <CardDataStats
                    title="Total Uploaded"
                    total={`${blotters}`}
                    rate={`${blotters}`}
                    remark={4}
                    routeTo="blotters"
                    levelUp
                >
                    <Upload size={24} color="blue" />
                </CardDataStats>

            </div>

            <div className="flex justify-between gap-6">

                <div className="w-[40%] bg-white">
                    <Provinces
                        provinces={provinces}
                        selectedProvince={selectedProvince}
                        setSelectedProvince={setSelectedProvince}
                    />
                </div>

                <div className="lg:w-[60%]">
                    <Cities
                        cities={cities}
                        provinces={provinces}
                        selectedProvince={selectedProvince}
                        setSelected={setSelectedCity}
                        selectedCity={selectedCity}
                        barangays={barangays}
                        setSelectedProvince={setSelectedProvince}
                    />
                </div>
            </div>

            <Barangays
                selectedCity={selectedCity}
                barangays={barangays}
            />

        </AuthenticatedLayout >
    );

}

const Provinces = ({ provinces, selectedProvince, setSelectedProvince }
    : { provinces: any, selectedProvince: number, setSelectedProvince: CallableFunction }) => {

    // Handle redirect to cities page by province Id
    const redirectToCitiesOfProvince = (provinceID: number) => {
        router.visit('/admin-cities', {
            data: {
                province_id: provinceID,
            },
        });
    }

    const provincesData = [
        {
            id: 1,
            name: "ANTIQUE",
            code: 606,
        },
        {
            id: 2,
            name: "AKLAN",
            code: 604,
        },
        {
            id: 3,
            name: "CAPIZ",
            code: 619,
        }, {
            id: 4,
            name: "GUIMARAS",
            code: 679,
        },
        {
            id: 5,
            name: "ILOILO",
            code: 630,
        },
        {
            id: 6,
            name: "NEGROS OCC.",
            code: 645,
        },
        {
            id: 7,
            name: "BACOLOD CITY",
            code: 645,
        },
        {
            id: 8,
            name: "ILOILO CITY",
            code: 630,
        }]

    return (
        <div className="my-10 border border-solid border-slate-200 shadow rounded  shadow p-6 h-[21rem]">
            <h2 className="font-bold text-slate-700">
                {provincesData?.length - 2} Provinces and 2 Component Cities
            </h2>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
                {provincesData?.map((province: any, key: number) => (
                    <>
                        <button
                            className={`${selectedProvince == province?.code
                                ? 'bg-blue-400 text-blue-400'
                                : 'bg-none text-green-400'} 
                                w-full bg-white text-sm place-items-center rounded-lg py-2 uppercase hover:text-blue-400 hover:text-white font-bold flex flex-col`}
                            onClick={() => setSelectedProvince(province?.code)}
                        >
                            <FolderFill size={72} />
                            <h6 className="text-slate-500">{province?.name}</h6>
                        </button >
                    </>
                ))}
            </div>
        </div >
    )
}

const Cities = ({ cities, provinces, selectedProvince, selectedCity, setSelected, barangays, setSelectedProvince }
    : { cities: object[], provinces: any, selectedProvince: number, selectedCity: number, setSelected: CallableFunction, barangays: object[]; setSelectedProvince: CallableFunction }) => {

    return (
        <>
            {/** City / Municipality Card */}
            <div className="my-6 mt-10 border border-solid border-slate-200 shadow rounded p-6 h-[21rem] overflow-scroll  overflow-x-hidden">
                <h2 className="font-bold text-slate-700">
                    {cities?.filter((item: any) => item?.province_code == selectedProvince)?.length} City / Municipalities
                </h2>

                <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 mt-6">
                    {cities?.filter((item: any) => item?.province_code == selectedProvince)?.length > 0
                        ? cities?.filter((item: any) => item?.province_code == selectedProvince)
                            ?.map((city: any, key: number) => (
                                <>
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
                                </>
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
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1">
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
