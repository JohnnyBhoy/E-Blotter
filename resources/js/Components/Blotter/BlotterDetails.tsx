import React, { ReactNode } from 'react';
import {
    CalendarEventFill,
    ClipboardCheckFill,
    GeoAltFill,
    ImageFill,
    JournalText,
    PersonBadgeFill,
} from 'react-bootstrap-icons';

import { formatDate, formatTime } from '@/Components/Barangay/Dashboard/format';
import FormSection from './ui/FormSection';
import { addressOf, ageOf, fullName, labelOf } from './blotterLabels';

type BlotterDetailsProps = {
    tab: string;
    blotter: any;
    complainants: any[];
    respondents: any[];
    /** Server-resolved path to the uploaded photo, null when none. */
    photoUrl: string | null;
};

/** One label/value pair in the read-only grid. */
const Detail = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-wide text-body dark:text-bodydark">
            {label}
        </dt>
        <dd className="mt-0.5 break-words text-sm text-black dark:text-white">
            {value === '' || value === null || value === undefined ? '—' : value}
        </dd>
    </div>
);

const Grid = ({ children }: { children: ReactNode }) => (
    <dl className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
    </dl>
);

/** Read-only rendering of one person card, complainant or respondent. */
const PersonCard = ({
    person,
    prefix,
    index,
    total,
}: {
    person: any;
    prefix: 'complainant' | 'respondent';
    index: number;
    total: number;
}) => {
    const at = (suffix: string) => person?.[`${prefix}_${suffix}`];
    const role = prefix === 'complainant' ? 'Complainant' : 'Person Complained Of';

    return (
        <FormSection
            title={fullName(person, prefix)}
            description={total > 1 ? `${role} ${index + 1} of ${total}` : role}
            icon={<PersonBadgeFill size={16} />}
        >
            <Grid>
                <Detail label="Birth date" value={formatDate(at('birth_date'))} />
                <Detail label="Age" value={ageOf(at('birth_date'))} />
                <Detail label="Place of birth" value={at('place_of_birth')} />
                <Detail label="Citizenship" value={labelOf('citizenship', at('citizenship'))} />
                <Detail label="Sex / Gender" value={labelOf('gender', at('gender'))} />
                <Detail label="Civil status" value={labelOf('civilStatus', at('civil_status'))} />
                <Detail label="Occupation" value={labelOf('occupation', at('occupation'))} />
                <Detail label="Education" value={labelOf('education', at('education'))} />
                <Detail label="Email address" value={at('email_address')} />
            </Grid>

            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-stroke pt-4 dark:border-strokedark sm:grid-cols-2">
                <div className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <GeoAltFill size={14} />
                    </span>
                    <Detail label="Home address" value={addressOf(person, prefix)} />
                </div>

                <div className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <GeoAltFill size={14} />
                    </span>
                    <Detail label="Work address" value={addressOf(person, prefix, 'work_')} />
                </div>
            </div>
        </FormSection>
    );
};

const EmptyPeople = ({ role }: { role: string }) => (
    <FormSection title={role} icon={<PersonBadgeFill size={16} />}>
        <p className="text-sm text-body dark:text-bodydark">
            No {role.toLowerCase()} was recorded on this entry.
        </p>
    </FormSection>
);

/**
 * The view side of the console modal: the same five groups as the edit form,
 * rendered as plain text so an entry can be read without any risk of
 * changing it.
 */
const BlotterDetails = ({
    tab,
    blotter,
    complainants,
    respondents,
    photoUrl,
}: BlotterDetailsProps) => {
    if (tab === 'details') {
        return (
            <FormSection
                title="Barangay e-Record Form (BRF)"
                description="Entry details and when the incident was reported."
                icon={<CalendarEventFill size={16} />}
            >
                <Grid>
                    <Detail label="Entry number" value={blotter?.entry_number} />
                    <Detail label="Barangay" value={blotter?.barangay} />
                    <Detail label="Date reported" value={formatDate(blotter?.date_reported)} />
                    <Detail label="Time of report" value={formatTime(blotter?.time_of_report) || '—'} />
                    <Detail label="Date of incident" value={formatDate(blotter?.date_of_incident)} />
                    <Detail label="Time of incident" value={formatTime(blotter?.time_of_incident) || '—'} />
                    <Detail label="Recorded by" value={blotter?.recorded_by} />
                    <Detail label="Encoded on" value={formatDate(blotter?.created_at)} />
                </Grid>

                <div className="mt-5 border-t border-stroke pt-4 dark:border-strokedark">
                    <Detail
                        label="Type of offense / incident"
                        value={labelOf('incidentType', blotter?.incident_type)}
                    />
                </div>
            </FormSection>
        );
    }

    if (tab === 'complainant') {
        return (
            <div className="flex flex-col gap-4">
                {complainants.length ? (
                    complainants.map((person, index) => (
                        <PersonCard
                            key={person.id ?? index}
                            person={person}
                            prefix="complainant"
                            index={index}
                            total={complainants.length}
                        />
                    ))
                ) : (
                    <EmptyPeople role="Complainant" />
                )}
            </div>
        );
    }

    if (tab === 'respondent') {
        return (
            <div className="flex flex-col gap-4">
                {respondents.length ? (
                    respondents.map((person, index) => (
                        <PersonCard
                            key={person.id ?? index}
                            person={person}
                            prefix="respondent"
                            index={index}
                            total={respondents.length}
                        />
                    ))
                ) : (
                    <EmptyPeople role="Person Complained Of" />
                )}
            </div>
        );
    }

    if (tab === 'narrative') {
        return (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    <FormSection
                        title="Narrative of the Incident"
                        description="As recorded on the blotter."
                        icon={<JournalText size={16} />}
                    >
                        {blotter?.narrative ? (
                            <div
                                className="prose prose-sm max-w-none text-sm leading-relaxed text-black dark:text-white"
                                // The narrative is stored as the rich-text HTML
                                // the barangay's own editor produced.
                                dangerouslySetInnerHTML={{ __html: blotter.narrative }}
                            />
                        ) : (
                            <p className="text-sm text-body dark:text-bodydark">
                                No narrative was recorded.
                            </p>
                        )}
                    </FormSection>
                </div>

                <div className="lg:col-span-2">
                    <FormSection title="Photo Evidence" icon={<ImageFill size={16} />}>
                        {photoUrl ? (
                            <a href={photoUrl} target="_blank" rel="noreferrer">
                                <img
                                    src={photoUrl}
                                    alt="Incident evidence"
                                    className="h-64 w-full rounded-lg border border-stroke object-cover dark:border-strokedark"
                                />
                            </a>
                        ) : (
                            <p className="text-sm text-body dark:text-bodydark">
                                No photo was attached to this entry.
                            </p>
                        )}
                    </FormSection>
                </div>
            </div>
        );
    }

    return (
        <FormSection
            title="Case Disposition"
            description="Action taken on the complaint, and who recorded it."
            icon={<ClipboardCheckFill size={16} />}
        >
            <Grid>
                <Detail
                    label="Remarks / action taken"
                    value={labelOf('disposition', blotter?.remarks)}
                />
                <Detail label="Recorded by" value={blotter?.recorded_by} />
                <Detail label="Last updated" value={formatDate(blotter?.updated_at)} />
            </Grid>
        </FormSection>
    );
};

export default BlotterDetails;
