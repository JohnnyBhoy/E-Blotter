import React from 'react'

const FormInput = ({ data, setData, title, placeholder, type, label }: { data: any, setData: CallableFunction, title: string, placeholder: string; type: string; label: string }) => {
    return (
        <>
            <label className="text-xs bg-white absolute ml-3 mt-[-.4rem]">
                {label}
            </label>
            <input
                value={data}
                type={type}
                onChange={(e) => setData(title, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
        </>

    )
}
export default FormInput