import React from 'react'

const Engaegement = () => {
    return (
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
            <img
                className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex h-[25rem]"
                src="./images/homepage/community_engagement.webp"
                alt="feature  2"
            />
            <div className="text-gray-500 sm:text-lg dark:text-gray-400">
                <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    4. Community Engagement and Empowerment
                </h2>
                <p className="mb-8 font-light lg:text-xl">
                    The system fosters community engagement and empowerment by making the e-Blotter system accessible via mobile phones through web and mobile browsers. This encourages residents to take ownership of community safety and collaborate with authorities and counterpart agencies in responding to emergencies and calamities. When residents see their reports being acted upon, they are more likely to:
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
                            Engage in prevention efforts and collaborate with authorities
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
                            Encourage other community groups to assist as additional force multipliers for local agencies
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
                            Enhance overall community safety
                        </span>
                    </li>

                </ul>
                <p className="font-light lg:text-xl">
                    Strengthen your barangay's safety by submitting concise and accurate data, guiding future incident responses.
                </p>
            </div>
        </div>
    )
}

export default Engaegement