import React from 'react'

const TableHead = () => {
    const headers = ['Entry No.', 'Complainant/s', 'Suspect/s', 'Incident Type', 'Report Date', 'Case Remarks', 'Action'];

    return (
        <thead>
            <tr className="bg-gray-1 text-left dark:bg-meta-4 ">
                {headers.map((item: string) => (
                    <th className="border border-slate-300 min-w-[120px] py-3 px-2 font-medium text-black dark:text-white xl:pl-7 text-sm">
                        {item}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHead