import CardDataStats from "@/Components/CardDataStats";
import ChartOne from "@/Components/components/Charts/ChartOne";
import ChartThree from "@/Components/components/Charts/ChartThree";
import ChartTwo from "@/Components/components/Charts/ChartTwo";
import ChatCard from "@/Components/components/Chat/ChatCard";
import MapOne from "@/Components/components/Maps/MapOne";
import TableOne from "@/Components/components/Tables/TableOne";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/Pages/types";
import { Head } from "@inertiajs/react";
import React from "react";
import { Book, BookFill, File } from "react-bootstrap-icons";

export default function New({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Blotter
                </h2>
            }
        >
            <Head title="Blotter" />
            <h1>Add new blotter</h1>
        </AuthenticatedLayout>
    );

}
