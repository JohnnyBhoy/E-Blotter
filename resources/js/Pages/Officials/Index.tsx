import React, { useMemo, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import {
    PencilSquare,
    PersonBadge,
    PersonPlus,
    Search,
    TelephoneFill,
    Trash,
    X,
} from "react-bootstrap-icons";
import Swal from "sweetalert2";

import Breadcrumb from "@/Components/components/Breadcrumbs/Breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "../types";

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

const EMPTY: Omit<Official, "id"> = {
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
 * Barangay officials directory.
 *
 * This page was a placeholder that rendered the words "Officials Page" under a
 * breadcrumb that said "Map". It is now a working roster: add, edit, retire and
 * remove the officials of the signed-in barangay.
 */
export default function Officials({ auth, officials, positions }:
    PageProps<{ officials: Official[]; positions: string[] }>) {

    const [term, setTerm] = useState<string>("");
    const [showInactive, setShowInactive] = useState<boolean>(true);
    const [editing, setEditing] = useState<Official | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<any>({ ...EMPTY });

    const visible = useMemo(() => {
        const needle = term.trim().toLowerCase();

        return (officials ?? []).filter((official) => {
            if (!showInactive && !official.is_active) return false;
            if (!needle) return true;

            return official.name.toLowerCase().includes(needle)
                || official.position.toLowerCase().includes(needle);
        });
    }, [officials, term, showInactive]);

    const activeCount = (officials ?? []).filter((official) => official.is_active).length;

    const openForm = (official: Official | null) => {
        clearErrors();

        if (official) {
            setEditing(official);
            setData({
                name: official.name,
                position: official.position,
                contact_number: official.contact_number ?? "",
                email: official.email ?? "",
                term_start: official.term_start?.slice(0, 10) ?? "",
                term_end: official.term_end?.slice(0, 10) ?? "",
                is_active: official.is_active,
            });
        } else {
            setEditing(null);
            setData({ ...EMPTY });
        }

        setOpen(true);
    };

    const closeForm = () => {
        setOpen(false);
        setEditing(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const options = { preserveScroll: true, onSuccess: () => closeForm() };

        if (editing) {
            put(`/officials/${editing.id}`, options);
        } else {
            post("/officials", options);
        }
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

            router.delete(`/officials/${official.id}`, { preserveScroll: true });
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Barangay Officials</h2>
            }
        >
            <Head title="Barangay Officials" />

            <Breadcrumb pageName="Officials" />

            <div className="flex flex-col gap-4">

                {/** Toolbar */}
                <div className="flex flex-col gap-3 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-black dark:text-white">Roster</h3>
                        <p className="text-sm text-slate-500 dark:text-bodydark1">
                            {activeCount} active {activeCount === 1 ? "official" : "officials"} on record.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-bodydark1">
                            <input
                                type="checkbox"
                                checked={showInactive}
                                onChange={(event) => setShowInactive(event.target.checked)}
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            Show former officials
                        </label>

                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={term}
                                onChange={(event) => setTerm(event.target.value)}
                                type="text"
                                placeholder="Search name or position..."
                                className="w-full rounded border border-slate-300 py-2 pl-8 pr-8 text-sm text-slate-700 focus:border-primary focus:ring-0 dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1 sm:w-60"
                            />
                            {term ? (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    onClick={() => setTerm("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={15} />
                                </button>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={() => openForm(null)}
                            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            <PersonPlus size={15} /> Add Official
                        </button>
                    </div>
                </div>

                {/** Roster */}
                {visible.length ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {visible.map((official) => (
                            <div
                                key={official.id}
                                className={`flex flex-col rounded-sm border border-stroke bg-white p-5 shadow-default transition dark:border-strokedark dark:bg-boxdark ${official.is_active ? "" : "opacity-70"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary dark:bg-meta-4 dark:text-white">
                                        {initials(official.name) || <PersonBadge size={18} />}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate font-semibold text-black dark:text-white">
                                            {official.name}
                                        </h4>
                                        <p className="truncate text-sm text-primary">{official.position}</p>
                                    </div>

                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${official.is_active
                                        ? "bg-success/10 text-success"
                                        : "bg-slate-200 text-slate-500 dark:bg-meta-4 dark:text-bodydark1"
                                        }`}>
                                        {official.is_active ? "Active" : "Former"}
                                    </span>
                                </div>

                                <dl className="mt-4 space-y-1.5 text-sm text-slate-600 dark:text-bodydark1">
                                    <div className="flex items-center gap-2">
                                        <TelephoneFill size={12} className="shrink-0 text-slate-400" />
                                        <span className="truncate">{official.contact_number || "No contact number"}</span>
                                    </div>
                                    <div className="truncate">{official.email || "No email address"}</div>
                                    <div className="text-xs text-slate-400">
                                        Term: {formatTerm(official.term_start, official.term_end)}
                                    </div>
                                </dl>

                                <div className="mt-4 flex gap-2 border-t border-stroke pt-3 dark:border-strokedark">
                                    <button
                                        type="button"
                                        onClick={() => openForm(official)}
                                        className="flex flex-1 items-center justify-center gap-1 rounded border border-stroke py-1.5 text-sm text-slate-600 transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-bodydark1"
                                    >
                                        <PencilSquare size={13} /> Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(official)}
                                        aria-label={`Remove ${official.name}`}
                                        className="flex items-center justify-center rounded border border-stroke px-3 py-1.5 text-danger transition hover:border-danger hover:bg-danger hover:text-white dark:border-strokedark"
                                    >
                                        <Trash size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-stroke bg-white py-16 text-center dark:border-strokedark dark:bg-boxdark">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <PersonBadge size={22} />
                        </span>
                        <h4 className="font-semibold text-black dark:text-white">
                            {officials?.length ? "No officials match this view" : "No officials recorded yet"}
                        </h4>
                        <p className="max-w-sm text-sm text-slate-500 dark:text-bodydark1">
                            {officials?.length
                                ? "Try a different search, or show former officials."
                                : "Add the Punong Barangay, Kagawads and staff so the roster is on hand when you record a blotter entry."}
                        </p>
                        {!officials?.length ? (
                            <button
                                type="button"
                                onClick={() => openForm(null)}
                                className="mt-1 flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                            >
                                <PersonPlus size={15} /> Add the first official
                            </button>
                        ) : null}
                    </div>
                )}
            </div>

            {/** Add / edit modal */}
            {open ? (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
                            <h3 className="font-semibold text-black dark:text-white">
                                {editing ? "Edit official" : "Add official"}
                            </h3>
                            <button type="button" aria-label="Close" onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                                    Full name <span className="text-danger">*</span>
                                </label>
                                <input
                                    value={data.name}
                                    onChange={(event) => setData("name", event.target.value)}
                                    type="text"
                                    placeholder="e.g. Juan Dela Cruz"
                                    className="w-full rounded border border-stroke px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                                />
                                {errors.name ? <p className="mt-1 text-xs text-danger">{errors.name}</p> : null}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                                    Position <span className="text-danger">*</span>
                                </label>
                                <select
                                    value={data.position}
                                    onChange={(event) => setData("position", event.target.value)}
                                    className="w-full rounded border border-stroke px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                                >
                                    <option value="">Select a position</option>
                                    {positions?.map((position) => (
                                        <option key={position} value={position}>{position}</option>
                                    ))}
                                </select>
                                {errors.position ? <p className="mt-1 text-xs text-danger">{errors.position}</p> : null}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Contact number</label>
                                    <input
                                        value={data.contact_number}
                                        onChange={(event) => setData("contact_number", event.target.value)}
                                        type="text"
                                        placeholder="09XX XXX XXXX"
                                        className="w-full rounded border border-stroke px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                                    />
                                    {errors.contact_number ? <p className="mt-1 text-xs text-danger">{errors.contact_number}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Email</label>
                                    <input
                                        value={data.email}
                                        onChange={(event) => setData("email", event.target.value)}
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full rounded border border-stroke px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                                    />
                                    {errors.email ? <p className="mt-1 text-xs text-danger">{errors.email}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Term start</label>
                                    <input
                                        value={data.term_start}
                                        onChange={(event) => setData("term_start", event.target.value)}
                                        type="date"
                                        className="w-full rounded border border-stroke px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                                    />
                                    {errors.term_start ? <p className="mt-1 text-xs text-danger">{errors.term_start}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">Term end</label>
                                    <input
                                        value={data.term_end}
                                        onChange={(event) => setData("term_end", event.target.value)}
                                        type="date"
                                        className="w-full rounded border border-stroke px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1"
                                    />
                                    {errors.term_end ? <p className="mt-1 text-xs text-danger">{errors.term_end}</p> : null}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-bodydark1">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_active)}
                                    onChange={(event) => setData("is_active", event.target.checked)}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                Currently serving
                            </label>

                            <div className="flex justify-end gap-2 border-t border-stroke pt-4 dark:border-strokedark">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded border border-stroke px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:border-strokedark dark:text-bodydark1 dark:hover:bg-meta-4"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-primary px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                                >
                                    {processing ? "Saving..." : editing ? "Save changes" : "Add official"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </AuthenticatedLayout>
    );
}
