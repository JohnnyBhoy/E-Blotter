import { PageProps } from "@/Pages/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { FormEvent, ReactElement, useState } from "react";
import { ArrowLeft, ArrowRight, CircleHalf, CloudUpload } from "react-bootstrap-icons";
import { SweetAlertOptions } from 'sweetalert2';

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

export default function Edit({ auth, blotter }: PageProps<{ blotter: any }>) {
    // Local states
    const [person, setPerson] = useState<string>("Complainant");
    const user = usePage<PageProps>().props.auth.user;

    // Form data
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: user?.id,
        entry_number: blotter.entry_number,
        barangay: blotter.barangay,
        date_reported: blotter.date_reported?.substring(0, 10),
        time_of_report: blotter.time_of_report,
        incident_type: blotter.incident_type,

        complainant_data: [{
            complainant_family_name: blotter.complainant_family_name ?? "",
            complainant_first_name: blotter.complainant_first_name ?? "",
            complainant_middle_name: blotter.complainant_middle_name ?? "",
            complainant_birth_date: blotter.complainant_birth_date?.substring(0, 10) ?? "",
            complainant_place_of_birth: blotter.complainant_place_of_birth ?? "",
            complainant_citizenship: blotter.complainant_citizenship ?? 1,
            complainant_gender: blotter.complainant_gender ?? 1,
            complainant_civil_status: blotter.complainant_civil_status ?? 1,
            complainant_occupation: blotter.complainant_occupation ?? 1,
            complainant_education: blotter.complainant_education ?? 1,
            complainant_email_address: blotter.complainant_email_address ?? "",
            complainant_street: blotter.complainant_street ?? "",
            complainant_village: blotter.complainant_village ?? "",
            complainant_barangay: blotter.complainant_barangay ?? 0,
            complainant_city: blotter.complainant_city ?? 0,
            complainant_province: blotter.complainant_province ?? 0,
            complainant_region: blotter.complainant_region ?? 0,
            complainant_work_street: blotter.complainant_work_street ?? "",
            complainant_work_village: blotter.complainant_work_village ?? "",
            complainant_work_barangay: blotter.complainant_work_barangay ?? 0,
            complainant_work_city: blotter.complainant_work_city ?? 0,
            complainant_work_province: blotter.complainant_work_province ?? 0,
            complainant_work_region: blotter.complainant_work_region ?? 0,
        }],

        respondent_data: [{
            respondent_family_name: blotter.respondent_family_name ?? "",
            respondent_first_name: blotter.respondent_first_name ?? "",
            respondent_middle_name: blotter.respondent_middle_name ?? "",
            respondent_birth_date: blotter.respondent_birth_date?.substring(0, 10) ?? "",
            respondent_place_of_birth: blotter.respondent_place_of_birth ?? "",
            respondent_citizenship: blotter.respondent_citizenship ?? 1,
            respondent_gender: blotter.respondent_gender ?? 1,
            respondent_civil_status: blotter.respondent_civil_status ?? 1,
            respondent_occupation: blotter.respondent_occupation ?? 1,
            respondent_education: blotter.respondent_education ?? 1,
            respondent_email_address: blotter.respondent_email_address ?? "",
            respondent_street: blotter.respondent_street ?? "",
            respondent_village: blotter.respondent_village ?? "",
            respondent_barangay: blotter.respondent_barangay ?? 0,
            respondent_city: blotter.respondent_city ?? 0,
            respondent_province: blotter.respondent_province ?? 0,
            respondent_region: blotter.respondent_region ?? 0,
            respondent_work_street: blotter.respondent_work_street ?? "",
            respondent_work_village: blotter.respondent_work_village ?? "",
            respondent_work_barangay: blotter.respondent_work_barangay ?? 0,
            respondent_work_city: blotter.respondent_work_city ?? 0,
            respondent_work_province: blotter.respondent_work_province ?? 0,
            respondent_work_region: blotter.respondent_work_region ?? 0,
        }],

        narrative: blotter.narrative ?? "",
        remarks: blotter.remarks ?? "",
        complainant_signature: '',
        recorded_by: blotter.recorded_by ?? "",
        recorded_by_signature: '',
    });

    console.log('date reported: ', data.date_reported);


    // Move to respondent handler
    const handleNext = () => {

        // Check for the unanswered require input
        if (data.entry_number == 0)
            return SweetAlert(`Entry number  is required!`, 'Unable to proceed, please answer entry number.', 'error', 2500);

        if (data.barangay == "")
            return SweetAlert(`Barangay name is required!`, 'Unable to proceed, please provide barangay name.', 'error', 2500);

        if (data.incident_type == 0)
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
            return SweetAlert(`Narrative report is required!`, 'Unable to proceed, please provide narrative report .', 'error', 2500);

        return person != 'Complainant' ? setPerson('Complainant') : setPerson('Suspect/s');
    }


    // Upload blotter handler
    const Submit = (e: FormEvent) => {
        e.preventDefault();

        post(route("blotter"));
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
