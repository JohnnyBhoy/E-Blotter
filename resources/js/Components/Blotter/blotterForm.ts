/**
 * Shape of the blotter form, shared by the console modal's view and edit sides.
 *
 * The tabs group the same fields the standalone form stacks into one page, so
 * the barangay fills in nothing new — it just stops scrolling for it.
 */

import { Tab } from './ui/TabBar';

export const BLOTTER_TABS: Tab[] = [
    { id: 'details', label: 'Entry Details' },
    { id: 'complainant', label: 'Complainant' },
    { id: 'respondent', label: 'Person Complained Of' },
    { id: 'narrative', label: 'Narrative & Evidence' },
    { id: 'disposition', label: 'Disposition' },
];

/** Which tab a flat (non-person) field lives on, for the tab issue badges. */
export const TAB_FOR_FIELD: Record<string, string> = {
    entry_number: 'details',
    barangay: 'details',
    date_reported: 'details',
    time_of_report: 'details',
    date_of_incident: 'details',
    time_of_incident: 'details',
    incident_type: 'details',
    narrative: 'narrative',
    uploaded_file: 'narrative',
    remarks: 'disposition',
    recorded_by: 'disposition',
};

/** An unfilled complainant card. Reference selects default to their first ID. */
export const blankComplainant = {
    complainant_family_name: '',
    complainant_first_name: '',
    complainant_middle_name: '',
    complainant_birth_date: '',
    complainant_place_of_birth: '',
    complainant_citizenship: 1,
    complainant_gender: 1,
    complainant_civil_status: 1,
    complainant_occupation: 1,
    complainant_education: 1,
    complainant_email_address: '',
    complainant_street: '',
    complainant_village: '',
    complainant_barangay: 0,
    complainant_city: 0,
    complainant_province: 0,
    complainant_region: 0,
    complainant_work_street: '',
    complainant_work_village: '',
    complainant_work_barangay: 0,
    complainant_work_city: 0,
    complainant_work_province: 0,
    complainant_work_region: 0,
};

/** An unfilled respondent (person complained of) card. */
export const blankRespondent = {
    respondent_family_name: '',
    respondent_first_name: '',
    respondent_middle_name: '',
    respondent_birth_date: '',
    respondent_place_of_birth: '',
    respondent_citizenship: 1,
    respondent_gender: 1,
    respondent_civil_status: 1,
    respondent_occupation: 1,
    respondent_education: 1,
    respondent_email_address: '',
    respondent_street: '',
    respondent_village: '',
    respondent_barangay: 0,
    respondent_city: 0,
    respondent_province: 0,
    respondent_region: 0,
    respondent_work_street: '',
    respondent_work_village: '',
    respondent_work_barangay: 0,
    respondent_work_city: 0,
    respondent_work_province: 0,
    respondent_work_region: 0,
};
