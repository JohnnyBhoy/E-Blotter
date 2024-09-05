import React from "react";
import { AgencyProps } from "@/Pages/types/agency";
import { ArrowDown, TelephoneFill, Facebook, Globe, Google, Messenger } from "react-bootstrap-icons";

const AgencyHotline = ({ id, agencyLogo, agencyName, contactNumber, department }: AgencyProps) => {
    return (
        <div className="relative flex flex-col rounded hover:bg-blue-500 hover:text-white place-items-center shadow border border-solid border-slate-300 pb-10" key={id}>
            <div className="flex mt-4 place-items-center px-2 pt-4">
                <img src={agencyLogo} alt={agencyName} className="h-12" />
                <h3 className="text-xl font-bold hover:text-white flex gap-2 ml-2">
                    {agencyName} <ArrowDown className="mt-1 animate-bounce" />
                </h3>
            </div>
            <h6 className="my-3">
                {department}
            </h6>
            <div className="flex gap-2 mb-4 font-bold">
                <TelephoneFill size={16} className="text-blue-500 mt-1" />
                <h6>{contactNumber}</h6>
            </div>

            <div className="grid grid-cols-4 w-full px-10 place-items-center">
                <Facebook className="text-blue-700" size={24} />
                <Globe className="text-green-500" size={24} />
                <Google className="text-red-500" size={24} />
                <Messenger className="text-blue-700" size={24} />
            </div>
        </div>
    )
}

export default AgencyHotline;