/** Display helpers shared by the barangay dashboard components. */

import { BlotterRecord } from "./types";

/**
 * Reference number shown in the table, e.g. BLT-2025-128. `entry_number` is
 * only unique per barangay per year, so the year is part of the label.
 */
export const formatBlotterNo = (record: BlotterRecord): string => {
    const source = record.date_reported || record.created_at;
    const year = new Date(source).getFullYear();
    const entry = String(record.entry_number ?? 0).padStart(3, "0");

    return `BLT-${Number.isNaN(year) ? "----" : year}-${entry}`;
};

/** "May 14, 2025", or an em dash when the value is unusable. */
export const formatDate = (value?: string | null): string => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

/**
 * "10:30 AM" from a stored "HH:MM" / "HH:MM:SS" string. Times are kept in their
 * own varchar column, so they are parsed against an arbitrary date.
 */
export const formatTime = (value?: string | null): string => {
    if (!value) {
        return "";
    }

    const [hours, minutes] = value.split(":");
    const date = new Date(2000, 0, 1, Number(hours), Number(minutes));

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

/** "May 7 – May 14, 2025" for the date range button. */
export const formatRange = (from: string, to: string): string => {
    const start = new Date(from);
    const end = new Date(to);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return `${from} – ${to}`;
    }

    const sameYear = start.getFullYear() === end.getFullYear();

    const startLabel = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(sameYear ? {} : { year: "numeric" }),
    });

    const endLabel = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return `${startLabel} – ${endLabel}`;
};

/** Whole-number percentage of `value` against `total`, 0 when there is no data. */
export const percentOf = (value: number, total: number): number =>
    total > 0 ? Math.round((value * 100) / total) : 0;
