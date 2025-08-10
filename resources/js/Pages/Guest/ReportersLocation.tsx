import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { Telephone } from 'react-bootstrap-icons';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type LocationProps = {
    error: string | null,
    position: {
        lat: number,
        lng: number,
    } | null,
    address: string,
}

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

type ReporterData = {
    lat: number | undefined;
    lng: number | undefined;
    phone: string;
    address: string;
}

const ReportersLocation = ({ error, position, address }: LocationProps) => {
    //Local state
    const [userData, setUserData] = useState<ReporterData>({
        lat: position?.lat,
        lng: position?.lng,
        phone: '',
        address: '',
    });

    //Post reporter's data
    const postData = async (data: ReporterData) => {
        const response = await axios.post('/api/submit', data);
        return response.data;
    };


    //Mutate
    const mutation = useMutation({
        mutationFn: postData,
        onSuccess: (data) => {
            console.log('Success:', data);
        },
        onError: (error) => {
            console.error('Error:', error);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(userData);
    };

    //useEffect(() => {
    //    if (position != null) {
    //        setUserData({ ...userData, lat: position?.lat, lng: position?.lng, address: address });
    //    }
//
    //}, [position]);
//
    console.log('user data: ', userData);

    return (
        <div className='w-full'>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {position && (
                    <div>
                        <p className='mb-6'><strong>Track Location: </strong> {address}</p>
                        <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[position.lat, position.lng]} icon={customIcon}>
                                <Popup>
                                    You are here.<br />{address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                        <div className="flex place-items-center gap-2">
                            <Telephone size={36} className='mt-6' />
                            <input
                                value={userData.phone}
                                type="text"
                                className='w-full p-2 mt-6'
                                placeholder='Please enter your phone number so that we can verify you through call.'
                                onChange={(e: any) => setUserData({ ...userData, phone: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className='bg-red-800 text-white p-2 w-full mt-6 animate-pulse'>
                            Yes, This is my exact location and I need assistance
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default ReportersLocation