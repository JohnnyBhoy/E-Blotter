import React from 'react';
import Editor from 'react-simple-wysiwyg';

type Data = {
    id: number;
    value: string;
}

const Narrative = ({ data, setData }: { data: any; setData: CallableFunction }) => {

    function onChange(e: any) {
        setData('narrative', e.target.value);
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">

            <div className="border-b border-stroke py-2  px-6.5 dark:border-strokedark bg-amber">
                <h3 className="font-medium text-black dark:text-white text-center">
                    Narrative of Incident
                </h3>
            </div>
            <Editor
                value={data.narrative}
                onChange={onChange}
                className='h-40'
                containerProps={{ style: { resize: 'vertical', height: '20rem' } }} />
            {/** End complainant Address */}
        </div>
    )
}

export default Narrative