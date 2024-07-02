import { PageProps } from "@/Pages/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import React, { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, CloudUpload } from "react-bootstrap-icons";

import Authentication from "@/Components/Blotter/Authentication";
import BrfForm from "@/Components/Blotter/BrfForm";
import CaseDisposition from "@/Components/Blotter/CaseDisposition";
import Narrative from "@/Components/Blotter/Narrative";
import PersonInvolveData from "@/Components/Blotter/PersonInvolveData";
import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function New({ auth }: PageProps) {
    // Local states
    const [person, setPerson] = useState<string>("Complainant");
    const user = usePage<PageProps>().props.auth.user;

    // Dates
    const date = new Date();
    const todayYear = date.getFullYear();
    const todayMonth = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const todayDay = date.getMonth() < 10 ? `0${date.getDay()}` : date.getDay();
    const h = date.getHours();
    const m = date.getMinutes();

    // Move to respondent handler
    const handleNext = () => {
        return person === 'Complainant'
            ? () => setPerson('Respondent')
            : () => setPerson('Complainant');
    }

    // Form data
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: user?.id,
        entry_number: "",
        barangay: user?.name,
        date_reported: `${todayYear}-${todayMonth}-${todayDay}`,
        time_of_report: `${h}:${m}`,
        incident_type: 0,

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

        narrative: "",
        remarks: "",
        complainant_signature: "",
        recorded_by: "",
        recorded_by_signature: "",
    });

    // Upload blotter handler
    const Submit = (e: FormEvent) => {
        e.preventDefault();

        post(route("blotter"));

        router.on('success', () => {
            return alert('Blotter uploaded successfully.');
        });
    }

    console.log(data);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Blotter
                </h2>
            }
        >
            <Head title="Barangay Blotter" />
            <Breadcrumb pageName={person} />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col lg:gap-0 gap-4">

                    {/* <!- BRF FORM --> */}
                    {person === 'Complainant'
                        ? <BrfForm
                            data={data}
                            setData={setData}
                        />
                        : null}
                    {/** End BRF FORM */}


                    {/* <!- Person's involved Data --> */}
                    <PersonInvolveData
                        data={data}
                        setData={setData}
                        person={person}
                    />
                    {/** End Person's involved  */}

                    {/* <!- Narrative Report --> */}
                    {person === 'Complainant'
                        ? <Narrative
                            data={data}
                            setData={setData}
                        />
                        : null}
                    {/** End Narrative Report */}

                    {/* <!- Case Disposition --> */}
                    {person === 'Respondent'
                        ? <CaseDisposition
                            data={data}
                            setData={setData}
                        />
                        : null}
                    {/** End Case Disposition */}

                    {/* <!- Authentication --> */}
                    {person === 'Respondent'
                        ? <Authentication
                            data={data}
                            setData={setData}
                        />
                        : null}
                    {/** End Authentication */}


                    {/* Next to respondent */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            className="bg-blue-500  hover:bg-blue-700 text-white px-5 py-1 rounded-3xl flex gap-2"
                            onClick={person === 'Complainant'
                                ? () => setPerson('Respondent')
                                : () => setPerson('Complainant')}>

                            {person === 'Complainant'
                                ? <>
                                    Proceed to Person Complain of
                                    <ArrowRight className="m-1 hover:font-bold" />
                                </>
                                : <>
                                    <ArrowLeft className="m-1 hover:font-bold" />
                                    Back
                                </>}
                        </button>
                        {person === 'Respondent' ? (
                            <form onSubmit={Submit}>
                                <button
                                    className="bg-blue-500  hover:bg-blue-700 text-white px-5 py-1 rounded-3xl flex gap-1"
                                    onClick={() => { }}>
                                    <CloudUpload className="m-1 hover:font-bold" /> Submit
                                </button>
                            </form>

                        ) : (
                            null
                        )}

                    </div>
                    {/* End Next to respondent */}
                </div>
            </div>
        </AuthenticatedLayout>
    );

}
