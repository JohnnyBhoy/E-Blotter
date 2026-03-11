import { PageProps } from "@/Pages/types";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import React, { FormEvent, ReactElement, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CircleHalf,
    CloudUpload,
    Eye,
} from "react-bootstrap-icons";
import Swal, { SweetAlertOptions } from "sweetalert2";

import Authentication from "@/Components/Blotter/Authentication";
import BrfForm from "@/Components/Blotter/BrfForm";
import CaseDisposition from "@/Components/Blotter/CaseDisposition";
import Narrative from "@/Components/Blotter/Narrative";
import PersonInvolveData from "@/Components/Blotter/PersonInvolveData";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SweetAlert from "@/utils/functions/Sweetalert";

export declare type SweetAlert2Props = {
    show?: boolean;
    showLoading?: boolean;
    onConfirm?: Function;
    onResolve?: Function;
    onError?: Function;
    children?: ReactElement;
    title: string;
    text: string;
    icon: string;
} & SweetAlertOptions;

type Data = {
    user_id: number;
    entry_number: number;
    barangay: string;
    date_reported: string;
    time_of_report: string;
    incident_type: 0;

    complainant_data: Object[];

    respondent_data: Object[];

    narrative: string;
    remarks: string;
    complainant_signature: string;
    recorded_by: string;
    recorded_by_signature: string;
};

export default function New({
    auth,
    latestID,
}: PageProps<{ latestID: number }>) {
    // Local states
    const [person, setPerson] = useState<string>("Complainant");
    const user = usePage<PageProps>().props.auth.user;

    // Dates
    const date = new Date();
    const todayYear = date.getFullYear();
    const todayMonth =
        date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
    const todayDay =
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    // Form data
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: user?.id,
        entry_number: latestID ?? 0,
        barangay: user?.name,
        date_reported: `${todayYear}-${todayMonth}-${todayDay}`,
        time_of_report: `${h}:${m}`,
        date_of_incident: "",
        time_of_incident: "",
        incident_type: "",

        complainant_data: [
            {
                complainant_family_name: "",
                complainant_first_name: "",
                complainant_middle_name: "",
                complainant_birth_date: "",
                complainant_place_of_birth: "",
                complainant_citizenship: 1,
                complainant_gender: 1,
                complainant_civil_status: 1,
                complainant_occupation: 1,
                complainant_education: 1,
                complainant_email_address: "",
                complainant_street: "",
                complainant_village: "",
                complainant_barangay: 0,
                complainant_city: 0,
                complainant_province: 0,
                complainant_region: 0,
                complainant_work_street: "",
                complainant_work_village: "",
                complainant_work_barangay: 0,
                complainant_work_city: 0,
                complainant_work_province: 0,
                complainant_work_region: 0,
            },
        ],

        respondent_data: [
            {
                respondent_family_name: "",
                respondent_first_name: "",
                respondent_middle_name: "",
                respondent_birth_date: "",
                respondent_place_of_birth: "",
                respondent_citizenship: 1,
                respondent_gender: 1,
                respondent_civil_status: 1,
                respondent_occupation: 1,
                respondent_education: 1,
                respondent_email_address: "",
                respondent_street: "",
                respondent_village: "",
                respondent_barangay: 0,
                respondent_city: 0,
                respondent_province: 0,
                respondent_region: 0,
                respondent_work_street: "",
                respondent_work_village: "",
                respondent_work_barangay: 0,
                respondent_work_city: 0,
                respondent_work_province: 0,
                respondent_work_region: 0,
            },
        ],

        narrative: "",
        uploaded_file: "",
        remarks: "",
        complainant_signature: "",
        recorded_by: "",
        recorded_by_signature: "",
    });

    // Move to respondent handler
    const handleNext = () => {
        if (data.entry_number == 0 || data.entry_number == latestID - 1)
            return SweetAlert(
                `Entry number  is required!`,
                "Unable to proceed, please answer entry number.",
                "error",
                2500,
            );

        if (data.barangay == "")
            return SweetAlert(
                `Barangay name is required!`,
                "Unable to proceed, please provide barangay name.",
                "error",
                2500,
            );

        if (data.incident_type == "")
            return SweetAlert(
                `Incident type is required!`,
                "Unable to proceed, please provide incident type.",
                "error",
                2500,
            );

        if (
            [
                data.complainant_data[0].complainant_family_name,
                data.complainant_data[0].complainant_first_name,
                data.complainant_data[0].complainant_middle_name,
            ].indexOf("") != -1
        )
            return SweetAlert(
                `Complainant name is required!`,
                "Unable to proceed, please provide Complainant name.",
                "error",
                2500,
            );

        if (data.complainant_data[0].complainant_birth_date == "")
            return SweetAlert(
                `Complainant birth date is required!`,
                "Unable to proceed, please provide birth date.",
                "error",
                2500,
            );

        if (data.complainant_data[0].complainant_place_of_birth == "")
            return SweetAlert(
                `complainant place of birth is required!`,
                "Unable to proceed, please provide place of birth .",
                "error",
                2500,
            );

        if (
            [
                data.complainant_data[0].complainant_region,
                data.complainant_data[0].complainant_province,
                data.complainant_data[0].complainant_city,
                data.complainant_data[0].complainant_barangay,
            ].indexOf(0) != -1
        )
            return SweetAlert(
                `Complainant address is required!`,
                "Unable to proceed, please provide Complainant address.",
                "error",
                2500,
            );

        if (data.narrative == "")
            return SweetAlert(
                `Narrative report is required!`,
                "Unable to proceed, please provide narrative report .",
                "error",
                2500,
            );

        return person != "Complainant"
            ? setPerson("Complainant")
            : setPerson("Suspect/s");
    };

    // Upload blotter handler
    const Submit = (e: FormEvent) => {
        e.preventDefault();

        post(route("blotter"), {
            onSuccess: () => {
                Swal.fire({
                    title: "Blotter Added",
                    text: "Entry saved to your database!",
                    icon: "success",
                    timer: 2500,
                });
                setTimeout(() => {
                    router.visit("/blotter/blotters");
                }, 3000);
            },
            onError: (errors) => {
                Swal.fire({
                    title: "Error",
                    text: "Failed to save blotter. Please check the form and try again.",
                    icon: "error",
                    timer: 3000,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <CloudUpload className="w-7 h-7 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 leading-tight">
                                New Blotter Report
                            </h2>
                            <p className="text-gray-600 dark:text-claude-text-muted text-sm font-medium">
                                Create a new blotter entry for your barangay
                            </p>
                        </div>
                    </div>

                    {/* View Blotters Button in Header */}
                    <Link
                        href="/barangay/blotters"
                        className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 cursor-pointer z-50 border-0"
                    >
                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold">View Blotters</span>
                    </Link>
                </div>
            }
        >
            <Head title="New Blotter Report - E-Blotter" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 p-6">
                    <div className="max-w-full mx-auto">
                        <div className="flex flex-col lg:gap-6 gap-4">
                            {/* BRF FORM - Enhanced */}
                            {person === "Complainant" && (
                                <div className="bg-gradient-to-br z-50 from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0">
                                    <BrfForm data={data} setData={setData} />
                                </div>
                            )}

                            {/* Person's involved Data - Enhanced */}
                            <div className="bg-gradient-to-br z-30 from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0">
                                <PersonInvolveData
                                    data={data}
                                    setData={setData}
                                    person={person}
                                />
                            </div>

                            {/* Narrative Report - Enhanced */}
                            {person === "Complainant" && (
                                <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0">
                                    <Narrative data={data} setData={setData} />
                                </div>
                            )}

                            {/* Case Disposition & Authentication - Enhanced */}
                            <div className="flex lg:flex-row flex-col justify-between lg:gap-6 gap-4">
                                {/* Case Disposition */}
                                {person === "Suspect/s" && (
                                    <div className="flex-1 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0">
                                        <CaseDisposition
                                            data={data}
                                            setData={setData}
                                        />
                                    </div>
                                )}

                                {/* Authentication */}
                                {person === "Suspect/s" && (
                                    <div className="flex-1 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-0">
                                        <Authentication
                                            data={data}
                                            setData={setData}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons - Enhanced */}
                            <div className="flex lg:flex-row flex-col justify-between lg:gap-6 gap-4 mt-8">
                                {/* Back Button */}
                                <button
                                    onClick={() => window.history.back()}
                                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 border-0"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Back
                                </button>

                                {/* Navigation Button */}
                                {person === "Complainant" ? (
                                    <button
                                        onClick={() => setPerson("Suspect/s")}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 border-0"
                                    >
                                        Next
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <form onSubmit={Submit}>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 border-0"
                                        >
                                            {processing ? (
                                                <>
                                                    Submitting...
                                                    <CircleHalf className="w-5 h-5 animate-spin" />
                                                </>
                                            ) : (
                                                <>
                                                    Submit
                                                    <CloudUpload className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
