import React from 'react';
import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

export type SortKey = 'entry_number' | 'complainant' | 'respondent' | 'incident_type' | 'date' | 'remarks' | 'id';
export type SortDirection = 'asc' | 'desc';

type Column = {
    label: string;
    /** Columns without a key are not sortable server-side. */
    key?: SortKey;
    align?: string;
};

const columns: Column[] = [
    { label: 'Entry No.', key: 'entry_number' },
    { label: 'Complainant/s', key: 'complainant' },
    { label: 'Suspect/s', key: 'respondent' },
    { label: 'Incident Type', key: 'incident_type' },
    { label: 'Place of Incident' },
    { label: 'Time / Date', key: 'date' },
    { label: 'Incident Photo' },
    { label: 'Remarks', key: 'remarks' },
    { label: 'Action', align: 'text-center' },
];

const TableHead = ({ sort, direction, onSort }: {
    sort?: SortKey;
    direction?: SortDirection;
    onSort?: (key: SortKey) => void;
}) => {
    return (
        <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {columns.map((column) => {
                    const isSorted = Boolean(column.key) && column.key === sort;
                    const isSortable = Boolean(column.key && onSort);

                    return (
                        <th
                            key={column.label}
                            scope="col"
                            aria-sort={isSorted ? (direction === 'asc' ? 'ascending' : 'descending') : undefined}
                            className={`border border-slate-300 px-3 py-3 text-sm font-medium text-black dark:border-strokedark dark:text-white ${column.align ?? ''}`}
                        >
                            {isSortable ? (
                                <button
                                    type="button"
                                    onClick={() => onSort!(column.key!)}
                                    className={`flex w-full items-center gap-1 whitespace-nowrap transition hover:text-primary ${isSorted ? 'text-primary dark:text-secondary' : ''}`}
                                >
                                    {column.label}
                                    <span className="flex flex-col leading-none">
                                        <CaretUpFill
                                            size={7}
                                            className={isSorted && direction === 'asc' ? 'opacity-100' : 'opacity-30'}
                                        />
                                        <CaretDownFill
                                            size={7}
                                            className={isSorted && direction === 'desc' ? 'opacity-100' : 'opacity-30'}
                                        />
                                    </span>
                                </button>
                            ) : (
                                <span className="whitespace-nowrap">{column.label}</span>
                            )}
                        </th>
                    );
                })}
            </tr>
        </thead>
    )
}

export default TableHead
