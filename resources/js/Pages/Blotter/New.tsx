import { PageProps } from "@/Pages/types";
import { qualifiers } from "@/utils/data/qualifiers";
import { Head, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar3, Globe } from "react-bootstrap-icons";

import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import barangays from "@/utils/data/barangays";
import cities from "@/utils/data/cities";
import { civilStatus } from "@/utils/data/civilStatus";
import { genders } from "@/utils/data/genders";
import provinces from "@/utils/data/provinces";
import regions from "@/utils/data/regions";

export default function New({ auth }: PageProps) {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
    const [person, setPerson] = useState<string>("Complainant");

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        complainant_first_name: "",
        complainant_middle_name: "",
        complainant_last_name: "",
        complainant_qualifier: 0,
        complainant_room: "",
        complainant_lot: "",
        complainant_block: "",
        complainant_purok: "",
        complainant_barangay_code: 0,
        complainant_city_code: 0,
        complainant_province_code: 0,
        complainant_region_code: 0,
        complainant_gender: 1,
        complainant_birth_date: "",
        complainant_status: 1,
        complainant_phone_number: 0,
        respondent_first_name: "",
        respondent_middle_name: "",
        respondent_last_name: "",
        respondent_qualifier: 0,
        respondent_room: "",
        respondent_lot: "",
        respondent_block: "",
        respondent_purok: "",
        respondent_barangay_code: 0,
        respondent_city_code: 0,
        respondent_province_code: 0,
        respondent_region_code: 0,
        respondent_gender: 1,
        respondent_birth_date: "",
        respondent_status: 1,
        respondent_phone_number: 0,
    });

    console.log(data);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Blotter
                </h2>
            }
        >
            <Head title="Barangay Blotter" />
            <Breadcrumb pageName={person} />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-4">

                    {/* <!- Contacts --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Full Name
                            </h3>
                        </div>
                        <div className="lg:flex lg:gap-5.5 p-6.5 w-full space-y-6 lg:space-y-0">
                            <div className="w-full">
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_first_name" : "respondent_first_name"}
                                    data={person === 'Complainant' ? data.complainant_first_name : data.respondent_first_name}
                                    setData={setData}
                                    type="text"
                                    placeholder="First Name"
                                />
                            </div>

                            <div className="w-full">
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_middle_name" : "respondent_middle_name"}
                                    data={person === 'Complainant' ? data.complainant_middle_name : data.respondent_middle_name}
                                    setData={setData}
                                    type="text"
                                    placeholder="Middle Name"
                                />
                            </div>

                            <div className="w-full">
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_last_name" : "respondent_last_name"}
                                    data={person === 'Complainant' ? data.complainant_last_name : data.respondent_last_name}
                                    setData={setData}
                                    type="text"
                                    placeholder="Last Name"
                                />
                            </div>

                            <div className="w-full">
                                <select
                                    value={person === 'Complainant' ? data.complainant_qualifier : data.respondent_qualifier}
                                    onChange={(e) => {
                                        setData(person === 'Complainant' ? "complainant_qualifier" : "respondent_qualifier", parseInt(e.target.value))
                                        changeTextColor();
                                    }}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="" className="text-body dark:text-bodydark w-full" key="10">
                                        Qualifier
                                    </option>
                                    <option value="" className="text-body dark:text-bodydark" key="11">
                                        N/A
                                    </option>
                                    {qualifiers?.map((qualifier: any) => (
                                        <option
                                            value={parseInt(qualifier.id)} className="text-body dark:text-bodydark"
                                            key={qualifier.id}
                                        >
                                            {qualifier.qualifier}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="lg:flex gap-5.5 px-6.5 w-full pb-6 space-y-6 lg:space-y-0">
                            <div className="w-full">
                                <select
                                    value={person === 'Complainant' ? data.complainant_gender : data.respondent_gender}
                                    onChange={(e) => {
                                        setData(person === 'Complainant' ? "complainant_gender" : "respondent_gender", parseInt(e.target.value))
                                        changeTextColor();
                                    }}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    {genders?.map((gender: any) => (
                                        <option
                                            value={parseInt(gender.id)} className="text-body dark:text-bodydark"
                                            key={gender.id}
                                        >
                                            {gender.value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full">
                                <select
                                    value={person === 'Complainant' ? data.complainant_status : data.respondent_status}
                                    onChange={(e) => {
                                        setData(person === 'Complainant' ? "complainant_status" : "respondent_status", parseInt(e.target.value))
                                        changeTextColor();
                                    }}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    {civilStatus?.map((status: any) => (
                                        <option
                                            value={parseInt(status.id)} className="text-body dark:text-bodydark"
                                            key={status.id}
                                        >
                                            {status.status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full">
                                <div className="relative">
                                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                        Date of birth
                                    </label>
                                    <input
                                        value={person === 'Complainant' ? data.complainant_birth_date : data.respondent_birth_date}
                                        onChange={(e) => setData(person === 'Complainant' ? "complainant_birth_date" : "respondent_birth_date", e.target.value
                                        )}
                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        placeholder="mm/dd/yyyy"
                                        data-class="flatpickr-right"
                                    />

                                    <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                                        <Calendar3 />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                    Phone number
                                </label>
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_phone_number" : "respondent_phone_number"}
                                    data={person === 'Complainant' ? data.complainant_phone_number : data.respondent_phone_number}
                                    setData={setData}
                                    type="number"
                                    placeholder="Phone number"
                                />
                            </div>

                        </div>

                    </div>
                    {/** End Contacts */}

                    {/* <!-- Complainant Address --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke p-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Address
                            </h3>
                        </div>
                        <div className="lg:flex gap-5.5 p-6.5 w-full space-y-6 lg:space-y-0">
                            <div className="w-full">
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_room" : "respondent_room"}
                                    data={person === 'Complainant' ? data.complainant_room : data.respondent_room}
                                    setData={setData}
                                    type="text"
                                    placeholder="Room no."
                                />
                            </div>

                            <div className="w-full">
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_lot" : "respondent_lot"}
                                    data={person === 'Complainant' ? data.complainant_lot : data.respondent_lot}
                                    setData={setData}
                                    type="text"
                                    placeholder="Lot no."
                                />
                            </div>

                            <div className="w-full">
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_block" : "respondent_block"}
                                    data={person === 'Complainant' ? data.complainant_block : data.respondent_block}
                                    setData={setData}
                                    type="text"
                                    placeholder="Block no."
                                />
                            </div>

                            <div className="w-full">
                                <FormInput
                                    title={person === 'Complainant' ? "complainant_purok" : "respondent_purok"}
                                    data={person === 'Complainant' ? data.complainant_purok : data.respondent_purok}
                                    setData={setData}
                                    type="text"
                                    placeholder="Purok / Village"
                                />
                            </div>

                        </div>

                        <div className="lg:flex gap-5.5 px-6.5 w-full pb-6 space-y-6 lg:space-y-0">
                            <div className="w-full">
                                <div className="relative z-20 bg-white dark:bg-form-input">
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>

                                    <select
                                        value={person === 'Complainant' ? data.complainant_region_code : data.respondent_region_code}
                                        onChange={(e) => setData(person === 'Complainant' ? "complainant_region_code" : "respondent_region_code", parseInt(e.target.value)
                                        )}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                                            }`}
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={1}>
                                            Select region
                                        </option>
                                        {Object.entries(regions)?.map((region) => region[1])?.map((region: any) => (
                                            <option value={parseInt(region?.region_code)} className="text-body dark:text-bodydark" key={region.id}>
                                                {region?.region_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="relative">
                                    <div className="relative z-20 bg-white dark:bg-form-input">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <Globe className='text-slate-600' />
                                        </span>

                                        <select
                                            value={person === 'Complainant' ? data.complainant_province_code : data.respondent_province_code}
                                            onChange={(e) => setData(person === 'Complainant' ? "complainant_province_code" : "respondent_province_code", parseInt(e.target.value)
                                            )}
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                                                }`}
                                        >
                                            <option value="" className="text-body dark:text-bodydark" key={1}>
                                                Select province
                                            </option>
                                            {Object.entries(provinces)?.map((province) => province[1])
                                                ?.filter((province) => parseInt(province.region_code) == data.complainant_region_code)
                                                ?.map((province: any) => (
                                                    <option
                                                        value={parseInt(province?.province_code)}
                                                        className="text-body dark:text-bodydark"
                                                        key={province.id}>
                                                        {province?.province_name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="relative z-20 bg-white dark:bg-form-input">
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>
                                    <select
                                        value={person === 'Complainant' ? data.complainant_city_code : data.respondent_city_code}
                                        onChange={(e) => setData(person === 'Complainant' ? "complainant_city_code" : "respondent_city_code", parseInt(e.target.value)
                                        )}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                                            }`}
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={1}>
                                            Select City / Municipalities
                                        </option>
                                        {Object.entries(cities)
                                            ?.map((city) => city[1])
                                            ?.filter((city) => parseInt(city.province_code) === data.complainant_province_code)
                                            ?.map((city: any) => (
                                                <option
                                                    value={parseInt(city?.city_code)}
                                                    className="text-body dark:text-bodydark"
                                                    key={city.id}>
                                                    {city?.city_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="relative">
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>
                                    <select
                                        value={person === 'Complainant' ? data.complainant_barangay_code : data.respondent_barangay_code}
                                        onChange={(e) => setData(person === 'Complainant' ? "complainant_barangay_code" : "respondent_barangay_code", parseInt(e.target.value)
                                        )}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                                            }`}
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={1}>
                                            Select Barangay
                                        </option>
                                        {Object.entries(barangays)
                                            ?.map((barangay) => barangay[1])
                                            ?.filter((barangay) => parseInt(barangay.city_code) === data.complainant_city_code)
                                            ?.map((barangay: any) => (
                                                <option
                                                    value={parseInt(barangay?.brgy_code)}
                                                    className="text-body dark:text-bodydark"
                                                    key={barangay.id}>
                                                    {barangay?.brgy_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** End complainant Address */}

                    {/* Next to respondent */}
                    <div className="grid place-items-end">
                        <button
                            className="bg-blue-500  hover:bg-blue-700 text-white px-5 py-2 rounded flex gap-2"
                            onClick={person === 'Complainant'
                                ? () => setPerson('Respondent')
                                : () => setPerson('Complainant')}>

                            {person === 'Complainant'
                                ? <>
                                    Next
                                    <ArrowRight className="m-1 hover:font-bold" />
                                </>
                                : <>
                                    <ArrowLeft className="m-1 hover:font-bold" />
                                    Back
                                </>}
                        </button>
                    </div>
                    {/* End Next to respondent */}
                </div>
            </div>
        </AuthenticatedLayout>
    );

}


const FormInput = ({ data, setData, title, placeholder, type }: { data: any, setData: CallableFunction, title: string, placeholder: string; type: string }) => {
    return (
        <input
            value={data}
            type={type}
            onChange={(e) => setData(title, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
    )
}