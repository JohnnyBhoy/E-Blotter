import React from 'react'

const TableHead = () => {
    const headers = ['Entry No.', 'Complainant', 'Suspect', 'Incident Type', 'Remarks', 'Action'];

    return (
        <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-left">
                {headers.map((item: string, index: number) => (
                    <th 
                        key={index}
                        className="px-4 py-3 font-semibold text-gray-900 dark:text-claude-text text-sm border-0 border-b-2 border-gray-200 dark:border-claude-border first:rounded-tl-xl last:rounded-tr-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-claude-panel-2"
                    >
                        {item}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHead