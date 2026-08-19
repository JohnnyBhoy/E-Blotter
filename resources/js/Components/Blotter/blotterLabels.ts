/**
 * Label lookups for the read-only view of a blotter entry.
 *
 * The tables store reference IDs and PSGC codes; the view tab has to print the
 * words the barangay actually typed into the form, so every list is indexed
 * once and shared instead of being scanned per field.
 */

import barangays from '@/utils/data/barangays';
import cities from '@/utils/data/cities';
import citizenships from '@/utils/data/citizenships';
import civilStatus from '@/utils/data/civilStatus';
import educations from '@/utils/data/educations';
import genders from '@/utils/data/genders';
import incidentTypes from '@/utils/data/incidentTypes';
import occupations from '@/utils/data/occupations';
import provinces from '@/utils/data/provinces';
import regions from '@/utils/data/regions';
import disposition from '@/utils/data/disposition';

type Reference = { id: number | string; value: string };

const index = (rows: Reference[]) => {
    const map = new Map<string, string>();

    rows.forEach((row) => map.set(String(row.id), row.value));

    return map;
};

const indexBy = (rows: any[], code: string, name: string) => {
    const map = new Map<string, string>();

    // Codes are zero-padded strings in the PSGC files but come back from the
    // database as integers, so both forms are keyed.
    rows.forEach((row) => {
        map.set(String(row[code]), row[name]);
        map.set(String(parseInt(row[code])), row[name]);
    });

    return map;
};

const lazy = <T,>(build: () => T) => {
    let cached: T | undefined;

    return () => (cached ??= build());
};

const lists = {
    incidentType: lazy(() => index(incidentTypes as Reference[])),
    disposition: lazy(() => index(disposition as Reference[])),
    gender: lazy(() => index(genders as Reference[])),
    civilStatus: lazy(() => index(civilStatus as Reference[])),
    citizenship: lazy(() => index(citizenships as Reference[])),
    education: lazy(() => index(educations as Reference[])),
    occupation: lazy(() => index(occupations as Reference[])),
    region: lazy(() => indexBy(regions, 'region_code', 'region_name')),
    province: lazy(() => indexBy(provinces, 'province_code', 'province_name')),
    city: lazy(() => indexBy(cities, 'city_code', 'city_name')),
    barangay: lazy(() => indexBy(barangays, 'brgy_code', 'brgy_name')),
};

export type LabelList = keyof typeof lists;

/** The stored value's label, or an em dash when it is blank or unknown. */
export const labelOf = (list: LabelList, value: unknown): string => {
    if (value === null || value === undefined || value === '' || Number(value) === 0) {
        return '—';
    }

    return lists[list]().get(String(value)) ?? String(value);
};

/** "Santos, Maria Cruz" style full name from a person card. */
export const fullName = (person: any, prefix: 'complainant' | 'respondent'): string => {
    const parts = [
        person?.[`${prefix}_first_name`],
        person?.[`${prefix}_middle_name`],
        person?.[`${prefix}_family_name`],
    ]
        .map((part) => String(part ?? '').trim())
        .filter(Boolean);

    return parts.length ? parts.join(' ') : 'Unnamed';
};

/** One-line address built from the street/village/PSGC columns of a card. */
export const addressOf = (
    person: any,
    prefix: 'complainant' | 'respondent',
    scope: '' | 'work_' = '',
): string => {
    const at = (suffix: string) => person?.[`${prefix}_${scope}${suffix}`];

    const parts = [
        at('street'),
        at('village'),
        labelOf('barangay', at('barangay')),
        labelOf('city', at('city')),
        labelOf('province', at('province')),
    ]
        .map((part) => String(part ?? '').trim())
        .filter((part) => part && part !== '—');

    return parts.length ? parts.join(', ') : '—';
};

/** Age in whole years on today's date, blank when no birth date was recorded. */
export const ageOf = (birthDate?: string | null): string => {
    if (!birthDate) return '—';

    const born = new Date(birthDate);

    if (Number.isNaN(born.getTime())) return '—';

    const now = new Date();
    let age = now.getFullYear() - born.getFullYear();
    const monthDelta = now.getMonth() - born.getMonth();

    if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < born.getDate())) {
        age -= 1;
    }

    return age >= 0 && age < 150 ? `${age} years old` : '—';
};
