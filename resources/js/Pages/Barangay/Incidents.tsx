import React, { useMemo } from "react";

import BreakdownPage from "@/Components/Barangay/Breakdown/BreakdownPage";
import { BreakdownItem } from "@/Components/Barangay/Breakdown/BreakdownList";
import { SortDirection, SortKey } from "@/Components/Blotter/TableHead";
import { PageProps } from "@/Pages/types";
import getIncidentType from "@/utils/functions/getIncidentType";
import getIncidentTypeShort from "@/utils/functions/getIncidentTypeShort";

type TypeCount = { id: number; count: number };

/**
 * Barangay entries grouped by incident type.
 *
 * The old page read its filter out of `window.location.search.split("=")[1]`,
 * paged in the browser with broken arithmetic, and showed an empty table when
 * opened from the sidebar because no type was selected. Everything now comes
 * from the server through the shared drill-down shell.
 */
export default function Incidents({ auth, incidents, breakdown, incidentType, pageDisplay, pageNumber, keyword, sort, direction }:
    PageProps<{
        incidents: any;
        breakdown: TypeCount[];
        incidentType: number | null;
        pageDisplay: number;
        pageNumber: number;
        keyword: string;
        sort: SortKey;
        direction: SortDirection;
    }>) {

    const items: BreakdownItem[] = useMemo(
        () => (breakdown ?? []).map((entry) => ({
            value: entry.id,
            label: getIncidentTypeShort(entry.id),
            // The quoted offence title, dropped from the short citation above.
            hint: getIncidentType(entry.id)?.split(" - ")[1]?.replace(/[“”]/g, "") ?? undefined,
            count: entry.count,
        })),
        [breakdown]
    );

    const selectedLabel = incidentType
        ? `${getIncidentTypeShort(incidentType)} — ${getIncidentType(incidentType)?.split(" - ")[1]?.replace(/[“”]/g, "") ?? ""}`
        : null;

    return (
        <BreakdownPage
            user={auth.user}
            title="Incidents"
            breadcrumb="Incidents"
            subtitle={incidentType
                ? "Blotter entries recorded under this incident type."
                : "Pick an incident type on the left to narrow the list."}
            url="/barangay-incidents"
            filterKey="incident_type"
            filterLabel="Incident types"
            items={items}
            selected={incidentType ?? null}
            selectedLabel={selectedLabel}
            entries={incidents}
            pageDisplay={pageDisplay}
            pageNumber={pageNumber}
            keyword={keyword}
            sort={sort}
            direction={direction}
            exportName={incidentType ? getIncidentTypeShort(incidentType) : "Incidents"}
        />
    );
}
