import React from 'react'

const CrimeDataAccuracy = () => {
    return (
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
            <div className="text-gray-500 sm:text-lg dark:text-gray-400 animate-fadeInLeft">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    1. Improved Incident Data Accuracy
                </h2>
                <p className="mb-8 font-light lg:text-xl">
                    Barangay incident records provide essential local-level data that contribute to a comprehensive understanding of various incidents and emergencies, including crime, fire, and natural disasters. These records, detailing time, location, hotspots, and other circumstances, are monitored and acted upon in coordination with the local PNP and other government agencies. This ensures proper intervention, prevention, and response in real time. Enhanced data accuracy enables government agencies to make informed decisions regarding:
                </p>
                {/** List **/}
                <ul className="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700">
                    <li className="flex space-x-3">
                        {/** Icon **/}
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">
                            Resource allocation
                        </span>
                    </li>
                    <li className="flex space-x-3">
                        {/** Icon **/}
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">
                            Time management
                        </span>
                    </li>
                    <li className="flex space-x-3">
                        {/** Icon **/}
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">
                            Incident prevention strategies
                        </span>
                    </li>
                </ul>
                <p className="mb-8 font-light lg:text-xl">
                    Your submitted blotter entries and reports will aid in data consistency across government agencies and contribute to overall incident management.
                </p>
            </div>
            <img
                className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex h-[25rem]"
                src="./images/homepage/data_accuracy.jpg"
                alt="dashboard feature"
            />
        </div>
    )
}

export default CrimeDataAccuracy