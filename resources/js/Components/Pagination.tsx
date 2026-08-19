import React, { FormEventHandler } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const Pagination = ({ links, setData, handleChangePage }: { links: any, setData: CallableFunction, handleChangePage: FormEventHandler }) => {

    const getClassName = (active: any) => {
        if (active) {
            return "cursor-pointer h-6 grid place-items-center mx-1 w-6 text-sm leading-4 text-white bg-slate-700 text-warning rounded-full focus:border-primary focus:text-primary";
        } else {
            return "cursor-pointer grid place-items-center h-6 w-6  mx-1 text-sm leading-4 text-success  bg-opacity-10 rounded-full hover:bg-slate-700 hover:text-white focus:border-primary focus:text-primary";
        }
    }

    // Reading only the last character meant every page from 10 onwards was
    // parsed as its final digit (page=10 -> 0), so paging past 9 jumped back.
    const getPage = (url: string) => {
        if (!url) return 1;

        const page = parseInt(new URLSearchParams(url.split('?')[1] ?? '').get('page') ?? '');

        return isNaN(page) ? 1 : page;
    }

    return (
        links?.length > 3 && (
            <div className="mb-2 grid grid-cols-1 place-items-end mt-4">
                <div className="flex flex-wrap content-center mb-2">
                    {links?.map((link: any, i: number) => (
                        link.label === '&laquo; Previous' ?
                            (
                                <form onSubmit={handleChangePage} key={i}>
                                    <button
                                        className="mr-1 mb-1 flex gap-2 px-3 py-1 text-sm leading-4  bg-white text-success  bg-opacity-10  rounded hover:primaryCyanHOver hover:text-white"
                                        key={i}
                                        onClick={() => setData('page', getPage(link?.url))}
                                    >
                                        <ChevronLeft /> Previous
                                    </button>
                                </form>
                            ) :
                            link.label === 'Next &raquo;' ?
                                <form onSubmit={handleChangePage} key={i}>
                                    <button
                                        className="mr-1 mb-1 px-3 flex gap-2 py-1 text-sm leading-4  text-success  bg-opacity-10  rounded hover:primaryCyanHOver hover:text-white"
                                        onClick={() => setData('page', getPage(link?.url))}
                                    >
                                        Next <ChevronRight />
                                    </button>
                                </form>
                                :
                                (
                                    link?.url == null ? (
                                        // Laravel's "..." separator has no url and is not clickable.
                                        <span key={i} className="mx-1 text-sm text-slate-400">{link?.label}</span>
                                    ) : (
                                        <form onSubmit={handleChangePage} key={i}>
                                            <button
                                                className={getClassName(link.active)}
                                                onClick={() => setData('page', getPage(link?.url))}
                                            >{link?.label}
                                            </button>
                                        </form>
                                    )
                                )
                    ))}
                </div>
            </div >
        )
    );
}

export default Pagination