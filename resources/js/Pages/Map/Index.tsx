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

            <div style={{ height: '80vh', width: '100%' }}>
                <iframe
                    title="San Jose Antique"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31354.997362619622!2d121.99134615969821!3d10.782589226330815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ae484a4e97c385%3A0xbf3738c8f41b097c!2sSibalom%20Public%20Market!5e0!3m2!1sen!2sph!4v1725974118066!5m2!1sen!2sph"
                    width="100%"
                    height="100%"
                    className="border:0;"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" />
            </div>

        </AuthenticatedLayout>
    )
}

export default Index