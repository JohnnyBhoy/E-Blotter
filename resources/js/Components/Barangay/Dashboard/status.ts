/**
 * Presentation for the five case dispositions stored in `blotters.remarks`.
 * Labels come from utils/data/disposition.ts so the dashboard and the blotter
 * forms never drift apart.
 */

import disposition from "@/utils/data/disposition";

export type StatusStyle = {
    id: number;
    label: string;
    /** Solid colour used for chart bars and legend dots. */
    color: string;
    /** Tailwind classes for the pill badge in the records table. */
    badge: string;
};

const COLORS: Record<number, { color: string; badge: string }> = {
    1: { color: "#3B82F6", badge: "bg-[#DBEAFE] text-[#1D4ED8]" }, // For Hearing
    2: { color: "#16A34A", badge: "bg-[#DCFCE7] text-[#15803D]" }, // Amicably Settled
    3: { color: "#F59E0B", badge: "bg-[#FEF3C7] text-[#B45309]" }, // Pending
    4: { color: "#6366F1", badge: "bg-[#E0E7FF] text-[#4338CA]" }, // Referred to PNP
    5: { color: "#94A3B8", badge: "bg-[#F1F5F9] text-[#475569]" }, // Others
};

const FALLBACK = { color: "#94A3B8", badge: "bg-[#F1F5F9] text-[#475569]" };

/** Every disposition in display order, with its colours resolved. */
export const statusStyles: StatusStyle[] = disposition.map((item) => ({
    id: Number(item.id),
    label: item.value,
    ...(COLORS[Number(item.id)] ?? FALLBACK),
}));

/**
 * One disposition's presentation. Unknown or blank remarks fall back to a
 * neutral "Unspecified" pill rather than rendering an empty badge.
 */
export const getStatusStyle = (id: number | string | null | undefined): StatusStyle => {
    const numeric = Number(id);
    const match = statusStyles.find((style) => style.id === numeric);

    return match ?? { id: numeric, label: "Unspecified", ...FALLBACK };
};
