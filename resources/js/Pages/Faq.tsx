import GuestLayout from '@/Layouts/GuestLayout'
import { Head, router, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { DashCircleDotted, Envelope, FileRichtext, PersonCircle } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'

const Faq = () => {
    const faqs = [
        {
            question: "What is the Barangay e-Blotter System?",
            answer: `The <b>Barangay e-Blotter System </b> is an online platform designed to facilitate the recording, tracking, and reporting of various incidents, such as crime, fire, arson, calamities, disasters, traffic accidents, and other incidents that occur or are reported in the Barangay. <br/> <br/> 
            This system is accessible via <b>web and mobile browser-based applications </b>, enabling real-time incident reporting and data sharing with the nearest Barangay, PNP station, and other relevant agencies.`
        },
        {
            question: "What are the benefits of using the Barangay e-Blotter System?",
            answer: `
              <ul class="space-y-6 text-lg">
                <li>
                <b>1. Improved Data Accuracy</b><br /> 
                Ensures precise and comprehensive incident reporting, helping law enforcement and other agencies make informed decisions.
                </li>
                <li>
                <b>2.  Timely Interventions </b><br /> 
                Enables quicker responses to incidents through real-time data sharing and coordination.
                </li>
                <li>
                <b>3.  Enhanced Incident Prevention </b><br />
                 Assists in identifying trends and vulnerabilities, leading to more effective prevention strategies.
                 </li>
                <li>
                <b>4.  Community Engagement </b><br /> 
                Encourages residents to participate in maintaining community safety by reporting incidents easily and efficiently.
                </li>
                <li>
                <b>5.  Trust and Confidence </b><br /> Builds trust in authorities by promoting transparency and accountability in incident management.
                </li>
              </ul>
            `
        },
        {
            question: "How do I access the Barangay e-Blotter System?",
            answer: `You can access the Barangay e-Blotter System via any internet-enabled device, such as a <b>desktop, laptop, tablet, or mobile phone </b>. <br/><br/> Simply use a web or mobile browser to log in to the system and submit your incident report.`
        },
        {
            question: "What types of incidents can I report using the Barangay e-Blotter System?",
            answer: `<b>You can report various incidents, including:</b> <br/>
            <ul class="space-y-3 mt-6">
            <li>• Crimes (theft, assault, etc.) <br/></li>
            <li>• Fire and arson • Calamities and natural disasters<br/></li>
            <li>• Traffic accidents and road crashes<br/></li>
            <li>• Other emergencies and incidents that occur within the Barangay</li>
            </ul>`
        },
        {
            question: "How does the Barangay e-Blotter System enhance community safety?",
            answer: `By providing a centralized platform for <b>incident reporting and tracking </b>, the system enables law enforcement, disaster response agencies, and other relevant authorities to respond more effectively to incidents. <br/> <br/> The real-time data sharing improves coordination and <b>helps prevent incidents </b> by addressing emerging threats and vulnerabilities early.`
        },
        {
            question: "Who can use the Barangay e-Blotter System?",
            answer: `The system is intended for use by Barangay officials, law enforcement agencies (such as the PNP), disaster response teams, and community members who wish to report incidents. <br/> <br/>
             It is designed to be user-friendly and accessible to anyone with an internet-enabled device.`
        },
        {
            question: "How do I submit an incident report through the Barangay e-Blotter System?",
            answer: `To submit an incident report, log in to the system via a web or mobile browser, fill out the required fields detailing the incident (such as the type of incident, location, time, and description), and submit it. <br/> <br/>
            The report will be automatically forwarded to the relevant authorities for action.`
        },
        {
            question: "How does the system ensure my privacy and data security?",
            answer: `The <b>Barangay e-Blotter System </b> adheres to strict data privacy and security protocols. Personal information submitted through the system is protected under the Data Privacy Act, and users must consent to the use of their information by the system's administrators for incident management purposes.`
        },
        {
            question: "Can I track the progress of my incident report?",
            answer: `Yes, you can track the status of your report within the system. You will <b>receive updates on actions </b> taken by authorities in response to your report, ensuring transparency and accountability.`
        },
        {
            question: "How does the Barangay e-Blotter System contribute to evidence-based decision-making?",
            answer: "The system collects and analyzes incident data, providing valuable insights into trends, patterns, and hotspots within the community. This data is used by policymakers and stakeholders to develop targeted strategies and policies aimed at preventing and managing incidents more effectively."
        },
        {
            question: "What should I do if I experience technical issues with the system?",
            answer: "If you encounter any technical difficulties while using the Barangay e-Blotter System, you can contact the system administrator or support team for assistance. They will help resolve any issues to ensure smooth operation."
        },
        {
            question: "Is the Barangay e-Blotter System aligned with other government initiatives?",
            answer: "Yes, the Barangay e-Blotter System is designed to harmonize with other government projects, including those of the PNP, BFP, PCG, and disaster response agencies. This alignment ensures a coordinated approach to incident management and public safety."
        }
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleQuestionClick = (index: number) => {
        setSelectedIndex(index === selectedIndex ? 0 : index);
    };

    return (
        <GuestLayout>
            <Head title="Contact Us - Barangay E-Blotter" />
            <div className="lg:mx-36 m-3 lg:pt-24 pt-16">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Questions */}
                    <div className="w-full md:w-1/3 bg-gray-200 overflow-y-auto space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer p-2 shadow rounded border border-slate-300 transition-colors duration-300 hover:bg-blue-500 hover:text-white ${selectedIndex === index ? 'bg-blue-500 text-white' : 'bg-white'
                                    }`}
                                onClick={() => handleQuestionClick(index)}
                            >
                                {faq.question}
                            </div>
                        ))}
                    </div>

                    {/* Answers */}
                    <div className="w-full md:w-2/3 px-4 bg-white">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`transition-opacity duration-300 ease-in-out text-lg text-justify border border-slate-300 p-6 rounded shadow ${selectedIndex === index ? 'opacity-100' : 'opacity-0'
                                    }`}
                                style={{ transition: 'opacity 300ms ease-in-out' }}
                                dangerouslySetInnerHTML={{ __html: selectedIndex === index ? faq.answer : '' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}

export default Faq