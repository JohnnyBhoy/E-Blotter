import { PageProps } from "@/Pages/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CircleHalf,
    CloudUpload,
    ExclamationTriangleFill,
} from "react-bootstrap-icons";
import Swal from "sweetalert2";

import Authentication from "@/Components/Blotter/Authentication";
import BrfForm from "@/Components/Blotter/BrfForm";
import CaseDisposition from "@/Components/Blotter/CaseDisposition";
import FormStepper, { Step } from "@/Components/Blotter/FormStepper";
import Narrative from "@/Components/Blotter/Narrative";
import PersonInvolveData from "@/Components/Blotter/PersonInvolveData";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const STEPS: Step[] = [
    {
        title: "Incident & Reporting Person",
        description: "Entry details, victim and narrative",
    },
    {
        title: "Suspect & Disposition",
        description: "Person complained of and action taken",
    },
];

const pad = (value: number) => String(value).padStart(2, "0");

const emptyComplainant = {
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
};

const emptyRespondent = {
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
};

export default function New({ auth, latestID }: PageProps<{ latestID: number }>) {
    const user = usePage<PageProps>().props.auth.user;

    const [step, setStep] = useState<number>(0);
    const [issues, setIssues] = useState<Record<string, string>>({});

    const now = new Date();
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeNow = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const {
        data,
        setData,
        post,
        processing,
        errors: serverErrors,
        isDirty,
    } = useForm({
        user_id: user?.id,
        entry_number: latestID ?? 0,
        barangay: user?.name,
        date_reported: today,
        time_of_report: timeNow,
        date_of_incident: "",
        time_of_incident: "",
        incident_type: "",

        complainant_data: [{ ...emptyComplainant }],
        respondent_data: [{ ...emptyRespondent }],

        narrative: "",
        uploaded_file: "" as string | File,
        remarks: "",
        complainant_signature: "",
        recorded_by: "",
        recorded_by_signature: "",
    });

    // Warn before losing a half-filled entry to an accidental refresh or close.
    useEffect(() => {
        const warn = (event: BeforeUnloadEvent) => {
            if (!isDirty || processing) return;

            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", warn);

        return () => window.removeEventListener("beforeunload", warn);
    }, [isDirty, processing]);

    // Server-side validation messages sit alongside the client-side ones.
    const errors = useMemo(
        () => ({ ...issues, ...(serverErrors as Record<string, string>) }),
        [issues, serverErrors],
    );

    const plainNarrative = String(data.narrative ?? "")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

    /** Moves focus to the first field that failed validation. */
    const focusFirstIssue = (found: Record<string, string>) => {
        const [firstKey] = Object.keys(found);
        if (!firstKey) return;

        const [index, fieldName] = firstKey.split(".");
        const elementId = fieldName ? `${fieldName}_${index}` : firstKey;

        window.requestAnimationFrame(() => {
            const element = document.getElementById(elementId);

            element?.scrollIntoView({ behavior: "smooth", block: "center" });
            element?.focus({ preventScroll: true });
        });
    };

    const reportIssues = (found: Record<string, string>) => {
        setIssues(found);

        const count = Object.keys(found).length;

        Swal.fire({
            position: "top-end",
            icon: "error",
            title: count === 1 ? "1 field needs attention" : `${count} fields need attention`,
            text: "The highlighted fields below are required.",
            timer: 2800,
            showConfirmButton: false,
        });

        focusFirstIssue(found);
    };

    /** Everything the barangay must supply before moving on to the suspects. */
    const validateDetails = () => {
        const found: Record<string, string> = {};

        if (!data.entry_number || Number(data.entry_number) < 1) {
            found.entry_number = "Enter the blotter entry number.";
        }

        if (!String(data.barangay ?? "").trim()) {
            found.barangay = "Barangay name is required.";
        }

        if (!data.incident_type) {
            found.incident_type = "Select the type of offense or incident.";
        }

        if (!data.date_reported) {
            found.date_reported = "Select the date this was reported.";
        }

        if (!data.time_of_report) {
            found.time_of_report = "Select the time this was reported.";
        }

        if (!data.date_of_incident) {
            found.date_of_incident = "Select the date the incident happened.";
        }

        data.complainant_data.forEach((complainant: any, index: number) => {
            const require = (suffix: string, message: string) => {
                const key = `complainant_${suffix}`;
                const value = complainant[key];

                if (value === "" || value === 0 || value === undefined || value === null) {
                    found[`${index}.${key}`] = message;
                }
            };

            require("family_name", "Family name is required.");
            require("first_name", "First name is required.");
            require("middle_name", "Middle name is required.");
            require("birth_date", "Birth date is required.");
            require("place_of_birth", "Place of birth is required.");
            require("region", "Select a region.");
            require("province", "Select a province.");
            require("city", "Select a city or municipality.");
            require("barangay", "Select a barangay.");
        });

        if (!plainNarrative) {
            found.narrative = "Describe what happened.";
        }

        return found;
    };

    const goToSuspects = () => {
        const found = validateDetails();

        if (Object.keys(found).length) return reportIssues(found);

        setIssues({});
        setStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goBack = () => {
        setStep(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const found = validateDetails();

        if (!String(data.recorded_by ?? "").trim()) {
            found.recorded_by = "Enter the name of the person recording this entry.";
        }

        if (Object.keys(found).length) {
            // A missing detail from step one has to be fixed where it lives.
            if (Object.keys(found).some((key) => key !== "recorded_by")) {
                setStep(0);
            }

            return reportIssues(found);
        }

        setIssues({});

        post(route("blotter"), {
            preserveScroll: true,
            onSuccess: () =>
                Swal.fire({
                    title: "Blotter entry saved",
                    text: `Entry number ${data.entry_number} has been added to your records.`,
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                }),
            onError: () =>
                Swal.fire({
                    title: "Entry not saved",
                    text: "Please review the highlighted fields and try again.",
                    icon: "error",
                    timer: 3000,
                    showConfirmButton: false,
                }),
        });
    };

    const issueCount = Object.keys(errors).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Blotter
                </h2>
            }
        >
            <Head title="New Blotter Entry" />

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6 flex flex-col gap-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h1 className="text-title-sm font-semibold text-black dark:text-white">
                                New Blotter Entry
                            </h1>
                            <p className="mt-1 text-sm text-body dark:text-bodydark">
                                Entry No. {data.entry_number} &middot; Fields marked
                                <span className="mx-1 text-danger">*</span>
                                are required.
                            </p>
                        </div>

                        <Link
                            href={route("blotter.blotters")}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Back to blotter records
                        </Link>
                    </div>

                    <FormStepper
                        steps={STEPS}
                        current={step}
                        onSelect={(index) => setStep(index)}
                    />

                    {issueCount ? (
                        <div className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/5 px-4 py-3">
                            <ExclamationTriangleFill
                                size={16}
                                className="mt-0.5 shrink-0 text-danger"
                            />
                            <p className="text-sm text-danger">
                                {issueCount === 1
                                    ? "1 field still needs your attention."
                                    : `${issueCount} fields still need your attention.`}{" "}
                                They are highlighted in red below.
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col gap-6 pb-28">
                    {step === 0 ? (
                        <>
                            <BrfForm data={data} setData={setData} errors={errors} />

                            <PersonInvolveData
                                data={data}
                                setData={setData}
                                person="Complainant"
                                errors={errors}
                            />

                            <Narrative data={data} setData={setData} errors={errors} />
                        </>
                    ) : (
                        <>
                            <PersonInvolveData
                                data={data}
                                setData={setData}
                                person="Suspect/s"
                                errors={errors}
                            />

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <CaseDisposition
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                                <Authentication
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Sticky action bar so the controls stay reachable in a long form */}
                <div className="sticky bottom-0 -mx-4 mt-2 border-t border-stroke bg-white/95 px-4 py-3 backdrop-blur dark:border-strokedark dark:bg-boxdark/95 md:-mx-6 md:px-6 2xl:-mx-10 2xl:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-medium text-body dark:text-bodydark">
                            Step {step + 1} of {STEPS.length} &middot; {STEPS[step].title}
                        </span>

                        <div className="flex flex-wrap items-center gap-3">
                            {step > 0 ? (
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="flex h-11 items-center gap-2 rounded-lg border border-stroke px-5 text-sm font-medium text-black transition hover:bg-whiten dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                                >
                                    <ArrowLeft size={14} />
                                    Back
                                </button>
                            ) : null}

                            {step === 0 ? (
                                <button
                                    type="button"
                                    onClick={goToSuspects}
                                    className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-opacity-90"
                                >
                                    Next: Suspect details
                                    <ArrowRight size={14} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            Submitting...
                                            <CircleHalf size={14} className="animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            Submit blotter entry
                                            <CloudUpload size={14} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
