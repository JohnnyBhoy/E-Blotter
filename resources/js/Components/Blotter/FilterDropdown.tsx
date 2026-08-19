import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckLg, ChevronDown, Search, X } from 'react-bootstrap-icons';

export type FilterOption = {
    value: number | string;
    label: string;
};

type FilterDropdownProps = {
    /** Stable id used by the parent to keep only one dropdown open at a time. */
    id: string;
    label: string;
    options: FilterOption[];
    selected?: number | string | null;
    openId: string | null;
    setOpenId: (id: string | null) => void;
    onSelect: (value: number | string) => void;
    onClear?: () => void;
    /** Renders a type-to-filter box; worth it for the long barangay/incident lists. */
    searchable?: boolean;
    /** Tailwind width class for the trigger, e.g. "w-full sm:w-48". */
    widthClass?: string;
    disabled?: boolean;
};

/**
 * Toolbar filter control: a trigger button plus an overlay panel.
 *
 * The panel is absolutely positioned inside a relative wrapper so it floats over
 * the table instead of reserving layout space -- the old blotter filters were
 * spaced with hand-tuned `ml-[3.5rem]` style margins that overlapped on smaller
 * screens.
 */
const FilterDropdown = ({
    id,
    label,
    options,
    selected,
    openId,
    setOpenId,
    onSelect,
    onClear,
    searchable = false,
    widthClass = 'w-full sm:w-44',
    disabled = false,
}: FilterDropdownProps) => {
    const isOpen = openId === id;
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [term, setTerm] = useState<string>('');

    const activeOption = options?.find((option) => String(option.value) === String(selected));

    // Close on outside click / Escape so the panel never gets stranded open.
    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenId(null);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpenId(null);
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, setOpenId]);

    useEffect(() => {
        if (isOpen && searchable) searchRef.current?.focus();
        if (!isOpen) setTerm('');
    }, [isOpen, searchable]);

    const visibleOptions = useMemo(() => {
        if (!searchable || term.trim() === '') return options;

        const needle = term.trim().toLowerCase();
        return options?.filter((option) => option.label?.toLowerCase().includes(needle));
    }, [options, searchable, term]);

    return (
        <div className={`relative ${widthClass}`} ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpenId(isOpen ? null : id)}
                className={`flex w-full items-center justify-between gap-2 rounded border px-3 py-2 text-sm transition
                    ${activeOption
                        ? 'border-primary bg-primary/5 text-primary dark:border-primary dark:bg-meta-4 dark:text-white'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1 dark:hover:bg-boxdark'}
                    ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
                <span className="truncate text-left">{activeOption ? activeOption.label : label}</span>
                <span className="flex shrink-0 items-center gap-1">
                    {activeOption && onClear ? (
                        <span
                            role="button"
                            aria-label={`Clear ${label}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                setOpenId(null);
                                onClear();
                            }}
                            className="rounded p-0.5 hover:bg-slate-200 dark:hover:bg-boxdark"
                        >
                            <X size={14} />
                        </span>
                    ) : null}
                    <ChevronDown size={12} className={isOpen ? 'rotate-180 transition' : 'transition'} />
                </span>
            </button>

            {isOpen ? (
                <div className="absolute left-0 z-999 mt-1 w-full min-w-[14rem] rounded border border-slate-200 bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
                    {searchable ? (
                        <div className="border-b border-slate-200 p-2 dark:border-strokedark">
                            <div className="flex items-center gap-2 rounded border border-slate-200 px-2 dark:border-strokedark">
                                <Search size={12} className="text-slate-400" />
                                <input
                                    ref={searchRef}
                                    value={term}
                                    onChange={(event) => setTerm(event.target.value)}
                                    type="text"
                                    placeholder="Type to filter..."
                                    className="w-full border-0 bg-transparent p-1 text-xs text-slate-700 focus:ring-0 dark:text-bodydark1"
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="max-h-72 overflow-y-auto">
                        {visibleOptions?.length ? (
                            visibleOptions.map((option) => {
                                const isActive = String(option.value) === String(selected);

                                return (
                                    <button
                                        type="button"
                                        key={option.value}
                                        onClick={() => {
                                            setOpenId(null);
                                            onSelect(option.value);
                                        }}
                                        className={`flex w-full items-start gap-2 px-3 py-2 text-left text-xs
                                            ${isActive
                                                ? 'bg-primary/10 font-medium text-primary dark:bg-meta-4 dark:text-white'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-bodydark1 dark:hover:bg-meta-4'}`}
                                    >
                                        <CheckLg
                                            size={12}
                                            className={`mt-0.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                        <span className="flex-1">{option.label}</span>
                                    </button>
                                );
                            })
                        ) : (
                            <p className="px-3 py-4 text-center text-xs text-slate-400">No matches found</p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default FilterDropdown;
