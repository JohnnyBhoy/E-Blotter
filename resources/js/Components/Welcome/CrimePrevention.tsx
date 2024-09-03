import React from 'react'

const CrimePrevention = () => {
    return (
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
            <img
                className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex h-[25rem]"
                src="./images/homepage/crime_prevention.jpg"
                alt="feature 2"
            />
            <div className="text-gray-500 sm:text-lg dark:text-gray-400">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    2. Enhanced Incident Prevention Efforts
                </h2>
                <p className="mb-8 font-light lg:text-xl">
                    Harmonizing barangay incident records enhances prevention by providing law enforcement, disaster response agencies, and other relevant bodies with granular data on incidents at the community level. This data allows for the identification of emerging trends, vulnerabilities, and critical circumstances, leading to:
                </p>
                {/** List **/}
                <ul
                    className="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700"
                >
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
                            Targeted and effective prevention initiatives and programs
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
                            Addressing specific community needs and concerns
                        </span>
                    </li>

                </ul>
                <p className="font-light lg:text-xl">
                    Ensure the safety of your barangay by submitting accurate data to the nearest station, facilitating appropriate actions for future incidents.
                </p>
            </div>
        </div>
    )
}

export default CrimePrevention