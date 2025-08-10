import SweetAlert from '@/utils/functions/Sweetalert';
import { useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { EmojiHeartEyesFill, Eye, EyeSlashFill } from 'react-bootstrap-icons';

const Login = () => {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('login'));
    };


    if (errors.email) {
        SweetAlert('Failed to login',
            'Incorrect email or password, Please try again.',
            'error',
            2000
        );

        errors.email = undefined;
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="/images/E-911.jpg"
                    className="mx-auto h-20 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={data?.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">

                            {showPassword
                                ? <Eye
                                    className='absolute lg:ml-[23%] ml-[80%] mt-3'
                                    onClick={() => setShowPassword(!showPassword)} />
                                : <EyeSlashFill
                                    className='absolute lg:ml-[23%] ml-[80%] mt-3'
                                    onClick={() => setShowPassword(!showPassword)} />
                            }


                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={data?.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`flex w-full justify-center rounded-md ${processing ? 'bg-blue-300' : 'bg-blue-500'}  px-3 py-2.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                        >
                            {processing
                                ? <img src="/images/loader.gif" alt="loading" className='h-6' />
                                : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?{' '}
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Start a 14 day free trial
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Login
