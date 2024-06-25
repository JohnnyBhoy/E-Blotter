import { useLoginRegisterStore } from '@/utils/store/loginRegisterStore'
import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { GraphUpArrow } from 'react-bootstrap-icons';

const Homepage1 = () => {
    const { setShowLogin, setShowRegister } = useLoginRegisterStore();

    return (
        <div className="lg:flex lg:p-10 p-3 lg:mt-6 w-auto">
            <div className="lg:p-10">
                <h1 className="lg:text-6xl text-3xl font-semibold text-slate-800 mt-10 text-center lg:text-start">
                    Harmonization of Barangay Crime Incidents via Barangay
                    e-Blotter
                </h1>
                <h5 className="mt-6 text-lg text-slate-600">
                    Store, retrieve, update and create your blotter entry report
                    online to nearest PNP Station with your computer, laptop, tablet
                    or mobile phone
                </h5>

                <ul className="lg:flex w-full gap-10 mt-6">
                    <li
                        className={`text-slate-300 cursor-pointer text-md m-1`}
                    >
                        <button
                            onClick={() => setShowRegister(true)}
                            className="border lg:px-6 lg:py-2 py-3 rounded bg-blue-500 hover:bg-blue-700 text-white w-full mb-4 lg:mb-0"
                        >
                            Create Account
                        </button>
                    </li>
                    <li
                        className={`text-slate-500 cursor-pointer text-md m-1`}
                    >
                        <button
                            className="border rounded border-solid hover:border-blue-900 border-blue-300 text-blue-500border lg:px-6 lg:py-2 py-3  w-full"
                            onClick={() => setShowLogin(true)}>
                            Go to my Dashboard
                        </button>
                    </li>
                </ul>

                <ul className="lg:flex text-center lg:text-start w-full gap-6 mt-6">
                    <li className="text-slate-600 p-3">
                        Doesn't have an account?
                    </li>
                    <li className="">
                        <button className="hover:bg-slate-100 text-blue-700 p-3">
                            Sign up at no cost here
                        </button>
                    </li>
                </ul>
            </div>

            <Carousel
                autoPlay
                showThumbs={false}
                infiniteLoop
                showStatus={false}
                swipeable
                className='w-full'
            >
                <img
                    src="/images/homepage/homepage_image_1.png"
                    className="lg:h-[30rem] w-[150rem]"
                    alt="image_1"
                />
                <img
                    src="/images/homepage/slider_1.png"
                    className="lg:h-[30rem] w-[150rem]"
                    alt="image_1"
                />
                <img
                    src="/images/homepage/slider_2.png"
                    className="lg:h-[30rem] w-[150rem]"
                    alt="image_1"
                />
                <img
                    src="/images/homepage/slider_3.png"
                    className="lg:h-[30rem] w-[150rem]"
                    alt="image_1"
                />
            </Carousel>
        </div>
    )
}

export default Homepage1