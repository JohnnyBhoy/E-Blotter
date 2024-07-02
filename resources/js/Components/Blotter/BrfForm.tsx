import incidentTypes from "@/utils/data/incidentTypes";
import React from 'react';
import FormInput from '../FormInput';

const BrfForm = ({ data, setData }: { data: any; setData: CallableFunction }) => {

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-2 px-6.5 dark:border-strokedark bg-amber">
                <h3 className="font-medium text-black dark:text-white text-center">
                    Barangay e-Record Form (BRF)
                </h3>
            </div>
            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title="entry_number"
                        data={data?.entry_number}
                        setData={setData}
                        type="number"
                        placeholder=""
                        label="Entry Number *"
                    />
                </div>

                <div className="lg:w-3/4 w-full">
                    <FormInput
                        title="barangay"
                        data={data?.barangay}
                        setData={setData}
                        type="text"
                        placeholder=""
                        label="Name of Barangay *"
                    />
                </div>

                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title="date_reported"
                        data={data?.date_reported}
                        setData={setData}
                        type="date"
                        placeholder=""
                        label="Date Reported *"
                    />
                </div>

                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title="time_of_report"
                        data={data?.time_of_report}
                        setData={setData}
                        type="time"
                        placeholder=""
                        label="Time of Report *"
                    />
                </div>

                <div className="w-full">
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Incident Type *
                    </label>
                    <select
                        value={data.incident_type}
                        onChange={(e) => setData("incident_type", parseInt(e.target.value))}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent text-sm py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="" key={0}>Select incident type</option>
                        {incidentTypes?.map((incident: any) => (
                            <option
                                value={parseInt(incident.id)} className="text-body dark:text-bodydark"
                                key={incident.id}
                            >
                                {incident.value}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default BrfForm