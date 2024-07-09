import incidentTypes from "@/utils/data/incidentTypes";
import React from 'react';
import Select from 'react-select';

const BrfForm = ({ data, setData }: { data: any; setData: CallableFunction }) => {
    const handleIncidentChange = (selectedOption: any) => {
        const a = selectedOption.map((e: any) => e.id);

        setData("incident_type", a.join(","));
    }

    console.log(data.time_of_report);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-2 px-6.5 dark:border-strokedark bg-amber">
                <h3 className="font-medium text-black dark:text-white text-center">
                    Barangay e-Record Form (BRF)
                </h3>
            </div>

            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="lg:w-1/2 w-full">
                    <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                        Entry Number *
                    </label>
                    <input
                        value={data?.entry_number}
                        type="number"
                        onChange={(e) => setData('entry_number', e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="lg:w-3/4 w-full">
                    <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                        Barangay *
                    </label>
                    <input
                        value={data?.barangay}
                        type="text"
                        onChange={(e) => setData('barangay', e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="lg:w-1/2 w-full">
                    <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                        Date Reported *
                    </label>
                    <input
                        value={data?.date_reported}
                        type="date"
                        onChange={(e) => setData('date_reported', e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="lg:w-1/2 w-full">
                    <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                        Time of Report *
                    </label>
                    <input
                        value={data?.time_of_report}
                        type="time"
                        onChange={(e) => setData('time_of_report', e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="w-full z-50">
                    <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem] z-50">
                        Incident Type *
                    </label>
                    <Select
                        onChange={(e: any) => handleIncidentChange(e)}
                        isMulti
                        id="productServices"
                        name="productServices"
                        options={incidentTypes}
                        className="basic-multi-select rounded text-xs"
                        classNamePrefix="select"
                    />
                </div>
            </div>
        </div>
    )
}

export default BrfForm