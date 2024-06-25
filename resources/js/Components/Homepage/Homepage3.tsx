import React from 'react'
import { GraphUpArrow } from 'react-bootstrap-icons'

const Homepage3 = () => {
    return (
        <div className="flex justify-between px-12 gap-12 mt-24">
            <div className="px-24">
                <h1 className="text-4xl font-semibold mt-10 flex gap-4">
                    Enhanced Crime Prevention Efforts
                    <GraphUpArrow size={48} color="blue" />
                </h1>
                <h6 className='text-xl mt-12 text-slate-500'>
                    Encompass strategies, initiatives, and actions aimed at improving the effectiveness and efficiency of preventing criminal activities within a community or organization. This includes implementing advanced technologies, community engagement programs, targeted law enforcement activities, and proactive measures to reduce the occurrence of crime and enhance overall public safety.
                </h6>
            </div>
            <div className="px-24">
                <img
                    src="/images/homepage/crime_prevention.jpg"
                    className="h-[30rem] w-[300rem] rounded "
                    alt="image_3"
                />
            </div>
        </div>
    )
}

export default Homepage3