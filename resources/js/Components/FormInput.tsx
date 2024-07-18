import React, { ChangeEventHandler } from 'react'

const FormInput = ({ label, type, name, value, onChange }:
    { label: string, type: string, name: string, value: string, onChange: ChangeEventHandler }) => {

    return (
        <>
            <label className="text-xs bg-white dark:bg-transparent absolute ml-3 mt-[-.4rem]">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full lg:w-3/4 items-center rounded-3xl border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
        </>

    )
}
export default FormInput