import React from 'react';

type Data = {
    id: number;
    value: string;
}

const Authentication = ({ data, setData }: { data: any; setData: CallableFunction }) => {

    return (
        <div className="animate-slideinright rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4 w-full">
            <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-white">
                <h3 className="font-medium dark:text-white text-center">
                    Authentication
                </h3>
            </div>
            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="w-full">
                    <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                        Recorded by (Full Name) *
                    </label>
                    <input
                        value={data?.recorded_by}
                        type="text"
                        onChange={(e) => setData('recorded_by', e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                {/* <div className="lg:w-1/2 w-full">
                    <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                        Signature of Recorder
                    </label>
                    <input
                        value={data?.recorded_by_signature}
                        type="file"
                        onChange={(e) => setData('recorded_by_signature', e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div> */}
                {/** End work address */}
            </div>
            {/** End complainant Address */}
        </div>
    )
}

export default Authentication