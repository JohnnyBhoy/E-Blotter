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
        <div className="animate-fadeinup rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4">

            <div className="border-b border-stroke py-2 rounded-t-lg px-6.5 dark:border-strokedark  dark:bg-boxdark bg-amber text-white">
                <h3 className="font-medium text-white dark:text-white">
                    Narrative of Incident
                </h3>
            </div>
            <Editor
                value={data.narrative}
                onChange={onChange}
                className='h-28 text-sm'
                containerProps={{ style: { resize: 'vertical', height: '20rem' } }} />
            {/** End complainant Address */}
        </div>
    )
}

export default Narrative