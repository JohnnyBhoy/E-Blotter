import React from 'react'
import { Calendar2 } from 'react-bootstrap-icons'

const Submitted = () => {
    return (
        <>
            <label htmlFor="incidentType" className='absolute ml-[50rem] mt-3'>
                <Calendar2 />
            </label>
            <select
                name=""
                value=""
                onChange={() => { }}
                className="relative z-20 w-full shadow-sm appearance-none rounded-3xl border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
            >
                <option value="" className="text-body dark:text-bodydark" key={0}>
                    Submitted
                </option>
                <option className="text-body dark:text-bodydark" value="0">Newly submitted</option>
                <option className="text-body dark:text-bodydark" value="6">1 week ago</option>
                <option className="text-body dark:text-bodydark" value="30">1 month ago</option>
                <option className="text-body dark:text-bodydark" value="91">3 months ago</option>
                <option className="text-body dark:text-bodydark" value="183">6 months ago</option>
                <option className="text-body dark:text-bodydark" value="365">This year</option>
                <option className="text-body dark:text-bodydark" value="730">Last year</option>
            </select>
        </>
    )
}

export default Submitted