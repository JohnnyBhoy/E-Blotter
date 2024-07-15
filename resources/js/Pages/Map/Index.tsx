import Breadcrumb from '@/Components/components/Breadcrumbs/Breadcrumb'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'
import { PageProps } from '../types'
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }: { text: string }) => <div>{text}</div>;

const Index = ({ auth }: PageProps) => {
    const defaultProps = {
        center: {
            lat: auth.user.lat,
            lng: auth.user.lang,
        },
        zoom: 11
    };

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
            <Breadcrumb pageName="Map" />

            <div style={{ height: '80vh', width: '100%' }} className='filter brightness-200'>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}

                >
                    <AnyReactComponent
                        lat={auth.user.lat}
                        lng={auth.user.lang}
                        text={`Barangay ${auth.user.name}`}
                    />
                </GoogleMapReact>
            </div>

        </AuthenticatedLayout>
    )
}

export default Index