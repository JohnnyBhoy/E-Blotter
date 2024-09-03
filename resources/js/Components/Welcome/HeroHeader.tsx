import { useLoginRegisterStore } from "@/utils/store/loginRegisterStore";
import React from "react";
import { ArrowDown, TelephoneFill } from "react-bootstrap-icons";

const HeroHeader = () => {
    const { setShowLogin, setShowRegister } = useLoginRegisterStore();

    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
                    <div className="mr-auto place-self-center lg:col-span-7 space-y-16">
                        <h3 className="max-w-2xl mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl xl:text-5xl dark:text-white">
                            Harmonization of <br /> Barangay Incidents
                            <br /> via Barangay e-Blotter
                        </h3>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                            Store, create, update and submit your complaint via Barangay e-Blotter system using a web and mobile browser-based application to harmonize barangay incident reports. This system is designed to facilitate the recording, tracking, and reporting of various incidents, including crime, fire, arson, calamities, disasters, traffic accidents, road crashes, and other incidents reported or transpired in the Barangay in real-time to your nearest Barangay, PNP Station via desktop, laptop, tablet or mobile phone to help prevent crimes and incidents in your barangay.
                        </p>
                        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => setShowRegister(true)}
                                className="text-slate-500 bg-slate-100 shadow hover:bg-slate-300 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800 border border-solid border-slate-300"
                            >
                                <div className="flex gap-2">
                                    <h6 className="lg:text-3xl text-xl text-green-600 animate-pulse lg:text-start text-center">ONLINE COMPLAINT </h6>
                                    <ArrowDown size={24} className="mt-2 animate-bounce" />
                                </div>

                                <h6 className="text-slate-600 dark:text-gray-400">Immediate Assistance Police, Fire Response, Rescue & Medical Emergency</h6>
                            </button>

                            <div className="space-y-2 flex flex-col">
                                <button
                                    className="text-slate-500 bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800 shadow border border-solid border-slate-300"
                                    onClick={() => setShowLogin(true)}
                                >
                                    Sign in
                                </button>

                                <button className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800 shadow  border border-solid border-slate-300"
                                    onClick={() => setShowRegister(true)}
                                >
                                    Create account
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <img
                            src="./images/homepage/homepage_image_1.png"
                            alt="hero banner"
                        />
                    </div>
                </div>
            </section>
            {/** End block **/}

            {/** Emergency Hotline */}
            <div className="pt-10 lg:px-36 px-6 py-4 mb-24">
                <h5 className="text-slate-500 font-bold xl:text-2xl text-sm text-center">EMERGENCY HOTLINE/HELPLINE NUMBERS (PROVINCE OF ANTIQUE)</h5>
                <div className="grid lg:grid-cols-4 grid-cols-1 gap-6 mt-6">
                    <AgencyHotline
                        image="/images/government_agencies/BFP.png"
                        name="FIRE"
                        number="0915-3248-833"
                    />

                    <AgencyHotline
                        image="/images/government_agencies/PNP.png"
                        name="POLICE"
                        number="0945-771-9529"
                    />

                    <AgencyHotline
                        image="/images/government_agencies/RESCUE.png"
                        name="RESCUE"
                        number="0915-324-8833"
                    />

                    <AgencyHotline
                        image="/images/government_agencies/MDRRMO.png"
                        name="MDRRMO"
                        number="0919-286-8863"
                    />

                </div>
            </div>

            {/** End Emergency Hotline */}
        </div>
    )
}

export default HeroHeader

type Agency = {
    image: string,
    name: string,
    number: string,
}

const AgencyHotline = ({ image, name, number }: Agency) => {
    return (
        <div className="flex flex-col bg-blue-100 rounded-lg py-2 px-8 place-items-center shadow border border-solid border-slate-300">
            <div className="flex mt-4 place-items-center">
                <img src={image} alt={name} className="h-12" />
                <h3 className="text-2xl font-bold flex gap-2 text-slate-600 ml-2">
                    {name} <ArrowDown className="mt-1 animate-bounce" />
                </h3>
            </div>
            <div className="flex gap-2 mt-4">
                <TelephoneFill size={24} className="text-blue-500" />
                <h6 className="text-xl font-bold text-slate-700">: {number}</h6>
            </div>
        </div>
    )
}