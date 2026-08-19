import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
    CircleHalf,
    ExclamationTriangleFill,
    PencilSquare,
    PersonPlus,
    Search,
    Trash,
} from "react-bootstrap-icons";
import Swal from "sweetalert2";

import Modal from "@/Components/Blotter/ui/Modal";
import { SelectField, TextField } from "@/Components/Blotter/ui/Field";

type Official = {
    id: number;
    name: string;
    position: string;
    contact_number: string | null;
    email: string | null;
    term_start: string | null;
    term_end: string | null;
    is_active: boolean;
};

const EMPTY = {
    name: "",
    position: "",
    contact_number: "",
    email: "",
    term_start: "",
    term_end: "",
    is_active: true,
};

const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

const formatTerm = (start: string | null, end: string | null) => {
    const year = (value: string | null) => (value ? new Date(value).getFullYear() : null);

    const from = year(start);
    const to = year(end);

    if (!from && !to) return "No term recorded";
    if (from && to) return `${from} – ${to}`;

    return `${from ?? to} – present`;
};

/**
 * The barangay officials roster, as a console panel.
 *
 * Reads and writes go over XHR rather than through Inertia: the controller
 * redirects back to its own page after every write, which from the console
 * would close the panel and take the barangay off the dashboard.
 */
const OfficialsPanel = ({ onClose }: { onClose: () => void }) => {
    const [officials, setOfficials] = useState<Official[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState("");

    const [term, setTerm] = useState("");
    const [showInactive, setShowInactive] = useState(true);

    const [editing, setEditing] = useState<Official | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState<Record<string, any>>({ ...EMPTY });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        setFailed("");

        return axios
            .get("/officials")
            .then(({ data }) => {
                setOfficials(data.officials ?? []);
                setPositions(data.positions ?? []);
            })
            .catch(() => setFailed("The roster could not be loaded. Please try again."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const visible = useMemo(() => {
        const needle = term.trim().toLowerCase();

        return officials.filter((official) => {
            if (!showInactive && !official.is_active) return false;
            if (!needle) return true;

            return (
                official.name.toLowerCase().includes(needle) ||
                official.position.toLowerCase().includes(needle)
            );
        });
    }, [officials, term, showInactive]);

    const activeCount = officials.filter((official) => official.is_active).length;

    const openForm = (official: Official | null) => {
        setErrors({});
        setEditing(official);
        setForm(
            official
                ? {
                      name: official.name,
                      position: official.position,
                      contact_number: official.contact_number ?? "",
                      email: official.email ?? "",
                      term_start: official.term_start?.slice(0, 10) ?? "",
                      term_end: official.term_end?.slice(0, 10) ?? "",
                      is_active: official.is_active,
                  }
                : { ...EMPTY },
        );
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
        setErrors({});
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setSaving(true);
        setErrors({});

        const request = editing
            ? axios.put(`/officials/${editing.id}`, form)
            : axios.post("/officials", form);

        request
            .then(() => {
                closeForm();

                return load();
            })
            .catch((error) => {
                // Laravel answers an XHR validation failure with 422 and a
                // field-keyed error bag.
                const bag = error?.response?.data?.errors;

                if (bag) {
                    setErrors(
                        Object.fromEntries(
                            Object.entries(bag).map(([key, list]: any) => [key, list[0]]),
                        ),
                    );

                    return;
                }

                Swal.fire({
                    title: "Not saved",
                    text: "The official could not be saved. Please try again.",
                    icon: "error",
                    timer: 2600,
                    showConfirmButton: false,
                });
            })
            .finally(() => setSaving(false));
    };

    const handleDelete = (official: Official) => {
        Swal.fire({
            title: `Remove ${official.name}?`,
            text: "This takes them off the barangay roster.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DC2626",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, remove",
        }).then((result) => {
            if (!result.isConfirmed) return;

            axios
                .delete(`/officials/${official.id}`)
                .then(() => load())
                .catch(() =>
                    Swal.fire({
                        title: "Not removed",
                        text: "The official could not be removed. Please try again.",
                        icon: "error",
                        timer: 2600,
                        showConfirmButton: false,
                    }),
                );
        });
    };

    const set = (key: string, value: any) => setForm((current) => ({ ...current, [key]: value }));

    return (
        <Modal
            open
            onClose={formOpen ? closeForm : onClose}
            title={formOpen ? (editing ? `Edit ${editing.name}` : "Add an official") : "Barangay Officials"}
            subtitle={
                formOpen
                    ? "Fields marked * are required."
                    : `${activeCount} active ${activeCount === 1 ? "official" : "officials"} on record.`
            }
            headerActions={
                formOpen ? null : (
                    <button
                        type="button"
                        onClick={() => openForm(null)}
                        className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-opacity-90"
                    >
                        <PersonPlus size={14} />
                        Add official
                    </button>
                )
            }
            footer={
                formOpen ? (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="flex h-10 items-center rounded-lg border border-stroke px-4 text-sm font-medium text-black transition hover:bg-whiten dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="official-form"
                            disabled={saving}
                            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    Saving...
                                    <CircleHalf size={14} className="animate-spin" />
                                </>
                            ) : editing ? (
                                "Save changes"
                            ) : (
                                "Add official"
                            )}
                        </button>
                    </div>
                ) : null
            }
        >
            {formOpen ? (
                <form id="official-form" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                        <TextField
                            label="Full name"
                            name="name"
                            required
                            value={form.name}
                            onChange={(event) => set("name", event.target.value)}
                            error={errors.name}
                            placeholder="e.g. Maria Santos"
                        />

                        <SelectField
                            label="Position"
                            name="position"
                            required
                            value={form.position}
                            onChange={(event) => set("position", event.target.value)}
                            error={errors.position}
                        >
                            <option value="">Select a position</option>
                            {positions.map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </SelectField>

                        <TextField
                            label="Contact number"
                            name="contact_number"
                            value={form.contact_number}
                            onChange={(event) => set("contact_number", event.target.value)}
                            error={errors.contact_number}
                            placeholder="e.g. 0917 123 4567"
                        />

                        <TextField
                            label="Email address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(event) => set("email", event.target.value)}
                            error={errors.email}
                        />

                        <TextField
                            label="Term start"
                            name="term_start"
                            type="date"
                            value={form.term_start}
                            onChange={(event) => set("term_start", event.target.value)}
                            error={errors.term_start}
                        />

                        <TextField
                            label="Term end"
                            name="term_end"
                            type="date"
                            value={form.term_end}
                            onChange={(event) => set("term_end", event.target.value)}
                            error={errors.term_end}
                            hint="Leave blank while they are still serving."
                        />
                    </div>

                    <label className="mt-4 flex items-center gap-2 text-sm text-black dark:text-white">
                        <input
                            type="checkbox"
                            checked={Boolean(form.is_active)}
                            onChange={(event) => set("is_active", event.target.checked)}
                            className="rounded border-stroke text-primary focus:ring-primary"
                        />
                        Currently serving
                    </label>
                </form>
            ) : loading ? (
                <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3">
                    <CircleHalf size={22} className="animate-spin text-primary" />
                    <p className="text-sm text-body dark:text-bodydark">Loading the roster...</p>
                </div>
            ) : failed ? (
                <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3 text-center">
                    <ExclamationTriangleFill size={24} className="text-danger" />
                    <p className="text-sm font-medium text-black dark:text-white">{failed}</p>
                    <button
                        type="button"
                        onClick={load}
                        className="flex h-10 items-center rounded-lg border border-stroke px-4 text-sm font-medium text-black dark:border-strokedark dark:text-white"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-sm text-black dark:text-white">
                            <input
                                type="checkbox"
                                checked={showInactive}
                                onChange={(event) => setShowInactive(event.target.checked)}
                                className="rounded border-stroke text-primary focus:ring-primary"
                            />
                            Show former officials
                        </label>

                        <div className="relative">
                            <Search
                                size={13}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                            />
                            <input
                                type="search"
                                value={term}
                                onChange={(event) => setTerm(event.target.value)}
                                placeholder="Search name or position..."
                                className="h-10 w-full rounded-lg border border-stroke bg-white pl-9 pr-3 text-sm text-black placeholder:text-body focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-strokedark dark:bg-form-input dark:text-white sm:w-64"
                            />
                        </div>
                    </div>

                    {visible.length === 0 ? (
                        <div className="py-14 text-center">
                            <PersonPlus size={26} className="mx-auto mb-2 text-[#CBD5E1]" />
                            <p className="text-sm font-medium text-black dark:text-white">
                                No officials on the roster yet
                            </p>
                            <p className="mt-1 text-xs text-body dark:text-bodydark">
                                Use “Add official” above to record the barangay council.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {visible.map((official) => (
                                <div
                                    key={official.id}
                                    className="flex items-start gap-3 rounded-xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                        {initials(official.name)}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-black dark:text-white">
                                            {official.name}
                                        </p>
                                        <p className="truncate text-xs text-body dark:text-bodydark">
                                            {official.position}
                                        </p>
                                        <p className="mt-1 text-xs text-body dark:text-bodydark">
                                            {formatTerm(official.term_start, official.term_end)}
                                            {official.contact_number ? ` · ${official.contact_number}` : ""}
                                        </p>

                                        {!official.is_active && (
                                            <span className="mt-2 inline-flex rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
                                                Former official
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openForm(official)}
                                            aria-label={`Edit ${official.name}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                                        >
                                            <PencilSquare size={13} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(official)}
                                            aria-label={`Remove ${official.name}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                                        >
                                            <Trash size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
};

export default OfficialsPanel;
