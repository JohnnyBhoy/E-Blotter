import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEvent } from 'react';
import { DashCircleDotted } from 'react-bootstrap-icons';

export default function VerifyEmail({ status }: { status: string }) {
    const { post, processing } = useForm({});

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />
            <div className="grid place-items-center p-40">

                <div className="p-10 shadow-lg rounded w-1/2">
                    <div className="mb-4 text-xl text-gray-600">
                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                        link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            A new verification link has been sent to the email address you provided during registration.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mt-8 flex items-center flex-col">
                            <PrimaryButton disabled={false}>
                                {processing ?
                                    <span className='flex gap-2 justify-center'>Sending verification email <DashCircleDotted size={24} className='animate-spin' /> </span>
                                    : 'Resend Verification Email'}
                            </PrimaryButton>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="mt-6 w-full bg-slate-500 text-white rounded p-3"
                            >
                                Log Out
                            </Link>

                        </div>
                    </form>
                </div>
            </div>

        </GuestLayout>
    );
}
