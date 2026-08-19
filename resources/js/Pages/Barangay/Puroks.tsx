import React, { useMemo } from "react";

import BreakdownPage from "@/Components/Barangay/Breakdown/BreakdownPage";
import { BreakdownItem } from "@/Components/Barangay/Breakdown/BreakdownList";
import { SortDirection, SortKey } from "@/Components/Blotter/TableHead";
import { PageProps } from "@/Pages/types";

type PurokCount = { name: string; count: number };

/**
 * Barangay entries grouped by the purok/village of the complainant. Same shell
 * as the incident-type page; only the grouping differs.
 */
export default function Puroks({ auth, puroks, breakdown, purok, pageDisplay, pageNumber, keyword, sort, direction }:
    PageProps<{
        puroks: any;
        breakdown: PurokCount[];
        purok: string | null;
        pageDisplay: number;
        pageNumber: number;
        keyword: string;
        sort: SortKey;
        direction: SortDirection;
    }>) {

    const items: BreakdownItem[] = useMemo(
        () => (breakdown ?? []).map((entry) => ({
            value: entry.name,
            label: entry.name,
            count: entry.count,
        })),
        [breakdown]
    );

    return (
        <BreakdownPage
            user={auth.user}
            title="Puroks"
            breadcrumb="Puroks"
            subtitle={purok
                ? "Blotter entries whose complainant lives in this purok."
                : "Pick a purok on the left to narrow the list."}
            url="/barangay-puroks"
            filterKey="purok"
            filterLabel="Puroks"
            items={items}
            selected={purok ?? null}
            selectedLabel={purok}
            entries={puroks}
            pageDisplay={pageDisplay}
            pageNumber={pageNumber}
            keyword={keyword}
            sort={sort}
            direction={direction}
            exportName={purok ? `Purok ${purok}` : "Puroks"}
        />
    );
}
