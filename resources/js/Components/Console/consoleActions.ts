/**
 * What the console header can do without navigating.
 *
 * Every level -- barangay, station, province, region, super admin -- works out
 * of one page, so every header item either narrows the table that is already on
 * screen or opens a panel over it. Nothing here is a link: routing away is what
 * these replaced.
 */

/** A panel the header can float over the console. */
export type ConsolePanel =
    | "reports"
    | "incidents"
    /** The level below the viewer: puroks, barangays, cities, provinces or regions. */
    | "areas"
    | "officials"
    | "map"
    | "profile"
    | "settings";

export type ConsoleActions = {
    /** Float one of the panels over the console. */
    openPanel: (panel: ConsolePanel) => void;
    /** Narrow the console table, then bring it into view. */
    filterTable: (changes: Record<string, string | number>) => void;
    /** Scroll the console table into view without changing the filters. */
    focusTable: () => void;
    /** Open the blank blotter form. Barangay accounts only. */
    newEntry: () => void;
};

/** Case dispositions, matching utils/data/disposition ids. */
export const DISPOSITIONS = [
    { id: 1, label: "For Hearing" },
    { id: 2, label: "Amicably Settled" },
    { id: 3, label: "Pending" },
    { id: 4, label: "Referred to PNP" },
];
