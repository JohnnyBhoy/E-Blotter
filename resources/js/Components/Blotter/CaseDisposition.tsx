import disposition from '@/utils/data/disposition';
import React from 'react';
import { ClipboardCheckFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import FormSection from './ui/FormSection';
import { SelectField } from './ui/Field';

type Reference = {
    id: number | string;
    value: string;
};

type CaseDispositionProps = {
    data: any;
    setData: CallableFunction;
    errors?: Record<string, string>;
};

const CaseDisposition = ({ data, setData, errors = {} }: CaseDispositionProps) => {
    const handleAddDisposition = async () => {
        const { value: caseValue } = await Swal.fire({
            title: 'Add a case disposition',
            input: 'text',
            inputLabel: 'Action taken on the complaint',
            inputPlaceholder: 'e.g. Referred to the Lupong Tagapamayapa',
            showCancelButton: true,
            confirmButtonText: 'Add',
        });

        if (caseValue) {
            disposition.push({ id: caseValue, value: caseValue });
            setData('remarks', caseValue);
        }
    };

    return (
        <FormSection
            title="Case Disposition"
            description="What action was taken on the complaint."
            icon={<ClipboardCheckFill size={16} />}
            action={
                <button
                    type="button"
                    onClick={handleAddDisposition}
                    className="rounded-full border border-stroke px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/5 dark:border-strokedark"
                >
                    Other (specify)
                </button>
            }
        >
            <SelectField
                label="Remarks / Action on the Complaint"
                name="remarks"
                value={data?.remarks}
                onChange={(e) => setData('remarks', e.target.value)}
                error={errors.remarks}
            >
                <option value="">Select a disposition</option>
                {disposition?.map((item: Reference) => (
                    <option value={item.id} key={item.id}>
                        {item.value}
                    </option>
                ))}
            </SelectField>
        </FormSection>
    );
};

export default CaseDisposition;
