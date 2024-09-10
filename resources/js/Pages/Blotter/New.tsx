import { PageProps } from "@/Pages/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { FormEvent, ReactElement, useState } from "react";
import { ArrowLeft, ArrowRight, CircleHalf, CloudUpload } from "react-bootstrap-icons";
import Swal, { SweetAlertOptions } from 'sweetalert2';

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
    title: string,
    text: string,
    icon: string,
} & SweetAlertOptions;

type Data = {
    user_id: number,
    entry_number: number,
    barangay: string,
    date_reported: string,
    time_of_report: string,
    incident_type: 0,

    complainant_data: Object[],

    respondent_data: Object[],

    narrative: string,
    remarks: string,
    complainant_signature: string,
    recorded_by: string,
    recorded_by_signature: string,
}

export default function New({ auth, latestID }: PageProps<{ latestID: number }>) {
    // Local states
    const [person, setPerson] = useState<string>("Complainant");
    const user = usePage<PageProps>().props.auth.user;

    // Dates
    const date = new Date();
    const todayYear = date.getFullYear();
    const todayMonth = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const todayDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    // Form data
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: user?.id,
        entry_number: latestID ?? 0,
        barangay: user?.name,
        date_reported: `${todayYear}-${todayMonth}-${todayDay}`,
        time_of_report: `${h}:${m}`,
        incident_type: "",

        complainant_data: [{
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
        }],

        respondent_data: [{
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
        }],

        narrative: "(Detail the narrative of the incident or event, answering the WHO, WHAT, WHERE, WHY and HOW of reporting either in English or common dialect)",
        uploaded_file: "",
        remarks: "",
        complainant_signature: "",
        recorded_by: "",
        recorded_by_signature: "",
    });


    // Move to respondent handler
    const handleNext = () => {

        {/* Check for the unanswered require input
        if (data.entry_number == 0 || data.entry_number == latestID - 1)
            return SweetAlert(`Entry number  is required!`, 'Unable to proceed, please answer entry number.', 'error', 2500);

        if (data.barangay == "")
            return SweetAlert(`Barangay name is required!`, 'Unable to proceed, please provide barangay name.', 'error', 2500);

        if (data.incident_type == "")
            return SweetAlert(`Incident type is required!`, 'Unable to proceed, please provide incident type.', 'error', 2500);

        if ([data.complainant_data[0].complainant_family_name, data.complainant_data[0].complainant_first_name, data.complainant_data[0].complainant_middle_name].indexOf("") != -1)
            return SweetAlert(`Complainant name is required!`, 'Unable to proceed, please provide Complainant name.', 'error', 2500);

        if (data.complainant_data[0].complainant_birth_date == "")
            return SweetAlert(`Complainant birth date is required!`, 'Unable to proceed, please provide birth date.', 'error', 2500);

        if (data.complainant_data[0].complainant_place_of_birth == "")
            return SweetAlert(`complainant place of birth is required!`, 'Unable to proceed, please provide place of birth .', 'error', 2500);

        if ([data.complainant_data[0].complainant_region, data.complainant_data[0].complainant_province, data.complainant_data[0].complainant_city, data.complainant_data[0].complainant_barangay].indexOf(0) != -1)
            return SweetAlert(`Complainant address is required!`, 'Unable to proceed, please provide Complainant address.', 'error', 2500);

        if (data.narrative == "")
            return SweetAlert(`Narrative report is required!`, 'Unable to proceed, please provide narrative report .', 'error', 2500); */}

        return person != 'Complainant' ? setPerson('Complainant') : setPerson('Suspect/s');
    }


    // Upload blotter handler
    const Submit = (e: FormEvent) => {
        e.preventDefault();

        post(route("blotter"));

        setTimeout(() => {
            Swal.fire({
                title: "Blotter Added",
                text: "Entry saved to your database!",
                icon: "success",
                timer: 2500,
            });
        }, 2000);
    }

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

                    {/** */}

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


                    <div className="flex lg:flex-row flex-col justify-between lg:gap-12">
                        {/* <!- Case Disposition --> */}
                        {person === 'Suspect/s'
                            ? <CaseDisposition
                                data={data}
                                setData={setData}
                            />
                            : null}
                        {/** End Case Disposition */}

                        {/* <!- Authentication --> */}
                        {person === 'Suspect/s'
                            ? <Authentication
                                data={data}
                                setData={setData}
                            />
                            : null}
                        {/** End Authentication */}
                    </div>



                    {/* Next to respondent */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            className="bg-blue-500  hover:bg-blue-700 text-white px-3 py-1 rounded-3xl flex gap-1"
                            onClick={handleNext}>

                            {person === 'Complainant'
                                ? <>
                                    Next to Person Complain of/Suspects
                                    <ArrowRight className="my-1 hover:font-bold" />
                                </>
                                : <>
                                    <ArrowLeft className="my-1 hover:font-bold" />
                                    Back
                                </>}
                        </button>
                        {person === 'Suspect/s' ? (
                            <form onSubmit={Submit}>
                                <button
                                    className="bg-blue-500  hover:bg-blue-700 text-white px-5 py-1 rounded-3xl flex gap-1"
                                    onClick={() => { }}>

                                    {!processing
                                        ? <> Submit <CloudUpload className="m-1 hover:font-bold" /></>
                                        : <> Submitting... <CircleHalf className="m-1 hover:font-bold animate-spin" /></>
                                    }
                                </button>
                            </form>

                        ) : (
                            null
                        )}

                    </div>
                    {/* End Next to respondent */}
                </div>
            </div>
        </AuthenticatedLayout >
    );

}
