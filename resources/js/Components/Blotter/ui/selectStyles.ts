import { StylesConfig } from 'react-select';

export type SelectOption = {
    value: number | string;
    label: string;
};

/**
 * react-select renders its own DOM, so the Tailwind theme tokens are mirrored
 * here to keep the searchable selects identical to the native ones.
 */
const selectStyles = (
    isDark: boolean,
    hasError = false,
): StylesConfig<SelectOption, boolean> => {
    const surface = isDark ? '#1d2a39' : '#FFFFFF';
    const border = hasError ? '#D34053' : isDark ? '#3d4d60' : '#E2E8F0';
    const text = isDark ? '#FFFFFF' : '#1C2434';
    const muted = isDark ? '#AEB7C0' : '#64748B';
    const hovered = isDark ? '#24303F' : '#F1F5F9';
    const primary = '#3C50E0';

    return {
        control: (base, state) => ({
            ...base,
            minHeight: '2.75rem',
            backgroundColor: surface,
            borderColor: state.isFocused ? (hasError ? '#D34053' : primary) : border,
            borderRadius: '0.5rem',
            boxShadow: state.isFocused
                ? `0 0 0 2px ${hasError ? 'rgba(211,64,83,.2)' : 'rgba(60,80,224,.2)'}`
                : 'none',
            fontSize: '0.875rem',
            ':hover': { borderColor: state.isFocused ? primary : border },
        }),
        valueContainer: (base) => ({ ...base, padding: '0.125rem 0.75rem' }),
        singleValue: (base) => ({ ...base, color: text }),
        input: (base) => ({ ...base, color: text }),
        placeholder: (base) => ({ ...base, color: muted }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: isDark ? '#2E3A47' : '#EFF4FB',
            borderRadius: '0.375rem',
        }),
        multiValueLabel: (base) => ({ ...base, color: text }),
        indicatorSeparator: (base) => ({ ...base, backgroundColor: border }),
        dropdownIndicator: (base) => ({ ...base, color: muted }),
        menu: (base) => ({
            ...base,
            backgroundColor: surface,
            border: `1px solid ${isDark ? '#3d4d60' : '#E2E8F0'}`,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            zIndex: 60,
            fontSize: '0.875rem',
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? primary
                : state.isFocused
                    ? hovered
                    : 'transparent',
            color: state.isSelected ? '#FFFFFF' : text,
            cursor: 'pointer',
        }),
        noOptionsMessage: (base) => ({ ...base, color: muted }),
    };
};

export default selectStyles;
