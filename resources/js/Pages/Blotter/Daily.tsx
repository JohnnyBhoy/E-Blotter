import { PageProps } from "@/Pages/types";
import React from "react";

import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MonthlyBlotters from "@/Components/Blotter/MonthlyBlotters";
import DailyBlotters from "@/Components/Blotter/DailyBlotters";

type BlotterProps = {
    id: number;
    entry_number: number;
    complainant_family_name: string;
    complainant_first_name: string;
    complainant_middle_name: string;
    respondent_family_name: string;
    respondent_first_name: string;
    respondent_middle_name: string;
    incident_type: number;
    created_at: string;
    remarks: string;
}

export default function Daily({ auth, year, month, dailyBlotters }:
    PageProps<{ year: number; month: number, dailyBlotters: any }>) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Blotter
                </h2>
            }
        >

            <Breadcrumb pageName={`${year} Monthly Reports`} />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-[-.5rem]">
                <DailyBlotters
                    year={year}
                    month={month}
                    dailyBlotters={dailyBlotters}
                />
            </div>
        </AuthenticatedLayout >
    );

}