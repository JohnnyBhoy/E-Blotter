import getUserId from '@/utils/functions/getUserId';
import React, { useState } from 'react';
import { CloudArrowUpFill, JournalText, Trash3, XLg } from 'react-bootstrap-icons';
import Editor from 'react-simple-wysiwyg';
import Swal from 'sweetalert2';
import FormSection from './ui/FormSection';
import { FieldMessage } from './ui/Field';

type NarrativeProps = {
    data: any;
    setData: CallableFunction;
    errors?: Record<string, string>;
};

const NARRATIVE_LIMIT = 10000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Kept in step with the server rule: nullable|image|mimes:jpg,jpeg,png|max:10240
const ALLOWED_TYPES = ['jpg', 'jpeg', 'png'];

const Narrative = ({ data, setData, errors = {} }: NarrativeProps) => {
    const [preview, setPreview] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const userId = getUserId();
    const existingFile = typeof data?.uploaded_file === 'string' ? data.uploaded_file : '';

    const plainNarrative = String(data?.narrative ?? '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();

    const acceptFile = (file: File | undefined) => {
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

        if (!ALLOWED_TYPES.includes(extension)) {
            return Swal.fire({
                title: 'Unsupported file format',
                text: 'Allowed formats: JPG, JPEG and PNG.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
            });
        }

        if (file.size > MAX_FILE_SIZE) {
            return Swal.fire({
                title: 'File too large',
                text: 'The photo must be 10MB or smaller.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
            });
        }

        setPreview(URL.createObjectURL(file));
        setData('uploaded_file', file);
    };

    const handleRemove = () =>
        Swal.fire({
            title: 'Remove this photo?',
            text: 'You can upload a different one afterwards.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Remove',
        }).then((result) => {
            if (result.isConfirmed) {
                setPreview('');
                setData('uploaded_file', '');
            }
        });

    const shownImage = preview
        ? preview
        : existingFile
            ? `/images/${userId}/incidents/${existingFile}`
            : '';

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <FormSection
                    title="Narrative of the Incident"
                    description="Answer the WHO, WHAT, WHERE, WHEN, WHY and HOW — in English or the local dialect."
                    icon={<JournalText size={16} />}
                    action={
                        <span
                            className={[
                                'text-xs font-medium',
                                plainNarrative.length > NARRATIVE_LIMIT
                                    ? 'text-danger'
                                    : 'text-body dark:text-bodydark',
                            ].join(' ')}
                        >
                            {plainNarrative.length.toLocaleString()} /{' '}
                            {NARRATIVE_LIMIT.toLocaleString()}
                        </span>
                    }
                >
                    <p className="mb-2 rounded-lg bg-whiten px-3 py-2 text-xs text-body dark:bg-meta-4 dark:text-bodydark">
                        Example: &ldquo;On or about 10:30 PM of June 5, 2025, the
                        complainant reported that...&rdquo;
                    </p>

                    <div
                        className={[
                            'overflow-hidden rounded-lg border transition',
                            errors.narrative
                                ? 'border-danger'
                                : 'border-stroke focus-within:border-primary dark:border-form-strokedark',
                        ].join(' ')}
                    >
                        <Editor
                            value={data?.narrative ?? ''}
                            onChange={(e: any) => setData('narrative', e.target.value)}
                            containerProps={{
                                style: {
                                    resize: 'vertical',
                                    height: '22rem',
                                    overflow: 'auto',
                                    border: 'none',
                                },
                            }}
                            className="text-sm"
                        />
                    </div>
                    <FieldMessage
                        error={errors.narrative}
                        hint="Write in complete sentences — this text is printed on the blotter record."
                    />
                </FormSection>
            </div>

            <div className="lg:col-span-2">
                <FormSection
                    title="Photo Evidence"
                    description="Optional. One JPG or PNG photo, up to 10MB."
                    icon={<CloudArrowUpFill size={16} />}
                    action={
                        shownImage ? (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="flex items-center gap-1.5 rounded-full border border-danger/40 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/10"
                            >
                                <Trash3 size={12} />
                                Remove
                            </button>
                        ) : null
                    }
                >
                    {shownImage ? (
                        <div className="relative">
                            <img
                                src={shownImage}
                                alt="Incident evidence"
                                className="h-64 w-full rounded-lg border border-stroke object-cover dark:border-strokedark"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                aria-label="Remove photo"
                                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-danger"
                            >
                                <XLg size={12} />
                            </button>
                        </div>
                    ) : (
                        <label
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                acceptFile(e.dataTransfer.files?.[0]);
                            }}
                            className={[
                                'flex h-64 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 text-center transition',
                                isDragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-stroke hover:border-primary hover:bg-primary/5 dark:border-strokedark',
                            ].join(' ')}
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CloudArrowUpFill size={20} />
                            </span>
                            <span className="text-sm font-medium text-black dark:text-white">
                                Drop a photo here, or{' '}
                                <span className="text-primary underline">browse</span>
                            </span>
                            <span className="text-xs text-body dark:text-bodydark">
                                JPG or PNG, maximum 10MB
                            </span>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => acceptFile(e.target.files?.[0])}
                            />
                        </label>
                    )}
                    <FieldMessage error={errors.uploaded_file} />
                </FormSection>
            </div>
        </div>
    );
};

export default Narrative;
