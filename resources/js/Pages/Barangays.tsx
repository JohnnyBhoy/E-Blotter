import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import { PageProps } from "./types";
import getProvince from "@/utils/functions/getProvince";
import getCity from "@/utils/functions/getCity";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import { ArrowDown, ArrowLeft } from "react-bootstrap-icons";


type Barangays = {
    barangayCode: number;
    cityCode: number;
    provinceCode: number;
    noOfBarangays: number;
    noOfBlotters: number;

}[]

type Barangay = {
    barangayCode: number;
    cityCode: number;
    provinceCode: number;
    noOfBarangays: number;
    noOfBlotters: number;
};

const Barangays = ({ auth, barangays }: PageProps<{ barangays: Barangays }>) => {
    // Local states
    const [limitBarangay, setLimitBarangay] = useState<number>(10);

    // Handle redirect to blotters page by barangay code
    const redirectToBlotters = (code: number) => {
        router.visit('/blotter/admin-blotters', {
            data: {
                brgy_code: code,
            },
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Barangays
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex justify-between px-2 pb-2">
                <Link
                    href="/admin-dashboard"
                    className="flex gap-2 hover:font-bold"
                >
                    <ArrowLeft className="mt-2 animate-bounce" />
                    back
                </Link>

                <div className="flex gap-10">
                    <h1 className="text-black dark:text-white">
                        City : <b>{getCity(barangays[0].cityCode)}</b>
                    </h1>

                    <h1 className="text-black dark:text-white">
                        Province : <b>{getProvince(barangays[0].provinceCode)}</b>
                    </h1>

                    <h1 className="text-black dark:text-white">
                        No of Barangays : <b>{barangays?.length}</b>
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
                                    Barangay
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
                            {barangays
                                ?.slice(0, limitBarangay)
                                ?.map((barangay: Barangay, key: number) => (
                                    <tr key={key} className="hover:bg-slate-100 cursor-pointer z-20 bg-white dark:bg-meta-4">
                                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="text-black dark:text-white">
                                                {barangay?.barangayCode}
                                            </h5>
                                        </td>
                                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="text-black dark:text-white text-start">
                                                {getBarangayByBrgyCode(barangay?.barangayCode)}
                                            </h5>
                                        </td>
                                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="text-black dark:text-white">
                                                {barangay?.noOfBlotters}
                                            </h5>
                                        </td>
                                        <td className="border border-[#eee] dark:border-white py-1.5 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                            <button
                                                className="bg-primary hover:bg-blue-900 text-white px-5 py-1 rounded-lg"
                                                onClick={() => redirectToBlotters(barangay.barangayCode)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="p-3 flex justify-end gap-x-1">
                        <ArrowDown className="mt-1 animate-bounce" />

                        <button onClick={() => setLimitBarangay(limitBarangay + 10)}>
                            See More
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    )
}

export default Barangays