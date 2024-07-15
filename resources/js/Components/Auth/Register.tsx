import { useLoginRegisterStore } from '@/utils/store/loginRegisterStore';
import { useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';

import regions from '@/utils/data/regions';
import BlotterIcon1 from '../Icons/BlotterIcon1';
import Address from '../Register/Address';
import BlotterLogo from '../Register/BlotterLogo';
import EmailAndPassword from '../Register/EmailAndPassword';
import RegisterTitle from '../Register/RegisterTitle';
import SubmitRegistration from '../Register/SubmitRegistration';

const Register = () => {
    // Global state
    const { setShowLogin, setShowRegister } = useLoginRegisterStore();

    // Local state
    const [page, setPage] = useState<number>(1);

    console.log(Object.entries(regions)?.map((region) => region[1]));

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 2,
        region_code: 6,
        province_code: 0,
        city_code: 0,
        barangay_code: 0,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('register'));
    };

    const handleShowLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-3">
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="py-17.5 px-26 text-center">
                        <BlotterLogo />
                        <RegisterTitle />
                        <BlotterIcon1 />
                    </div>
                </div>

                <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        {page == 1 ? (
                            <EmailAndPassword
                                data={data}
                                setData={setData}
                                setPage={setPage}
                                errors={errors}
                            />
                        ) : (
                            <form onSubmit={submit}>
                                <Address
                                    data={data}
                                    setData={setData}
                                />

                                <SubmitRegistration processing={processing} />
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <p>
                                Already have an account?{' '}
                                <button type="button" onClick={handleShowLogin} className="text-primary">
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Register