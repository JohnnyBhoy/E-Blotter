import incidentTypes from '@/utils/data/incidentTypes'
import React from 'react'
import { FileBarGraph } from 'react-bootstrap-icons'

const IncidentType = () => {
    return (
        <>
            <label htmlFor="incidentType" className='absolute ml-5 mt-3'>
                <FileBarGraph />
            </label>
            <select
                name=""
                value=""
                onChange={() => { }}
                className="relative z-20 w-full appearance-none rounded-3xl shadow-sm border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-sm"
            >
                <option value="" className="text-body dark:text-bodydark" key={0}>
                    Incident Type
                </option>
                {Object.entries(incidentTypes)?.map((incident) => incident[1])?.map((incident: any) => (
                    <option value={parseInt(incident?.id)} className="text-body dark:text-bodydark" key={incident.id}>
                        {incident?.value}
                    </option>
                ))}
            </select>
        </>
    )
}

export default IncidentType