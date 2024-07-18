import months from '@/utils/data/months';
import { useForm } from '@inertiajs/react';
import React from 'react'
import { FolderFill } from 'react-bootstrap-icons';

const MonthlyBlotters = ({ year, monthlyBlotters }: { year: number; monthlyBlotters: any }) => {
    // Get Year
    let currentYear: any = new Date();
    currentYear = currentYear.getFullYear();

    // Data form inertia get request
    const { data, setData, get, processing } = useForm({
        blotterYear: year,
        blotterMonth: 0,
    });

    // Redirect to Monthly blotter page
    const Submit = (e: any) => {
        e.preventDefault();
        get(route('blotter.daily'));
    }

    const formatMonth = (mos: number) => {
        const month: any = months?.filter((item: any) => parseInt(item?.value) == mos);
        return month[0].label;
    }

    return (
        <div className='flex flex-wrap gap-12 py-6 w-full justify-center shadow mt-12 rounded-sm border border-stroke bg-white py-12 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
            {monthlyBlotters?.map((blotter: any, i: number) => (
                <form onSubmit={Submit}>
                    <div className="py-3 grid place-items-center px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 border border-solid border-slate-300" key={i}>
                        <span className='text-white font-bold absolute z-20 mt-[-1rem]'>
                            {blotter?.count}
                        </span>

                        <FolderFill size={72} color='gray' className='relative z-10' />

                        <input type="number" value={data?.blotterMonth} hidden />

                        <button
                            onClick={() => setData('blotterMonth', blotter?.month)}
                            className='text-slate-800 py-0 rounded text-center items-center font-semibold'>
                            {formatMonth(blotter?.month)}
                        </button>
                    </div>
                </form>
            ))}
        </div>
    )
}

export default MonthlyBlotters