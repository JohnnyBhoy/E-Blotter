import React from 'react'

const TableHead = () => {
    return (
        <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] py-4 px-2 font-medium text-black dark:text-white xl:pl-11">
                    Entry No.
                </th>
                <th className="min-w-[150px] py-4 px-2 font-medium text-black dark:text-white">
                    Complainant/s
                </th>
                <th className="min-w-[120px] py-4 px-2 font-medium text-black dark:text-white">
                    Suspect/s
                </th>
                <th className="py-4 px-2 font-medium text-black dark:text-white">
                    Incident Type
                </th>
                <th className="py-4 px-2 font-medium text-black dark:text-white">
                    Report Date
                </th>
                <th className="py-4 px-2 font-medium text-black dark:text-white">
                    Case Remarks
                </th>
                <th className="py-4 px-2 font-medium text-black dark:text-white">
                    Action
                </th>
            </tr>
        </thead>
    )
}

export default TableHead