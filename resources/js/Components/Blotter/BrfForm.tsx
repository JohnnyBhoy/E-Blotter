import incidentTypes from "@/utils/data/incidentTypes";
import React from 'react';
import Select from 'react-select';
import Swal from "sweetalert2";

const BrfForm = ({ data, setData }: { data: any; setData: CallableFunction }) => {
    const handleIncidentChange = (selectedOption: any) => {
        const a = selectedOption.map((e: any) => e.id);

        setData("incident_type", a.join(","));
    }

    const handleAddIncident = async () => {
        const { value: incident } = await Swal.fire({
            title: "Enter New Incident Type",
            input: "text",
            inputLabel: "Type of offense/incident",
            inputPlaceholder: "Enter new incident"
        });
        if (incident) {
            incidentTypes.push({ id: incident, value: incident, label: incident });
            Swal.fire("Saved!", "", "success");;
        }
    }

    console.log(data.incident_type);

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
                    <div className="flex justify-between w-full">
                        <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem] z-50">
                            Incident Type *
                        </label>

                        <button onClick={handleAddIncident} className="text-xs bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-3xl dark:bg-transparent  absolute text-end mt-[-.8rem] ml-[14rem] z-50">
                            Other (Specify)
                        </button>
                    </div>

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