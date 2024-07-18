import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect } from 'react';
import { DashCircleDotted } from 'react-bootstrap-icons';
import { useLoginRegisterStore } from '@/utils/store/loginRegisterStore';

export default function VerifyEmail({ status }: { status: string }) {
    const { setShowRegister, setShowLogin } = useLoginRegisterStore();

    const { post, processing } = useForm({});

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    useEffect(() => {
        setShowRegister(false);
        setShowLogin(false);
    }, [])

    return (
        <GuestLayout>
            <Head title="Email Verification" />
            <div className="grid place-items-center lg:p-40 mt-10 lg:mt-0">

                <div className="p-10 shadow-lg rounded lg:w-1/2">
                    <div className="mb-4 text-normal text-gray-600">
                        <h1 className='lg:text-4xl text-2xl text-center mb-6 text-slate-500'>
                            Thanks for signing up to <br />
                            <span className='text-slate-800 font-bold'>Barangay E-Blotter</span>
                        </h1>
                        <h6 className='text-slate-500'>
                            Before getting started, could you verify your email address by clicking on the
                            link we just emailed to you? If you didn't receive the email, we will gladly send you another
                            one by clicking resend email verification button.
                        </h6>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            A new verification link has been sent to the email address you provided during registration.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mt-8 lg:flex items-center gap-12">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full bg-slate-100  lg:mb-0 mb-4  hover:bg-slate-200 text-slate-800 rounded-3xl p-3"
                            >
                                Log Out
                            </Link>

                            <PrimaryButton disabled={false}>
                                {processing ?
                                    <span className='flex gap-2 justify-center'>Sending verification email <DashCircleDotted size={24} className='animate-spin' /> </span>
                                    : 'Resend Verification Email'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </GuestLayout>
    );
}
