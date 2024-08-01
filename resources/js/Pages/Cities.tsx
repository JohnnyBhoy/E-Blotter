import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import getCity from "@/utils/functions/getCity";
import getProvince from "@/utils/functions/getProvince";
import { Head, Link, router } from "@inertiajs/react";
import React from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { PageProps } from "./types";

type Cities = {
    cityCode: number;
    provinceCode: number;
    noOfBarangays: number;
    noOfBlotters: number;

}[]

type City = {
    cityCode: number;
    provinceCode: number;
    noOfBarangays: number;
    noOfBlotters: number;
};

const Cities = ({ auth, cities }: PageProps<{ cities: Cities }>) => {

    // Handle redirect to barangay page by city code
    const redirectToBarangaysOfCity = (cityId: number) => {
        router.visit('/admin-barangays', {
            data: {
                city_id: cityId,
            },
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex justify-between px-2 pb-2">
                <div className="flex gap-12">
                    <Link
                        href="/admin-dashboard"
                        className="flex gap-2 hover:font-bold"
                    >
                        <ArrowLeft className="mt-2 animate-bounce" />
                        back
                    </Link>

                </div>

                <div className="flex gap-12">
                    <h1 className="text-black dark:text-white">
                        Province : <b>{getProvince(cities[0].provinceCode)}</b>
                    </h1>
                    <h1 className="text-black dark:text-white">
                        No of Cities : <b>{cities?.length}</b>
                    </h1>
                </div>

            </div>


            {/**Table */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1 mt-2">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full z-20 border border-[#eee]">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4 ">
                                <th className="border border-[#eee] min-w-[120px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11">
                                    Id
                                </th>
                                <th className="border border-[#eee] min-w-[150px] py-3 px-2 xl:pl-11 font-medium text-black dark:text-white">
                                    Municipality
                                </th>
                                <th className="border border-[#eee] min-w-[120px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11">
                                    No. Of Barangay
                                </th>
                                <th className="border border-[#eee] min-w-[120px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11">
                                    No. of Blotters
                                </th>
                                <th className="border border-[#eee] min-w-[120px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities?.map((city: City, key: number) => (
                                <tr key={key} className="hover:bg-slate-100 cursor-pointer z-20 bg-white dark:bg-meta-4">
                                    <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="text-black dark:text-white">
                                            {city?.cityCode}
                                        </h5>
                                    </td>
                                    <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="text-black dark:text-white text-start">
                                            {getCity(city?.cityCode)}
                                        </h5>
                                    </td>
                                    <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="text-black dark:text-white">
                                            {city?.noOfBarangays}
                                        </h5>
                                    </td>
                                    <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="text-black dark:text-white">
                                            {city?.noOfBlotters}
                                        </h5>
                                    </td>
                                    <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                        <button
                                            className="bg-primary hover:bg-blue-900 text-white rounded px-5 py-1"
                                            onClick={() => redirectToBarangaysOfCity(city.cityCode)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    )

}

export default Cities