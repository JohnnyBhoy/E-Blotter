import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { FolderFill, Search } from 'react-bootstrap-icons';
import TableBody from "@/Components/Blotter/TableBody";
import TableHead from "@/Components/Blotter/TableHead";

const DailyBlotters = ({ year, month, dailyBlotters }: { year: number; month: number; dailyBlotters: any }) => {
    // Local state
    const [keyword, setKeyword] = useState<string>('');
    const [newBlotters, setNewBlotters] = useState<object[]>(dailyBlotters);

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
        //get(route('blotter.monthly.all'));
    }

    useEffect(() => {
        const newData = dailyBlotters?.filter((item: any) =>
            item?.entry_number == keyword
            || item?.complainant_family_name?.includes(keyword)
            || item?.complainant_middle_name?.includes(keyword)
            || item?.complainant_first_name?.includes(keyword)
            || item?.respondent_family_name?.includes(keyword)
            || item?.respondent_middle_name?.includes(keyword)
            || item?.respondent_first_name?.includes(keyword)
            || item?.incident_type?.includes(keyword)
        );

        setNewBlotters(newData);
    }, [keyword])

    return (
        <>
            <div className="flex mt-3 justify-between">
                <div className="mt-2 bg-slate-100 py-1 px-3 rounded-lg shadow border border-solid border-slate-500">
                    Showing <b>{dailyBlotters?.length}</b> blotter entries
                </div>

                <div className="">
                    <Search className="absolute z-20 ml-3 mt-2" />
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        type="text"
                        placeholder="Search keywords..."
                        className="relative rounded-3xl py-1 pl-10 dark:bg-meta-4 z-10"
                    />
                </div>

            </div>

            < div className="rounded-sm border border-stroke bg-white px-3 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1" >
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full z-20 mt-3">
                        <TableHead />
                        <TableBody
                            blotters={newBlotters}
                            setData={setData} handleDelete={() => { }}
                        />
                    </table>
                </div>
            </div >
        </>

    )
}

export default DailyBlotters