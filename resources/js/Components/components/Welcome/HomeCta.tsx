import { useLoginRegisterStore } from "@/utils/store/loginRegisterStore";
import React, { MouseEventHandler } from "react";
import { ArrowDown } from "react-bootstrap-icons";

const HomeCta = ({ onClick }: { onClick: MouseEventHandler }) => {
    const { setShowLogin, setShowRegister } = useLoginRegisterStore();

    return (
        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <button
                onClick={onClick}
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
    )
}

export default HomeCta;