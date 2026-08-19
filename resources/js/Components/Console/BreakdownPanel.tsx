import React, { useMemo, useState } from "react";
import { InboxFill, Search } from "react-bootstrap-icons";

import Modal from "@/Components/Blotter/ui/Modal";

export type BreakdownRow = {
    /** Value written into the console filter when the row is picked. */
    value: string | number;
    label: string;
    /** Secondary line, e.g. the full offence title behind a short citation. */
    hint?: string;
    count: number;
};

type BreakdownPanelProps = {
    title: string;
    subtitle: string;
    rows: BreakdownRow[];
    /** Currently applied filter value, blank or 0 for "all". */
    selected: string | number;
    searchPlaceholder: string;
    onPick: (value: string | number) => void;
    onClose: () => void;
};

/**
 * The drill-down the standalone Incidents and Puroks pages used to be.
 *
 * Those pages existed to answer "how many entries of each kind, and show me
 * them" -- which the console table already does once it is filtered. So the
 * panel keeps the part that was actually missing, the counts, and picking a
 * row narrows the table underneath instead of loading a page.
 */
const BreakdownPanel = ({
    title,
    subtitle,
    rows,
    selected,
    searchPlaceholder,
    onPick,
    onClose,
}: BreakdownPanelProps) => {
    const [keyword, setKeyword] = useState("");

    const total = rows.reduce((sum, row) => sum + row.count, 0);

    const shown = useMemo(() => {
        const needle = keyword.trim().toLowerCase();

        const matching = needle
            ? rows.filter(
                  (row) =>
                      row.label.toLowerCase().includes(needle) ||
                      row.hint?.toLowerCase().includes(needle),
              )
            : rows;

        return [...matching].sort((a, b) => b.count - a.count);
    }, [rows, keyword]);

    const rowClass = (value: string | number) =>
        `flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
            String(value) === String(selected)
                ? "border-[#2563EB] bg-[#EFF6FF] dark:border-primary dark:bg-meta-4"
                : "border-[#E5E7EB] hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-strokedark dark:hover:bg-meta-4"
        }`;

    return (
        <Modal
            open
            onClose={onClose}
            title={title}
            subtitle={subtitle}
            footer={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-body dark:text-bodydark">
                        {total} entr{total === 1 ? "y" : "ies"} in the selected date range
                    </span>

                    <button
                        type="button"
                        onClick={() => onPick("")}
                        className="flex h-10 items-center rounded-lg border border-stroke px-4 text-sm font-medium text-black transition hover:bg-whiten dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                        Show all entries
                    </button>
                </div>
            }
        >
            <div className="mb-3 relative">
                <Search
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                    type="search"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-11 w-full rounded-lg border border-stroke bg-white pl-9 pr-3 text-sm text-black placeholder:text-body focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-strokedark dark:bg-form-input dark:text-white"
                />
            </div>

            {shown.length === 0 ? (
                <div className="py-14 text-center">
                    <InboxFill size={26} className="mx-auto mb-2 text-[#CBD5E1]" />
                    <p className="text-sm font-medium text-black dark:text-white">
                        Nothing recorded here yet
                    </p>
                    <p className="mt-1 text-xs text-body dark:text-bodydark">
                        Widen the date range on the console, or clear the search above.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {shown.map((row) => (
                        <button
                            key={row.value}
                            type="button"
                            onClick={() => onPick(row.value)}
                            className={rowClass(row.value)}
                        >
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-medium text-black dark:text-white">
                                    {row.label}
                                </span>
                                {row.hint ? (
                                    <span className="mt-0.5 block truncate text-xs text-body dark:text-bodydark">
                                        {row.hint}
                                    </span>
                                ) : null}
                            </span>

                            <span className="shrink-0 rounded-md bg-[#EFF6FF] px-2 py-1 text-xs font-semibold text-[#1D4ED8] dark:bg-meta-4 dark:text-white">
                                {row.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default BreakdownPanel;
