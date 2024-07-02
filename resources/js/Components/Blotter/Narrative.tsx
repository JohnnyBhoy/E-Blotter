import React from 'react';

type Data = {
    id: number;
    value: string;
}

const Narrative = ({ data, setData }: { data: any; setData: CallableFunction }) => {

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">
            <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-amber">
                <h3 className="font-medium text-black dark:text-white text-center">
                    Narrative of Incident
                </h3>
            </div>
            <div className="lg:flex lg:gap-5.5 p-2 w-full space-y-6 lg:space-y-0">
                <div className="w-full">
                    <textarea
                        value={data.narrative}
                        onChange={(e) => setData('narrative', e.target.value)}
                        rows={5}
                        className='w-full rounded border border-gray-400'
                        placeholder="(Detail the narrative of the incident or event, answering the WHO, WHAT, WHERE, WHY and HOW of reporting either in English or common dialect)"
                        required
                    />
                </div>
                {/** End work address */}
            </div>
            {/** End complainant Address */}
        </div>
    )
}

export default Narrative