import React from 'react'

const TableHead = () => {
<<<<<<< HEAD
    const headers = ['Entry No.', 'Complainant/s', 'Suspect/s', 'Incident Type', 'Place of Incident', 'Time / Date', 'Incident Photo', 'Remarks', 'Action'];
=======
    const headers = ['Entry No.', 'Complainant/s', 'Suspect/s', 'Incident Type', 'Reported Date', 'Case Remarks', 'Action'];
>>>>>>> a72769b0f33fc3b3821546bbe82c95cca7c63ee1

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