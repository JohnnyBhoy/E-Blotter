import React from 'react';
import { Head } from '@inertiajs/react';

import LoginCard from '@/Components/Auth/Login';
import GuestLayout from '@/Layouts/GuestLayout';

/**
 * GET /login — the standalone sign-in page. It renders the same card used by
 * the sign-in modal on the landing page so both entry points stay in sync.
 */
const Login = ({ status }: { status?: string }) => {
    return (
        <GuestLayout>
            <Head title="Sign in" />

            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {status && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                            {status}
                        </div>
                    )}

                    <LoginCard />
                </div>
            </div>
        </GuestLayout>
    );
};

export default Login;
