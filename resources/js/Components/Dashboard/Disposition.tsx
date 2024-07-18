import disposition from '@/utils/data/disposition'
import incidentTypes from '@/utils/data/incidentTypes'
import React from 'react'
import { Folder } from 'react-bootstrap-icons'

const Disposition = () => {
    return (
        <>
            <label htmlFor="incidentType" className='absolute ml-[25rem] mt-3'>
                <Folder />
            </label>
            <select
                name=""
                value=""
                onChange={() => { }}
                className="relative z-20 w-full appearance-none shadow-sm rounded-3xl border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
            >
                <option value="" className="text-body dark:text-bodydark" key={0}>
                    Disposition
                </option>
                {Object.entries(disposition)?.map((disp) => disp[1])?.map((disp: any) => (
                    <option value={parseInt(disp?.id)} className="text-body dark:text-bodydark" key={disp.id}>
                        {disp?.value}
                    </option>
                ))}
            </select>
        </>
    )
}

export default Disposition