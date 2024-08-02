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

    const getPage = (url: string) => {
        const page = parseInt(url?.charAt(url?.length - 1));

        if (page == null || isNaN(page)) return 1;

        return page;
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
                                <form onSubmit={handleChangePage}>
                                    <button key={i}
                                        className="mr-1 mb-1 px-3 flex gap-2 py-1 text-sm leading-4  text-success  bg-opacity-10  rounded hover:primaryCyanHOver hover:text-white"
                                        onClick={() => setData('page', getPage(link?.url))}
                                    >
                                        Next <ChevronRight />
                                    </button>
                                </form>
                                :
                                (
                                    <form onSubmit={handleChangePage} key={i}>
                                        <button
                                            className={getClassName(link.active)}
                                            key={i}
                                            onClick={() => setData('page', i)}
                                        >{link?.label}
                                        </button>
                                    </form>
                                )
                    ))}
                </div>
            </div >
        )
    );
}

export default Pagination