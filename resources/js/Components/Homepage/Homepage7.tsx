import React from 'react'
import { SearchHeart } from 'react-bootstrap-icons'

const Homepage7 = () => {
    return (
        <div className="flex justify-between px-12 gap-12 mt-24">
            <div className="px-24 mt-12">
                <h1 className="text-4xl font-semibold mt-10 flex gap-4 animate-bounce">
                    Evidence-Based Policy Making
                    <SearchHeart size={48} color="blue" />
                </h1>
                <h6 className='text-xl mt-6 text-slate-500'>
                    To the approach of using empirical evidence, research findings, and data analysis as the foundation for developing and implementing policies and decisions. This method emphasizes the importance of relying on credible and objective information to understand problems, assess potential solutions, and evaluate outcomes. By prioritizing evidence, policymakers aim to increase the effectiveness, efficiency, and impact of policies, ensuring they are grounded in reliable information rather than assumptions or ideologies alone.
                </h6>
            </div>
            <div className="px-12">
                <img
                    src="/images/homepage/evidence.webp"
                    className="h-[30rem] w-[200rem] rounded animate-pulse"
                    alt="image_3"
                />
            </div>
        </div>
    )
}

export default Homepage7