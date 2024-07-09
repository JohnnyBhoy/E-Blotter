import { useLoginRegisterStore } from "@/utils/store/loginRegisterStore";
import React from "react";
import { FolderSymlinkFill, Person } from "react-bootstrap-icons";

const HeroHeader = () => {
    const { setShowLogin, setShowRegister } = useLoginRegisterStore();

    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
                    <div className="mr-auto place-self-center lg:col-span-7 space-y-16">
                        <h3 className="max-w-2xl mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl xl:text-5xl dark:text-white">
                            Harmonization of Barangay Crime Incidents
                            <br /> via Barangay e-Blotter
                        </h3>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                            Store, create, update and submit your blotter
                            reports online and realtime to your nearest PNP
                            Station to solve and response to your needed actions
                            everywhere via desktop, laptop, tablet or mobile to
                            help prevent crimes and incidents in your barangay.
                        </p>
                        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            >
                                <Person className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />{" "}
                                Sign in
                            </button>
                            <button
                                onClick={() => setShowRegister(true)}
                                className="inline-flex items-center justify-center w-full px-5 py-3 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                                <FolderSymlinkFill className="w-4 h-4 mr-2" />{" "}
                                Create account
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <img
                            //src="./images/hero.png"
                            src="./images/homepage/homepage_image_1.png"
                            alt="hero image"
                        />
                    </div>
                </div>
            </section>
            {/** End block **/}
            {/** Start block **/}
            <section className="bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-16">
                    <div className="grid grid-cols-2 gap-2 text-gray-500 sm:gap-12 sm:grid-cols-3 lg:grid-cols-6 dark:text-gray-400">
                        <a
                            href="#"
                            className="flex items-center lg:justify-center"
                        >
                            <img
                                src="/images/region_6_provinces/ilo-ilo.png"
                                alt="ilo-ilo"
                            />
                        </a>
                        <a
                            href="#"
                            className="flex items-center lg:justify-center"
                        >
                            <img
                                src="/images/region_6_provinces/aklan.png"
                                alt="ilo-ilo"
                            />
                        </a>
                        <a
                            href="#"
                            className="flex items-center lg:justify-center"
                        >
                            <img
                                src="/images/region_6_provinces/antique.png"
                                alt="ilo-ilo"
                            />
                        </a>
                        <a
                            href="#"
                            className="flex items-center lg:justify-center"
                        >
                            <img
                                src="/images/region_6_provinces/negros.png"
                                alt="ilo-ilo"
                            />
                        </a>
                        <a
                            href="#"
                            className="flex items-center lg:justify-center"
                        >
                            <img
                                src="/images/region_6_provinces/capiz.png"
                                alt="ilo-ilo"
                            />
                        </a>
                        <a
                            href="#"
                            className="flex items-center lg:justify-center  animate-slideinright"
                        >
                            <img
                                src="/images/region_6_provinces/guimaras.png"
                                alt="ilo-ilo"
                            />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroHeader