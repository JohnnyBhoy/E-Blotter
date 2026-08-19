import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ArrowClockwise,
    CircleHalf,
    ExclamationTriangleFill,
    PencilSquare,
} from 'react-bootstrap-icons';

import { formatDate } from '@/Components/Barangay/Dashboard/format';
import { getStatusStyle } from '@/Components/Barangay/Dashboard/status';
import BlotterDetails from './BlotterDetails';
import BlotterEditor from './BlotterEditor';
import Modal from './ui/Modal';
import TabBar from './ui/TabBar';
import { BLOTTER_TABS } from './blotterForm';

export type BlotterModalMode = 'view' | 'edit' | 'create';

type BlotterModalProps = {
    /** Blotter ID to open; ignored when creating. */
    id: number | null;
    mode: BlotterModalMode;
    /** Entry number pre-filled on a new entry. */
    nextEntryNumber: number;
    /** Whether this account may correct entries. */
    canEdit: boolean;
    onClose: () => void;
    /** Called after a successful save, so the console can refresh its table. */
    onSaved: () => void;
};

/** The payload GET /blotter/record returns. */
type LoadedEntry = {
    blotter: any;
    complainants: any[];
    respondents: any[];
    uploaded_file_url: string | null;
};

/**
 * The console's single window onto one blotter entry.
 *
 * Reading, correcting and filing an entry all happen here so the barangay never
 * leaves the dashboard. The entry is pulled over XHR rather than as its own
 * Inertia page, which is what used to send the table away to /blotter/edit.
 */
const BlotterModal = ({
    id,
    mode,
    nextEntryNumber,
    canEdit,
    onClose,
    onSaved,
}: BlotterModalProps) => {
    const [record, setRecord] = useState<LoadedEntry | null>(null);
    const [loading, setLoading] = useState<boolean>(mode !== 'create');
    const [failed, setFailed] = useState<string>('');
    const [tab, setTab] = useState<string>('details');

    // "View" can be promoted to "edit" in place; the fetched entry is reused.
    const [current, setCurrent] = useState<BlotterModalMode>(mode);

    useEffect(() => setCurrent(mode), [mode, id]);

    useEffect(() => {
        if (mode === 'create' || !id) return;

        let cancelled = false;

        setLoading(true);
        setFailed('');
        setTab('details');

        axios
            .get('/blotter/record', { params: { id } })
            .then(({ data }) => {
                if (!cancelled) setRecord(data);
            })
            .catch((error) => {
                if (cancelled) return;

                setFailed(
                    error?.response?.status === 403
                        ? 'That entry is outside your barangay.'
                        : 'The entry could not be loaded. Please try again.',
                );
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id, mode]);

    if (current === 'create') {
        return (
            <BlotterEditor
                mode="create"
                record={null}
                nextEntryNumber={nextEntryNumber}
                onClose={onClose}
                onSaved={onSaved}
            />
        );
    }

    if (loading || failed || !record) {
        return (
            <Modal open onClose={onClose} title="Blotter Entry">
                <div className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center">
                    {failed ? (
                        <>
                            <ExclamationTriangleFill size={26} className="text-danger" />
                            <p className="text-sm font-medium text-black dark:text-white">
                                {failed}
                            </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-10 items-center gap-2 rounded-lg border border-stroke px-4 text-sm font-medium text-black dark:border-strokedark dark:text-white"
                            >
                                <ArrowClockwise size={14} />
                                Close
                            </button>
                        </>
                    ) : (
                        <>
                            <CircleHalf size={24} className="animate-spin text-primary" />
                            <p className="text-sm text-body dark:text-bodydark">
                                Loading the entry...
                            </p>
                        </>
                    )}
                </div>
            </Modal>
        );
    }

    if (current === 'edit') {
        return (
            <BlotterEditor
                mode="edit"
                record={record}
                nextEntryNumber={nextEntryNumber}
                onClose={onClose}
                onSaved={onSaved}
            />
        );
    }

    const { blotter } = record;
    const status = getStatusStyle(blotter?.remarks);

    return (
        <Modal
            open
            onClose={onClose}
            title={`Entry No. ${blotter?.entry_number}`}
            subtitle={`Reported ${formatDate(blotter?.date_reported)} · ${blotter?.barangay ?? 'Barangay'}`}
            toolbar={<TabBar tabs={BLOTTER_TABS} current={tab} onSelect={setTab} />}
            headerActions={
                <>
                    <span
                        className={`hidden rounded-md px-2 py-1 text-[11px] font-semibold sm:inline-flex ${status.badge}`}
                    >
                        {status.label}
                    </span>

                    {canEdit ? (
                        <button
                            type="button"
                            onClick={() => setCurrent('edit')}
                            className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-opacity-90"
                        >
                            <PencilSquare size={13} />
                            Edit entry
                        </button>
                    ) : null}
                </>
            }
        >
            <BlotterDetails
                tab={tab}
                blotter={blotter}
                complainants={record.complainants ?? []}
                respondents={record.respondents ?? []}
                photoUrl={record.uploaded_file_url}
            />
        </Modal>
    );
};

export default BlotterModal;
