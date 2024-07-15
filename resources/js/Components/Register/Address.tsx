import barangays from '@/utils/data/barangays';
import cities from '@/utils/data/cities';
import provinces from '@/utils/data/provinces';
import regions from '@/utils/data/regions';
import React, { useState } from 'react'
import { Globe } from 'react-bootstrap-icons';

const Address = ({ data, setData }: { data: any; setData: CallableFunction }) => {
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    return (
        <><div className="mb-4">
            <label className="mb-3 block text-black dark:text-white">
                Select Region
            </label>

            <div className="relative">
                <div className="relative">
                    <div className="relative z-20 bg-white dark:bg-form-input">
                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                            <Globe className='text-slate-600' />
                        </span>

                        <select
                            value={data.region_code}
                            onChange={(e) => setData('region_code', parseInt(e.target.value))}
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
            </div>
        </div>

            <div className="mb-4">
                <label className="mb-3 block text-black dark:text-white">
                    Select Province
                </label>
                <div className="relative">
                    <div className="relative z-20 bg-white dark:bg-form-input">
                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                            <Globe className='text-slate-600' />
                        </span>

                        <select
                            value={data.province_code}
                            onChange={(e) => setData('province_code', parseInt(e.target.value))}
                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                                }`}
                        >
                            <option value="" className="text-body dark:text-bodydark" key={1}>
                                Select province
                            </option>
                            {Object.entries(provinces)?.map((province) => province[1])
                                ?.filter((province) => parseInt(province.region_code) == data.region_code)
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

            <div className="mb-4">
                <label className="mb-3 block text-black dark:text-white">
                    Select City/Municipality
                </label>
                <div className="relative">
                    <div className="relative z-20 bg-white dark:bg-form-input">
                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                            <Globe className='text-slate-600' />
                        </span>
                        <select
                            value={data.city_code}
                            onChange={(e) => setData('city_code', parseInt(e.target.value))}
                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                                }`}
                        >
                            <option value="" className="text-body dark:text-bodydark" key={1}>
                                Select City / Municipalities
                            </option>
                            {Object.entries(cities)
                                ?.map((city) => city[1])
                                ?.filter((city) => parseInt(city.province_code) === data.province_code)
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
            </div>

            <div className="mb-6">
                <label className="mb-3 block text-black dark:text-white">
                    Select Barangay
                </label>
                <div className="relative">
                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                        <Globe className='text-slate-600' />
                    </span>
                    <select
                        value={data.barangay_code}
                        onChange={(e) => setData('barangay_code', parseInt(e.target.value))}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                            }`}
                    >
                        <option value="" className="text-body dark:text-bodydark" key={1}>
                            Select Barangay
                        </option>
                        {Object.entries(barangays)
                            ?.map((barangay) => barangay[1])
                            ?.filter((barangay) => parseInt(barangay.city_code) === data.city_code)
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
        </>
    )
}

export default Address