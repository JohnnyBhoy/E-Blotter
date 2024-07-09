import React from 'react'

const Evidence = () => {
    return (
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
            <div className="text-gray-500 sm:text-lg dark:text-gray-400">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    7. Evidence-Based Policy Making
                </h2>
                <p className="mb-8 font-light lg:text-xl">
                    Harmonized crime records serve as a valuable resource for policymakers and stakeholders involved in developing
                    crime prevention strategies and policies at the barangay, municipal, and city council levels. By analyzing trends and patterns in
                    crime data, decision-makers can make evidence-based decisions that address the root causes of crime and improve
                    community safety. This data-driven approach ensures that policies are effective, relevant, and responsive to the actual needs
                    of the community.
                </p>
                {/** List **/}
                <ul
                    role="list"
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
                            Prevent crime thru solid evidence
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
                            Clear submission of evidence
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
                            Database records and convenience incident solutions.
                        </span>
                    </li>
                </ul>
                <p className="mb-8 font-light lg:text-xl">
                    Your submitted blotter entries and report will
                    help PNP for the crime prevention and data consistency.
                </p>
            </div>
            <img
                className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex h-[25rem]"
                src="./images/homepage/evidence.jpg"
                alt="dashboard feature image"
            />
        </div>
    )
}

export default Evidence