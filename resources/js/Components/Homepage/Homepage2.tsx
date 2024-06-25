import React from 'react'
import { ArrowDown, BarChart, BarChartFill } from 'react-bootstrap-icons'

const Homepage2 = () => {
    return (
        <>
            <div className='flex justify-center'>
                <h6 className='font-bold text-slate-500 animate-pulse'>See what you can do with E-Blotter</h6>
                <ArrowDown className='animate-bounce m-1' />
            </div>
            <div className="lg:flex lg:justify-between p-12 gap-6 mt-24">
                <div className="px-24">
                    <img
                        src="/images/homepage/data_accuracy.jpg"
                        className="h-[30rem] w-[300rem] rounded"
                        alt="image_1"
                    />
                </div>
                <div className="px-24 space-y-6 mt-16">
                    <h1 className="text-4xl font-semibold mt-10  flex gap-2">
                        Improved Crime Data Accuracy
                        <BarChart size={48} color="blue" />
                    </h1>
                    <h6 className='text-xl text-slate-500'>
                        Enhancements made to the precision, reliability, and thoroughness of information collected and reported about criminal activities within a given jurisdiction or dataset. This typically involves better methodologies, technology, and processes to ensure that crime statistics more accurately reflect the true nature and extent of criminal incidents.
                    </h6>
                </div>
            </div>
        </>

    )
}

export default Homepage2