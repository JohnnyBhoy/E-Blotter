import CardDataStats from "@/Components/CardDataStats";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { PageProps } from "@/Pages/types";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getCity from "@/utils/functions/getCity";
import getProvince from "@/utils/functions/getProvince";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { ArrowDown, BookHalf, BuildingDash, BuildingFillGear, BuildingGear, Buildings, BuildingUp, BuildingX } from "react-bootstrap-icons";

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

            <Provinces provinces={provinces} />

            <Cities
                cities={cities}
                provinces={provinces}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
            />

            <Barangays
                barangays={barangays}
                cities={cities}
                setSelected={setSelectedCity}
                selectedCity={selectedCity}
            />
        </AuthenticatedLayout >
    );

}

const Provinces = ({ provinces }: { provinces: any }) => {

    // Handle redirect to cities page by province Id
    const redirectToCitiesOfProvince = (provinceID: number) => {
        router.visit('/admin-cities', {
            data: {
                province_id: provinceID,
            },
        });
    }

    return (
        <div className="shadow my-6">
            <div className="border border-solid border-slate-200 rounded-t">
                <div className="px-10 py-2 flex justify-between place-items-center">
                    <h6 className="font-bold">{provinces?.length} Provinces</h6>
                    <select className="py-1 rounded border-slate-400 ">
                        <option value="">Region VI</option>
                    </select>
                </div>
            </div>
            {provinces?.map((province: any, key: number) => (
                <>
                    <div className="border border-solid border-slate-200 rounded-b">
                        <div className="px-10 py-2 flex justify-between place-items-center">
                            <div className="flex gap-3">
                                <Buildings color="blue" size={24} />
                                <h6>Province of {getProvince(province.province_code)}</h6>
                            </div>
                            <button
                                className="py-2 px-5 rounded-lg bg-primary hover:bg-blue-900 text-white"
                                onClick={() => redirectToCitiesOfProvince(province.province_code)}>
                                Manage
                            </button>
                        </div>
                    </div>
                </>
            ))}
        </div>
    )
}

const Cities = ({ cities, provinces, selectedProvince, setSelectedProvince }
    : { cities: object[], provinces: any, selectedProvince: number, setSelectedProvince: CallableFunction }) => {

    // Local states
    const [limitCity, setLimitCity] = useState<number>(10);

    // Handle redirect to barangay page by city code
    const redirectToBarangaysOfCity = (cityId: number) => {
        router.visit('/admin-barangays', {
            data: {
                city_id: cityId,
            },
        });
    }

    return (
        <div className="shadow my-6">
            <div className="border border-solid border-slate-200 rounded-t">
                <div className="px-10 py-2 flex justify-between place-items-center">
                    <h6 className="font-bold">{cities?.length} Cities</h6>
                    <select
                        className="py-1 rounded border-slate-400 shadow-sm"
                        onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                        {provinces?.map((province: any, key: number) => (
                            <option value={province.province_code}>Province of {getProvince(parseInt(province.province_code))}</option>
                        ))}
                    </select>
                </div>
            </div>
            {cities
                ?.filter((item: any) => item?.province_code == selectedProvince)
                ?.slice(0, limitCity)
                .map((city: any, key: number) => (
                    <>
                        <div className="border border-solid border-slate-200 rounded-b">
                            <div className="px-10 py-2 flex justify-between place-items-center">
                                <div className="flex gap-3">
                                    <BuildingUp color="blue" size={24} />
                                    <h6>Municipality of {getCity(city.city_code)}</h6>
                                </div>
                                <button
                                    className="py-2 px-5 rounded-lg bg-primary hover:bg-blue-900 text-white"
                                    onClick={() => redirectToBarangaysOfCity(city.city_code)}>
                                    Manage
                                </button>
                            </div>
                        </div>
                    </>
                ))}

            <div className="border border-slate-300 p-3 flex justify-end gap-x-1">
                <ArrowDown className="mt-1 animate-bounce" />

                <button onClick={() => setLimitCity(limitCity + 10)}>
                    See More
                </button>
            </div>
        </div>
    )
}


const Barangays = ({ barangays, cities, selectedCity, setSelected }
    : { barangays: object[]; cities: any, selectedCity: number, setSelected: CallableFunction }) => {
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
        <div className="shadow my-6">
            <div className="border border-solid border-slate-200 rounded-t">
                <div className="px-10 py-2 flex justify-between place-items-center">
                    <h6 className="font-bold">
                        {barangays?.filter((item: any) => item?.city_code == selectedCity).length} Barangays
                    </h6>
                    <select
                        className="py-1 rounded border-slate-400 shadow-sm"
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        {cities?.map((city: any, key: number) => (
                            <option value={city.city_code}>Municipality of {getCity(parseInt(city.city_code))}</option>
                        ))}
                    </select>
                </div>
            </div>
            {barangays
                ?.filter((item: any) => item?.city_code == selectedCity)
                ?.slice(0, limitBarangay)
                ?.map((barangay: any, key: number) => (
                    <>
                        <div className="border border-solid border-slate-200 rounded-b" key={key}>
                            <div className="px-10 py-2 flex justify-between place-items-center">
                                <div className="flex gap-3">
                                    <BuildingGear color="blue" size={24} />
                                    <h6>Barangay {getBarangayByBrgyCode(parseInt(barangay.barangay_code))}</h6>
                                </div>
                                <button
                                    className="py-2 px-5 rounded-lg bg-primary hover:bg-blue-900 text-white"
                                    onClick={() => redirectToBlotters(barangay.barangay_code)}
                                >
                                    Manage
                                </button>
                            </div>
                        </div>
                    </>
                ))}

            <div className="border border-slate-300 p-3 flex justify-end gap-x-1">
                <ArrowDown className="mt-1 animate-bounce" />

                <button onClick={() => setLimitBarangay(limitBarangay + 10)}>
                    See More
                </button>
            </div>
        </div>
    )
}
