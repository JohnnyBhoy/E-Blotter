import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ShieldExclamation, ArrowLeft, Person, GeoAlt, Calendar, Clock, FileText } from 'react-bootstrap-icons';

export default function CrimeReport() {
    const [formData, setFormData] = useState({
        reporter_name: '',
        reporter_contact: '',
        victim_name: '',
        incident_date: '',
        incident_time: '',
        location: '',
        description: '',
        suspect_description: '',
        witnesses: '',
        evidence_description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/report/crime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    window.location.href = '/';
                } else {
                    alert('Failed to submit crime report. Please try again.');
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting crime report:', error);
            alert('Failed to submit crime report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Report Selection
                        </Link>
                        
                        <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <ShieldExclamation className="w-8 h-8 mr-3" />
                                <h1 className="text-2xl font-bold">Crime Report</h1>
                            </div>
                            <p className="text-red-100">
                                Report criminal incidents. This information will be forwarded to the PNP for immediate action.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                        {/* Reporter Information */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <Person className="w-5 h-5 mr-2 text-blue-600" />
                                Reporter Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="reporter_name"
                                        value={formData.reporter_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="reporter_contact"
                                        value={formData.reporter_contact}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="09XX-XXX-XXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Victim Information */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4">Victim Information</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Victim Name (if known)
                                </label>
                                <input
                                    type="text"
                                    name="victim_name"
                                    value={formData.victim_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter victim name"
                                />
                            </div>
                        </div>

                        {/* Incident Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Incident Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date of Incident *
                                    </label>
                                    <input
                                        type="date"
                                        name="incident_date"
                                        value={formData.incident_date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time of Incident *
                                    </label>
                                    <input
                                        type="time"
                                        name="incident_time"
                                        value={formData.incident_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <GeoAlt className="w-4 h-4 inline mr-1" />
                                    Location of Incident *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter specific location/address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Detailed Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Provide a detailed description of the incident..."
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Suspect Description (if known)
                                </label>
                                <textarea
                                    name="suspect_description"
                                    value={formData.suspect_description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe any suspects involved..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Witnesses
                                </label>
                                <textarea
                                    name="witnesses"
                                    value={formData.witnesses}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="List any witnesses and their contact information..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Evidence Description
                                </label>
                                <textarea
                                    name="evidence_description"
                                    value={formData.evidence_description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe any evidence available..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <Link
                                href="/"
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Crime Report'}
                            </button>
                        </div>
                    </form>

                    {/* Emergency Notice */}
                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                            <strong>Emergency Notice:</strong> If this is an ongoing emergency or life-threatening situation, 
                            call 911 immediately instead of using this online form.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
