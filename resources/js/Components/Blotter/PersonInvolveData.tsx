import barangays from '@/utils/data/barangays';
import cities from '@/utils/data/cities';
import citizenships from "@/utils/data/citizenships";
import civilStatus from "@/utils/data/civilStatus";
import educations from '@/utils/data/educations';
import genders from "@/utils/data/genders";
import occupations from '@/utils/data/occupations';
import provinces from '@/utils/data/provinces';
import regions from '@/utils/data/regions';
import React, { useState } from 'react';
import { Globe } from 'react-bootstrap-icons';
import FormInput from '../FormInput';
import Swal from 'sweetalert2';

type Data = {
    id: number;
    value: string;
}

const PersonInvolveData = ({ data, setData, person }: { data: any; setData: CallableFunction; person: string }) => {

    const complainant_info = {
        complainant_family_name: "",
        complainant_first_name: "",
        complainant_middle_name: "",
        complainant_birth_date: "",
        complainant_place_of_birth: "",
        complainant_citizenship: 1,
        complainant_gender: 1,
        complainant_civil_status: 1,
        complainant_occupation: 1,
        complainant_education: 1,
        complainant_email_address: "",
        complainant_street: "",
        complainant_village: "",
        complainant_barangay: 0,
        complainant_city: 0,
        complainant_province: 0,
        complainant_region: 0,
        complainant_work_street: "",
        complainant_work_village: "",
        complainant_work_barangay: 0,
        complainant_work_city: 0,
        complainant_work_province: 0,
        complainant_work_region: 0,
    };

    const respondent_info = {
        respondent_family_name: "",
        respondent_first_name: "",
        respondent_middle_name: "",
        respondent_birth_date: "",
        respondent_place_of_birth: "",
        respondent_citizenship: 1,
        respondent_gender: 1,
        respondent_civil_status: 1,
        respondent_occupation: 1,
        respondent_education: 1,
        respondent_email_address: "",
        respondent_street: "",
        respondent_village: "",
        respondent_barangay: 0,
        respondent_city: 0,
        respondent_province: 0,
        respondent_region: 0,
        respondent_work_street: "",
        respondent_work_village: "",
        respondent_work_barangay: 0,
        respondent_work_city: 0,
        respondent_work_province: 0,
        respondent_work_region: 0,
    };

    const handleAddOccupation = async () => {
        const { value: occupation } = await Swal.fire({
            title: "Enter New Occupation",
            input: "text",
            inputLabel: "Type of Job/Occupation",
            inputPlaceholder: "Enter new occupation"
        });
        if (occupation) {
            occupations.push({ id: occupation, value: occupation });
            setData('occupation', occupation);
            Swal.fire("Saved!", "", "success");
        }
    }

    const handleSetData = (e: any, index: number) => {
        const newData = person === 'Complainant'
            ? { ...data.complainant_data[index], [e.target.name]: e.target.value }
            : { ...data.respondent_data[index], [e.target.name]: e.target.value };

        setData(person === 'Complainant'
            ? 'complainant_data'
            : 'respondent_data',
            person === 'Complainant'
                ? data.complainant_data.map((item: any, i: number) =>
                    i == index ? item = newData : item
                )
                : data.respondent_data?.map((item: any, i: number) =>
                    i == index ? item = newData : item
                )
        )
    }

    const handleSameHomeAddress = (i: number) => {
        // debugger;

        const workStreet = person === 'Complainant'
            ? {
                ...data.complainant_data[i],
                'complainant_work_street': data.complainant_data[i].complainant_street,
                'complainant_work_village': data.complainant_data[i].complainant_village,
                'complainant_work_barangay': data.complainant_data[i].complainant_barangay,
                'complainant_work_city': data.complainant_data[i].complainant_city,
                'complainant_work_province': data.complainant_data[i].complainant_province,
                'complainant_work_region': data.complainant_data[i].complainant_region,
            }
            : {
                ...data.respondent_data[i],
                'respondent_work_street': data.respondent_street,
                'respondent_work_village': data.respondent_village,
                'respondent_work_barangay': data.respondent_barangay,
                'respondent_work_city': data.respondent_city,
                'respondent_work_province': data.respondent_province,
                'respondent_work_region': data.respondent_region,
            }

        return setData(person === 'Complainant'
            ? 'complainant_data'
            : 'respondent_data',
            person === 'Complainant'
                ? data.complainant_data?.map((item: any, index: number) =>
                    index == i ? item = workStreet : item
                )
                : data.respondent_data?.map((item: any, index: number) =>
                    index == i ? item = workStreet : item
                )
        )
    }

    const [complainants, setComplainants] = useState<number[]>([1]);
    const [respondents, setRespondents] = useState<number[]>([1]);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">

            {complainants?.map((count, i) => (
                <>
                    <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-amber flex justify-between"
                        key={i}>
                        <h3 className="font-medium text-black dark:text-white">
                            {person === 'Complainant'
                                ? `A - Reporting Person (Victim's Data No. ${count})`
                                : `B - Person Complain of/ Suspect Data No. ${count}`
                            }
                        </h3>

                        <div className="flex gap-3">
                            {count === complainants?.length
                                ? <>
                                    <button
                                        className="font-medium text-black dark:text-white bg-white hover:bg-slate-300 text-xs rounded-3xl px-3 text-blue-700"
                                        onClick={() => {
                                            setComplainants([...complainants, count + 1]);
                                            setData(person === 'Complainant' ? 'complainant_data' : 'respondent_data',
                                                person === 'Complainant'
                                                    ? [...data.complainant_data, complainant_info]
                                                    : [...data.respondent_data, respondent_info]
                                            )
                                        }}>
                                        + Add {person}
                                    </button>

                                    {count != 1
                                        ? <button
                                            className="font-medium text-black dark:text-white bg-white  hover:bg-slate-300 text-xs rounded-3xl px-3 text-red-700"
                                            onClick={() => {
                                                setComplainants(complainants.slice(0, -1));
                                                setData('complainant_data', data.complainant_data.slice(0, -1));
                                            }}>
                                            - Remove
                                        </button>
                                        : null
                                    }
                                </>
                                : ''}
                        </div>

                    </div>

                    <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                        <div className="lg:w-1/2 w-full">
                            <FormInput
                                label="Family Name *"
                                type="text"
                                name={person === 'Complainant'
                                    ? "complainant_family_name"
                                    : "respondent_family_name"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_family_name
                                    : data.respondent_data[i]?.respondent_family_name}
                                onChange={(e) => handleSetData(e, i)}
                            />
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <FormInput
                                label="First Name *"
                                type="text"
                                name={person === 'Complainant'
                                    ? "complainant_first_name"
                                    : "respondent_first_name"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_first_name
                                    : data.respondent_data[i]?.respondent_first_name}
                                onChange={(e) => handleSetData(e, i)}
                            />
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <FormInput
                                label="Middle Name *"
                                type="text"
                                name={person === 'Complainant'
                                    ? "complainant_middle_name"
                                    : "respondent_middle_name"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_middle_name
                                    : data.respondent_data[i]?.respondent_middle_name}
                                onChange={(e) => handleSetData(e, i)}
                            />
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <FormInput
                                label="Birth Date *"
                                type="date"
                                name={person === 'Complainant'
                                    ? "complainant_birth_date"
                                    : "respondent_birth_date"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_birth_date
                                    : data.respondent_data[i]?.respondent_birth_date}
                                onChange={(e) => handleSetData(e, i)}
                            />
                        </div>

                        <div className="w-full">
                            <FormInput
                                label="Place of Birth *"
                                type="text"
                                name={person === 'Complainant'
                                    ? "complainant_place_of_birth"
                                    : "respondent_place_of_birth"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_place_of_birth
                                    : data.respondent_data[i]?.respondent_place_of_birth}
                                onChange={(e) => handleSetData(e, i)}
                            />
                        </div>
                    </div>

                    <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                        <div className="lg:w-1/2 w-full">
                            <label className="text-xs bg-white dark:bg-transparent  absolute ml-3 mt-[-.4rem]">
                                Citizenship *
                            </label>
                            <select
                                name={person === 'Complainant'
                                    ? "complainant_citizenship"
                                    : "respondent_citizenship"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_citizenship
                                    : data.respondent_data[i]?.respondent_citizenship}
                                onChange={(e) => handleSetData(e, i)}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm"
                            >
                                {citizenships?.map((citizenship: Data) => (
                                    <option
                                        value={citizenship.id} className="text-body dark:text-bodydark"
                                        key={citizenship.id}
                                    >
                                        {citizenship.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <label className="text-xs dark:bg-transparent  bg-white absolute ml-3 mt-[-.4rem]">
                                Sex / Gender *
                            </label>
                            <select
                                name={person === 'Complainant'
                                    ? "complainant_gender"
                                    : "respondent_gender"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_gender
                                    : data.respondent_data[i]?.respondent_gender}
                                onChange={(e) => handleSetData(e, i)}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm"
                            >
                                {genders?.map((gender: Data) => (
                                    <option
                                        value={gender.id} className="text-body dark:text-bodydark"
                                        key={gender.id}
                                    >
                                        {gender.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <label className="text-xs dark:bg-transparent  bg-white absolute ml-3 mt-[-.4rem]">
                                Civil Status *
                            </label>
                            <select
                                name={person === 'Complainant'
                                    ? "complainant_civil_status"
                                    : "respondent_civil_status"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_civil_status
                                    : data.respondent_data[i]?.respondent_civil_status}
                                onChange={(e) => handleSetData(e, i)}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm"
                            >
                                {civilStatus?.map((status: Data) => (
                                    <option
                                        value={status.id} className="text-body dark:text-bodydark"
                                        key={status.id}
                                    >
                                        {status.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full">
                            <div className="flex justify-between w-full ">

                                <label className="text-xs dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                                    Occupation *
                                </label>
                                <button onClick={handleAddOccupation} className="text-xs bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-3xl dark:bg-transparent  absolute text-end mt-[-.8rem] ml-[8rem] z-50">
                                    Other (Specify)
                                </button>
                            </div>
                            <select
                                name={person === 'Complainant'
                                    ? "complainant_occupation"
                                    : "respondent_occupation"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_occupation
                                    : data.respondent_data[i]?.respondent_occupation}
                                onChange={(e) => handleSetData(e, i)}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm"
                            >
                                <option value="" key={0}>Select Occupation</option>
                                {occupations?.map((occupation: Data) => (
                                    <option
                                        value={occupation.id} className="text-body dark:text-bodydark"
                                        key={occupation.id}
                                    >
                                        {occupation.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="text-xs dark:bg-transparent  bg-white absolute ml-3 mt-[-.4rem]">
                                Highest Educational Attainment *
                            </label>
                            <select
                                name={person === 'Complainant'
                                    ? "complainant_education"
                                    : "respondent_education"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_education
                                    : data.respondent_data[i]?.respondent_education}
                                onChange={(e) => handleSetData(e, i)}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm"
                            >
                                <option value="" key={0}>Select Attainment</option>
                                {educations?.map((education: Data) => (
                                    <option
                                        value={education.id} className="text-body dark:text-bodydark"
                                        key={education.id}
                                    >
                                        {education.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full">
                            <FormInput
                                label="Email Address"
                                type="email"
                                name={person === 'Complainant'
                                    ? "complainant_email_address"
                                    : "respondent_email_address"}
                                value={person === 'Complainant'
                                    ? data.complainant_data[i]?.complainant_email_address
                                    : data.respondent_data[i]?.respondent_email_address}
                                onChange={(e) => handleSetData(e, i)}
                            />
                        </div>
                    </div>

                    {/* <!-- Complainant Address --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        {/** Home Address */}
                        <div className="border-b border-stroke py-2 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black text-center dark:text-white">
                                Home Address
                            </h3>
                        </div>
                        <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                            <div className="lg:w-1/2 w-full">
                                <FormInput
                                    label="House no/Street"
                                    type="text"
                                    name={person === 'Complainant' ? "complainant_street" : "respondent_street"}
                                    value={person === 'Complainant'
                                        ? data.complainant_data[i]?.complainant_street
                                        : data.respondent_data[i]?.respondent_street}
                                    onChange={(e) => handleSetData(e, i)}
                                />
                            </div>

                            <div className="lg:w-1/2 w-full">
                                <FormInput
                                    label="Village/Sitio *"
                                    type="text"
                                    name={person === 'Complainant' ? "complainant_village" : "respondent_village"}
                                    value={person === 'Complainant'
                                        ? data.complainant_data[i]?.complainant_village
                                        : data.respondent_data[i]?.respondent_village}
                                    onChange={(e) => handleSetData(e, i)}
                                />
                            </div>

                            <div className="w-full">
                                <div className="relative z-20 bg-white dark:bg-form-input">
                                    <label className="z-40 text-xs dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                                        Region *
                                    </label>
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>

                                    <select
                                        name={person === 'Complainant'
                                            ? "complainant_region"
                                            : "respondent_region"}
                                        value={person === 'Complainant'
                                            ? data.complainant_data[i]?.complainant_region
                                            : data.respondent_data[i]?.respondent_region}
                                        onChange={(e) => handleSetData(e, i)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={0}>
                                            Select Region
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
                                    <label className="z-40 text-xs  dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                                        Province *
                                    </label>
                                    <div className="relative z-20 bg-white dark:bg-form-input">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <Globe className='text-slate-600' />
                                        </span>

                                        <select
                                            name={person === 'Complainant'
                                                ? "complainant_province"
                                                : "respondent_province"}
                                            value={person === 'Complainant'
                                                ? data.complainant_data[i]?.complainant_province
                                                : data.respondent_data[i]?.respondent_province}
                                            onChange={(e) => handleSetData(e, i)}
                                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                        >
                                            <option value="" className="text-body dark:text-bodydark" key={0}>
                                                Select Province
                                            </option>
                                            {Object.entries(provinces)?.map((province) => province[1])
                                                ?.filter((province) => parseInt(province.region_code) == (person === 'Complainant'
                                                    ? data.complainant_data[i]?.complainant_region
                                                    : data.respondent_data[i]?.respondent_region))
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
                                <div className="relative z-20  bg-white dark:bg-form-input">
                                    <label className="z-40 text-xs bg-white  dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                                        City *
                                    </label>
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>
                                    <select
                                        name={person === 'Complainant'
                                            ? "complainant_city"
                                            : "respondent_city"}
                                        value={person === 'Complainant'
                                            ? data.complainant_data[i]?.complainant_city
                                            : data.respondent_data[i]?.respondent_city}
                                        onChange={(e) => handleSetData(e, i)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={0}>
                                            Select City
                                        </option>
                                        {Object.entries(cities)
                                            ?.map((city) => city[1])
                                            ?.filter((city) => parseInt(city.province_code) == (person === 'Complainant'
                                                ? data.complainant_data[i]?.complainant_province
                                                : data.respondent_data[i]?.respondent_province))
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
                                    <label className="z-40 text-xs  dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                                        Barangay *
                                    </label>
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>
                                    <select
                                        name={person === 'Complainant'
                                            ? "complainant_barangay"
                                            : "respondent_barangay"}
                                        value={person === 'Complainant'
                                            ? data.complainant_data[i]?.complainant_barangay
                                            : data.respondent_data[i]?.respondent_barangay}
                                        onChange={(e) => handleSetData(e, i)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={0}>
                                            Select Barangay
                                        </option>
                                        {Object.entries(barangays)
                                            ?.map((barangay) => barangay[1])
                                            ?.filter((barangay) => parseInt(barangay.city_code) == (person === 'Complainant'
                                                ? data.complainant_data[i]?.complainant_city
                                                : data.respondent_data[i]?.respondent_city))
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
                        {/** End Home Address */}

                        {/**Work Address */}
                        <div className="border-b border-stroke py-2 px-6.5 dark:border-strokedark">
                            <div className="flex justify-center gap-2">
                                <h3 className="font-medium text-black text-center dark:text-white">
                                    Work Address
                                </h3>
                                <button onClick={() => handleSameHomeAddress(i)} className="text-xs bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-3xl dark:bg-transparent">
                                    Same with home address
                                </button>
                            </div>
                        </div>
                        <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                            <div className="lg:w-1/2 w-full">
                                <FormInput
                                    label="House no./Street"
                                    type="text"
                                    name={person === 'Complainant' ? "complainant_work_street" : "respondent_work_street"}
                                    value={person === 'Complainant'
                                        ? data.complainant_data[i]?.complainant_work_street
                                        : data.respondent_data[i]?.respondent_work_street}
                                    onChange={(e) => handleSetData(e, i)}
                                />
                            </div>

                            <div className="lg:w-1/2 w-full">
                                <FormInput
                                    label="Village/Sitio *"
                                    type="text"
                                    name={person === 'Complainant' ? "complainant_work_village" : "respondent_work_village"}
                                    value={person === 'Complainant'
                                        ? data.complainant_data[i]?.complainant_work_village
                                        : data.respondent_data[i]?.respondent_work_village}
                                    onChange={(e) => handleSetData(e, i)}
                                />
                            </div>

                            <div className="w-full">
                                <div className="relative z-20 bg-white dark:bg-form-input">
                                    <label className="z-40 text-xs dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                                        Region *
                                    </label>
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>

                                    <select
                                        name={person === 'Complainant'
                                            ? "complainant_work_region"
                                            : "respondent_work_region"}
                                        value={person === 'Complainant'
                                            ? data.complainant_data[i]?.complainant_work_region
                                            : data.respondent_data[i]?.respondent_work_region}
                                        onChange={(e) => handleSetData(e, i)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={0}>
                                            Select Region
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
                                    <label className="z-40 text-xs dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                                        Province *
                                    </label>
                                    <div className="relative z-20 bg-white dark:bg-form-input">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <Globe className='text-slate-600' />
                                        </span>

                                        <select
                                            name={person === 'Complainant'
                                                ? "complainant_work_province"
                                                : "respondent_work_province"}
                                            value={person === 'Complainant'
                                                ? data.complainant_data[i]?.complainant_work_province
                                                : data.respondent_data[i]?.respondent_work_province}
                                            onChange={(e) => handleSetData(e, i)}
                                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                        >
                                            <option value="" className="text-body dark:text-bodydark" key={1}>
                                                Select Province
                                            </option>
                                            {Object.entries(provinces)?.map((province) => province[1])
                                                ?.filter((province) => parseInt(province.region_code) == (person === 'Complainant'
                                                    ? data.complainant_data[i]?.complainant_work_region
                                                    : data.respondent_data[i]?.respondent_work_region))
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
                                    <label className="z-40 text-xs dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                                        City *
                                    </label>
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>
                                    <select
                                        name={person === 'Complainant'
                                            ? "complainant_work_city"
                                            : "respondent_work_city"}
                                        value={person === 'Complainant'
                                            ? data.complainant_data[i]?.complainant_work_city
                                            : data.respondent_data[i]?.respondent_work_city}
                                        onChange={(e) => handleSetData(e, i)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={1}>
                                            Select City
                                        </option>
                                        {Object.entries(cities)
                                            ?.map((city) => city[1])
                                            ?.filter((city) => parseInt(city.province_code) == (person === 'Complainant'
                                                ? data.complainant_data[i]?.complainant_work_province
                                                : data.respondent_data[i]?.respondent_work_province))
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
                                    <label className="z-40 text-xs bg-white  dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                                        Barangay *
                                    </label>
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>
                                    <select
                                        name={person === 'Complainant'
                                            ? "complainant_work_barangay"
                                            : "respondent_work_barangay"}
                                        value={person === 'Complainant'
                                            ? data.complainant_data[i]?.complainant_work_barangay
                                            : data.respondent_data[i]?.respondent_work_barangay}
                                        onChange={(e) => handleSetData(e, i)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={1}>
                                            Select Barangay
                                        </option>
                                        {Object.entries(barangays)
                                            ?.map((barangay) => barangay[1])
                                            ?.filter((barangay) => parseInt(barangay.city_code) == (person === 'Complainant'
                                                ? data.complainant_data[i]?.complainant_work_city
                                                : data.respondent_data[i]?.respondent_work_city))
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
                        {/** End work address */}
                    </div >
                </>
            ))}
            {/** End complainant Address */}
        </div >
    )
}

export default PersonInvolveData