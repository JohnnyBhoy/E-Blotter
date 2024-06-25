import React from 'react'
import { Clock } from 'react-bootstrap-icons'

const Homepage4 = () => {
    return (
        <div className="flex justify-between px-12 gap-12 mt-24">
            <div className="p-12">
                <img
                    src="/images/homepage/timely_intervention.jpg"
                    className="h-[30rem] w-[200rem] rounded"
                    alt="image_3"
                />
            </div>
            <div className="px-24 mt-16">
                <h1 className="text-4xl font-semibold mt-10 flex gap-4">
                    Timely Intervention and Response
                    <Clock size={48} color="blue" />
                </h1>
                <h6 className='text-xl mt-12 text-slate-500'>
                    Swift and proactive actions taken in response to emerging situations or issues, aimed at addressing them promptly to minimize potential negative outcomes. This approach emphasizes the importance of quick and effective intervention to prevent escalation or harm, often involving coordinated efforts from relevant authorities or organizations.
                </h6>
            </div>
        </div>
    )
}

export default Homepage4