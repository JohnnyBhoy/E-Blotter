import { PageProps } from '@/Pages/types';
import { useUserStore } from '@/utils/store/userStore';
import { usePage } from '@inertiajs/react';
import React from 'react'

const BlotterPdf = ({ data }: { data: any }) => {
    // User info
    const user = usePage<PageProps>().props.auth.user;
    const { barangay, city, province, region } = useUserStore();

    return (
        <div className='p-6'>
            <div className="grid place-items-center text-center">
                Republic of the Philippines<br />
                Province of {province} <br />
                Municipality of {city} <br />
                Barangay {barangay}<br />

                <h3 className='my-10'>BLOTTER REPORT</h3>
            </div>
        </div>
    )
}

export default BlotterPdf