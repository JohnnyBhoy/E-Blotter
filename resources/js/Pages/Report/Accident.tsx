import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { HouseExclamation, ArrowLeft, Person, GeoAlt, Calendar, Clock, FileText, CarFront } from 'react-bootstrap-icons';

export default function AccidentReport() {
    const [formData, setFormData] = useState({
        reporter_name: '',
        reporter_contact: '',
        accident_type: '',
        incident_date: '',
        incident_time: '',
        location: '',
        description: '',
        injuries: '',
        vehicles_involved: '',
        weather_conditions: '',
        road_conditions: '',
        emergency_services: ''
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
            const response = await fetch('/report/accident', {
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
                    alert('Failed to submit accident report. Please try again.');
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting accident report:', error);
            alert('Failed to submit accident report. Please try again.');
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
                        
                        <div className="bg-yellow-600 text-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <HouseExclamation className="w-8 h-8 mr-3" />
                                <h1 className="text-2xl font-bold">Accident Report</h1>
                            </div>
                            <p className="text-yellow-100">
                                Report various types of accidents. This information will be forwarded to emergency services and appropriate authorities.
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        placeholder="09XX-XXX-XXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Accident Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Accident Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Accident Type *
                                    </label>
                                    <select
                                        name="accident_type"
                                        value={formData.accident_type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">Select accident type</option>
                                        <option value="vehicle_collision">Vehicle Collision</option>
                                        <option value="motorcycle_accident">Motorcycle Accident</option>
                                        <option value="pedestrian_accident">Pedestrian Accident</option>
                                        <option value="workplace_accident">Workplace Accident</option>
                                        <option value="slip_fall">Slip and Fall</option>
                                        <option value="drowning">Drowning</option>
                                        <option value="poisoning">Poisoning</option>
                                        <option value="burns">Burns</option>
                                        <option value="electrocution">Electrocution</option>
                                        <option value="sports_injury">Sports Injury</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <CarFront className="w-4 h-4 inline mr-1" />
                                        Vehicles Involved
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicles_involved"
                                        value={formData.vehicles_involved}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        placeholder="e.g., 2 cars, 1 motorcycle"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date of Accident *
                                    </label>
                                    <input
                                        type="date"
                                        name="incident_date"
                                        value={formData.incident_date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time of Accident *
                                    </label>
                                    <input
                                        type="time"
                                        name="incident_time"
                                        value={formData.incident_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <GeoAlt className="w-4 h-4 inline mr-1" />
                                    Location of Accident *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Provide a detailed description of how the accident occurred..."
                                />
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4">Environmental Conditions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Weather Conditions
                                    </label>
                                    <select
                                        name="weather_conditions"
                                        value={formData.weather_conditions}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">Select weather condition</option>
                                        <option value="clear">Clear</option>
                                        <option value="cloudy">Cloudy</option>
                                        <option value="rain">Rain</option>
                                        <option value="heavy_rain">Heavy Rain</option>
                                        <option value="fog">Fog</option>
                                        <option value="snow">Snow</option>
                                        <option value="windy">Windy</option>
                                        <option value="unknown">Unknown</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Road Conditions
                                    </label>
                                    <select
                                        name="road_conditions"
                                        value={formData.road_conditions}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">Select road condition</option>
                                        <option value="dry">Dry</option>
                                        <option value="wet">Wet</option>
                                        <option value="icy">Icy</option>
                                        <option value="construction">Under Construction</option>
                                        <option value="poor_lighting">Poor Lighting</option>
                                        <option value="debris">Road Debris</option>
                                        <option value="unknown">Unknown</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Injuries *
                                </label>
                                <select
                                    name="injuries"
                                    value={formData.injuries}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">Select injury level</option>
                                    <option value="none">No Injuries</option>
                                    <option value="minor">Minor Injuries</option>
                                    <option value="serious">Serious Injuries</option>
                                    <option value="critical">Critical Injuries</option>
                                    <option value="fatalities">Fatalities</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Emergency Services Notified
                                </label>
                                <select
                                    name="emergency_services"
                                    value={formData.emergency_services}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">Select</option>
                                    <option value="yes">Yes - Already called</option>
                                    <option value="no">No - Please notify</option>
                                    <option value="unknown">Unknown</option>
                                </select>
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
                                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Accident Report'}
                            </button>
                        </div>
                    </form>

                    {/* Emergency Notice */}
                    <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                            <strong>Emergency Notice:</strong> If this is an ongoing accident with injuries, 
                            call 911 immediately for emergency medical services.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
