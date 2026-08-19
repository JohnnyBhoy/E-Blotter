import barangays from '@/utils/data/barangays';
import cities from '@/utils/data/cities';
import citizenships from '@/utils/data/citizenships';
import civilStatus from '@/utils/data/civilStatus';
import educations from '@/utils/data/educations';
import genders from '@/utils/data/genders';
import occupations from '@/utils/data/occupations';
import provinces from '@/utils/data/provinces';
import regions from '@/utils/data/regions';
import React, { useMemo } from 'react';
import {
    GeoAltFill,
    PersonBadgeFill,
    PersonPlusFill,
    Trash3,
} from 'react-bootstrap-icons';
import FormSection from './ui/FormSection';
import { SearchSelect, SelectField, TextField } from './ui/Field';
import { SelectOption } from './ui/selectStyles';

type Reference = {
    id: number;
    value: string;
};

type PersonInvolveDataProps = {
    data: any;
    setData: CallableFunction;
    person: string;
    errors?: Record<string, string>;
};

/** Address block prefix: the home/incident block, or the work block. */
type Scope = '' | 'work_';

type OptionGroups = Record<string, SelectOption[]>;

const groupBy = (rows: any[], key: string, code: string, name: string) => {
    const groups: OptionGroups = {};

    rows.forEach((row: any) => {
        const parent = String(parseInt(row[key]));

        (groups[parent] ??= []).push({
            value: parseInt(row[code]),
            label: row[name],
        });
    });

    return groups;
};

/**
 * The PSGC lists run to tens of thousands of rows, so they are indexed once per
 * page load and shared by every person card instead of being re-filtered.
 */
const lazy = <T,>(build: () => T) => {
    let cached: T | undefined;

    return () => (cached ??= build());
};

const getRegionOptions = lazy<SelectOption[]>(() =>
    regions.map((region: any) => ({
        value: parseInt(region.region_code),
        label: region.region_name,
    })),
);

const getProvincesByRegion = lazy(() =>
    groupBy(provinces, 'region_code', 'province_code', 'province_name'),
);

const getCitiesByProvince = lazy(() =>
    groupBy(cities, 'province_code', 'city_code', 'city_name'),
);

const getBarangaysByCity = lazy(() =>
    groupBy(barangays, 'city_code', 'brgy_code', 'brgy_name'),
);

const PersonInvolveData = ({
    data,
    setData,
    person,
    errors = {},
}: PersonInvolveDataProps) => {
    const isComplainant = person === 'Complainant';
    const prefix = isComplainant ? 'complainant' : 'respondent';
    const listKey = isComplainant ? 'complainant_data' : 'respondent_data';
    const people: any[] = data[listKey] ?? [];

    const field = (suffix: string) => `${prefix}_${suffix}`;
    const valueOf = (index: number, suffix: string) => people[index]?.[field(suffix)];
    const errorOf = (index: number, suffix: string) => errors[`${index}.${field(suffix)}`];
    // Ids must stay unique once a second person card is added.
    const idOf = (index: number, suffix: string) => `${field(suffix)}_${index}`;

    const today = new Date().toISOString().substring(0, 10);

    const regionOptions = getRegionOptions();
    const provincesByRegion = getProvincesByRegion();
    const citiesByProvince = getCitiesByProvince();
    const barangaysByCity = getBarangaysByCity();

    const occupationOptions = useMemo<SelectOption[]>(
        () =>
            occupations.map((occupation: Reference) => ({
                value: occupation.id,
                label: occupation.value,
            })),
        [],
    );

    const blankPerson = () => ({
        [field('family_name')]: '',
        [field('first_name')]: '',
        [field('middle_name')]: '',
        [field('birth_date')]: '',
        [field('place_of_birth')]: '',
        [field('citizenship')]: 1,
        [field('gender')]: 1,
        [field('civil_status')]: 1,
        [field('occupation')]: 1,
        [field('education')]: 1,
        [field('email_address')]: '',
        [field('street')]: '',
        [field('village')]: '',
        [field('barangay')]: 0,
        [field('city')]: 0,
        [field('province')]: 0,
        [field('region')]: 0,
        [field('work_street')]: '',
        [field('work_village')]: '',
        [field('work_barangay')]: 0,
        [field('work_city')]: 0,
        [field('work_province')]: 0,
        [field('work_region')]: 0,
    });

    /** Writes one or more keys of a single person back into the form state. */
    const patchPerson = (index: number, changes: Record<string, any>) =>
        setData(
            listKey,
            people.map((item: any, i: number) =>
                i === index ? { ...item, ...changes } : item,
            ),
        );

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number,
    ) => patchPerson(index, { [event.target.name]: event.target.value });

    /**
     * Clears the narrower parts of an address when a wider one changes, so a
     * stale city can never stay attached to a freshly picked province.
     */
    const handleLocationChange = (
        index: number,
        scope: Scope,
        level: 'region' | 'province' | 'city' | 'barangay',
        value: string | number,
    ) => {
        const dependents: Record<string, string[]> = {
            region: ['province', 'city', 'barangay'],
            province: ['city', 'barangay'],
            city: ['barangay'],
            barangay: [],
        };

        const changes: Record<string, any> = {
            [field(`${scope}${level}`)]: value === '' ? 0 : value,
        };

        dependents[level].forEach((dependent) => {
            changes[field(`${scope}${dependent}`)] = 0;
        });

        patchPerson(index, changes);
    };

    const copyFirstAddress = (index: number) =>
        patchPerson(index, {
            [field('work_street')]: valueOf(index, 'street'),
            [field('work_village')]: valueOf(index, 'village'),
            [field('work_region')]: valueOf(index, 'region'),
            [field('work_province')]: valueOf(index, 'province'),
            [field('work_city')]: valueOf(index, 'city'),
            [field('work_barangay')]: valueOf(index, 'barangay'),
        });

    const addPerson = () => setData(listKey, [...people, blankPerson()]);

    const removePerson = (index: number) =>
        setData(
            listKey,
            people.filter((_item: any, i: number) => i !== index),
        );

    const ageFrom = (birthDate: string) => {
        if (!birthDate) return undefined;

        const birth = new Date(birthDate);
        if (Number.isNaN(birth.getTime())) return undefined;

        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const monthDiff = now.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
            age -= 1;
        }

        return age >= 0 && age < 130 ? `${age} years old` : undefined;
    };

    const optionsFor = (
        groups: Record<string, SelectOption[]>,
        parentValue: any,
    ): SelectOption[] => groups[String(parseInt(parentValue) || 0)] ?? [];

    const addressBlock = (index: number, scope: Scope, title: string) => {
        const region = valueOf(index, `${scope}region`);
        const province = valueOf(index, `${scope}province`);
        const city = valueOf(index, `${scope}city`);

        return (
            <div className="rounded-lg border border-stroke p-4 dark:border-strokedark">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-black uppercase dark:text-white">
                        <GeoAltFill size={14} className="text-primary" />
                        {title}
                    </h4>

                    {scope === 'work_' ? (
                        <button
                            type="button"
                            onClick={() => copyFirstAddress(index)}
                            className="rounded-full border border-stroke px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/5 dark:border-strokedark"
                        >
                            Copy address above
                        </button>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField
                        label="House No. / Street"
                        name={field(`${scope}street`)}
                        id={idOf(index, `${scope}street`)}
                        value={valueOf(index, `${scope}street`)}
                        onChange={(e) => handleChange(e, index)}
                        error={errorOf(index, `${scope}street`)}
                        placeholder="e.g. 123 Rizal St."
                    />

                    <TextField
                        label="Village / Sitio / Purok"
                        name={field(`${scope}village`)}
                        id={idOf(index, `${scope}village`)}
                        value={valueOf(index, `${scope}village`)}
                        onChange={(e) => handleChange(e, index)}
                        error={errorOf(index, `${scope}village`)}
                        placeholder="e.g. Purok 5"
                    />

                    <SearchSelect
                        label="Region"
                        name={field(`${scope}region`)}
                        id={idOf(index, `${scope}region`)}
                        required
                        value={region}
                        options={regionOptions}
                        onSelect={(_n, value) =>
                            handleLocationChange(index, scope, 'region', value)
                        }
                        error={errorOf(index, `${scope}region`)}
                        placeholder="Select region"
                    />

                    <SearchSelect
                        label="Province"
                        name={field(`${scope}province`)}
                        id={idOf(index, `${scope}province`)}
                        required
                        value={province}
                        options={optionsFor(provincesByRegion, region)}
                        disabled={!parseInt(region)}
                        onSelect={(_n, value) =>
                            handleLocationChange(index, scope, 'province', value)
                        }
                        error={errorOf(index, `${scope}province`)}
                        placeholder="Select province"
                        emptyMessage="Select a region first"
                    />

                    <SearchSelect
                        label="Municipality / City"
                        name={field(`${scope}city`)}
                        id={idOf(index, `${scope}city`)}
                        required
                        value={city}
                        options={optionsFor(citiesByProvince, province)}
                        disabled={!parseInt(province)}
                        onSelect={(_n, value) =>
                            handleLocationChange(index, scope, 'city', value)
                        }
                        error={errorOf(index, `${scope}city`)}
                        placeholder="Select city"
                        emptyMessage="Select a province first"
                    />

                    <SearchSelect
                        label="Barangay"
                        name={field(`${scope}barangay`)}
                        id={idOf(index, `${scope}barangay`)}
                        required
                        value={valueOf(index, `${scope}barangay`)}
                        options={optionsFor(barangaysByCity, city)}
                        disabled={!parseInt(city)}
                        onSelect={(_n, value) =>
                            handleLocationChange(index, scope, 'barangay', value)
                        }
                        error={errorOf(index, `${scope}barangay`)}
                        placeholder="Select barangay"
                        emptyMessage="Select a city first"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {people.map((_item: any, index: number) => (
                <FormSection
                    key={index}
                    icon={<PersonBadgeFill size={16} />}
                    title={
                        isComplainant
                            ? `A - Reporting Person / Victim No. ${index + 1}`
                            : `B - Person Complained of / Suspect No. ${index + 1}`
                    }
                    description={
                        isComplainant
                            ? 'Personal details of the person filing the report.'
                            : 'Personal details of the person being complained of.'
                    }
                    action={
                        people.length > 1 ? (
                            <button
                                type="button"
                                onClick={() => removePerson(index)}
                                className="flex items-center gap-1.5 rounded-full border border-danger/40 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/10"
                            >
                                <Trash3 size={12} />
                                Remove
                            </button>
                        ) : null
                    }
                >
                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                        <TextField
                            label="Family Name"
                            name={field('family_name')}
                            id={idOf(index, 'family_name')}
                            required
                            value={valueOf(index, 'family_name')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'family_name')}
                            placeholder="Dela Cruz"
                        />

                        <TextField
                            label="First Name"
                            name={field('first_name')}
                            id={idOf(index, 'first_name')}
                            required
                            value={valueOf(index, 'first_name')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'first_name')}
                            placeholder="Juan"
                        />

                        <TextField
                            label="Middle Name"
                            name={field('middle_name')}
                            id={idOf(index, 'middle_name')}
                            required
                            value={valueOf(index, 'middle_name')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'middle_name')}
                            placeholder="Santos"
                        />

                        <TextField
                            label="Birth Date"
                            name={field('birth_date')}
                            id={idOf(index, 'birth_date')}
                            type="date"
                            required
                            max={today}
                            value={valueOf(index, 'birth_date')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'birth_date')}
                            hint={ageFrom(valueOf(index, 'birth_date'))}
                        />

                        <TextField
                            label="Place of Birth"
                            name={field('place_of_birth')}
                            id={idOf(index, 'place_of_birth')}
                            required
                            value={valueOf(index, 'place_of_birth')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'place_of_birth')}
                            placeholder="City / Municipality"
                        />

                        <TextField
                            label="Email Address"
                            name={field('email_address')}
                            id={idOf(index, 'email_address')}
                            type="email"
                            value={valueOf(index, 'email_address')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'email_address')}
                            placeholder="name@example.com"
                        />

                        <SelectField
                            label="Citizenship"
                            name={field('citizenship')}
                            id={idOf(index, 'citizenship')}
                            required
                            value={valueOf(index, 'citizenship')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'citizenship')}
                        >
                            {citizenships?.map((citizenship: Reference) => (
                                <option value={citizenship.id} key={citizenship.id}>
                                    {citizenship.value}
                                </option>
                            ))}
                        </SelectField>

                        <SelectField
                            label="Sex / Gender"
                            name={field('gender')}
                            id={idOf(index, 'gender')}
                            required
                            value={valueOf(index, 'gender')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'gender')}
                        >
                            {genders?.map((gender: Reference) => (
                                <option value={gender.id} key={gender.id}>
                                    {gender.value}
                                </option>
                            ))}
                        </SelectField>

                        <SelectField
                            label="Civil Status"
                            name={field('civil_status')}
                            id={idOf(index, 'civil_status')}
                            required
                            value={valueOf(index, 'civil_status')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'civil_status')}
                        >
                            {civilStatus?.map((status: Reference) => (
                                <option value={status.id} key={status.id}>
                                    {status.value}
                                </option>
                            ))}
                        </SelectField>

                        <SearchSelect
                            label="Occupation"
                            name={field('occupation')}
                            id={idOf(index, 'occupation')}
                            required
                            value={valueOf(index, 'occupation')}
                            options={occupationOptions}
                            onSelect={(name, value) =>
                                patchPerson(index, { [name]: value })
                            }
                            error={errorOf(index, 'occupation')}
                            placeholder="Search occupation"
                        />

                        <SelectField
                            label="Highest Educational Attainment"
                            name={field('education')}
                            id={idOf(index, 'education')}
                            required
                            value={valueOf(index, 'education')}
                            onChange={(e) => handleChange(e, index)}
                            error={errorOf(index, 'education')}
                        >
                            {educations?.map((education: Reference) => (
                                <option value={education.id} key={education.id}>
                                    {education.value}
                                </option>
                            ))}
                        </SelectField>
                    </div>

                    <div className="mt-6 flex flex-col gap-4">
                        {addressBlock(
                            index,
                            '',
                            isComplainant ? 'Place of Incident' : 'Home Address',
                        )}
                        {addressBlock(
                            index,
                            'work_',
                            isComplainant ? 'Home Address' : 'Work Address',
                        )}
                    </div>
                </FormSection>
            ))}

            <button
                type="button"
                onClick={addPerson}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-white py-3 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/5 dark:border-strokedark dark:bg-boxdark"
            >
                <PersonPlusFill size={16} />
                Add another {isComplainant ? 'reporting person' : 'suspect'}
            </button>
        </div>
    );
};

export default PersonInvolveData;
