import { PageProps } from "@/Pages/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { FormEvent, ReactElement, useState, useEffect } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CircleHalf,
    CloudUpload,
    Save,
} from "react-bootstrap-icons";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { AlertCircle, FileText } from "lucide-react";

import Authentication from "@/Components/Blotter/Authentication";
import BrfForm from "@/Components/Blotter/BrfForm";
import CaseDisposition from "@/Components/Blotter/CaseDisposition";
import Narrative from "@/Components/Blotter/Narrative";
import PersonInvolveData from "@/Components/Blotter/PersonInvolveData";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
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

export default function NewBlotter({ auth }: { auth: any }) {
    // Local states
    const [person, setPerson] = useState<string>("Complainant");
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formErrors, setFormErrors] = useState<any>({});
    const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
    const [lastSaved, setLastSaved] = useState<string>("");
    const [latestID, setLatestID] = useState<number>(1);
    const user = usePage<PageProps>().props.auth.user;

    // Fetch latest blotter ID
    useEffect(() => {
        const fetchLatestID = async () => {
            try {
                const response = await fetch("/api/blotter/latest");
                const data = await response.json();
                setLatestID(data.latestID ? data.latestID + 1 : 1);
            } catch (error) {
                console.error("Failed to fetch latest ID:", error);
                setLatestID(1);
            }
        };
        fetchLatestID();
    }, []);

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

        narrative:
            "(Detail the narrative of the incident or event, answering the WHO, WHAT, WHERE, WHY and HOW of reporting either in English or common dialect)",
        uploaded_file: "",
        remarks: "",
        complainant_signature: "",
        recorded_by: "",
        recorded_by_signature: "",
    });

    // Enhanced validation function
    const validateStep = (step: number): boolean => {
        const errors: any = {};

        if (step === 1) {
            // BRF Form validation
            if (!data.entry_number || data.entry_number === 0) {
                errors.entry_number = "Entry number is required";
            }
            if (!data.barangay?.trim()) {
                errors.barangay = "Barangay name is required";
            }
            if (!data.incident_type?.trim()) {
                errors.incident_type = "Incident type is required";
            }
            if (!data.date_reported) {
                errors.date_reported = "Date reported is required";
            }
            if (!data.time_of_report) {
                errors.time_of_report = "Time of report is required";
            }
            if (!data.date_of_incident) {
                errors.date_of_incident = "Date of incident is required";
            }
            if (!data.time_of_incident) {
                errors.time_of_incident = "Time of incident is required";
            }
        }

        if (step === 2) {
            // Complainant validation
            const complainant = data.complainant_data[0];
            if (!complainant.complainant_family_name?.trim()) {
                errors.complainant_name = "Complainant family name is required";
            }
            if (!complainant.complainant_first_name?.trim()) {
                errors.complainant_name = "Complainant first name is required";
            }
            if (!complainant.complainant_birth_date) {
                errors.complainant_birth_date =
                    "Complainant birth date is required";
            }
            if (!complainant.complainant_place_of_birth?.trim()) {
                errors.complainant_place_of_birth =
                    "Complainant place of birth is required";
            }
            if (
                [
                    complainant.complainant_region,
                    complainant.complainant_province,
                    complainant.complainant_city,
                    complainant.complainant_barangay,
                ].includes(0)
            ) {
                errors.complainant_address =
                    "Complete complainant address is required";
            }
        }

        if (step === 3) {
            // Narrative validation
            if (
                !data.narrative?.trim() ||
                data.narrative ===
                    "(Detail the narrative of the incident or event, answering the WHO, WHAT, WHERE, WHY and HOW of reporting either in English or common dialect)"
            ) {
                errors.narrative = "Narrative report is required";
            }
        }

        if (step === 4) {
            // Final validation
            if (!data.remarks?.trim()) {
                errors.remarks = "Case disposition is required";
            }
            if (!data.recorded_by?.trim()) {
                errors.recorded_by = "Recorder name is required";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Auto-save functionality
    const autoSave = async () => {
        setIsAutoSaving(true);
        try {
            // Save to localStorage for auto-save functionality
            localStorage.setItem("blotter_draft", JSON.stringify(data));
            setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Auto-save failed:", error);
        } finally {
            setIsAutoSaving(false);
        }
    };

    // Load draft from localStorage
    useEffect(() => {
        const draft = localStorage.getItem("blotter_draft");
        if (draft) {
            try {
                const draftData = JSON.parse(draft);
                // Merge with current data, preserving essential fields
                setData({
                    ...data,
                    ...draftData,
                    user_id: user?.id,
                    entry_number: latestID ?? 0,
                });
            } catch (error) {
                console.error("Failed to load draft:", error);
            }
        }
    }, [latestID]);

    // Auto-save every 30 seconds
    useEffect(() => {
        const interval = setInterval(autoSave, 30000);
        return () => clearInterval(interval);
    }, [data]);

    // Enhanced step navigation
    const handleNextStep = () => {
        if (!validateStep(currentStep)) {
            SweetAlert(
                `Validation Error`,
                "Please fill in all required fields.",
                "error",
                3000,
            );
            return;
        }

        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
            autoSave();
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Legacy handler for backward compatibility
    const handleNext = () => {
        if (currentStep === 2) {
            handleNextStep();
        } else {
            // Original logic for complainant/respondent toggle
            if (data.entry_number == 0 || data.entry_number == latestID - 1)
                return SweetAlert(
                    `Entry number  is required!`,
                    "Unable to proceed, please answer entry number.",
                    "error",
                    2500,
                );

            if (data.barangay == "" || data.barangay == null)
                return SweetAlert(
                    `Barangay is required!`,
                    "Unable to proceed, please provide barangay.",
                    "error",
                    2500,
                );

            if (data.incident_type == "" || data.incident_type == null)
                return SweetAlert(
                    `Incident type is required!`,
                    "Unable to proceed, please provide incident type.",
                    "error",
                    2500,
                );

            if (data.date_reported == "")
                return SweetAlert(
                    `Date reported is required!`,
                    "Unable to proceed, please provide date reported.",
                    "error",
                    2500,
                );

            if (data.time_of_report == "")
                return SweetAlert(
                    `Time reported is required!`,
                    "Unable to proceed, please provide time reported.",
                    "error",
                    2500,
                );

            if (data.date_of_incident == "")
                return SweetAlert(
                    `Date of incident is required!`,
                    "Unable to proceed, please provide date of incident.",
                    "error",
                    2500,
                );

            if (data.time_of_incident == "")
                return SweetAlert(
                    `Time of incident is required!`,
                    "Unable to proceed, please provide time of incident.",
                    "error",
                    2500,
                );

            const complainant = data.complainant_data[0];
            if (
                complainant.complainant_family_name == "" ||
                complainant.complainant_first_name == "" ||
                complainant.complainant_middle_name == ""
            )
                return SweetAlert(
                    `Complainant name is required!`,
                    "Unable to proceed, please provide Complainant name.",
                    "error",
                    2500,
                );

            if (complainant.complainant_birth_date == "")
                return SweetAlert(
                    `Complainant birth date is required!`,
                    "Unable to proceed, please provide Complainant birth date.",
                    "error",
                    2500,
                );

            if (complainant.complainant_place_of_birth == "")
                return SweetAlert(
                    `Complainant place of birth is required!`,
                    "Unable to proceed, please provide Complainant place of birth.",
                    "error",
                    2500,
                );

            if (
                [
                    complainant.complainant_region,
                    complainant.complainant_province,
                    complainant.complainant_city,
                    complainant.complainant_barangay,
                ].includes(0)
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
        }
    };

    // Enhanced submit handler
    const Submit = (e: FormEvent) => {
        e.preventDefault();

        // Final validation
        if (!validateStep(4)) {
            SweetAlert(
                `Validation Error`,
                "Please complete all required fields before submitting.",
                "error",
                3000,
            );
            return;
        }

        // Clear draft on successful submission
        localStorage.removeItem("blotter_draft");

        post(route("blotter"));

        setTimeout(() => {
            Swal.fire({
                title: "Blotter Added",
                text: "Entry saved to your database!",
                icon: "success",
                timer: 2500,
            });
        }, 2000);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-black dark:text-claude-text leading-tight">
                            New Blotter Report
                        </h2>
                        <p className="text-sm text-blue-600 dark:text-blue-200">
                            {auth.user.name} • {auth.user.email}
                        </p>
                    </div>
                </div>
            }
        >
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    {/* Progress Indicator - Enhanced */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center mb-8">
                            <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                                <div className="flex items-center justify-between w-full max-w-2xl">
                                    {[1, 2, 3, 4].map((step, index) => (
                                        <React.Fragment key={step}>
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 transform hover:scale-110 ${
                                                        currentStep >= step
                                                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0"
                                                            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 border-0"
                                                    }`}
                                                >
                                                    {currentStep > step ? (
                                                        <svg
                                                            className="w-6 h-6 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        step
                                                    )}
                                                </div>
                                                <span
                                                    className={`mt-3 text-xs font-medium transition-colors duration-300 ${
                                                        currentStep >= step
                                                            ? "text-gray-900 dark:text-claude-text font-semibold"
                                                            : "text-gray-500 dark:text-claude-text-muted"
                                                    }`}
                                                >
                                                    {step === 1 && "BRF Form"}
                                                    {step === 2 &&
                                                        "Complainant"}
                                                    {step === 3 && "Narrative"}
                                                    {step === 4 &&
                                                        "Finalization"}
                                                </span>
                                            </div>
                                            {step < 4 && (
                                                <div
                                                    className={`flex-1 h-1 mx-6 transition-all duration-500 rounded-full ${
                                                        currentStep > step
                                                            ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                                            : "bg-gradient-to-r from-gray-200 to-gray-300"
                                                    }`}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Auto-save Status - Enhanced */}
                        <div className="flex justify-end">
                            <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                                {lastSaved && (
                                    <span className="flex items-center text-gray-700 dark:text-claude-text-muted">
                                        <div className="w-5 h-5 mr-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        Last saved: {lastSaved}
                                    </span>
                                )}
                                {isAutoSaving && (
                                    <span className="flex items-center text-blue-600 dark:text-blue-400">
                                        <div className="w-5 h-5 mr-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-3 h-3 text-white animate-spin"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        Saving...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 max-w-4xl mx-auto">
                        <div className="flex flex-col gap-6">
                            {/* Error Display */}
                            {Object.keys(formErrors).length > 0 && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center mb-3">
                                        <AlertCircle className="text-red-400 mr-3 w-5 h-5" />
                                        <h4 className="text-red-700 font-medium">
                                            Please correct the following errors:
                                        </h4>
                                    </div>
                                    <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                                        {Object.values(formErrors).map(
                                            (error: any, index) => (
                                                <li key={index}>{error}</li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/** */}

                            {/* Step 1: BRF Form */}
                            {currentStep === 1 && (
                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300">
                                    <BrfForm data={data} setData={setData} />
                                </div>
                            )}

                            {/* Step 2: Complainant Information */}
                            {currentStep === 2 && (
                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300">
                                    <PersonInvolveData
                                        data={data}
                                        setData={setData}
                                        person="Complainant"
                                    />
                                </div>
                            )}

                            {/* Step 3: Narrative */}
                            {currentStep === 3 && (
                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300">
                                    <Narrative data={data} setData={setData} />
                                </div>
                            )}

                            {/* Step 4: Finalization */}
                            {currentStep === 4 && (
                                <div className="space-y-6 transition-all duration-300">
                                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <PersonInvolveData
                                            data={data}
                                            setData={setData}
                                            person="Suspect/s"
                                        />
                                    </div>

                                    <div className="flex lg:flex-row flex-col justify-between lg:gap-8 gap-6">
                                        <div className="flex-1">
                                            <CaseDisposition
                                                data={data}
                                                setData={setData}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Authentication
                                                data={data}
                                                setData={setData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center mt-8 p-6 bg-gray-50 rounded-xl shadow-sm">
                                <div className="w-full sm:w-auto">
                                    {currentStep > 1 && (
                                        <button
                                            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                            onClick={handlePrevStep}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Previous
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    {/* Auto-save button */}
                                    <button
                                        className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                        onClick={autoSave}
                                        disabled={isAutoSaving}
                                    >
                                        <Save className="w-4 h-4" />
                                        {isAutoSaving
                                            ? "Saving..."
                                            : "Save Draft"}
                                    </button>

                                    {/* Next/Submit button */}
                                    {currentStep < 4 ? (
                                        <button
                                            className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                            onClick={handleNextStep}
                                        >
                                            Next
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <form
                                            onSubmit={Submit}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        Submitting...
                                                        <CircleHalf className="w-4 h-4 animate-spin" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit
                                                        <CloudUpload className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Legacy navigation for backward compatibility */}
                            <div className="flex justify-end gap-4 mt-6 px-6">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-3xl flex gap-1 transition-all duration-200"
                                    onClick={handleNext}
                                >
                                    {person === "Complainant" ? (
                                        <>
                                            Next to Person Complain of/Suspects
                                            <ArrowRight className="my-1 hover:font-bold" />
                                        </>
                                    ) : (
                                        <>
                                            <ArrowLeft className="my-1 hover:font-bold" />
                                            Back
                                        </>
                                    )}
                                </button>
                                {person === "Suspect/s" ? (
                                    <form onSubmit={Submit}>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-3xl flex gap-1 transition-all duration-200"
                                            onClick={() => {}}
                                        >
                                            {!processing ? (
                                                <>
                                                    {" "}
                                                    Submit{" "}
                                                    <CloudUpload className="m-1 hover:font-bold" />
                                                </>
                                            ) : (
                                                <>
                                                    {" "}
                                                    Submitting...{" "}
                                                    <CircleHalf className="m-1 hover:font-bold animate-spin" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
