
import { useLoginRegisterStore } from "@/utils/store/loginRegisterStore";
import React, { LegacyRef, MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { PageProps } from "./types";

import Footer from "@/Components/Footer";
import Allocation from "@/Components/Welcome/Allocation";
import Challenges from "@/Components/Welcome/Challenges";
import CrimeDataAccuracy from "@/Components/Welcome/CrimeDataAccuracy";
import CrimePrevention from "@/Components/Welcome/CrimePrevention";
import Engaegement from "@/Components/Welcome/Engaegement";
import Evidence from "@/Components/Welcome/Evidence";
import HeroHeader from "@/Components/Welcome/HeroHeader";
import Intervention from "@/Components/Welcome/Intervention";
import TimelyResponse from "@/Components/Welcome/TimelyResponse";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";


export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    status,
}: PageProps<{
    laravelVersion: string;
    phpVersion: string;
    message: string;
    status: string;
}>) {
    const { setShowLogin, setShowRegister } = useLoginRegisterStore();

    const ref1: any = useRef();
    const isVisible1 = useIsVisible(ref1);

    const ref2: any = useRef();
    const isVisible2 = useIsVisible(ref2);

    const ref3: any = useRef();
    const isVisible3 = useIsVisible(ref3);

    const ref4: any = useRef();
    const isVisible4 = useIsVisible(ref4);

    const ref5: any = useRef();
    const isVisible5 = useIsVisible(ref5);

    const ref6: any = useRef();
    const isVisible6 = useIsVisible(ref6);

    const ref7: any = useRef();
    const isVisible7 = useIsVisible(ref7);

    const ref8: any = useRef();
    const isVisible8 = useIsVisible(ref8);

    return (
        <GuestLayout>
            <Head title=" Welcome -Barangay E-Blotter" />

            {/** Start block **/}
            <div ref={ref1} className={`transition-opacity ease-in duration-300 ${isVisible1 ? "opacity-100" : "opacity-0"}`}>
                <HeroHeader />
            </div>
            {/** End block **/}

            {/** Start block **/}
            <section className="bg-gray-50 dark:bg-gray-800">
                <div className="mb-4 text-xl font-bold tracking-tight text-slate-700 dark:text-white text-center">
                    Harmonizing barangay crime incident records between the <br />Philippine National Police (PNP)  and the
                    Barangay through community  <br /> collaboration holds significant importance for several reasons:
                </div>


                <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6  animate-slideinright">
                    {/** Crime Data Accuracy **/}
                    <div ref={ref2} className={`transition-opacity ease-in duration-300 ${isVisible2 ? "opacity-100" : "opacity-0"}`}>
                        <CrimeDataAccuracy />
                    </div>

                    {/** Crime Prevention **/}
                    <div ref={ref3} className={`transition-opacity ease-in duration-300 ${isVisible3 ? "opacity-100" : "opacity-0"}`}>
                        <CrimePrevention />
                    </div>

                    {/** Timely intervention and response */}
                    <div ref={ref4} className={`transition-opacity ease-in duration-300 ${isVisible4 ? "opacity-100" : "opacity-0"}`}>
                        <TimelyResponse />
                    </div>
                    {/** End Timely Intervention and Response */}

                    {/** Row **/}
                    <div ref={ref5} className={`transition-opacity ease-in duration-300 ${isVisible5 ? "opacity-100" : "opacity-0"}`}>
                        <Engaegement />
                    </div>

                    {/** Timely intervention and response */}
                    <div ref={ref6} className={`transition-opacity ease-in duration-300 ${isVisible6 ? "opacity-100" : "opacity-0"}`}>
                        <Intervention />
                    </div>
                    {/** End Timely Intervention and Response */}

                    {/** Row **/}
                    <div ref={ref7} className={`transition-opacity ease-in duration-300 ${isVisible7 ? "opacity-100" : "opacity-0"}`}>
                        <Allocation />
                    </div>

                    {/** Evidence-Based Policy Making */}
                    <div ref={ref8} className={`transition-opacity ease-in duration-300 ${isVisible8 ? "opacity-100" : "opacity-0"}`}>
                        <Evidence />
                    </div>
                    {/** End Timely Intervention and Response */}
                </div>
            </section>
            {/** End block **/}

            {/** Start block **/}
            <section className="bg-white dark:bg-gray-900">
                <Challenges />
            </section>
            {/** End block **/}

            <Footer />
        </GuestLayout>
    );
}

const useIsVisible = (ref: any) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }
        );

        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
}
