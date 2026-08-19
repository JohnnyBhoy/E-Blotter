import React, { useMemo, useState } from "react";
import { Search, X } from "react-bootstrap-icons";

export type BreakdownItem = {
    /** Value pushed to the server when the row is picked. */
    value: string | number;
    label: string;
    /** Secondary line, e.g. the full statute title. */
    hint?: string;
    count: number;
};

/**
 * The left rail on the barangay drill-down pages: every incident type (or
 * purok) the barangay has recorded, ordered by frequency, with a share bar and
 * a click target that filters the table beside it.
 */
const BreakdownList = ({ title, items, selected, onSelect, searchPlaceholder, busy }: {
    title: string;
    items: BreakdownItem[];
    selected: string | number | null;
    onSelect: (value: string | number | null) => void;
    searchPlaceholder: string;
    busy?: boolean;
}) => {
    const [term, setTerm] = useState<string>("");

    const total = useMemo(
        () => items.reduce((sum, item) => sum + item.count, 0),
        [items]
    );

    const highest = useMemo(
        () => items.reduce((max, item) => Math.max(max, item.count), 0),
        [items]
    );

    const visible = useMemo(() => {
        const needle = term.trim().toLowerCase();

        if (!needle) return items;

        return items.filter((item) =>
            item.label.toLowerCase().includes(needle) ||
            item.hint?.toLowerCase().includes(needle)
        );
    }, [items, term]);

    return (
        <aside className="flex h-fit flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:sticky xl:top-24">

            <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-black dark:text-white">{title}</h3>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-meta-4 dark:text-white">
                        {items.length}
                    </span>
                </div>

                <div className="relative mt-3">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full rounded border border-slate-300 py-1.5 pl-8 pr-7 text-sm text-slate-700 focus:border-primary focus:ring-0 dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                    />
                    {term ? (
                        <button
                            type="button"
                            aria-label="Clear list search"
                            onClick={() => setTerm("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={15} />
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="max-h-[28rem] overflow-y-auto p-2 xl:max-h-[36rem]">
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => onSelect(null)}
                    className={`mb-1 flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-sm transition disabled:opacity-60 ${selected === null
                        ? "bg-primary/10 font-medium text-primary dark:bg-meta-4 dark:text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-bodydark1 dark:hover:bg-meta-4"
                        }`}
                >
                    <span>All entries</span>
                    <span className="text-xs text-slate-400">{total}</span>
                </button>

                {visible.length ? visible.map((item) => {
                    const isActive = String(selected) === String(item.value);
                    const share = highest ? Math.round((item.count / highest) * 100) : 0;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            disabled={busy}
                            title={item.hint ?? item.label}
                            onClick={() => onSelect(isActive ? null : item.value)}
                            className={`mb-1 w-full rounded px-3 py-2 text-left transition disabled:opacity-60 ${isActive
                                ? "bg-primary/10 dark:bg-meta-4"
                                : "hover:bg-slate-100 dark:hover:bg-meta-4"
                                }`}
                        >
                            <span className="flex items-center justify-between gap-2">
                                <span className={`truncate text-sm ${isActive
                                    ? "font-medium text-primary dark:text-white"
                                    : "text-slate-600 dark:text-bodydark1"
                                    }`}>
                                    {item.label}
                                </span>
                                <span className="shrink-0 text-xs font-medium text-slate-400">{item.count}</span>
                            </span>

                            {item.hint ? (
                                <span className="mt-0.5 block truncate text-xs text-slate-400">{item.hint}</span>
                            ) : null}

                            <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-strokedark">
                                <span
                                    className={`block h-full rounded-full ${isActive ? "bg-primary" : "bg-primary/40"}`}
                                    style={{ width: `${share}%` }}
                                />
                            </span>
                        </button>
                    );
                }) : (
                    <p className="px-3 py-6 text-center text-sm text-slate-400">
                        Nothing matches &quot;{term}&quot;.
                    </p>
                )}
            </div>
        </aside>
    );
};

export default BreakdownList;
