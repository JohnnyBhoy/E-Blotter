import React from 'react'
import { Power, Sun } from 'react-bootstrap-icons'

const Homepage5 = () => {
    return (
        <div className="flex justify-between px-12 gap-12 mt-24">
            <div className="px-24">
                <h1 className="text-4xl font-semibold mt-10 flex gap-4 animate-bounce">
                    Community Engagement and Empowerment
                    <Sun size={48} color="blue" />
                </h1>
                <h6 className='text-xl mt-6 text-slate-500'>
                    Involves actively involving community members in decision-making processes, initiatives, and activities that affect their lives. It aims to foster a sense of ownership, responsibility, and partnership within the community, empowering individuals and groups to contribute to and shape their own social, economic, and environmental development. This process often includes facilitating communication, collaboration, and capacity-building to address local needs and priorities effectively.
                </h6>
            </div>
            <div className="px-24">
                <img
                    src="/images/homepage/community_engagement.webp"
                    className="h-[30rem] w-[200rem] rounded animate-pulse"
                    alt="image_3"
                />
            </div>
        </div>
    )
}

export default Homepage5