import { BlotterProps } from '@/Pages/types/blotter';
import disposition from '@/utils/data/disposition';
import incidentTypes from '@/utils/data/incidentTypes';
import dateToString from '@/utils/functions/dataToString';
import getUserRole from '@/utils/functions/getUserRole';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { EyeFill, Images, PencilSquare, Trash, X } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import Modal from '../Modal';
import getBarangayByBrgyCode from '@/utils/functions/getBarangayByBrgyCode';

const TableBody = ({ blotters, setData }: { blotters: any; setData: CallableFunction }) => {

    // Local states
    const [showIncidentPhoto, setShowIncidentPhoto] = useState<boolean>(false);
    const [incidentPhotoIdToShow, setIncidentPhotoIdToShow] = useState<number>(0);
    const [blotterId, setBlotterId] = useState<number>(0);
    const [incidentPhotoToShow, setIncidentPhotoToShow] = useState<string>("");

    // User Role and redirect edit route
    const userRole = getUserRole();

    // Delete url based on role
    const deleteBlotterUrl = userRole == 1 ? '/blotter/admin-delete' : userRole == 3 ? '/blotter/municipal-delete' : 'blotter/delete';

    // Edit blotter url
    const editBlotterUrl = userRole == 1 ? '/blotter/admin-edit'
        : userRole == 2 ? '/blotter/edit'
            : userRole == 3 ? '/blotter/municipal-edit'
                : "dashboard";

    const handleEdit = (id: number) => {
        router.visit(editBlotterUrl, {
            method: 'get',
            data: {
                id: id,
            },
        })
    }

    const handleConfirmDelete = (e: any, id: number) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                if (userRole == 2) {
                    return Swal.fire({
                        title: "Action Forbidden!",
                        text: "Unable to remove blotter, Please contact your Municipal Admin.",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 3000,
                    });
                } else {

                    router.delete(deleteBlotterUrl, {
                        data: { id: id },
                    });

                    return Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                }

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Your blotter file is safe :)",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
        });
    }

    // Get incident type
    const getIncidentType = (type: number) => {
        const incident = incidentTypes?.filter((item: any) => item?.id == type)[0];
        return incident?.value;
    };

    const formatCaseDisposition = (remarks: string) => {
        if (remarks > '4') return 'Other';

        const result = disposition?.filter((item: any) => item?.id == parseInt(remarks))

        return result[0]?.value;
    }

    const handlePreviewIncidentPhoto = (uploadedFile: string, userId: number, blotterId: number) => {
        setBlotterId(blotterId);
        setShowIncidentPhoto(true);
        setIncidentPhotoIdToShow(userId);
        setIncidentPhotoToShow(uploadedFile);
    }

    return (
        <>
            <tbody>
                {blotters
                    ?.filter((item: any, index: any, self: any) => self?.findIndex((t: any) => t?.id === item?.id) === index)
                    ?.map((blotter: BlotterProps, i: number) => (
                        <tr key={i} className={`hover:bg-slate-100 cursor-pointer z-20 ${(i % 2) == 1 ? 'bg-white' : 'bg-slate-100'} dark:bg-meta-4`}>
                            <td className="border border-slate-300 dark:border-white py-2 px-2 pl-9 dark:border-strokedark xl:pl-11">
                                <h5 className="font-medium text-black dark:text-white text-xs">
                                    {blotter?.entry_number}
                                </h5>
                            </td>
                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark ">
                                <p className="text-black dark:text-white text-xs">
                                    {blotter?.complainant_family_name},  {blotter?.complainant_first_name}  {blotter?.complainant_middle_name?.charAt(0)}.
                                </p>
                            </td>

                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark">
                                <p className="text-black dark:text-white text-xs">
                                    {blotter?.respondent_family_name},  {blotter?.respondent_first_name}  {blotter?.complainant_middle_name?.charAt(0)}.
                                </p>
                            </td>

                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark">
                                <p className="text-black dark:text-white  grid place-items-start  text-xs" >
                                    {getIncidentType(blotter?.incident_type)?.split(" - ")[1]?.substring(0, 50) ?? 'Other'}
                                </p>
                            </td>

                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark">
                                <p className="text-black dark:text-white  grid place-items-start  text-xs" >
                                    {blotter?.complainant_street},  {blotter?.complainant_village}, {getBarangayByBrgyCode(parseInt(blotter?.complainant_barangay))}
                                </p>
                            </td>

                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark">
                                <p className="text-black dark:text-white text-xs  grid place-items-center ">
                                    {blotter?.time_of_incident ?? blotter?.time_of_report} / {blotter?.date_of_incident ?? blotter?.date_reported}
                                </p>
                            </td>

                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark flex place-items-center gap-3"
                                onClick={() => handlePreviewIncidentPhoto(blotter?.uploaded_file, blotter?.user_id, blotter?.id)}>
                                <img
                                    src={`/images/${blotter?.user_id}/incidents/${blotter?.uploaded_file}`}
                                    alt="incident-pic"
                                    className='h-6 w-10'
                                />
                                <p className="text-blue-600 underline dark:text-white  grid place-items-start  text-xs" >
                                    {blotter?.uploaded_file ?? 'No file uploaded'}
                                </p>
                            </td>

                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark">
                                <p
                                    className={`inline-flex rounded-full ml-2 bg-opacity-10 py-1 px-1 text-xs  text-slate-700`}
                                >
                                    {formatCaseDisposition(blotter?.remarks)}
                                </p>
                            </td>
                            <td className="border border-slate-300 dark:border-white py-2 px-2 dark:border-strokedark">
                                <div className="flex justify-center space-x-3.5">
                                    <button
                                        onClick={() => handleEdit(blotter.id)}
                                        className="bg-primary text-white rounded p-2 flex justify-center text-xs py-1 gap-1">
                                        {userRole == 2
                                            ? <><EyeFill size={16} /> View</>
                                            : <PencilSquare size={16} />
                                        }
                                    </button>

                                    {userRole != 2 ? (
                                        <button
                                            onClick={(e) => handleConfirmDelete(e, blotter.id)}
                                            className="bg-danger text-white rounded p-2 flex justify-center text-xs py-1 gap-1">
                                            <Trash size={16} />
                                        </button>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    ))
                }
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

                    </div>
                    {!incidentPhotoToShow
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