import { Globe } from 'react-bootstrap-icons';
import React from 'react';
import FormInput from '../FormInput';
import citizenships from "@/utils/data/citizenships";
import genders from "@/utils/data/genders";
import civilStatus from "@/utils/data/civilStatus";
import occupations from '@/utils/data/occupations';
import educations from '@/utils/data/educations';
import regions from '@/utils/data/regions';
import provinces from '@/utils/data/provinces';
import cities from '@/utils/data/cities';
import barangays from '@/utils/data/barangays';

type Data = {
    id: number;
    value: string;
}

const PersonInvolveData = ({ data, setData, person }: { data: any; setData: CallableFunction; person: string }) => {

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
            <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-amber">
                <h3 className="font-medium text-black dark:text-white text-center">
                    {person === 'Complainant'
                        ? 'A - Reporting Person (Victim`s Data)'
                        : 'B - Person Complain of/ Suspect Data'}
                </h3>
            </div>
            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title={person === 'Complainant' ? "complainant_family_name" : "respondent_family_name"}
                        data={person === 'Complainant' ? data.complainant_family_name : data.respondent_family_name}
                        setData={setData}
                        type="text"
                        placeholder=""
                        label="Family Name *"
                    />
                </div>

                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title={person === 'Complainant' ? "complainant_first_name" : "respondent_first_name"}
                        data={person === 'Complainant' ? data.complainant_first_name : data.respondent_first_name}
                        setData={setData}
                        type="text"
                        placeholder=""
                        label="First Name *"
                    />
                </div>

                <div className="lg:w-1/2 w-full">
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Middle Name *
                    </label>
                    <FormInput
                        title={person === 'Complainant' ? "complainant_middle_name" : "respondent_middle_name"}
                        data={person === 'Complainant' ? data.complainant_middle_name : data.respondent_middle_name}
                        setData={setData}
                        type="text"
                        placeholder=""
                        label=""
                    />
                </div>

                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title={person === 'Complainant' ? "complainant_birth_date" : "respondent_birth_date"}
                        data={person === 'Complainant' ? data.complainant_birth_date : data.respondent_birth_date}
                        setData={setData}
                        type="date"
                        placeholder=""
                        label="Birth Date *"
                    />
                </div>

                <div className="w-full">
                    <FormInput
                        title={person === 'Complainant' ? "complainant_place_of_birth" : "respondent_place_of_birth"}
                        data={person === 'Complainant' ? data.complainant_place_of_birth : data.respondent_place_of_birth}
                        setData={setData}
                        type="text"
                        placeholder=""
                        label="Place of Birth *"
                    />
                </div>
            </div>

            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="lg:w-1/2 w-full">
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Citizenship *
                    </label>
                    <select
                        value={person === 'Complainant' ? data.complainant_citizenship : data.respondent_citizenship}
                        onChange={(e) => setData(person === 'Complainant' ? "complainant_citizenship" : "respondent_citizenship", parseInt(e.target.value)
                        )}
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
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Sex / Gender *
                    </label>
                    <select
                        value={person === 'Complainant' ? data.complainant_gender : data.respondent_gender}
                        onChange={(e) => setData(person === 'Complainant' ? "complainant_gender" : "respondent_gender", parseInt(e.target.value)
                        )}
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
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Civil Status *
                    </label>
                    <select
                        value={person === 'Complainant' ? data.complainant_civil_status : data.respondent_civil_status}
                        onChange={(e) => setData(person === 'Complainant' ? "complainant_civil_status" : "respondent_civil_status", parseInt(e.target.value)
                        )}
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
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Occupation *
                    </label>
                    <select
                        value={person === 'Complainant' ? data.complainant_occupation : data.respondent_occupation}
                        onChange={(e) => setData(person === 'Complainant' ? "complainant_occupation" : "respondent_occupation", parseInt(e.target.value)
                        )}
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
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Highest Educational Attainment *
                    </label>
                    <select
                        value={person === 'Complainant' ? data.complainant_education : data.respondent_education}
                        onChange={(e) => setData(person === 'Complainant' ? "complainant_education" : "respondent_education", parseInt(e.target.value)
                        )}
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
                        title={person === 'Complainant' ? "complainant_email_address" : "respondent_email_address"}
                        data={person === 'Complainant' ? data.complainant_email_address : data.respondent_email_address}
                        setData={setData}
                        type="email"
                        placeholder="Optional"
                        label="Email Address"
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
                            title={person === 'Complainant' ? "complainant_street" : "respondent_street"}
                            data={person === 'Complainant' ? data.complainant_street : data.respondent_street}
                            setData={setData}
                            type="text"
                            placeholder=""
                            label="House no/Street *"
                        />
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <FormInput
                            title={person === 'Complainant' ? "complainant_village" : "respondent_village"}
                            data={person === 'Complainant' ? data.complainant_village : data.respondent_village}
                            setData={setData}
                            type="text"
                            placeholder=""
                            label="Village/Sitio *"
                        />
                    </div>

                    <div className="w-full">
                        <div className="relative z-20 bg-white dark:bg-form-input">
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                Region *
                            </label>
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <Globe className='text-slate-600' />
                            </span>

                            <select
                                value={person === 'Complainant' ? data.complainant_region : data.respondent_region}
                                onChange={(e) => setData(person === 'Complainant' ? "complainant_region" : "respondent_region", parseInt(e.target.value)
                                )}
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
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                Province *
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                                <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                    <Globe className='text-slate-600' />
                                </span>

                                <select
                                    value={person === 'Complainant' ? data.complainant_province : data.respondent_province}
                                    onChange={(e) => setData(person === 'Complainant' ? "complainant_province" : "respondent_province", parseInt(e.target.value)
                                    )}
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                >
                                    <option value="" className="text-body dark:text-bodydark" key={1}>
                                        Select Province
                                    </option>
                                    {Object.entries(provinces)?.map((province) => province[1])
                                        ?.filter((province) => parseInt(province.region_code) == (person === 'Complainant' ? data.complainant_region : data.respondent_region))
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
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                City *
                            </label>
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <Globe className='text-slate-600' />
                            </span>
                            <select
                                value={person === 'Complainant' ? data.complainant_city : data.respondent_city}
                                onChange={(e) => setData(person === 'Complainant' ? "complainant_city" : "respondent_city", parseInt(e.target.value)
                                )}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                            >
                                <option value="" className="text-body dark:text-bodydark" key={1}>
                                    Select City
                                </option>
                                {Object.entries(cities)
                                    ?.map((city) => city[1])
                                    ?.filter((city) => parseInt(city.province_code) === (person === 'Complainant' ? data.complainant_province : data.respondent_province))
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
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                Barangay *
                            </label>
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <Globe className='text-slate-600' />
                            </span>
                            <select
                                value={person === 'Complainant' ? data.complainant_barangay : data.respondent_barangay}
                                onChange={(e) => setData(person === 'Complainant' ? "complainant_barangay" : "respondent_barangay", parseInt(e.target.value)
                                )}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                            >
                                <option value="" className="text-body dark:text-bodydark" key={1}>
                                    Select Barangay
                                </option>
                                {Object.entries(barangays)
                                    ?.map((barangay) => barangay[1])
                                    ?.filter((barangay) => parseInt(barangay.city_code) === (person === 'Complainant' ? data.complainant_city : data.respondent_city))
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
                    <h3 className="font-medium text-black text-center dark:text-white">
                        Work Address
                    </h3>
                </div>
                <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                    <div className="lg:w-1/2 w-full">
                        <FormInput
                            title={person === 'Complainant' ? "complainant_work_street" : "respondent_work_street"}
                            data={person === 'Complainant' ? data.complainant_work_street : data.respondent_work_street}
                            setData={setData}
                            type="text"
                            placeholder=""
                            label="House no/Street *"
                        />
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <FormInput
                            title={person === 'Complainant' ? "complainant_work_village" : "respondent_work_village"}
                            data={person === 'Complainant' ? data.complainant_work_village : data.respondent_work_village}
                            setData={setData}
                            type="text"
                            placeholder=""
                            label="Village/Sitio *"
                        />
                    </div>

                    <div className="w-full">
                        <div className="relative z-20 bg-white dark:bg-form-input">
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                Region *
                            </label>
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <Globe className='text-slate-600' />
                            </span>

                            <select
                                value={person === 'Complainant' ? data.complainant_work_region : data.respondent_work_region}
                                onChange={(e) => setData(person === 'Complainant' ? "complainant_work_region" : "respondent_work_region", parseInt(e.target.value)
                                )}
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
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                Province *
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                                <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                    <Globe className='text-slate-600' />
                                </span>

                                <select
                                    value={person === 'Complainant' ? data.complainant_work_province : data.respondent_work_province}
                                    onChange={(e) => setData(person === 'Complainant' ? "complainant_work_province" : "respondent_work_province", parseInt(e.target.value)
                                    )}
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                                >
                                    <option value="" className="text-body dark:text-bodydark" key={1}>
                                        Select Province
                                    </option>
                                    {Object.entries(provinces)?.map((province) => province[1])
                                        ?.filter((province) => parseInt(province.region_code) == (person === 'Complainant' ? data.complainant_work_region : data.respondent_work_region))
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
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                City *
                            </label>
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <Globe className='text-slate-600' />
                            </span>
                            <select
                                value={person === 'Complainant' ? data.complainant_work_city : data.respondent_work_city}
                                onChange={(e) => setData(person === 'Complainant' ? "complainant_work_city" : "respondent_work_city", parseInt(e.target.value)
                                )}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                            >
                                <option value="" className="text-body dark:text-bodydark" key={1}>
                                    Select City
                                </option>
                                {Object.entries(cities)
                                    ?.map((city) => city[1])
                                    ?.filter((city) => parseInt(city.province_code) === (person === 'Complainant' ? data.complainant_work_province : data.respondent_work_province))
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
                            <label className="z-40 text-xs bg-white absolute ml-3 mt-[-.4rem]">
                                Barangay *
                            </label>
                            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <Globe className='text-slate-600' />
                            </span>
                            <select
                                value={person === 'Complainant' ? data.complainant_work_barangay : data.respondent_work_barangay}
                                onChange={(e) => setData(person === 'Complainant' ? "complainant_work_barangay" : "respondent_work_barangay", parseInt(e.target.value)
                                )}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
                            >
                                <option value="" className="text-body dark:text-bodydark" key={1}>
                                    Select Barangay
                                </option>
                                {Object.entries(barangays)
                                    ?.map((barangay) => barangay[1])
                                    ?.filter((barangay) => parseInt(barangay.city_code) === (person === 'Complainant' ? data.complainant_work_city : data.respondent_work_city))
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
            </div>
            {/** End complainant Address */}
        </div>
    )
}

export default PersonInvolveData