import React, { PropsWithChildren, ReactNode, useEffect } from 'react';
import { XLg } from 'react-bootstrap-icons';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    subtitle?: ReactNode;
    /** Rendered to the right of the title, e.g. status pills or an Edit button. */
    headerActions?: ReactNode;
    /** Rendered between the header and the scrolling body, e.g. tabs. */
    toolbar?: ReactNode;
    footer?: ReactNode;
};

/**
 * Floating panel used by the console for every blotter action.
 *
 * The barangay works out of one page, so an entry is opened over the table
 * rather than on a route of its own. Only the body scrolls: the header, tabs
 * and action bar stay put however long the form runs.
 *
 * Sits below react-select's portalled menus (z-index 9999) and below SweetAlert
 * (1060), so both still render above an open modal.
 */
const Modal = ({
    open,
    onClose,
    title,
    subtitle,
    headerActions,
    toolbar,
    footer,
    children,
}: PropsWithChildren<ModalProps>) => {
    // Escape closes, and the page behind must not scroll while it is open.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        const { overflow } = document.body.style;

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = overflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-[2px] sm:p-6"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => {
                // Only a click on the backdrop itself dismisses; a drag that
                // started inside the panel must not close it.
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-boxdark sm:max-h-[calc(100vh-3rem)]">
                <header className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-stroke px-4 py-3 dark:border-strokedark sm:px-6">
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-black dark:text-white">
                            {title}
                        </h2>
                        {subtitle ? (
                            <p className="mt-0.5 text-xs text-body dark:text-bodydark">
                                {subtitle}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {headerActions}

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-body transition hover:bg-whiten hover:text-black dark:text-bodydark dark:hover:bg-meta-4 dark:hover:text-white"
                        >
                            <XLg size={14} />
                        </button>
                    </div>
                </header>

                {toolbar ? <div className="shrink-0">{toolbar}</div> : null}

                <div className="flex-1 overflow-y-auto bg-whiten px-4 py-4 dark:bg-boxdark-2 sm:px-6">
                    {children}
                </div>

                {footer ? (
                    <div className="shrink-0 border-t border-stroke bg-white px-4 py-3 dark:border-strokedark dark:bg-boxdark sm:px-6">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Modal;
