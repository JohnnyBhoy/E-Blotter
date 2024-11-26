export type BlotterProps = {
    id: number;
    user_id: number;
    blotter_id: number;
    entry_number: number;
    complainant_family_name: string;
    complainant_first_name: string;
    complainant_middle_name: string;
    complainant_street: string;
    complainant_village: string;
    complainant_barangay: string;
    respondent_family_name: string;
    respondent_first_name: string;
    respondent_middle_name: string;
    incident_type: number;
    created_at: string;
    remarks: string;
    date_reported: string;
    time_of_report: string;
    date_of_incident: string;
    time_of_incident: string;
    uploaded_file: string;
}