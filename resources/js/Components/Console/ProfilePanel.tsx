import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import {
    Camera,
    CheckLg,
    EnvelopeFill,
    GeoAltFill,
    Hypnotize,
    PersonBadgeFill,
    XLg,
} from "react-bootstrap-icons";
import Swal from "sweetalert2";

import Modal from "@/Components/Blotter/ui/Modal";
import barangays from "@/utils/data/barangays";
import cities from "@/utils/data/cities";
import provinces from "@/utils/data/provinces";
import regions from "@/utils/data/regions";

/** The profile row the server returns: the account joined to its address. */
type ProfileData = {
    id: number;
    name: string;
    email: string;
    role: number;
    avatar: string | null;
    banner: string | null;
    created_at: string | null;
    barangay_code: number | null;
    city_code: number | null;
    province_code: number | null;
    region_code: number | null;
};

type ImageField = "avatar" | "banner";

const FALLBACK_AVATAR = "/images/user/admin_2.png";
const FALLBACK_BANNER = "/images/cover/cover-01.png";

/** Same allowances the standalone profile page enforced before uploading. */
const ALLOWED = ["jpg", "jpeg", "png", "jfif"];
const MAX_BYTES = 1_000_000;

const ROLES: Record<number, string> = {
    1: "Super Admin",
    2: "Barangay",
    3: "Municipal / Station",
    4: "Provincial",
    5: "Regional",
};

/** PSGC codes are stored as integers but listed as zero-padded strings. */
const lookup = <T,>(rows: T[], key: keyof T, code: number | null | undefined) =>
    code ? rows.find((row) => parseInt(String(row[key]), 10) === Number(code)) : undefined;

const imageUrl = (folder: string, file: string | null, fallback: string) =>
    file ? `/images/${folder}/${file}` : fallback;

const formatJoined = (value: string | null) =>
    value
        ? new Date(value).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "—";

const Row = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex items-start gap-3 border-b border-stroke py-3 last:border-0 dark:border-strokedark">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
        </span>

        <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-body dark:text-bodydark">
                {label}
            </p>
            <p className="mt-0.5 break-words text-sm text-black dark:text-white">{value || "—"}</p>
        </div>
    </div>
);

/** Change / save / discard controls, shared by the banner and the avatar. */
const ImageControls = ({
    field,
    compact,
    staged,
    busy,
    onPick,
    onSave,
    onDiscard,
}: {
    field: ImageField;
    /** Icon-only, for the avatar badge where there is no room for a label. */
    compact?: boolean;
    staged: boolean;
    busy: boolean;
    onPick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onDiscard: () => void;
}) => {
    const buttonClass = `flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium shadow transition ${
        compact ? "h-8 w-8" : "h-8 px-3"
    }`;

    if (!staged) {
        return (
            <label
                className={`${buttonClass} cursor-pointer bg-primary text-white hover:bg-opacity-90`}
                title={`Change ${field}`}
            >
                <input type="file" accept="image/*" className="sr-only" onChange={onPick} />
                <Camera size={13} />
                {compact ? null : `Change ${field}`}
            </label>
        );
    }

    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                onClick={onSave}
                disabled={busy}
                className={`${buttonClass} bg-meta-3 text-white hover:bg-opacity-90 disabled:opacity-60`}
                title="Save"
            >
                {busy ? <Hypnotize size={13} className="animate-spin" /> : <CheckLg size={13} />}
                {compact ? null : busy ? "Saving..." : "Save"}
            </button>

            <button
                type="button"
                onClick={onDiscard}
                disabled={busy}
                className={`${buttonClass} bg-white text-body hover:text-black disabled:opacity-60 dark:bg-boxdark dark:text-bodydark`}
                title="Discard"
            >
                <XLg size={13} />
            </button>
        </div>
    );
};

/**
 * The barangay's own account, as a console panel.
 *
 * This replaces the /profile route for the console: the account menu used to
 * navigate off the dashboard to a page that only showed what the console
 * already knows, plus the two image uploads. Reads and writes go over XHR --
 * /profile answers Inertia with a page, which from here would take the
 * barangay off the console.
 */
const ProfilePanel = ({ onClose }: { onClose: () => void }) => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState("");

    // A picked-but-unsaved image per field: the object URL previews it, the
    // File is what gets posted when the barangay confirms.
    const [pending, setPending] = useState<Partial<Record<ImageField, File>>>({});
    const [preview, setPreview] = useState<Partial<Record<ImageField, string>>>({});
    const [saving, setSaving] = useState<ImageField | null>(null);

    // Object URLs are revoked on unmount rather than on replacement, so a
    // barangay flicking through several images does not blank the preview.
    const objectUrls = useRef<string[]>([]);

    useEffect(() => {
        axios
            .get("/profile")
            .then(({ data }) => setProfile(data.data ?? null))
            .catch(() => setFailed("Your profile could not be loaded. Please try again."))
            .finally(() => setLoading(false));

        return () => {
            objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const pick = (field: ImageField) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        // Reset the input so re-picking the same file still fires a change.
        event.target.value = "";

        if (!file) return;

        const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

        if (!ALLOWED.includes(extension)) {
            Swal.fire({
                title: "Unsupported image format",
                text: `Allowed formats: ${ALLOWED.join(", ")}`,
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
            return;
        }

        if (file.size > MAX_BYTES) {
            Swal.fire({
                title: "Image too large",
                text: "Please pick an image under 1 MB.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
            return;
        }

        const url = URL.createObjectURL(file);

        objectUrls.current.push(url);

        setPending((current) => ({ ...current, [field]: file }));
        setPreview((current) => ({ ...current, [field]: url }));
    };

    const discard = (field: ImageField) => {
        setPending(({ [field]: _dropped, ...rest }) => rest);
        setPreview(({ [field]: _dropped, ...rest }) => rest);
    };

    const save = (field: ImageField) => {
        const file = pending[field];

        if (!file || saving) return;

        const body = new FormData();

        body.append(field, file);

        setSaving(field);

        axios
            .post("/profile", body, { headers: { Accept: "application/json" } })
            .then(({ data }) => {
                setProfile(data.data ?? null);
                discard(field);

                // The header avatar reads the shared auth prop, so refresh it
                // rather than leaving the console showing the old image.
                router.reload({ only: ["auth"] });

                Swal.fire({
                    title: "Saved",
                    text: `Your ${field} has been updated.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch(() =>
                Swal.fire({
                    title: "Not saved",
                    text: `Your ${field} could not be uploaded. Please try again.`,
                    icon: "error",
                }),
            )
            .finally(() => setSaving(null));
    };

    const barangayName = lookup(barangays as any[], "brgy_code", profile?.barangay_code)?.brgy_name;
    const cityName = lookup(cities as any[], "city_code", profile?.city_code)?.city_name;
    const provinceName = lookup(provinces as any[], "province_code", profile?.province_code)
        ?.province_name;
    const regionName = lookup(regions as any[], "region_code", profile?.region_code)?.region_name;

    return (
        <Modal
            open
            onClose={onClose}
            title="Profile"
            subtitle="The account this console is signed in as, and the images it shows."
            footer={
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 items-center rounded-lg border border-stroke px-4 text-sm font-medium text-black transition hover:bg-whiten dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                        Close
                    </button>
                </div>
            }
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-sm text-body dark:text-bodydark">
                    <Hypnotize size={18} className="animate-spin" />
                    Loading your profile...
                </div>
            ) : failed ? (
                <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-6 text-center text-sm text-danger">
                    {failed}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <section className="overflow-hidden rounded-xl border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <div className="relative h-32 md:h-44">
                            <img
                                src={
                                    preview.banner ??
                                    imageUrl("barangay_banner", profile?.banner ?? null, FALLBACK_BANNER)
                                }
                                alt="Barangay banner"
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute bottom-3 right-3">
                                <ImageControls
                                    field="banner"
                                    staged={Boolean(pending.banner)}
                                    busy={saving === "banner"}
                                    onPick={pick("banner")}
                                    onSave={() => save("banner")}
                                    onDiscard={() => discard("banner")}
                                />
                            </div>
                        </div>

                        <div className="px-4 pb-5">
                            <div className="relative -mt-12 mb-3 h-24 w-24 rounded-full border-4 border-white bg-white dark:border-boxdark dark:bg-boxdark">
                                <img
                                    src={
                                        preview.avatar ??
                                        imageUrl(
                                            "barangay_avatar",
                                            profile?.avatar ?? null,
                                            FALLBACK_AVATAR,
                                        )
                                    }
                                    alt="Barangay avatar"
                                    className="h-full w-full rounded-full object-cover"
                                />

                                <div className="absolute -bottom-1 -right-1">
                                    <ImageControls
                                        field="avatar"
                                        compact
                                        staged={Boolean(pending.avatar)}
                                        busy={saving === "avatar"}
                                        onPick={pick("avatar")}
                                        onSave={() => save("avatar")}
                                        onDiscard={() => discard("avatar")}
                                    />
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                {barangayName ? `Barangay ${barangayName}` : profile?.name}
                            </h3>
                            <p className="text-sm text-body dark:text-bodydark">{profile?.email}</p>
                        </div>
                    </section>

                    <section className="rounded-xl border border-stroke bg-white px-4 py-2 dark:border-strokedark dark:bg-boxdark">
                        <Row
                            icon={<PersonBadgeFill size={14} />}
                            label="Account name"
                            value={profile?.name}
                        />
                        <Row icon={<EnvelopeFill size={14} />} label="Email" value={profile?.email} />
                        <Row
                            icon={<PersonBadgeFill size={14} />}
                            label="Access level"
                            value={ROLES[Number(profile?.role)] ?? "Unknown"}
                        />
                        <Row
                            icon={<PersonBadgeFill size={14} />}
                            label="Account created"
                            value={formatJoined(profile?.created_at ?? null)}
                        />
                    </section>

                    <section className="rounded-xl border border-stroke bg-white px-4 py-2 dark:border-strokedark dark:bg-boxdark">
                        <Row icon={<GeoAltFill size={14} />} label="Barangay" value={barangayName} />
                        <Row
                            icon={<GeoAltFill size={14} />}
                            label="City / Municipality"
                            value={cityName}
                        />
                        <Row icon={<GeoAltFill size={14} />} label="Province" value={provinceName} />
                        <Row icon={<GeoAltFill size={14} />} label="Region" value={regionName} />
                    </section>

                    <p className="text-xs text-body dark:text-bodydark">
                        Images must be JPG or PNG and under 1 MB. Your barangay and address are set
                        by the system administrator.
                    </p>
                </div>
            )}
        </Modal>
    );
};

export default ProfilePanel;
