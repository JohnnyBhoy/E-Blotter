import { Link, useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';
import {
    BoxArrowInRight,
    CheckCircleFill,
    ExclamationTriangleFill,
    EnvelopeFill,
    Eye,
    EyeSlashFill,
    Hypnotize,
    ShieldLockFill,
} from 'react-bootstrap-icons';

import InputError from '../InputError';
import { useLoginRegisterStore } from '@/utils/store/loginRegisterStore';

const HIGHLIGHTS = [
    'Record and retrieve barangay blotter entries',
    'Forward incidents to your municipal station',
    'Print certified blotter extracts on demand',
];

const Login = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Global states
    const { setShowLogin, setShowRegister } = useLoginRegisterStore();

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-boxdark">
            <div className="flex flex-wrap">
                {/* Brand panel */}
                <div className="hidden w-full bg-gradient-to-br from-[#0B2447] via-[#123a72] to-[#1e40af] p-10 xl:block xl:w-1/2">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            className="h-11 w-auto"
                            src="/images/logo/e-blotter.png"
                            alt="Barangay e-Blotter"
                        />
                        <span className="text-xl font-bold text-white">
                            Barangay e-Blotter
                        </span>
                    </Link>

                    <h3 className="mt-12 text-3xl font-extrabold leading-tight text-white">
                        Barangay Realtime
                        <br />
                        Blotter Reporting
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-sky-100/80">
                        Harmonizing barangay crime records with the local PNP — a joint
                        initiative of NAPOLCOM Region VI and the PNP Antique Provincial
                        Office.
                    </p>

                    <ul className="mt-10 space-y-4">
                        {HIGHLIGHTS.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-sky-100/90">
                                <CheckCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-12 flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
                        <ShieldLockFill className="h-5 w-5 shrink-0 text-[#FCD34D]" />
                        <p className="text-xs leading-relaxed text-sky-100/80">
                            Blotter records are confidential and handled in compliance with
                            the Data Privacy Act of 2012.
                        </p>
                    </div>
                </div>

                {/* Form panel */}
                <div className="w-full xl:w-1/2">
                    <div className="p-8 sm:p-12">
                        <div className="flex items-center gap-3 xl:hidden">
                            <img
                                className="h-10 w-auto"
                                src="/images/logo/e-blotter.png"
                                alt="Barangay e-Blotter"
                            />
                            <span className="text-lg font-bold text-black dark:text-white">
                                Barangay e-Blotter
                            </span>
                        </div>

                        <h2 className="mt-6 text-2xl font-extrabold text-black dark:text-white xl:mt-0">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-bodydark">
                            For punong barangays, barangay secretaries, peace &amp; order
                            kagawads and PNP personnel.
                        </p>

                        {errors.email && (
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4">
                                <ExclamationTriangleFill className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                                <p className="text-sm text-danger">
                                    Incorrect email or password. Please try again.
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6">
                            <div className="mb-5">
                                <label
                                    htmlFor="login-email"
                                    className="mb-2 block text-sm font-semibold text-black dark:text-white"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <input
                                        id="login-email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={data?.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="juan.delacruz@barangay.gov.ph"
                                        className="w-full rounded-xl border border-stroke bg-transparent py-3.5 pl-5 pr-12 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <EnvelopeFill className="absolute right-4 top-4 h-4 w-4 text-slate-400" />
                                </div>
                                {/* A failed attempt lands on errors.email — already shown
                                    in the banner above, so it is not repeated here. */}
                            </div>

                            <div className="mb-5">
                                <label
                                    htmlFor="login-password"
                                    className="mb-2 block text-sm font-semibold text-black dark:text-white"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={data?.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-stroke bg-transparent py-3.5 pl-5 pr-12 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-4 top-4 text-slate-400 transition hover:text-primary"
                                    >
                                        {showPassword ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeSlashFill className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-bodydark">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary"
                                    />
                                    Keep me signed in
                                </label>

                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 p-4 font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-800 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing ? (
                                    <>
                                        Authenticating...
                                        <Hypnotize className="animate-spin" size={20} />
                                    </>
                                ) : (
                                    <>
                                        <BoxArrowInRight className="h-5 w-5" />
                                        Sign In
                                    </>
                                )}
                            </button>

                            <p className="mt-6 text-center text-sm text-slate-600 dark:text-bodydark">
                                Barangay not yet onboarded?{' '}
                                <button
                                    type="button"
                                    onClick={handleRegister}
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Request an account
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
