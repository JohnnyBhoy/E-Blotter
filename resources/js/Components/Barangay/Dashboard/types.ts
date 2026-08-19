/**
 * Props shared by the blotter console, which every level works out of: a
 * barangay, a municipal/PNP station, a province, a region and the super admin
 * all render the same page over a different slice of the country.
 */

/** How wide the signed-in account's jurisdiction is. */
export type ConsoleLevel = "barangay" | "station" | "province" | "region" | "national";

/**
 * The jurisdiction of the signed-in account, from App\Support\Jurisdiction.
 * Names the level, the units one step below it, and what the account may do.
 */
export type ConsoleScope = {
    level: ConsoleLevel;
    /** Human name of the level, e.g. "Municipal / Station". */
    levelLabel: string;
    /** PSGC code of this jurisdiction, 0 at national level. */
    code: number;
    barangayCode: number;
    cityCode: number;
    provinceCode: number;
    regionCode: number;
    /** Singular name of the units one level down, e.g. "Barangay". */
    childLabel: string;
    childLabelPlural: string;
    /** How many barangay accounts this jurisdiction covers. */
    barangayCount: number;
    /** Only a barangay files entries. */
    canEncode: boolean;
    canEdit: boolean;
    canDelete: boolean;
};

/**
 * One row of the area breakdown: a purok for a barangay, and the PSGC code of
 * the level below for everyone above it. The names of coded areas live in the
 * PSGC lookups under utils/data, so the server sends the code and the console
 * resolves the label -- see utils/functions/getAreaName.
 */
export type AreaCount = {
    code: number;
    /** Set for puroks, null for coded areas. */
    name: string | null;
    count: number;
};

export type DashboardSummary = {
    total: number;
    pending: number;
    inProgress: number;
    /** Pending + in progress: everything not yet closed. */
    active: number;
    resolved: number;
    others: number;
    complainants: number;
    personsInvolved: number;
    resolvedRate: number;
    previousTotal: number;
    trend: number;
    /** How many units one level down reported inside the selected range. */
    areasReporting: number;
    /** Barangay accounts this jurisdiction covers. */
    barangayCount: number;
};

/** A `remarks` (disposition) ID and how many entries carry it. */
export type StatusCount = {
    id: number;
    count: number;
};

/** An `incident_type` ID and how many entries carry it. */
export type IncidentTypeCount = {
    id: number;
    count: number;
};

/** A purok/village name and how many entries were recorded there. */
export type PurokCount = {
    name: string;
    count: number;
};

/** Twelve-month blotter counts, this year against last. */
export type MonthlySeries = {
    year: number;
    previousYear: number;
    current: number[];
    previous: number[];
};

export type BlotterRecord = {
    id: number;
    entry_number: number;
    incident_type: number;
    remarks: number;
    date_reported: string | null;
    time_of_report: string | null;
    date_of_incident: string | null;
    time_of_incident: string | null;
    created_at: string;
    complainant: string | null;
    respondent: string | null;
    /** Complainant's purok/village, blank when never recorded. */
    purok: string | null;
    location: string | null;
    /**
     * PSGC code of the barangay that filed the entry. Above barangay level the
     * console shows it as a column -- one table can hold entries from many
     * barangays.
     */
    barangay_code: number;
};

/** The slice of Laravel's LengthAwarePaginator payload the table needs. */
export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

export type DashboardData = {
    summary: DashboardSummary;
    byStatus: StatusCount[];
    byIncidentType: IncidentTypeCount[];
    /** Puroks for a barangay, the level below for everyone above it. */
    byArea: AreaCount[];
    monthly: MonthlySeries;
    records: Paginated<BlotterRecord>;
};

/** Sort keys the dashboard records query accepts, see BlotterRepository. */
export type ConsoleSortKey =
    | "entry_number"
    | "date"
    | "incident_type"
    | "complainant"
    | "respondent"
    | "purok"
    | "remarks"
    | "id";

export type SortDirection = "asc" | "desc";

export type DashboardFilters = {
    from: string;
    to: string;
    search: string;
    perPage: number;
    /** Case disposition ID, 0 for all. */
    remarks: number;
    /** Incident type ID, 0 for all. */
    incidentType: number;
    /** Purok/village name, blank for all. Barangay level only. */
    purok: string;
    /** PSGC code of one unit below this jurisdiction, 0 for all. */
    area: number;
    sort: ConsoleSortKey;
    direction: SortDirection;
};
