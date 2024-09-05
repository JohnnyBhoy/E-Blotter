import { AgencyProps } from "@/Pages/types/agency";
import React, { useState } from "react";
import Modal from "../Modal";
import OnlineComplaintModal from "../Modals/OnlineComplaintModal";
import AgencyHotline from "../components/Welcome/AgencyHotline";
import HomeCta from "../components/Welcome/HomeCta";
import HomeImage from "../components/Welcome/HomeImage";
import Purpose from "../components/Welcome/Purpose";
import { agencyHotline } from "@/utils/data/agencyHotline";
import { useOnlineComplaintStore } from "@/utils/store/onlineComplaintStore";

const HeroHeader = () => {
    // Local state
    const { showOnlineComplaintModal, setShowOnlineComplaintModal } = useOnlineComplaintStore();

    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
                    <div className="mr-auto place-self-center lg:col-span-7 space-y-16">
                        <h3 className="max-w-2xl mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl xl:text-5xl dark:text-white">
                            Harmonization of <br /> Barangay Incidents
                            <br /> via Barangay e-Blotter
                        </h3>

                        <Purpose />

                        <HomeCta onClick={() => setShowOnlineComplaintModal(true)} />

                    </div>

                    <HomeImage />
                </div>
            </section>
            {/** End block **/}

            {/** Emergency Hotline */}
            <div className="lg:px-24 px-6 mb-24 mt-12">
                <h5 className="text-slate-500 xl:text-2xl text-sm text-center">
                    Emergency Hotline / Helpline Numbers (Province Of Antique)
                </h5>
                <div className="grid lg:grid-cols-4 grid-cols-1 gap-6 mt-12">
                    {agencyHotline.map((agency: AgencyProps) => (
                        <AgencyHotline
                            id={agency.id}
                            agencyLogo={agency.agencyLogo}
                            agencyName={agency.agencyName}
                            contactNumber={agency?.contactNumber}
                            key={agency?.id}
                            department={agency?.department}
                        />
                    ))}
                </div>
            </div>

            {/** End Emergency Hotline */}

            {/**Online Complaint */}
            <Modal
                show={showOnlineComplaintModal}
                onClose={() => setShowOnlineComplaintModal(false)}
                maxWidth="6xl"
            >
                <OnlineComplaintModal />
            </Modal>
            {/** End Online Complaint */}
        </div>
    )
}

export default HeroHeader