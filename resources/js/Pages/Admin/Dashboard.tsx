import CardDataStats from "@/Components/CardDataStats";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getCity from "@/utils/functions/getCity";
import getProvince from "@/utils/functions/getProvince";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import { BookHalf, BuildingFillGear, Buildings, BuildingUp, ChevronLeft, ChevronRight } from "react-bootstrap-icons";

export default function Dashboard({ auth, provinces, cities, barangays, blotters }
    : PageProps<{
        provinces: object[];
        cities: { city_code: number; province_code: number }[];
        barangays: object[];
        blotters: number;
    }>) {

    // Local states
    const [selectedCity, setSelectedCity] = useState<number>(cities[0].city_code);
    const [selectedProvince, setSelectedProvince] = useState<number>(cities[0].province_code);

    console.log(barangays);

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
                <CardDataStats title="Provinces" total={`${provinces?.length}`} rate={`${provinces?.length}`} remark={1} routeTo="provinces" levelUp>
                    <Buildings size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Cities" total={`${cities?.length}`} rate={`${cities?.length}`} remark={2} routeTo="cities" levelUp>
                    <BuildingUp size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Barangays" total={`${barangays?.length}`} rate={`${barangays?.length}`} remark={3} routeTo="barangays" levelDown>
                    <BuildingFillGear size={24} color="blue" />
                </CardDataStats>

                <CardDataStats title="Blotters" total={`${blotters}`} rate={`${blotters}`} remark={4} routeTo="blotters" levelUp>
                    <BookHalf size={24} color="blue" />
                </CardDataStats>
            </div>

            <Provinces
                provinces={provinces}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
            />

            <Cities
                cities={cities}
                provinces={provinces}
                selectedProvince={selectedProvince}
                setSelected={setSelectedCity}
                selectedCity={selectedCity}
                barangays={barangays}
            />
        </AuthenticatedLayout >
    );

}

const Provinces = ({ provinces, selectedProvince, setSelectedProvince }: { provinces: any, selectedProvince: number, setSelectedProvince: CallableFunction }) => {

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
            name: "AKLAN",
            code: 604,
        },
        {
            id: 2,
            name: "ANTIQUE",
            code: 606,
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
        <div className="my-12">
            <div className="grid grid-cols-4 gap-4 mt-5">
                {provincesData?.map((province: any, key: number) => (
                    <>
                        <button
                            className={`${selectedProvince == province?.code ? 'bg-blue-400 text-white' : 'bg-none text-slate-500 border border-solid border-slate-300'} w-full  text-lg rounded-lg shadow p-2 uppercase hover:bg-blue-400 hover:text-white font-bold`}
                            onClick={() => setSelectedProvince(province?.code)}
                        >
                            {province?.name}
                        </button >
                    </>
                ))}
            </div>
        </div >
    )
}

const Cities = ({ cities, provinces, selectedProvince, selectedCity, setSelected, barangays }
    : { cities: object[], provinces: any, selectedProvince: number, selectedCity: number, setSelected: CallableFunction, barangays: object[]; }) => {

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

    console.log(activePage);

    return (
        <div className="shadow my-6">
            <div className="border border-solid border-slate-200 rounded-t">
                <div className="px-10 py-2 flex justify-between place-items-center">
                    <div className="flex gap-10">
                        <h6 className="">
                            Province: <b>{getProvince(selectedProvince)}
                            </b>
                        </h6>

                        <h6 className="">
                            Municipality : <b>{cities
                                ?.filter((item: any) => item?.province_code == selectedProvince)
                                ?.length}
                            </b>
                        </h6>

                        <h6 className="">
                            Barangay : <b>{barangays
                                ?.filter((item: any) => item?.city_code == selectedCity)
                                ?.length}
                            </b>
                        </h6>
                    </div>

                    <select
                        className="py-1 rounded border-slate-400 shadow-sm text-sm"
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        {cities
                            ?.filter((item: any) => item?.province_code == selectedProvince)
                            ?.map((city: any, key: number) => (
                                <option value={city.city_code}>
                                    {getCity(parseInt(city.city_code))}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

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
        </div >
    )
}
