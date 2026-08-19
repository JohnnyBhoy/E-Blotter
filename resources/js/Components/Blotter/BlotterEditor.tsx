import { useForm, usePage } from '@inertiajs/react';
import React, { FormEvent, useMemo, useState } from 'react';
import {
    CheckLg,
    CircleHalf,
    ExclamationTriangleFill,
} from 'react-bootstrap-icons';
import Swal from 'sweetalert2';

import { PageProps } from '@/Pages/types';
import Authentication from './Authentication';
import BrfForm from './BrfForm';
import CaseDisposition from './CaseDisposition';
import Narrative from './Narrative';
import PersonInvolveData from './PersonInvolveData';
import Modal from './ui/Modal';
import TabBar from './ui/TabBar';
import { BLOTTER_TABS, TAB_FOR_FIELD, blankComplainant, blankRespondent } from './blotterForm';

type BlotterEditorProps = {
    /** "create" starts from a blank entry, "edit" from `record`. */
    mode: 'create' | 'edit';
    /** The fetched entry, null when creating. */
    record: any;
    /** Entry number pre-filled on a new entry. */
    nextEntryNumber: number;
    onClose: () => void;
    onSaved: () => void;
};

const pad = (value: number) => String(value).padStart(2, '0');

/** A stored person row reduced to the keys the form writes. */
const toCard = (row: any, blank: Record<string, any>) => {
    const card: Record<string, any> = { ...blank };

    Object.keys(blank).forEach((key) => {
        const value = row?.[key];

        if (value === null || value === undefined) return;

        // Dates arrive as full timestamps; <input type="date"> needs Y-m-d.
        card[key] = key.endsWith('_birth_date') ? String(value).substring(0, 10) : value;
    });

    return card;
};

/**
 * Create and edit an entry without leaving the console.
 *
 * The same section components as the standalone blotter form are reused here,
 * grouped into tabs instead of stacked into one long page, so the barangay
 * fills in exactly the fields it always has.
 */
const BlotterEditor = ({
    mode,
    record,
    nextEntryNumber,
    onClose,
    onSaved,
}: BlotterEditorProps) => {
    const user = usePage<PageProps>().props.auth.user;

    const now = new Date();
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeNow = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const blotter = record?.blotter;
    const isEdit = mode === 'edit';

    // The photo already on the entry, so a save that does not touch the upload
    // field can leave it alone.
    const existingPhoto: string = blotter?.uploaded_file ?? '';

    const [tab, setTab] = useState<string>('details');
    const [issues, setIssues] = useState<Record<string, string>>({});

    const {
        data,
        setData,
        post,
        processing,
        errors: serverErrors,
        transform,
        isDirty,
    } = useForm({
        id: blotter?.id ?? 0,
        user_id: user?.id,
        entry_number: isEdit ? blotter?.entry_number : nextEntryNumber,
        barangay: (isEdit ? blotter?.barangay : user?.name) ?? '',
        date_reported: isEdit ? String(blotter?.date_reported ?? '').substring(0, 10) : today,
        time_of_report: (isEdit ? blotter?.time_of_report : timeNow) ?? '',
        date_of_incident: isEdit ? String(blotter?.date_of_incident ?? '').substring(0, 10) : '',
        time_of_incident: (isEdit ? blotter?.time_of_incident : '') ?? '',
        incident_type: (isEdit ? blotter?.incident_type : '') ?? '',

        complainant_data:
            isEdit && record?.complainants?.length
                ? record.complainants.map((row: any) => toCard(row, blankComplainant))
                : [{ ...blankComplainant }],

        respondent_data:
            isEdit && record?.respondents?.length
                ? record.respondents.map((row: any) => toCard(row, blankRespondent))
                : [{ ...blankRespondent }],

        narrative: (isEdit ? blotter?.narrative : '') ?? '',
        uploaded_file: (isEdit ? existingPhoto : '') as string | File,
        remarks: (isEdit ? blotter?.remarks : '') ?? '',
        complainant_signature: '',
        recorded_by: (isEdit ? blotter?.recorded_by : '') ?? '',
        recorded_by_signature: '',
    });

    /** Closing loses whatever was typed, so a touched form asks first. */
    const handleClose = () => {
        if (!isDirty || processing) return onClose();

        Swal.fire({
            title: isEdit ? 'Discard these changes?' : 'Discard this entry?',
            text: 'Anything you have filled in will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Discard',
            cancelButtonText: 'Keep editing',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) onClose();
        });
    };

    // Server-side validation messages sit alongside the client-side ones.
    const errors = useMemo(
        () => ({ ...issues, ...(serverErrors as Record<string, string>) }),
        [issues, serverErrors],
    );

    const plainNarrative = String(data.narrative ?? '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();

    /** Which tab each outstanding issue belongs to, for the tab badges. */
    const issuesByTab = useMemo(() => {
        const counts: Record<string, number> = {};

        Object.keys(errors).forEach((key) => {
            // Person fields are keyed "<index>.<field>", everything else is flat.
            const field = key.includes('.') ? key.split('.').slice(1).join('.') : key;
            const owner = field.startsWith('complainant_')
                ? 'complainant'
                : field.startsWith('respondent_')
                    ? 'respondent'
                    : TAB_FOR_FIELD[field];

            if (owner) counts[owner] = (counts[owner] ?? 0) + 1;
        });

        return counts;
    }, [errors]);

    const tabs = BLOTTER_TABS.map((item) => ({ ...item, issues: issuesByTab[item.id] }));

    /** Everything the barangay must supply before the entry can be saved. */
    const validate = () => {
        const found: Record<string, string> = {};

        if (!data.entry_number || Number(data.entry_number) < 1) {
            found.entry_number = 'Enter the blotter entry number.';
        }

        if (!String(data.barangay ?? '').trim()) {
            found.barangay = 'Barangay name is required.';
        }

        if (!data.incident_type) {
            found.incident_type = 'Select the type of offense or incident.';
        }

        if (!data.date_reported) {
            found.date_reported = 'Select the date this was reported.';
        }

        if (!data.time_of_report) {
            found.time_of_report = 'Select the time this was reported.';
        }

        if (!data.date_of_incident) {
            found.date_of_incident = 'Select the date the incident happened.';
        }

        data.complainant_data.forEach((complainant: any, index: number) => {
            const require = (suffix: string, message: string) => {
                const key = `complainant_${suffix}`;
                const value = complainant[key];

                if (value === '' || value === 0 || value === undefined || value === null) {
                    found[`${index}.${key}`] = message;
                }
            };

            require('family_name', 'Family name is required.');
            require('first_name', 'First name is required.');
            require('middle_name', 'Middle name is required.');
            require('birth_date', 'Birth date is required.');
            require('place_of_birth', 'Place of birth is required.');
            require('region', 'Select a region.');
            require('province', 'Select a province.');
            require('city', 'Select a city or municipality.');
            require('barangay', 'Select a barangay.');
        });

        if (!plainNarrative) {
            found.narrative = 'Describe what happened.';
        }

        if (!String(data.recorded_by ?? '').trim()) {
            found.recorded_by = 'Enter the name of the person recording this entry.';
        }

        return found;
    };

    /** Jump to the tab holding the first problem and focus that field. */
    const focusFirstIssue = (found: Record<string, string>) => {
        const [firstKey] = Object.keys(found);
        if (!firstKey) return;

        const [index, fieldName] = firstKey.split('.');
        const field = fieldName ?? firstKey;
        const owner = field.startsWith('complainant_')
            ? 'complainant'
            : field.startsWith('respondent_')
                ? 'respondent'
                : TAB_FOR_FIELD[field] ?? 'details';

        setTab(owner);

        const elementId = fieldName ? `${fieldName}_${index}` : firstKey;

        window.requestAnimationFrame(() => {
            const element = document.getElementById(elementId);

            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element?.focus({ preventScroll: true });
        });
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const found = validate();

        if (Object.keys(found).length) {
            setIssues(found);

            const count = Object.keys(found).length;

            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: count === 1 ? '1 field needs attention' : `${count} fields need attention`,
                text: 'The highlighted fields are marked on their tab.',
                timer: 2800,
                showConfirmButton: false,
            });

            return focusFirstIssue(found);
        }

        setIssues({});

        // The upload column is only rewritten when a new file arrives or the
        // barangay cleared the existing one; an untouched edit keeps its photo.
        transform((payload: any) => ({
            ...payload,
            remove_uploaded_file:
                isEdit && existingPhoto && payload.uploaded_file === '' ? 1 : 0,
        }));

        post(isEdit ? '/blotter/update' : route('blotter'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                Swal.fire({
                    title: isEdit ? 'Blotter entry updated' : 'Blotter entry saved',
                    text: `Entry number ${data.entry_number} has been ${isEdit ? 'updated' : 'added to your records'}.`,
                    icon: 'success',
                    timer: 2400,
                    showConfirmButton: false,
                });

                onSaved();
            },
            onError: () =>
                Swal.fire({
                    title: 'Entry not saved',
                    text: 'Please review the highlighted fields and try again.',
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false,
                }),
        });
    };

    const issueCount = Object.keys(errors).length;

    return (
        <Modal
            open
            onClose={handleClose}
            title={isEdit ? `Edit Entry No. ${blotter?.entry_number}` : 'New Blotter Entry'}
            subtitle={
                <>
                    {isEdit
                        ? 'Correct any detail, then save without leaving the console.'
                        : `Entry No. ${data.entry_number}`}
                    <span className="mx-1 text-danger">*</span>
                    marks a required field.
                </>
            }
            toolbar={<TabBar tabs={tabs} current={tab} onSelect={setTab} />}
            footer={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {issueCount ? (
                        <span className="flex items-center gap-2 text-xs font-medium text-danger">
                            <ExclamationTriangleFill size={13} />
                            {issueCount === 1
                                ? '1 field still needs your attention'
                                : `${issueCount} fields still need your attention`}
                        </span>
                    ) : (
                        <span className="text-xs text-body dark:text-bodydark">
                            All sections stay on this page — switch tabs freely before saving.
                        </span>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex h-10 items-center rounded-lg border border-stroke px-4 text-sm font-medium text-black transition hover:bg-whiten dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="blotter-modal-form"
                            disabled={processing}
                            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    Saving...
                                    <CircleHalf size={14} className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    {isEdit ? 'Save changes' : 'Save blotter entry'}
                                    <CheckLg size={15} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            }
        >
            <form id="blotter-modal-form" onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-4">
                    {tab === 'details' ? (
                        <BrfForm data={data} setData={setData} errors={errors} />
                    ) : null}

                    {tab === 'complainant' ? (
                        <PersonInvolveData
                            data={data}
                            setData={setData}
                            person="Complainant"
                            errors={errors}
                        />
                    ) : null}

                    {tab === 'respondent' ? (
                        <PersonInvolveData
                            data={data}
                            setData={setData}
                            person="Suspect/s"
                            errors={errors}
                        />
                    ) : null}

                    {tab === 'narrative' ? (
                        <Narrative data={data} setData={setData} errors={errors} />
                    ) : null}

                    {tab === 'disposition' ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <CaseDisposition data={data} setData={setData} errors={errors} />
                            <Authentication data={data} setData={setData} errors={errors} />
                        </div>
                    ) : null}
                </div>
            </form>
        </Modal>
    );
};

export default BlotterEditor;
