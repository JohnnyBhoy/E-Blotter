import React from 'react'
import { Heart } from 'react-bootstrap-icons'

const Homepage6 = () => {
    return (
        <div className="flex justify-between px-12 gap-12 mt-24">
            <div className="p-12">
                <img
                    src="/images/homepage/trust_and_build_confidence.webp"
                    className="h-[30rem] w-[300rem] rounded animate-pulse"
                    alt="image_3"
                />
            </div>
            <div className="px-24 mt-16">
                <h1 className=" text-4xl font-semibold mt-10 flex gap-4 animate-bounce">
                    Trust and Confidence Building
                    <Heart size={48} color="blue" />
                </h1>
                <h6 className='text-xl mt-6 text-slate-500'>
                    To deliberate efforts and strategies aimed at establishing and strengthening trust, credibility, and mutual reliance among individuals, groups, or organizations. It involves fostering transparent communication, demonstrating consistency and integrity in actions, and actively engaging in behaviors that promote reliability and accountability. This process is crucial in various contexts, including interpersonal relationships, community partnerships, organizational dynamics, and public institutions, to enhance cooperation, collaboration, and overall effectiveness.
                </h6>
            </div>
        </div>
    )
}

export default Homepage6