import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

/**
 * Each role reaches the blotter through its own route group. Regional accounts
 * (5) are read-only and appear in neither map, so their actions are skipped
 * rather than sent to a route the Is* middleware would bounce.
 */
export const EDIT_URL_BY_ROLE: Record<number, string> = {
    1: "/blotter/admin-edit",
    2: "/blotter/edit",
    3: "/blotter/municipal-edit",
    4: "/blotter/province-edit",
};

export const DELETE_URL_BY_ROLE: Record<number, string> = {
    1: "/blotter/admin-delete",
    2: "/blotter/delete",
    3: "/blotter/municipal-delete",
    4: "/blotter/province-delete",
};

/**
 * Barangay accounts may encode and correct their own entries but may not
 * remove them -- removal is escalated to the municipal admin. This has always
 * been the app's behaviour; it lives here so the blotter table and the console
 * cannot drift apart on it.
 */
export const canDeleteBlotter = (userRole: number): boolean =>
    Boolean(DELETE_URL_BY_ROLE[Number(userRole)]) && Number(userRole) !== 2;

/**
 * Who may correct an entry. Regional accounts (5) are read-only and reach the
 * blotter through no edit route, so they get the view modal without the form.
 */
export const canEditBlotter = (userRole: number): boolean =>
    Boolean(EDIT_URL_BY_ROLE[Number(userRole)]);

/** Open the edit screen for one entry. */
export const openBlotter = (id: number, userRole: number): void => {
    const url = EDIT_URL_BY_ROLE[Number(userRole)];

    if (!url) {
        return;
    }

    router.visit(url, { method: "get", data: { id } });
};

/**
 * Confirm, then delete through the caller's own role route. The server
 * re-checks jurisdiction in BlotterController::delete(), so this dialog is a
 * convenience, never the access control itself.
 */
export const confirmDeleteBlotter = (id: number, userRole: number): void => {
    const url = DELETE_URL_BY_ROLE[Number(userRole)];

    if (!url) {
        return;
    }

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
            if (!canDeleteBlotter(userRole)) {
                return Swal.fire({
                    title: "Action Forbidden!",
                    text: "Unable to remove blotter, Please contact your Municipal Admin.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000,
                });
            }

            router.delete(url, { data: { id } });

            return Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 2500,
            });
        }

        if (result.dismiss === Swal.DismissReason.cancel) {
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
