import React from 'react'
import FormInput from '../FormInput'
import { Search } from 'react-bootstrap-icons'

const SearchInBlotter = () => {
    return (
        <>
            <Search className='absolute mr-[51rem] mt-[-12rem]' />
            <input
                type="text"
                name="search"
                value=""
                placeholder='Search in E-Blotter'
                onChange={() => { }}
                className="w-full lg:w-3/4 items-center rounded-3xl border-[1.5px] border-stroke bg-transparent py-2 px-5 pl-12 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary shadow-sm"
            />
        </>

    )
}

export default SearchInBlotter