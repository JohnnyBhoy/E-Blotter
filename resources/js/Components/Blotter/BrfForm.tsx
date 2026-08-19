import incidentTypes from '@/utils/data/incidentTypes';
import React from 'react';
import { FileEarmarkTextFill } from 'react-bootstrap-icons';
import FormSection from './ui/FormSection';
import { SearchSelect, TextField } from './ui/Field';

type BrfFormProps = {
    data: any;
    setData: CallableFunction;
    errors?: Record<string, string>;
};

const incidentOptions = incidentTypes.map((incident: any) => ({
    value: incident.id,
    label: incident.value,
}));

const BrfForm = ({ data, setData, errors = {} }: BrfFormProps) => {
    const today = new Date().toISOString().substring(0, 10);

    return (
        <FormSection
            title="Barangay e-Record Form (BRF)"
            description="Entry details and when the incident was reported."
            icon={<FileEarmarkTextFill size={16} />}
        >
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                <TextField
                    label="Entry Number"
                    name="entry_number"
                    type="number"
                    min={1}
                    required
                    value={data?.entry_number}
                    onChange={(e) => setData('entry_number', e.target.value)}
                    error={errors.entry_number}
                    hint="Auto-filled from your last entry."
                />

                <TextField
                    label="Barangay"
                    name="barangay"
                    required
                    value={data?.barangay}
                    onChange={(e) => setData('barangay', e.target.value)}
                    error={errors.barangay}
                    placeholder="Barangay name"
                />

                <TextField
                    label="Date Reported"
                    name="date_reported"
                    type="date"
                    required
                    max={today}
                    value={data?.date_reported}
                    onChange={(e) => setData('date_reported', e.target.value)}
                    error={errors.date_reported}
                />

                <TextField
                    label="Time of Report"
                    name="time_of_report"
                    type="time"
                    required
                    value={data?.time_of_report}
                    onChange={(e) => setData('time_of_report', e.target.value)}
                    error={errors.time_of_report}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                <TextField
                    label="Date of Incident"
                    name="date_of_incident"
                    type="date"
                    required
                    max={data?.date_reported || today}
                    value={data?.date_of_incident}
                    onChange={(e) => setData('date_of_incident', e.target.value)}
                    error={errors.date_of_incident}
                />

                <TextField
                    label="Time of Incident"
                    name="time_of_incident"
                    type="time"
                    required
                    value={data?.time_of_incident}
                    onChange={(e) => setData('time_of_incident', e.target.value)}
                    error={errors.time_of_incident}
                />

                <div className="sm:col-span-2">
                    <SearchSelect
                        label="Type of Offense / Incident"
                        name="incident_type"
                        required
                        value={data?.incident_type}
                        options={incidentOptions}
                        onSelect={(_name, value) => setData('incident_type', value)}
                        error={errors.incident_type}
                        placeholder="Type to search an offense (e.g. threats, physical injuries)"
                        hint="Start typing to filter the list of offenses."
                    />
                </div>
            </div>
        </FormSection>
    );
};

export default BrfForm;
