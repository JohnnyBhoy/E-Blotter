import { BlotterProps } from "@/Pages/types/blotter";
import disposition from "@/utils/data/disposition";
import incidentTypes from "@/utils/data/incidentTypes";
import getBarangayByBrgyCode from "@/utils/functions/getBarangayByBrgyCode";
import getUserRole from "@/utils/functions/getUserRole";
import { router } from "@inertiajs/react";
import { default as React, useState } from "react";
import { EyeFill, Images, PencilSquare, Trash, X } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import Modal from "../Modal";

const TableBody = ({
    blotters,
    setData,
}: {
    blotters: any;
    setData: CallableFunction;
}) => {
    console.log(blotters);

    // Local states
    const [showIncidentPhoto, setShowIncidentPhoto] = useState<boolean>(false);
    const [incidentPhotoIdToShow, setIncidentPhotoIdToShow] =
        useState<number>(0);
    const [blotterId, setBlotterId] = useState<number>(0);
    const [incidentPhotoToShow, setIncidentPhotoToShow] = useState<string>("");

    // User Role and redirect edit route
    const userRole = getUserRole();

    // Delete url based on role
    const deleteBlotterUrl =
        userRole == 1
            ? "/blotter/admin-delete"
            : userRole == 3
              ? "/blotter/municipal-delete"
              : "blotter/delete";

    // Edit blotter url
    const editBlotterUrl =
        userRole == 1
            ? "/blotter/admin-edit"
            : userRole == 5
              ? "/barangay/edit"
              : userRole == 3
                ? "/blotter/municipal-edit"
                : "dashboard";

    const handleEdit = (id: number) => {
        router.visit(editBlotterUrl, {
            method: "get",
            data: {
                id: id,
            },
        });
    };

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
                cancelButton: "btn btn-danger",
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
    };

    // Get incident type
    const getIncidentType = (type: number) => {
        const incident = incidentTypes?.filter(
            (item: any) => item?.id == type,
        )[0];
        return incident?.value;
    };

    const formatCaseDisposition = (remarks: string) => {
        if (remarks > "4") return "Other";

        const result = disposition?.filter(
            (item: any) => item?.id == parseInt(remarks),
        );

        return result[0]?.value;
    };

    const handlePreviewIncidentPhoto = (
        uploadedFile: string,
        userId: number,
        blotterId: number,
    ) => {
        setBlotterId(blotterId);
        setShowIncidentPhoto(true);
        setIncidentPhotoIdToShow(userId);
        setIncidentPhotoToShow(uploadedFile);
    };

    return (
        <>
            <tbody>
                {blotters
                    ?.filter(
                        (item: any, index: any, self: any) =>
                            self?.findIndex((t: any) => t?.id === item?.id) ===
                            index,
                    )
                    ?.map((blotter: BlotterProps, i: number) => (
                        <tr
                            key={i}
                            className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600 cursor-pointer z-20 ${i % 2 == 1 ? "bg-white dark:bg-claude-panel" : "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900"} transition-all duration-200`}
                        >
                            <td className="px-4 py-3 border-0 border-b border-gray-100 dark:border-claude-border first:rounded-bl-xl">
                                <h5 className="font-semibold text-gray-900 dark:text-claude-text">
                                    {blotter?.entry_number}
                                </h5>
                            </td>
                            <td className="px-4 py-3 border-0 border-b border-gray-100 dark:border-claude-border">
                                <p className="text-gray-700 dark:text-claude-text-muted text-sm">
                                    {blotter?.complainant_family_name},{" "}
                                    {blotter?.complainant_first_name}
                                </p>
                            </td>
                            <td className="px-4 py-3 border-0 border-b border-gray-100 dark:border-claude-border">
                                <p className="text-gray-700 dark:text-claude-text-muted text-sm">
                                    {blotter?.respondent_family_name},{" "}
                                    {blotter?.respondent_first_name}
                                </p>
                            </td>
                            <td className="px-4 py-3 border-0 border-b border-gray-100 dark:border-claude-border">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                    {getIncidentType(blotter?.incident_type)}
                                </span>
                            </td>
                            <td className="px-4 py-3 border-0 border-b border-gray-100 dark:border-claude-border">
                                <p
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        blotter?.remarks == "1"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : blotter?.remarks == "2"
                                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                              : blotter?.remarks == "3"
                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                : blotter?.remarks == "4"
                                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                  : "bg-gray-100 text-gray-800 dark:bg-claude-bg dark:text-claude-text"
                                    }`}
                                >
                                    {formatCaseDisposition(blotter?.remarks)}
                                </p>
                            </td>
                            <td className="px-4 py-3 border-0 border-b border-gray-100 dark:border-claude-border">
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(blotter.id)}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-3 py-1.5 text-xs hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-1"
                                    >
                                        {userRole == 2 ? (
                                            <>
                                                <EyeFill size={14} /> View
                                            </>
                                        ) : (
                                            <PencilSquare size={14} />
                                        )}
                                    </button>

                                    {userRole != 2 ? (
                                        <button
                                            onClick={(e) =>
                                                handleConfirmDelete(
                                                    e,
                                                    blotter.id,
                                                )
                                            }
                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg px-3 py-1.5 text-xs hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-1"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    ))}
            </tbody>

            <Modal
                show={showIncidentPhoto}
                onClose={() => setShowIncidentPhoto(false)}
                maxWidth="4xl"
            >
                <div className="p-3">
                    <div className="flex justify-between place-items-center mb-2">
                        <h6
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={() => handleEdit(blotterId)}
                        >
                            View incident details
                        </h6>
                        <div
                            className="flex place-items-center hover:font-bold cursor-pointer"
                            onClick={() => setShowIncidentPhoto(false)}
                        >
                            <X size={30} /> Close
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TableBody;
