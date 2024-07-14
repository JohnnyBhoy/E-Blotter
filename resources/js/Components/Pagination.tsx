import React, { FormEventHandler } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const Pagination = ({ links, setData, handleChangePage }: { links: any, setData: CallableFunction, handleChangePage: FormEventHandler }) => {

    const getClassName = (active: any) => {
        if (active) {
            return "cursor-pointer mr-1 mb-1 px-3 py-1 text-sm leading-4 bg-opacity-10 bg-warning text-warning rounded focus:border-primary focus:text-primary";
        } else {
            return "cursor-pointer mr-1 mb-1 px-3 py-1 text-sm leading-4 bg-success text-success  bg-opacity-10 rounded hover:bg-slate-700 hover:text-white focus:border-primary focus:text-primary";
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
                                        className="mr-1 mb-1 px-3 py-1 text-sm leading-4  bg-success text-success  bg-opacity-10  rounded hover:primaryCyanHOver hover:text-white"
                                        key={i}
                                        onClick={() => setData('page', getPage(link?.url))}
                                    >
                                        <ChevronLeft />
                                    </button>
                                </form>
                            ) :
                            link.label === 'Next &raquo;' ?
                                <form onSubmit={handleChangePage}>
                                    <button key={i}
                                        className="mr-1 mb-1 px-3 py-1 text-sm leading-4  bg-success text-success  bg-opacity-10  rounded hover:primaryCyanHOver hover:text-white"
                                        onClick={() => setData('page', getPage(link?.url))}
                                    >
                                        <ChevronRight />
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