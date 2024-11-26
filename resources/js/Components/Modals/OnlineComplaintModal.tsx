import barangays from '@/utils/data/barangays';
import cities from '@/utils/data/cities';
import provinces from '@/utils/data/provinces';
import { useOnlineComplaintStore } from '@/utils/store/onlineComplaintStore';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { ArrowDown, ChevronLeft, ChevronRight, Globe } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

const OnlineComplaintModal = () => {
    // Global states
    const { setShowOnlineComplaintModal } = useOnlineComplaintStore();

    // Local states
    const { setOnlineComplaintData, onlineComplaintData } = useOnlineComplaintStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    console.log(onlineComplaintData);

    const incidentType = [
        {
            id: 1,
            incident: "Police Assistance",
            icon: "/images/government_agencies/Police_assistance.png",
        }, {
            id: 2,
            incident: "Fire Response",
            icon: "/images/government_agencies/Fire_response.webp",
        }, {
            id: 3,
            incident: "Rescue",
            icon: "/images/government_agencies/Rescue_icon.png",
        }, {
            id: 4,
            incident: "Medical Emergency",
            icon: "/images/government_agencies/Medical_emergency.png",
        },
    ];

    const incidentDate = ['Time_Reported (Oras ng Report)', 'Date_Reported (Petsa ng Report)', 'Time_Of_Incident (Oras na nangyari ang insidente)', 'Date_Of_Incident (Araw ng nangyari ang insidente)'];
    const incidentPlace = ['Purok', 'Barangay', 'City', 'Province', 'Landmark_Location'];
    const reportingPerson = ['First_name', 'Family_Name', 'Middle_Name', 'Age'];
    const homeAddress = ['Reporter_Purok', 'Reporter_Barangay', 'Reporter_City', 'Reporter_Province', 'Reporter_Zip_Code'];
    const involvedParties = ['Perpetrator_Details', 'Victim_Details'];

    const steps = [
        "Incident Type",
        "Incident Date",
        "Place of Incident",
        "Reporting Person",
        "Home Address",
        "Narrative Of Incident",
        "Involved Parties",
        "Submit",
    ];

    const handleNext = () => {
        if (currentStep == 1 && onlineComplaintData.incident_type == 0) {
            return Swal.fire({
                title: "Unable to proceed!",
                text: "Please provide incident type.",
                timer: 5000,
                icon: 'error',
                showConfirmButton: false,
            });
        }

        if (currentStep == 2 && (onlineComplaintData.time_reported == ""
            || onlineComplaintData.date_reported == ""
            || onlineComplaintData.time_of_incident == ""
            || onlineComplaintData.date_of_incident == ""
        )
        ) {
            return Swal.fire({
                title: "Unable to proceed!",
                text: "Please provide incident date.",
                timer: 5000,
                icon: 'error',
                showConfirmButton: false,
            });
        }

        if (currentStep == 3 && (onlineComplaintData.purok == ""
            || onlineComplaintData.barangay == ""
            || onlineComplaintData.city == ""
            || onlineComplaintData.province == ""
        )
        ) {
            return Swal.fire({
                title: "Unable to proceed!",
                text: "Please provide place of incident.",
                timer: 5000,
                icon: 'error',
                showConfirmButton: false,
            });
        }

        if (currentStep == 4 && (onlineComplaintData.family_name == ""
            || onlineComplaintData.first_name == ""
            || onlineComplaintData.age == 0
            || onlineComplaintData.relationship_to_the_incident == ""
            || onlineComplaintData.contact_number == 0
        )
        ) {
            return Swal.fire({
                title: "Unable to proceed!",
                text: "Please provide your details.",
                timer: 5000,
                icon: 'error',
                showConfirmButton: false,
            });
        }

        if (currentStep == 5 && (onlineComplaintData.reporter_purok == ""
            || onlineComplaintData.reporter_barangay == ""
            || onlineComplaintData.reporter_city == ""
            || onlineComplaintData.reporter_province == ""
        )
        ) {
            return Swal.fire({
                title: "Unable to proceed!",
                text: "Please provide your home address.",
                timer: 5000,
                icon: 'error',
                showConfirmButton: false,
            });
        }

        if (currentStep == 6 && (onlineComplaintData.number_of_people_involved == 0
            || onlineComplaintData.narrative_of_incident == ""
        )
        ) {
            return Swal.fire({
                title: "Unable to proceed!",
                text: "Please provide narrative incident.",
                timer: 5000,
                icon: 'error',
                showConfirmButton: false,
            });
        }

        if (currentStep == 7 && (onlineComplaintData.perpetrator_details == ""
            || onlineComplaintData.victim_details == ""
        )
        ) {
            return Swal.fire({
                title: "Unable to proceed!",
                text: "Please provide involved parties.",
                timer: 5000,
                icon: 'error',
                showConfirmButton: false,
            });
        }

        if (currentStep === 8) {
            setSubmitting(true);

            router.post('/online-incident-report', {
                data: onlineComplaintData,
            });

            setTimeout(() => {
                Swal.fire({
                    title: "Incident Report Saved Successfully!",
                    text: "You report is on review, please wait for a call from our personel for a response/rescue. Keepsafe!",
                    icon: 'success',
                    timer: 5000,
                    showConfirmButton: false,
                })
                setSubmitting(false);
                setShowOnlineComplaintModal(false);
            }, 2500);

        }

        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Incident Date
    const handleChangeIncidentData = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setOnlineComplaintData({ ...onlineComplaintData, [name]: value });
    }

    console.log('data : ', onlineComplaintData);

    const renderStepContent = () => {
        const inputStyle = "rounded";

        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <div className="animate-slideinright grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-6 gap-10 p-6 lg:px-48">
                            {incidentType.map((type, index) => (
                                <label
                                    key={index} className={`transition duration-300 ease-in-out hover:scale-110 cursor-pointer  transition duration-300 ease-in-out hover:scale-110 cursor-pointer hover:bg-blue-500 hover:text-white border border-gray-300 rounded-lg shadow-md cursor-pointer flex flex-col items-center hover:border-blue-600 transition ${onlineComplaintData.incident_type == type?.id ? "bg-blue-600" : ""}`}
                                    onClick={() => setOnlineComplaintData({ ...onlineComplaintData, incident_type: type.id })
                                    }>
                                    <input type="radio" name="incident-type" value={type?.id} className="hidden" />
                                    <img
                                        src={type?.icon}
                                        alt="incident"
                                        className='lg:h-40 lg:w-40 h-14 w-10'
                                    />
                                    <p className="text-center font-medium text-gray-800">{type?.incident}</p>
                                </label>
                            ))}
                        </div>
                    </div >
                );
            case 2:
                return (
                    <div className="animate-slideinright lg:px-20">
                        <div className="grid grid-cols-1 gap-y-10 mt-5">
                            {incidentDate.map((item: string, key: number) => (
                                <div key={key} className="flex flex-col mt-2">
                                    <label htmlFor={item}>{item.replace("_", " ")}</label>
                                    <input
                                        type={item?.includes('Time') ? "time" : "date"}
                                        name={item.toLocaleLowerCase()}
                                        id={item.toLocaleLowerCase()}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input}`}
                                        onChange={((e: any) => handleChangeIncidentData(e))}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-slideinright ">
                        <div className="grid grid-cols-1 lg:gap-y-8 px-10">
                            <div className="flex flex-col">
                                <label htmlFor="">Province</label>
                                <div className="relative">
                                    <div className="relative z-20 bg-white dark:bg-form-input">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <Globe className='text-slate-600' />
                                        </span>
                                        <select
                                            value={onlineComplaintData.province}
                                            onChange={(e) => setOnlineComplaintData({ ...onlineComplaintData, province: e.target.value })}
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input}`}
                                        >
                                            <option value="" className="text-body dark:text-bodydark" key={1}>
                                                Select province
                                            </option>
                                            {Object.entries(provinces)?.map((province) => province[1])
                                                ?.sort((a: any, b: any) => a.province_name.localeCompare(b.province_name))
                                                ?.map((province: any) => (
                                                    <option
                                                        value={parseInt(province?.province_code)}
                                                        className="text-body dark:text-bodydark"
                                                        key={province.id}>
                                                        {province?.province_name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2">
                                <label className="block text-black dark:text-white">
                                    Select City/Municipality
                                </label>
                                <div className="relative">
                                    <div className="relative z-20 bg-white dark:bg-form-input">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <Globe className='text-slate-600' />
                                        </span>
                                        <select
                                            value={onlineComplaintData.city}
                                            onChange={(e) => setOnlineComplaintData({ ...onlineComplaintData, city: e.target.value })}
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input}`}
                                        >
                                            <option value="" className="text-body dark:text-bodydark" key={1}>
                                                Select City / Municipalities
                                            </option>
                                            {Object.entries(cities)
                                                ?.map((city) => city[1])
                                                ?.filter((city) => parseInt(city.province_code) === parseInt(onlineComplaintData.province))
                                                ?.sort((a: any, b: any) => a.city_name.localeCompare(b.city_name))
                                                ?.map((city: any) => (
                                                    <option
                                                        value={parseInt(city?.city_code)}
                                                        className="text-body dark:text-bodydark"
                                                        key={city.id}>
                                                        {city?.city_name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-2 mt-2">
                                <label className="block text-black dark:text-white">
                                    Select Barangay
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                        <Globe className='text-slate-600' />
                                    </span>
                                    <select
                                        value={onlineComplaintData?.barangay}
                                        onChange={(e) => setOnlineComplaintData({ ...onlineComplaintData, barangay: e.target.value })}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
                                    >
                                        <option value="" className="text-body dark:text-bodydark" key={1}>
                                            Select Barangay
                                        </option>
                                        {Object.entries(barangays)
                                            ?.map((barangay) => barangay[1])
                                            ?.filter((barangay) => parseInt(barangay.city_code) === parseInt(onlineComplaintData?.city))
                                            ?.map((barangay: any) => (
                                                <option
                                                    value={parseInt(barangay?.brgy_code)}
                                                    className="text-body dark:text-bodydark"
                                                    key={barangay.id}>
                                                    {barangay?.brgy_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
                                <div className="flex flex-col">
                                    <label htmlFor="Purok">Purok</label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <Globe className='text-slate-600' />
                                        </span>
                                        <input
                                            type="text"
                                            name={onlineComplaintData.purok}
                                            id="purok"
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
                                            onChange={(e) => setOnlineComplaintData({ ...onlineComplaintData, purok: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="Purok">Nearest Landmark</label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <Globe className='text-slate-600' />
                                        </span>
                                        <input
                                            type="text"
                                            name={onlineComplaintData.landmark_location}
                                            id="purok"
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
                                            onChange={(e) => setOnlineComplaintData({ ...onlineComplaintData, landmark_location: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>


                            {/*incidentPlace.map((item: string) => (
                                <div className="flex flex-col">
                                    <label htmlFor={item}>{item.replace("_", " ")}</label>
                                    <input
                                        type="text"
                                        name={item.toLocaleLowerCase()}
                                        id={item.toLocaleLowerCase()}
                                        className={inputStyle}
                                        onChange={((e: any) => handleChangeIncidentData(e))}
                                        required
                                    />
                                </div>
                            ))*/}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="animate-slideinright ">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Step 4: Reporting Person (Impormasyon ng taong nag-ulat ng insidente)</h3>
                        <div className="grid grid-cols-1 gap-y-4">
                            {reportingPerson.map((item: string, i: number) => (
                                <div key={i} className="flex flex-col">
                                    <label htmlFor={item}>{item.replace("_", " ")}</label>
                                    <input
                                        type={item == 'Age' ? "number" : "text"}
                                        name={item.toLocaleLowerCase()}
                                        id={item.toLocaleLowerCase()}
                                        className={inputStyle}
                                        onChange={((e: any) => handleChangeIncidentData(e))}
                                        required
                                    />
                                </div>
                            ))}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label htmlFor="relationship">Relationship To The Incident</label>
                                    <select
                                        name="relationship_to_the_incident"
                                        id="relationship_to_the_incident"
                                        className='rounded'
                                        onChange={(e) => handleChangeIncidentData(e)}
                                        required>
                                        <option value="Victim">Victim</option>
                                        <option value="Witness">Witness</option>
                                        <option value="Bystander">Bystander</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="contact number">Contact Number</label>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        id="contact_number"
                                        className={inputStyle}
                                        onChange={((e: any) => handleChangeIncidentData(e))}
                                        required
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="animate-slideinright ">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Step 5: Home Address</h3>
                        <div className="grid grid-cols-1 gap-y-4">
                            {homeAddress.map((item: string) => (
                                <div className="flex flex-col">
                                    <label htmlFor={item}>{item.replace("_", " ").replace("_", "")}</label>
                                    <input
                                        type="text"
                                        name={item.toLocaleLowerCase()}
                                        id={item.toLocaleLowerCase()}
                                        className={inputStyle}
                                        onChange={((e: any) => handleChangeIncidentData(e))}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="animate-slideinright ">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Step 6: Narrative</h3>
                        <div className="flex flex-col my-3">
                            <label htmlFor="number_of_people_involved">Number Of People Involved</label>
                            <input
                                type="number"
                                name="number_of_people_involved"
                                id="number_of_people_involved"
                                className={inputStyle}
                                onChange={((e: any) => handleChangeIncidentData(e))}
                                required
                            />
                        </div>
                        <label htmlFor="narrative_of_incident" className='pt-6'>Narrative Of Incident</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3"
                            rows={11}
                            name="narrative_of_incident"
                            id="narrative_of_incident"
                            onChange={((e: any) => handleChangeIncidentData(e))}
                            placeholder="Narrative of the incident or current situation..."
                            required
                        />
                    </div>
                );
            case 7:
                return (
                    <div className="animate-slideinright ">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Step 7: Involved Parties</h3>
                        {involvedParties.map((item: string) => (
                            <div className="flex flex-col mb-4">
                                <label htmlFor={item}>{item.replace("_", " ")}</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3"
                                    rows={6}
                                    name={item.toLocaleLowerCase()}
                                    id={item.toLocaleLowerCase()}
                                    onChange={((e: any) => handleChangeIncidentData(e))}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                );
            case 8:
                return (
                    <>
                        <h3 className="text-lg font-medium text-gray-500 mb-4 flex justify-center">
                            Please review your incident report details before submitting.
                            <ArrowDown className='animate-bounce' size={24} />
                        </h3>
                        <div className="animate-slideinright overflow-y-scroll overflow lg:h-[26rem] h-[24rem] lg:px-12">
                            <div className="grid grid-cols-1 lg:grid-cols-1">
                                {Object.entries(onlineComplaintData).map((item: any, i: number) => (
                                    <div className="mb-3 lg:flex gap-3" key={i}>
                                        <h6 className='text-slate-500 lg:w-[25%]'>
                                            {item[0].replace("_", " ").replace(item[0].charAt(0), item[0].toUpperCase().charAt(0))}
                                        </h6>
                                        <h6 className='font-bold lg:w-[75%] text-slate-700 flex'>
                                            <span className='hidden lg:flex'>: &nbsp;&nbsp;</span>{item[1]}
                                        </h6>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
                return null;
        }
    };

    return (
        <div className="w-full max-w-7xl lg:p-6 bg-white shadow-md rounded-lg mx-auto mt-16 lg:mt-0">
            <h3 className='text-center text-2xl font-bold text-slate-600 border-b border-slate-300 mb-2 pb-2'>
                Report Incident Online (Magreport ng insidente sa online)
            </h3>
            {/* Stepper Navigation */}
            <div className="relative">
                <div className="flex justify-between items-center w-full px-2">
                    {steps.map((_, index) => (
                        <>
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${index + 1 === currentStep || index + 1 <= currentStep ? 'border-blue-600 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-600'}`}>
                                {index + 1}
                            </div>
                            {
                                index < steps.length - 1 && (
                                    <div className={`flex-grow h-0.5 ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`}></div>
                                )
                            }
                        </>
                    ))}
                </div>

                <div className="flex justify-between w-full border-b border-slate-300 pb-1 px-1 opacity-0 lg:opacity-100">
                    {steps?.map((step: any, i: number) => (
                        <h6 key={i} className='text-xs'>
                            {step}
                        </h6>
                    ))}
                </div>


                {/* Step Content */}
                <div className="transition-opacity duration-500 ease-in-out lg:mt-3 lg:h-[28rem] h-auto lg:p-0 px-3">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end mt-6 px-3 gap-6 pb-4">
                    <button
                        onClick={handlePrev}
                        className={`border hover:bg-slate-200 border-slate-300 px-4 py-2 rounded-lg  flex place-items-center gap-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft />
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex place-items-center gap-2"
                    >
                        {submitting ? 'Saving...' : currentStep === steps.length ? 'Submit' : 'Next'}
                        <ChevronRight />
                    </button>
                </div>
            </div >
        </div >
    )
}

export default OnlineComplaintModal