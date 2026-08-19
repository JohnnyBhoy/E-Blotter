import React, { ReactNode } from 'react';

export type Tab = {
    id: string;
    label: string;
    icon?: ReactNode;
    /** Count of fields still failing validation, shown as a red pill. */
    issues?: number;
};

type TabBarProps = {
    tabs: Tab[];
    current: string;
    onSelect: (id: string) => void;
};

/**
 * Horizontal tab strip for the blotter modal. The form is long enough that a
 * single scroll would bury the disposition below the address blocks, so it is
 * split into groups the barangay can jump between in any order.
 */
const TabBar = ({ tabs, current, onSelect }: TabBarProps) => (
    <div
        role="tablist"
        aria-label="Blotter sections"
        className="flex gap-1 overflow-x-auto border-b border-stroke bg-white px-2 dark:border-strokedark dark:bg-boxdark sm:px-4"
    >
        {tabs.map((tab) => {
            const active = tab.id === current;

            return (
                <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onSelect(tab.id)}
                    className={[
                        'flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition',
                        active
                            ? 'border-primary text-primary'
                            : 'border-transparent text-body hover:text-black dark:text-bodydark dark:hover:text-white',
                    ].join(' ')}
                >
                    {tab.icon}
                    {tab.label}

                    {tab.issues ? (
                        <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                            {tab.issues}
                        </span>
                    ) : null}
                </button>
            );
        })}
    </div>
);

export default TabBar;
