import React, { PropsWithChildren, ReactNode } from 'react';

type FormSectionProps = {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    /** Rendered flush, without the default padded body. */
    flush?: boolean;
};

/** Card shell shared by every block of the blotter form. */
const FormSection = ({
    title,
    description,
    icon,
    action,
    flush = false,
    children,
}: PropsWithChildren<FormSectionProps>) => (
    <section className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke px-4 py-3 dark:border-strokedark sm:px-6">
            <div className="flex items-center gap-3">
                {icon ? (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {icon}
                    </span>
                ) : null}

                <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white sm:text-base">
                        {title}
                    </h3>
                    {description ? (
                        <p className="mt-0.5 text-xs text-body dark:text-bodydark">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>

            {action ? <div className="flex items-center gap-2">{action}</div> : null}
        </header>

        <div className={flush ? '' : 'p-4 sm:p-6'}>{children}</div>
    </section>
);

export default FormSection;
