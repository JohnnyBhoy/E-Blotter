import disposition from '@/utils/data/disposition';
import React from 'react';
import Swal from 'sweetalert2';

type Data = {
    id: number;
    value: string;
}

const CaseDisposition = ({ data, setData }: { data: any; setData: CallableFunction }) => {
    const handleAddDisposition = async () => {
        const { value: caseValue } = await Swal.fire({
            title: "Enter New Case Disposition",
            input: "text",
            inputLabel: "Type of case disposition",
            inputPlaceholder: "Enter new disposition"
        });
        if (caseValue) {
            disposition.push({ id: caseValue, value: caseValue });
            setData('remarks', caseValue);
            Swal.fire("Saved!", "", "success");;
        }
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4 w-full">
            <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-amber flex justify-between">
                <h3 className="font-medium text-black dark:text-white text-center">
                    Case Disposition
                </h3>
                <button onClick={handleAddDisposition} className="text-xs bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-3xl dark:bg-transparent text-end">
                    Other (Specify)
                </button>
            </div>
            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="w-full">
                    <label className="text-xs dark:bg-transparent bg-white absolute ml-3 mt-[-.4rem]">
                        Remarks/Action of the Case Complaint
                    </label>
                    <select
                        name="remarks"
                        value={data.remarks}
                        onChange={(e) => setData('remarks', e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-sm"
                    >
                        <option value="" key={0}>Select Disposition</option>
                        {disposition?.map((item: any) => (
                            <option value={item.id}>{item.value}</option>
                        ))}
                    </select>
                </div>
                {/** End work address */}
            </div>
            {/** End complainant Address */}
        </div >
    )
}

export default CaseDisposition