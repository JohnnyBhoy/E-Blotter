import React from 'react';

type Data = {
    id: number;
    value: string;
}

const CaseDisposition = ({ data, setData }: { data: any; setData: CallableFunction }) => {

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
            <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-amber">
                <h3 className="font-medium text-black dark:text-white text-center">
                    Case Disposition
                </h3>
            </div>
            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="w-full">
                    <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                        Remarks/Actions of the Case/Complaint *
                    </label>
                    <input
                        value={data.remarks}
                        onChange={(e) => setData('remarks', e.target.value)}
                        type="text"
                        className='w-full rounded border border-gray-400'
                        placeholder=""
                        required
                    />
                </div>
                {/** End work address */}
            </div>
            {/** End complainant Address */}
        </div>
    )
}

export default CaseDisposition