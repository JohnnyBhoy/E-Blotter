import { BlotterProps } from '@/Pages/types/blotter';
import disposition from '@/utils/data/disposition';
import incidentTypes from '@/utils/data/incidentTypes';
import getBarangayByBrgyCode from '@/utils/functions/getBarangayByBrgyCode';
import getUserRole from '@/utils/functions/getUserRole';
import { confirmDeleteBlotter, openBlotter } from '@/utils/functions/blotterActions';
import { default as React, useState } from 'react';
import { EyeFill, ImageFill, Images, InboxFill, PencilSquare, Trash, X } from 'react-bootstrap-icons';
import Modal from '../Modal';

// Disposition badge colours, keyed by the `remarks` id in utils/data/disposition.
const REMARK_STYLES: Record<number, string> = {
    1: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white',        // For Hearing
    2: 'bg-success/10 text-success dark:bg-success/20',                        // Amicably Settled
    3: 'bg-warning/10 text-warning dark:bg-warning/20',                        // Pending
    4: 'bg-danger/10 text-danger dark:bg-danger/20',                           // Referred to PNP
    5: 'bg-slate-200 text-slate-600 dark:bg-meta-4 dark:text-bodydark1',       // Others
};

const TOTAL_COLUMNS = 9;

const TableBody = ({ blotters, setData }: { blotters: any; setData: CallableFunction }) => {

    // Local states
    const [showIncidentPhoto, setShowIncidentPhoto] = useState<boolean>(false);
    const [incidentPhotoIdToShow, setIncidentPhotoIdToShow] = useState<number>(0);
    const [blotterId, setBlotterId] = useState<number>(0);
    const [incidentPhotoToShow, setIncidentPhotoToShow] = useState<string>("");

    // User Role and redirect edit route
    const userRole = getUserRole();

    const handleEdit = (id: number) => openBlotter(id, Number(userRole));

    const handleConfirmDelete = (e: any, id: number) => {
        e.preventDefault();

        confirmDeleteBlotter(id, Number(userRole));
    }

    // Get incident type
    const getIncidentType = (type: number) => {
        const incident = incidentTypes?.filter((item: any) => item?.id == type)[0];
        return incident?.value;
    };

    // `remarks` arrives as a string; comparing it as one made '10' sort before
    // '4' and mislabelled entries, so normalise to a number first.
    const getDisposition = (remarks: string) => {
        const id = parseInt(remarks);

        if (isNaN(id)) return { id: 0, label: 'Unspecified' };

        const match = disposition?.find((item: any) => item?.id === id);

        return { id, label: match?.value ?? 'Other' };
    }

    const formatName = (family?: string, first?: string, middle?: string) => {
        const parts = [family, first].filter(Boolean).join(', ');
        const initial = middle ? ` ${middle.charAt(0)}.` : '';

        return parts ? `${parts}${initial}` : '—';
    }

    const handlePreviewIncidentPhoto = (uploadedFile: string, userId: number, blotterId: number) => {
        setBlotterId(blotterId);
        setShowIncidentPhoto(true);
        setIncidentPhotoIdToShow(userId);
        setIncidentPhotoToShow(uploadedFile);
    }

    const rows = blotters
        ?.filter((item: any, index: any, self: any) => self?.findIndex((t: any) => t?.id === item?.id) === index) ?? [];

    return (
        <>
            <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={TOTAL_COLUMNS} className="border border-slate-300 dark:border-strokedark">
                            <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
                                <InboxFill size={54} />
                                <h5 className="text-base font-medium text-slate-500 dark:text-bodydark1">No blotter entries found</h5>
                                <p className="text-sm">Try clearing the filters or searching for a different keyword.</p>
                            </div>
                        </td>
                    </tr>
                ) : rows.map((blotter: BlotterProps, i: number) => {
                    const remark = getDisposition(blotter?.remarks);
                    const placeOfIncident = [
                        blotter?.complainant_street,
                        blotter?.complainant_village,
                        getBarangayByBrgyCode(parseInt(blotter?.complainant_barangay)),
                    ].filter(Boolean).join(', ');

                    return (
                        <tr
                            key={blotter?.id ?? i}
                            className={`transition hover:bg-slate-100 dark:hover:bg-meta-4 ${(i % 2) == 1 ? 'bg-white dark:bg-boxdark' : 'bg-slate-50 dark:bg-meta-4/40'}`}
                        >
                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <h5 className="text-xs font-medium text-black dark:text-white">
                                    {blotter?.entry_number}
                                </h5>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <p className="text-xs text-black dark:text-white">
                                    {formatName(blotter?.complainant_family_name, blotter?.complainant_first_name, blotter?.complainant_middle_name)}
                                </p>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <p className="text-xs text-black dark:text-white">
                                    {formatName(blotter?.respondent_family_name, blotter?.respondent_first_name, blotter?.respondent_middle_name)}
                                </p>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <p
                                    className="text-xs text-black dark:text-white"
                                    title={getIncidentType(blotter?.incident_type)}
                                >
                                    {getIncidentType(blotter?.incident_type)?.split(" - ")[1]?.substring(0, 50) ?? 'Other'}
                                </p>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <p className="text-xs text-black dark:text-white" title={placeOfIncident}>
                                    {placeOfIncident || '—'}
                                </p>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <p className="whitespace-nowrap text-center text-xs text-black dark:text-white">
                                    {blotter?.time_of_incident ?? blotter?.time_of_report} / {blotter?.date_of_incident ?? blotter?.date_reported}
                                </p>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                {/* The thumbnail used to render a broken <img> whenever no file
                                    was uploaded, because the src fell back to a directory path. */}
                                <button
                                    type="button"
                                    onClick={() => handlePreviewIncidentPhoto(blotter?.uploaded_file, blotter?.user_id, blotter?.id)}
                                    className="flex items-center gap-2 text-left"
                                >
                                    {blotter?.uploaded_file ? (
                                        <img
                                            src={`/images/${blotter?.user_id}/incidents/${blotter?.uploaded_file}`}
                                            alt="incident"
                                            className="h-6 w-10 rounded object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-6 w-10 items-center justify-center rounded bg-slate-200 text-slate-400 dark:bg-meta-4">
                                            <ImageFill size={12} />
                                        </span>
                                    )}
                                    <span className={`text-xs ${blotter?.uploaded_file ? 'text-primary underline' : 'text-slate-400'}`}>
                                        {blotter?.uploaded_file ? 'View photo' : 'No file uploaded'}
                                    </span>
                                </button>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${REMARK_STYLES[remark.id] ?? REMARK_STYLES[5]}`}>
                                    {remark.label}
                                </span>
                            </td>

                            <td className="border border-slate-300 px-3 py-2 dark:border-strokedark">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(blotter.id)}
                                        title={userRole == 2 ? 'View entry' : 'Edit entry'}
                                        className="flex items-center justify-center gap-1 rounded bg-primary px-2 py-1 text-xs text-white transition hover:opacity-90">
                                        {userRole == 2
                                            ? <><EyeFill size={16} /> View</>
                                            : <PencilSquare size={16} />
                                        }
                                    </button>

                                    {userRole != 2 ? (
                                        <button
                                            onClick={(e) => handleConfirmDelete(e, blotter.id)}
                                            title="Delete entry"
                                            className="flex items-center justify-center gap-1 rounded bg-danger px-2 py-1 text-xs text-white transition hover:opacity-90">
                                            <Trash size={16} />
                                        </button>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody >
            <Modal
                show={showIncidentPhoto}
                onClose={() => setShowIncidentPhoto(false)}
                maxWidth='4xl'>
                <div className="p-3">
                    <div className="flex justify-between place-items-center mb-2">
                        <h6
                            className='text-blue-500 hover:underline cursor-pointer'
                            onClick={() => handleEdit(blotterId)} >
                            View incident details
                        </h6>
                        <div
                            className="flex place-items-center hover:font-bold cursor-pointer"
                            onClick={() => setShowIncidentPhoto(false)}>
                            <X size={30} /> Close
                        </div>
                    </div>  {!incidentPhotoToShow
                        ? <div className="flex place-items-center flex-col py-20">
                            <Images size={250} className='text-slate-600' />
                            <h1 className='text-slate-500 text-3xl font-bold'>NO IMAGE AVAILABLE!</h1>
                        </div>
                        : <img
                            src={`/images/${incidentPhotoIdToShow}/incidents/${incidentPhotoToShow}`}
                            alt="incident-pic"
                            className='h-[30rem] w-full'
                        />}

                </div>
            </Modal>
        </>
    )
}

export default TableBody
