import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import {
    ChevronRight,
    ExclamationCircleFill,
    Fire,
    GeoAltFill,
    Image,
    Plus,
    Tornado
} from 'react-bootstrap-icons';

type ReportData = {
    coordinates: string,
    location: string,
    incidentTypes: number,
    description: string,
    file: string,
    selectedFile: File | null,
    status: number,
}

const ReportingOptions = () => {
    const reportingOptions = [{
        id: 1,
        name: 'CRIME',
        pic: <ExclamationCircleFill size={32} />,
        color: 'bg-red-500',
    }, {
        id: 2,
        name: 'FIRE',
        pic: <Fire size={32} />,
        color: 'bg-green-500',
    }, {
        id: 3,
        name: 'MEDICAL',
        pic: <Plus size={32} />,
        color: 'bg-red-300',
    }, {
        id: 4,
        name: 'DISASTER',
        pic: <Tornado size={32} />,
        color: 'bg-blue-500',
    }];

    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showLocation, setShowLocation] = useState(false);
    const [uploadedImage, setUploadedImage] = useState('');
    const [reportData, setReportData] = useState<ReportData>({
        coordinates: '',
        location: '',
        incidentTypes: 1,
        description: '',
        file: '',
        selectedFile: null,
        status: 1,
    });


    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // this will handle for image upload
    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    // Get reporter's location
    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition({ lat: latitude, lng: longitude });

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    setAddress(data.display_name || 'Address not found');
                    setReportData({ ...reportData, location: data.display_name, coordinates: `${data.lat},${data.lon}` });
                    setShowLocation(true);
                } catch (err) {
                    setAddress('Failed to fetch address');
                    setShowLocation(false);
                }

                setError(null);
            },
            () => {
                setError('Permission denied or failed to get location.');
            }
        );
    };


    const formatReport = (reportId: number) => {
        if (reportId == 1) return 'CRIME';
        if (reportId == 2) return 'FIRE';
        if (reportId == 3) return 'MEDICAL';
        if (reportId == 4) return 'DISASTER';
        return 'NO SELECTED REPORT';
    };


    //Post reporter's data
    const INCIDENT_REPORT_URL = import.meta.env.VITE_INCIDENT_REPORT as string;

    const formData = new FormData();
    formData.append('coordinates', reportData.coordinates ?? '');
    formData.append('location', reportData.location ?? '');
    formData.append('incidentTypes', String(reportData.incidentTypes) ?? 1);
    formData.append('description', reportData.description ?? '');
    formData.append('status', String(reportData.status) ?? 1);

    if (reportData.selectedFile) {
        formData.append('file', reportData.selectedFile);
    }

    const postData = async (data: ReportData) => {
        const response = await axios.post(INCIDENT_REPORT_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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
        mutation.mutate(reportData);
    };

    console.log('user Data: ', reportData);

    //Get agency where report is meant to send
    const getAgency = (incidentId: number) => {
        if (incidentId == 1) return 'PNP Station';
        if (incidentId == 2) return 'Fire Station';
        if (incidentId == 3) return 'Medical & Emergency Station';
        if (incidentId == 4) return 'Disaster & Rescue Station';
    }

    return (
        <div className='lg:p-6 p-3'>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 lg:gap-10 gap-x-2 mt-6">
                    {reportingOptions.map((o) => (
                        <div
                            className={`lg:p-6 p-1 grid place-items-center text-white rounded ${o.color}`}
                            key={o.id}
                        >
                            {o.pic}
                            <h2 className='lg:text-lg text-sm mt-2 font-bold'>{o.name}</h2>
                        </div>
                    ))}
                </div>

                <h3 className='font-bold text-lg mt-3'>REPORT INCIDENT</h3>

                <div className="flex gap-2 place-items-center mt-2">
                    <GeoAltFill size={28} />
                    <div className="flex flex-col">
                        <h4 className='font-bold'>Location</h4>
                        <h4 className={`${showLocation ? '' : 'animate-pulse'}`}>{showLocation ? address : 'Getting your location...'}</h4>
                    </div>
                </div>

                <div className="my-5">
                    <label className='absolute mt-[-10px] ml-3 bg-white font-bold'>Incident Type</label>
                    <select
                        value={reportData.incidentTypes}
                        name="incident_type"
                        id="incident_type"
                        onChange={(e) => setReportData({ ...reportData, incidentTypes: parseInt(e.target.value) })}
                        className='w-full rounded border border-2'
                    >
                        <option value={0}>Select Type</option>
                        <option value={1}>Crime</option>
                        <option value={2}>Fire</option>
                        <option value={3}>Medical</option>
                        <option value={4}>Disaster</option>
                    </select>
                </div>

                <div className="rounded border my-6 py-3">
                    <div className="lg:flex justify-between">
                        <div className="">
                            <label
                                className='mt-[7px] ml-4 font-bold'
                                htmlFor="description"
                            >
                                Description
                            </label>
                            <input
                                value={reportData.description}
                                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                className='w-full rounded border-none lg:ml-3'
                                placeholder='Enter description'
                            />

                            {/* Upload Section */}
                            <div
                                className="flex place-items-center gap-6 ml-4 mt-4 cursor-pointer"
                                onClick={handleIconClick}
                            >
                                <Image size={28} />
                                <div className="flex flex-col">
                                    <h4 className='font-bold text-md'>Upload Media</h4>
                                    <h5>Picture or Short Video of incident you are reporting</h5>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setUploadedImage(URL.createObjectURL(file)); // for preview
                                            setReportData({ ...reportData, selectedFile: file, file: URL.createObjectURL(file) }); // for upload
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="">
                            {uploadedImage != '' && (
                                <img
                                    src={uploadedImage}
                                    alt="Preview"
                                    className="h-32 lg:w-32 w-full mr-3 rounded border"
                                />
                            )}

                        </div>
                    </div>

                </div>

                <div className="grid place-items-center">
                    <button
                        type='submit'
                        className={`font-bold text-center bg-blue-800 hover:bg-blue-500 text-white w-full py-2 rounded ${mutation.isPending ? 'animate-pulse' : ''}`}
                    >
                        {mutation.isPending
                            ? '⌛Uploading Report...'
                            : mutation.isSuccess
                                ? `✅ Your report has been delivered to nearest ${getAgency(reportData.incidentTypes)}, Please wait for our assistance, Keep safe👍!`
                                : '🚨 SUBMIT REPORT'}
                    </button>
                </div>

                <div className="border border-2 p-3 rounded mt-6 space-y-2">
                    <h4 className='font-bold'>TRACK REPORT</h4>
                    <div className="flex justify-between">
                        <h4 className='font-bold text-sm'>{formatReport(reportData.incidentTypes)}</h4>
                        <ChevronRight size={16} />
                    </div>
                    <div className="flex justify-between">
                        <h4 className='text-sm mr-20'>{address}</h4>
                        <h4 className='text-sm'>in Progress</h4>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReportingOptions;
