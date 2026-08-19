import React from 'react';
import { Check2 } from 'react-bootstrap-icons';

export type Step = {
    title: string;
    description: string;
};

type FormStepperProps = {
    steps: Step[];
    /** Zero based index of the step being edited. */
    current: number;
    /** Only steps already visited can be jumped back to. */
    onSelect?: (index: number) => void;
};

const FormStepper = ({ steps, current, onSelect }: FormStepperProps) => (
    <nav aria-label="Blotter form progress">
        <ol className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {steps.map((step, index) => {
                const isDone = index < current;
                const isActive = index === current;
                const canJump = isDone && !!onSelect;

                return (
                    <li key={step.title} className="flex flex-1 items-center gap-3">
                        <button
                            type="button"
                            disabled={!canJump}
                            onClick={() => canJump && onSelect?.(index)}
                            aria-current={isActive ? 'step' : undefined}
                            className={[
                                'flex flex-1 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                                canJump ? 'cursor-pointer hover:border-primary' : 'cursor-default',
                                isActive
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                    : 'border-stroke bg-white dark:border-strokedark dark:bg-boxdark',
                            ].join(' ')}
                        >
                            <span
                                className={[
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition',
                                    isDone
                                        ? 'bg-success text-white'
                                        : isActive
                                            ? 'bg-primary text-white'
                                            : 'bg-whiten text-body dark:bg-meta-4 dark:text-bodydark',
                                ].join(' ')}
                            >
                                {isDone ? <Check2 size={16} /> : index + 1}
                            </span>

                            <span className="min-w-0">
                                <span
                                    className={[
                                        'block truncate text-sm font-medium',
                                        isActive || isDone
                                            ? 'text-black dark:text-white'
                                            : 'text-body dark:text-bodydark',
                                    ].join(' ')}
                                >
                                    {step.title}
                                </span>
                                <span className="block truncate text-xs text-body dark:text-bodydark">
                                    {step.description}
                                </span>
                            </span>
                        </button>

                        {index < steps.length - 1 ? (
                            <span
                                aria-hidden="true"
                                className={[
                                    'hidden h-0.5 w-8 shrink-0 rounded-full sm:block',
                                    isDone ? 'bg-success' : 'bg-stroke dark:bg-strokedark',
                                ].join(' ')}
                            />
                        ) : null}
                    </li>
                );
            })}
        </ol>
    </nav>
);

export default FormStepper;
