import React, { useEffect, useRef, useState } from "react";
import { Calendar3, ChevronDown } from "react-bootstrap-icons";
import { formatRange } from "./format";

type DateRangePickerProps = {
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
};

/** Local Y-m-d for a date `days` before today, so presets stay in the user's timezone. */
const daysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return toInputValue(date);
};

const toInputValue = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}-${month}-${day}`;
};

const today = () => toInputValue(new Date());

const PRESETS: { label: string; range: () => [string, string] }[] = [
    { label: "Today", range: () => [today(), today()] },
    { label: "Last 7 days", range: () => [daysAgo(6), today()] },
    { label: "Last 30 days", range: () => [daysAgo(29), today()] },
    { label: "Last 90 days", range: () => [daysAgo(89), today()] },
    {
        label: "This month",
        range: () => {
            const now = new Date();
            return [toInputValue(new Date(now.getFullYear(), now.getMonth(), 1)), today()];
        },
    },
    {
        label: "This year",
        range: () => {
            const now = new Date();
            return [toInputValue(new Date(now.getFullYear(), 0, 1)), today()];
        },
    },
];

/** Date range control in the dashboard header. Drives every figure on the page. */
const DateRangePicker = ({ from, to, onChange }: DateRangePickerProps) => {
    const [open, setOpen] = useState(false);
    const [draftFrom, setDraftFrom] = useState(from);
    const [draftTo, setDraftTo] = useState(to);
    const container = useRef<HTMLDivElement>(null);

    // Keep the draft in step when the server echoes back a corrected range.
    useEffect(() => {
        setDraftFrom(from);
        setDraftTo(to);
    }, [from, to]);

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (!container.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEscape);

        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, []);

    const apply = (nextFrom: string, nextTo: string) => {
        setOpen(false);
        onChange(nextFrom, nextTo);
    };

    return (
        <div className="relative" ref={container}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm font-medium text-[#334155] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-strokedark dark:bg-boxdark dark:text-bodydark1 sm:w-auto"
            >
                <Calendar3 size={16} className="text-[#64748B]" />
                <span className="whitespace-nowrap">{formatRange(from, to)}</span>
                <ChevronDown size={12} className="text-[#94A3B8]" />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-lg dark:border-strokedark dark:bg-boxdark">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Quick ranges
                    </p>

                    <div className="mb-4 grid grid-cols-2 gap-2">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => apply(...preset.range())}
                                className="rounded-lg border border-[#E5E7EB] px-2 py-1.5 text-xs font-medium text-[#334155] transition hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] dark:border-strokedark dark:text-bodydark1 dark:hover:bg-meta-4"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Custom
                    </p>

                    <div className="space-y-2">
                        <label className="block text-xs text-[#64748B]">
                            From
                            <input
                                type="date"
                                value={draftFrom}
                                max={draftTo}
                                onChange={(event) => setDraftFrom(event.target.value)}
                                className="mt-1 w-full rounded-lg border-[#E5E7EB] py-1.5 text-sm text-[#334155] focus:border-[#2563EB] focus:ring-[#2563EB] dark:border-strokedark dark:bg-form-input dark:text-bodydark1"
                            />
                        </label>

                        <label className="block text-xs text-[#64748B]">
                            To
                            <input
                                type="date"
                                value={draftTo}
                                min={draftFrom}
                                onChange={(event) => setDraftTo(event.target.value)}
                                className="mt-1 w-full rounded-lg border-[#E5E7EB] py-1.5 text-sm text-[#334155] focus:border-[#2563EB] focus:ring-[#2563EB] dark:border-strokedark dark:bg-form-input dark:text-bodydark1"
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        disabled={!draftFrom || !draftTo || draftFrom > draftTo}
                        onClick={() => apply(draftFrom, draftTo)}
                        className="mt-3 w-full rounded-lg bg-[#2563EB] py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Apply range
                    </button>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
