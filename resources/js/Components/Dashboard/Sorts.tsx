import React from 'react'
import IncidentType from './IncidentType'
import Disposition from './Disposition'
import Submitted from './Submitted'

const Sorts = () => {
    return (
        <div className="lg:flex gap-4 mt-5">
            <IncidentType />
            <Disposition />
            <Submitted />
        </div>
    )
}

export default Sorts