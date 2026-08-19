import React from 'react';
import { PenFill } from 'react-bootstrap-icons';
import FormSection from './ui/FormSection';
import { TextField } from './ui/Field';

type AuthenticationProps = {
    data: any;
    setData: CallableFunction;
    errors?: Record<string, string>;
};

const Authentication = ({ data, setData, errors = {} }: AuthenticationProps) => (
    <FormSection
        title="Authentication"
        description="The barangay personnel who recorded this entry."
        icon={<PenFill size={16} />}
    >
        <TextField
            label="Recorded by (Full Name)"
            name="recorded_by"
            required
            value={data?.recorded_by}
            onChange={(e) => setData('recorded_by', e.target.value)}
            error={errors.recorded_by}
            placeholder="e.g. Barangay Secretary Maria Santos"
        />
    </FormSection>
);

export default Authentication;
