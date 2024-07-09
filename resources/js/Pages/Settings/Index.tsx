import Breadcrumb from '@/Components/components/Breadcrumbs/Breadcrumb'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'
import { PageProps } from '../types'

const Index = ({ auth }: PageProps) => {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Blotter
                </h2>
            }
        >
            <Head title="Barangay Settings" />
            <Breadcrumb pageName="Map" />

            <h1>Settings Page</h1>

        </AuthenticatedLayout>
    )
}

export default Index