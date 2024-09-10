import GuestLayout from '@/Layouts/GuestLayout'
import { Head, router, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { DashCircleDotted, Envelope, FileRichtext, PersonCircle } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'

const ContactUs = () => {
    const [loading, setloading] = useState<boolean>(false);

    const { data, setData, errors, setError } = useForm({
        full_name: "",
        email_address: "",
        subject: "",
        message: "",
    });

    const handleSubmitContactUs = (e: any) => {
        e.preventDefault();

        setloading(true);

        router.post('/contact-us', {
            data: data,
        });

        setTimeout(() => {
            setloading(false);

            setData('full_name', '');
            setData('email_address', '');
            setData('subject', '');
            setData('message', '');

            Swal.fire({
                title: "Message sent successfully!",
                text: "You feedback has been sent to E-Blotter Admin.",
                icon: 'success',
                timer: 3500,
                showConfirmButton: false,
            });
        }, 3500);
    }

    return (
        <GuestLayout>
            <Head title="Contact Us - Barangay E-Blotter" />
            <div className="lg:m-36 m-3 lg:pt-2 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="">
                        <iframe
                            title="San Jose Antique"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31354.997362619622!2d121.99134615969821!3d10.782589226330815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ae484a4e97c385%3A0xbf3738c8f41b097c!2sSibalom%20Public%20Market!5e0!3m2!1sen!2sph!4v1725974118066!5m2!1sen!2sph"
                            width="600"
                            height="500"
                            className="border:0;"
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade" />
                    </div>

                    <div className="">
                        <h1 className='lg:text-2xl text-lg font-bold text-slate-600'>Any Questions? Feel free to contact us.</h1>
                        <form onSubmit={handleSubmitContactUs}>
                            <div className="grid lg:grid-cols-2 grid-cols-1 w-full py-10 gap-6">
                                <div className="flex">
                                    <button className='p-3 border border-slate-300 bg-slate-100'>
                                        <PersonCircle />
                                    </button>
                                    <input
                                        type="text"
                                        className='border border-slate-300 p-3 w-full'
                                        placeholder='Your Name'
                                        name="full_name"
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                    />
                                </div>

                                <div className="flex">
                                    <button className='p-3 border border-slate-300 bg-slate-100'>
                                        <Envelope />
                                    </button>
                                    <input
                                        type="email"
                                        className='border border-slate-300 p-3 w-full'
                                        placeholder='Email Address'
                                        name="email_address"
                                        value={data.email_address}
                                        onChange={(e) => setData('email_address', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex">
                                <button className='p-3 border border-slate-300 bg-slate-100'>
                                    <FileRichtext />
                                </button>
                                <input
                                    type="text"
                                    className='border border-slate-300 p-3 w-full'
                                    placeholder='Subject'
                                    name="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                />
                            </div>

                            <textarea
                                name="message"
                                id="message"
                                className='w-full mt-10 border border-slate-300'
                                placeholder='Enter your message or concern here...'
                                rows={7}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                            />


                            <div className=" flex place-items-center text-end justify-end">
                                <button
                                    type='submit'
                                    className='bg-blue-600 hover:bg-blue-800 text-white px-3 py-2 mt-6'
                                >
                                    {!loading ? 'Submit Message' : (
                                        <div className="flex place-items-center gap-2">
                                            <DashCircleDotted size={24} className='animate-spin' />
                                            Sending...
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </GuestLayout>
    )
}

export default ContactUs