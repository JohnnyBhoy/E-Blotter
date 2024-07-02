import React from 'react';
import FormInput from '../FormInput';

type Data = {
    id: number;
    value: string;
}

const Authentication = ({ data, setData }: { data: any; setData: CallableFunction }) => {

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
            <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-amber">
                <h3 className="font-medium text-black dark:text-white text-center">
                    Authentication
                </h3>
            </div>
            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title="complainant_signature"
                        data={data?.complainant_signature}
                        setData={setData}
                        type="file"
                        placeholder=""
                        label="Signature of Complainant/Reporting Person *"
                    />
                </div>
                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title="recorded_by"
                        data={data?.recorded_by}
                        setData={setData}
                        type="text"
                        placeholder=""
                        label="Recorded by (Full Name) *"
                    />
                </div>
                <div className="lg:w-1/2 w-full">
                    <FormInput
                        title="recorded_by_signature"
                        data={data?.recorded_by_signature}
                        setData={setData}
                        type="file"
                        placeholder=""
                        label="Signature of Recorder"
                    />
                </div>
                {/** End work address */}
            </div>
            {/** End complainant Address */}
        </div>
    )
}

export default Authentication