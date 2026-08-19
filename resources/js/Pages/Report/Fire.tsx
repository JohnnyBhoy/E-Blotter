import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Fire, ArrowLeft, Person, GeoAlt, Calendar, Clock, FileText, House } from 'react-bootstrap-icons';

export default function FireReport() {
    const [formData, setFormData] = useState({
        reporter_name: '',
        reporter_contact: '',
        incident_date: '',
        incident_time: '',
        location: '',
        building_type: '',
        fire_size: '',
        people_trapped: '',
        injuries: '',
        description: '',
        fire_cause: ''
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
            const response = await fetch('/report/fire', {
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
                    alert('Failed to submit fire report. Please try again.');
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting fire report:', error);
            alert('Failed to submit fire report. Please try again.');
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
                        
                        <div className="bg-orange-600 text-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <Fire className="w-8 h-8 mr-3" />
                                <h1 className="text-2xl font-bold">Fire Report</h1>
                            </div>
                            <p className="text-orange-100">
                                Report fire incidents. This information will be forwarded to the Bureau of Fire Protection (BFP) for immediate response.
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="09XX-XXX-XXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Incident Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Fire Incident Details
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <GeoAlt className="w-4 h-4 inline mr-1" />
                                    Location of Fire *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter specific location/address"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <House className="w-4 h-4 inline mr-1" />
                                        Building Type *
                                    </label>
                                    <select
                                        name="building_type"
                                        value={formData.building_type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select building type</option>
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="industrial">Industrial</option>
                                        <option value="institutional">Institutional</option>
                                        <option value="vehicle">Vehicle</option>
                                        <option value="vegetation">Vegetation/Forest</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fire Size *
                                    </label>
                                    <select
                                        name="fire_size"
                                        value={formData.fire_size}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select fire size</option>
                                        <option value="small">Small (room size)</option>
                                        <option value="medium">Medium (building section)</option>
                                        <option value="large">Large (entire building)</option>
                                        <option value="massive">Massive (multiple buildings)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Information */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4">Emergency Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        People Trapped?
                                    </label>
                                    <select
                                        name="people_trapped"
                                        value={formData.people_trapped}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="none">None</option>
                                        <option value="unknown">Unknown</option>
                                        <option value="1-2">1-2 people</option>
                                        <option value="3-5">3-5 people</option>
                                        <option value="more-than-5">More than 5 people</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Injuries Reported?
                                    </label>
                                    <select
                                        name="injuries"
                                        value={formData.injuries}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="none">None</option>
                                        <option value="minor">Minor injuries</option>
                                        <option value="serious">Serious injuries</option>
                                        <option value="critical">Critical injuries</option>
                                        <option value="fatalities">Fatalities</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Provide detailed description of the fire incident..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Possible Cause (if known)
                                </label>
                                <textarea
                                    name="fire_cause"
                                    value={formData.fire_cause}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Describe possible cause of fire..."
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
                                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Fire Report'}
                            </button>
                        </div>
                    </form>

                    {/* Emergency Notice */}
                    <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                            <strong>Emergency Notice:</strong> If this is an active fire emergency, 
                            evacuate immediately and call the fire department at your local emergency number or 911.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
