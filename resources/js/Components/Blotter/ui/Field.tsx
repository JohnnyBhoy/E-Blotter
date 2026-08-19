import React, { ChangeEvent, ReactNode } from 'react';
import Select from 'react-select';
import selectStyles, { SelectOption } from './selectStyles';
import useIsDark from './useIsDark';

/** Shared control skin so inputs, selects and react-select all line up. */
export const controlClass = (hasError?: boolean, extra = '') =>
    [
        'h-11 w-full rounded-lg border bg-transparent px-3.5 text-sm text-black outline-none transition',
        'placeholder:text-body disabled:cursor-not-allowed disabled:bg-whiter',
        'dark:bg-form-input dark:text-white dark:disabled:bg-form-input',
        hasError
            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
            : 'border-stroke focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:focus:border-primary',
        extra,
    ]
        .filter(Boolean)
        .join(' ');

export const FieldLabel = ({
    htmlFor,
    label,
    required,
}: {
    htmlFor?: string;
    label: string;
    required?: boolean;
}) => (
    <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium text-black dark:text-bodydark1"
    >
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
    </label>
);

export const FieldMessage = ({ error, hint }: { error?: string; hint?: ReactNode }) => {
    if (error) {
        return <p className="mt-1 text-xs font-medium text-danger">{error}</p>;
    }

    if (hint) {
        return <p className="mt-1 text-xs text-body dark:text-bodydark">{hint}</p>;
    }

    return null;
};

type TextFieldProps = {
    label: string;
    name: string;
    value?: string | number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    error?: string;
    hint?: ReactNode;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    min?: string | number;
    max?: string | number;
    id?: string;
};

export const TextField = ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    required,
    error,
    hint,
    placeholder,
    disabled,
    readOnly,
    min,
    max,
    id,
}: TextFieldProps) => {
    const inputId = id ?? name;

    return (
        <div className="w-full">
            <FieldLabel htmlFor={inputId} label={label} required={required} />
            <input
                id={inputId}
                name={name}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                min={min}
                max={max}
                aria-invalid={error ? true : undefined}
                className={controlClass(!!error)}
            />
            <FieldMessage error={error} hint={hint} />
        </div>
    );
};

type SelectFieldProps = {
    label: string;
    name: string;
    value?: string | number;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    children: ReactNode;
    required?: boolean;
    error?: string;
    hint?: ReactNode;
    disabled?: boolean;
    id?: string;
};

export const SelectField = ({
    label,
    name,
    value,
    onChange,
    children,
    required,
    error,
    hint,
    disabled,
    id,
}: SelectFieldProps) => {
    const selectId = id ?? name;

    return (
        <div className="w-full">
            <FieldLabel htmlFor={selectId} label={label} required={required} />
            <div className="relative">
                <select
                    id={selectId}
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                    className={controlClass(!!error, 'appearance-none pr-10')}
                >
                    {children}
                </select>
                <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-body dark:text-bodydark">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
            <FieldMessage error={error} hint={hint} />
        </div>
    );
};

type SearchSelectProps = {
    label: string;
    name: string;
    value?: string | number;
    options: SelectOption[];
    onSelect: (name: string, value: string | number) => void;
    required?: boolean;
    error?: string;
    hint?: ReactNode;
    placeholder?: string;
    disabled?: boolean;
    /** Message shown when the list is empty because a parent is unselected. */
    emptyMessage?: string;
    id?: string;
};

/** Type-ahead select for the long reference lists (offenses, addresses...). */
export const SearchSelect = ({
    label,
    name,
    value,
    options,
    onSelect,
    required,
    error,
    hint,
    placeholder = 'Search or select...',
    disabled,
    emptyMessage = 'No options',
    id,
}: SearchSelectProps) => {
    const isDark = useIsDark();
    const inputId = id ?? name;
    const selected =
        options.find((option) => String(option.value) === String(value ?? '')) ?? null;

    return (
        <div className="w-full">
            <FieldLabel htmlFor={inputId} label={label} required={required} />
            <Select
                inputId={inputId}
                name={name}
                value={selected}
                options={options}
                isDisabled={disabled}
                isClearable
                placeholder={placeholder}
                noOptionsMessage={() => emptyMessage}
                onChange={(option) =>
                    onSelect(name, (option as SelectOption | null)?.value ?? '')
                }
                styles={selectStyles(isDark, !!error)}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                classNamePrefix="select"
            />
            <FieldMessage error={error} hint={hint} />
        </div>
    );
};
