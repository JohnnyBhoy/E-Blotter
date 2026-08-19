import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    BarChartLineFill,
    BoxArrowInRight,
    Bullseye,
    CalendarEventFill,
    CheckCircleFill,
    ClockHistory,
    Diagram3Fill,
    FileEarmarkTextFill,
    GeoAltFill,
    JournalText,
    PatchCheckFill,
    PeopleFill,
    ShieldCheck,
    ShieldLockFill,
    TelephoneOutboundFill,
} from "react-bootstrap-icons";

import GuestLayout from "@/Layouts/GuestLayout";
import { useLoginRegisterStore } from "@/utils/store/loginRegisterStore";
import { PageProps } from "./types";

type LandingStats = {
    barangays: number;
    municipalities: number;
    blotters: number;
    reports: number;
};

/** Outcomes the system is mandated to deliver (NAPOLCOM 6 / PNP Antique brief). */
const OUTCOMES = [
    {
        icon: BarChartLineFill,
        title: "Improved Crime Data Accuracy",
        body: "Barangay incident records are encoded once and harmonized with the records of the local PNP station — one crime picture, no parallel logbooks.",
    },
    {
        icon: ShieldCheck,
        title: "Enhanced Crime Prevention",
        body: "Patterns by barangay, incident type and time of day surface early, so patrols and interventions are planned on evidence instead of hunches.",
    },
    {
        icon: ClockHistory,
        title: "Timely Intervention & Response",
        body: "An entry recorded at the barangay is visible to the municipal station the moment it is saved, shortening the path from report to response.",
    },
    {
        icon: PeopleFill,
        title: "Community Engagement",
        body: "Residents can file crime, fire, accident and other incident reports online without an account, keeping the barangay reachable at all hours.",
    },
    {
        icon: PatchCheckFill,
        title: "Trust & Confidence Building",
        body: "Complete, retrievable and auditable records give the community a transparent account of how every reported incident was acted upon.",
    },
    {
        icon: Bullseye,
        title: "Targeted Resource Allocation",
        body: "Provincial and regional roll-ups show where incidents actually cluster, so personnel and equipment go where they are needed most.",
    },
];

/** Pilot launches conducted in the Province of Antique, 2024. */
const PILOTS = [
    {
        municipality: "Bugasong",
        date: "November 12, 2024",
        time: "2:15 PM",
        venue: "Evacuation Center, Brgy. Ilaya, Bugasong, Antique",
        barangays: "27 barangays",
        official: "Hon. Marvin Rico — Sangguniang Bayan Member / OIC Municipal Mayor",
    },
    {
        municipality: "Culasi",
        date: "November 26, 2024",
        time: "9:00 AM",
        venue: "Culasi Gymnasium, Brgy. Centro Poblacion, Culasi, Antique",
        barangays: "44 barangays",
        official: "Hon. Jose Jeffrey Y. Lomugdang — Municipal Mayor",
    },
    {
        municipality: "Tibiao",
        date: "November 29, 2024",
        time: "9:00 AM",
        venue: "Tibiao Function Hall, Tibiao, Antique",
        barangays: "21 barangays",
        official: "Hon. Klemens G. Bandoja — Municipal Mayor",
    },
    {
        municipality: "Sebaste",
        date: "December 2, 2024",
        time: "9:00 AM",
        venue: "Municipality of Sebaste, Antique",
        barangays: "Municipality-wide launch",
        official: "Local government unit officials and punong barangays",
    },
    {
        municipality: "Valderrama",
        date: "December 12, 2024",
        time: "2:00 PM",
        venue: "Valderrama Function Hall, Valderrama, Antique",
        barangays: "22 barangays",
        official: "Atty. Jocelyn L. Posadas — Municipal Mayor",
    },
];

/** How an entry travels from the barangay desk up the PNP chain. */
const FLOW = [
    {
        step: "01",
        title: "Barangay records the incident",
        body: "The barangay official entertains the complainant and encodes the short details of the incident into the barangay blotter template.",
    },
    {
        step: "02",
        title: "Initial assessment",
        body: "The barangay determines whether immediate intervention is required — medical attention, securing the scene, or direct forwarding to the PNP.",
    },
    {
        step: "03",
        title: "Notification & coordination",
        body: "The PNP is notified of the crime incident for further investigation, with the documented details already attached to the record.",
    },
    {
        step: "04",
        title: "Station, provincial & regional roll-up",
        body: "The municipal police station receives the data, which consolidates to the Provincial Office — records kept confidential and compliant with data privacy rules.",
    },
];

const LEADERSHIP = [
    {
        name: "Atty. Jerome LB. Asuga",
        role: "Regional Director, NAPOLCOM Region VI",
        note: "Reviewed the system and the proposed Memorandum of Agreement with the NAPOLCOM VI technical staff.",
    },
    {
        name: "PCOL Lea Rose B. Peña",
        role: "Provincial Director, PNP Antique Provincial Office",
        note: "Led the cascading of the project to all municipal police stations in the province.",
    },
    {
        name: "PLTCOL Robert R. Mansueto",
        role: "Project Director, Barangay e-Blotter System",
        note: "Personally led the capacity-building sessions and the pilot launches in the five municipalities.",
    },
    {
        name: "Mr. Alfonso Combong III",
        role: "Inspector, NAPOLCOM Region VI",
        note: "Presented the innovative purpose and the legal framework supporting the implementation.",
    },
];

const AGENCIES = [
    { src: "/images/government_agencies/NAPOLCOM.png", label: "NAPOLCOM Region VI" },
    { src: "/images/government_agencies/PNP.png", label: "Philippine National Police" },
    { src: "/images/government_agencies/DILG.png", label: "DILG" },
];

const formatCount = (value: number) => new Intl.NumberFormat("en-PH").format(value ?? 0);

export default function Welcome({ stats }: PageProps<{ stats: LandingStats }>) {
    const { setShowLogin } = useLoginRegisterStore();

    const counters = [
        { value: formatCount(stats?.barangays ?? 0), label: "Barangay accounts onboarded" },
        { value: formatCount(stats?.municipalities ?? 0), label: "Municipalities covered" },
        { value: formatCount(stats?.blotters ?? 0), label: "Blotter entries recorded" },
        { value: formatCount(stats?.reports ?? 0), label: "Citizen reports received" },
    ];

    return (
        <GuestLayout>
            <Head title="Barangay e-Blotter System" />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2447] via-[#123a72] to-[#1e40af]">
                <div
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                        backgroundSize: "28px 28px",
                    }}
                    aria-hidden="true"
                />
                <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FBBF24]/20 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" aria-hidden="true" />

                <div className="relative mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div className="text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-100 backdrop-blur">
                                <ShieldCheck className="h-4 w-4" />
                                NAPOLCOM 6 &middot; PNP Antique Provincial Office
                            </span>

                            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Barangay{" "}
                                <span className="bg-gradient-to-r from-[#FCD34D] to-[#F59E0B] bg-clip-text text-transparent">
                                    e-Blotter
                                </span>{" "}
                                System
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-relaxed text-sky-100/90 sm:text-lg lg:mx-0 mx-auto">
                                A web and mobile browser-based application that harmonizes barangay
                                crime records with those of the local PNP — for accurate crime data,
                                timely intervention, and evidence-based policy making at the
                                grassroots level.
                            </p>

                            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-sky-100/80 lg:justify-start">
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircleFill className="h-4 w-4 text-emerald-400" />
                                    Free for every barangay
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircleFill className="h-4 w-4 text-emerald-400" />
                                    Works on any phone or laptop
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircleFill className="h-4 w-4 text-emerald-400" />
                                    No installation required
                                </span>
                            </div>

                            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-[#0B2447] shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-xl"
                                >
                                    <BoxArrowInRight className="h-5 w-5" />
                                    Barangay Sign In
                                </button>
                                <Link
                                    href="/report/crime"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                                >
                                    <TelephoneOutboundFill className="h-4 w-4" />
                                    Report an Incident
                                </Link>
                            </div>

                            <p className="mt-4 text-sm text-sky-200/70">
                                Accounts are issued to punong barangays, barangay secretaries and
                                peace &amp; order kagawads by their municipal police station.
                            </p>
                        </div>

                        {/* Sign-in card */}
                        <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
                            <div className="rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/logo/e-blotter.png"
                                        alt="Barangay e-Blotter"
                                        className="h-11 w-auto"
                                    />
                                    <div>
                                        <p className="text-lg font-bold text-slate-900">
                                            Official Access
                                        </p>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Barangay &amp; PNP personnel
                                        </p>
                                    </div>
                                </div>

                                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                                    {[
                                        "Record and retrieve barangay blotter entries",
                                        "Print certified blotter extracts on demand",
                                        "Forward incidents to your municipal station",
                                        "Track incident trends inside your jurisdiction",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <CheckCircleFill className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:from-blue-800 hover:to-blue-700"
                                >
                                    Sign in to your account
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <ShieldLockFill className="h-3.5 w-3.5" />
                                    Records are confidential and handled under the Data Privacy Act
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Live counters ────────────────────────────────────── */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 divide-slate-200 lg:grid-cols-4 lg:divide-x">
                        {counters.map((counter) => (
                            <div key={counter.label} className="px-4 py-8 text-center">
                                <p className="text-3xl font-extrabold text-[#0B2447] sm:text-4xl">
                                    {counter.value}
                                </p>
                                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 sm:text-sm">
                                    {counter.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Partner agencies ─────────────────────────────────── */}
            <section className="bg-slate-50 py-12">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        A joint initiative and collaboration of
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                        {AGENCIES.map((agency) => (
                            <div key={agency.label} className="flex flex-col items-center gap-2">
                                <img
                                    src={agency.src}
                                    alt={agency.label}
                                    className="h-16 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
                                />
                                <span className="text-xs font-medium text-slate-500">
                                    {agency.label}
                                </span>
                            </div>
                        ))}
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-16 items-center rounded-xl border border-slate-200 bg-white px-5 text-lg font-extrabold tracking-tight text-slate-700">
                                DICT
                            </div>
                            <span className="text-xs font-medium text-slate-500">
                                Info &amp; Communications Tech
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Outcomes ─────────────────────────────────────────── */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                            Why the e-Blotter
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            One barangay record, one provincial crime picture
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            The Barangay e-Blotter adopts and implements a single record of barangay
                            crime incidents for PNP adoption — addressing peace and order
                            proactively rather than after the fact.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {OUTCOMES.map(({ icon: Icon, title, body }) => (
                            <article
                                key={title}
                                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors duration-300 group-hover:bg-blue-700 group-hover:text-white">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ─────────────────────────────────────── */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-14 lg:grid-cols-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                                How it works
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                From the barangay desk to the Provincial Office
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-slate-600">
                                Every entry recorded at the barangay level flows upward through the
                                municipal police station to the Provincial Office — no re-encoding,
                                no lost logbooks.
                            </p>

                            <ol className="mt-10 space-y-6">
                                {FLOW.map((item) => (
                                    <li key={item.step} className="flex gap-5">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B2447] text-sm font-bold text-white">
                                            {item.step}
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                                {item.body}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                            <img
                                src="/images/homepage/homepage_image_1.png"
                                alt="Barangay e-Blotter data flow: barangay officials record the incident, assess, notify the PNP, and the record consolidates to the municipal station and Provincial Office."
                                className="w-full rounded-xl"
                                loading="lazy"
                            />
                            <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                                <Diagram3Fill className="h-3.5 w-3.5" />
                                Barangay Information System (BIS) recording and reporting flow
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pilot testing ────────────────────────────────────── */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                            Pilot testing
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Launched in five municipalities of Antique
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-600">
                            The launching and pilot testing of the e-Blotter System was successfully
                            conducted in Bugasong, Culasi, Sebaste, Tibiao and Valderrama, attended
                            by the respective local government unit officials, punong barangays,
                            barangay secretaries and peace &amp; order kagawads. Actual application
                            using mobile phones over the web was initiated on site.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {PILOTS.map((pilot) => (
                            <article
                                key={pilot.municipality}
                                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-xl font-extrabold text-slate-900">
                                        {pilot.municipality}
                                    </h3>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Launched
                                    </span>
                                </div>

                                <dl className="mt-5 space-y-3 text-sm text-slate-600">
                                    <div className="flex gap-3">
                                        <CalendarEventFill className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                        <dd>
                                            {pilot.date}
                                            <span className="text-slate-400"> · {pilot.time}</span>
                                        </dd>
                                    </div>
                                    <div className="flex gap-3">
                                        <GeoAltFill className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                        <dd>{pilot.venue}</dd>
                                    </div>
                                    <div className="flex gap-3">
                                        <PeopleFill className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                        <dd>{pilot.barangays}</dd>
                                    </div>
                                </dl>

                                <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                                    {pilot.official}
                                </p>
                            </article>
                        ))}

                        <article className="flex flex-col justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-7 text-center">
                            <h3 className="text-lg font-bold text-[#0B2447]">
                                Province-wide rollout
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Follow-ups and updates are cascaded through regular coordination
                                meetings with the Chiefs of Police of all municipalities in Antique
                                — for adoption by PRO6 and the entire PNP.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ── Legal basis ──────────────────────────────────────── */}
            <section className="bg-[#0B2447] py-20 text-white">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FCD34D]">
                                Legal basis
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Backed by a Sangguniang Panlalawigan resolution
                            </h2>
                            <p className="mt-5 text-base leading-relaxed text-sky-100/85">
                                The proposed Memorandum of Agreement was duly reviewed by the
                                National Police Commission and subsequently endorsed to the
                                Sangguniang Panlalawigan for implementation.
                            </p>

                            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <FileEarmarkTextFill className="h-6 w-6 text-[#FCD34D]" />
                                    <p className="text-lg font-bold">Resolution No. 707-2024</p>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-sky-100/85">
                                    Authorizing Hon. Gov. Rhodora J. Cadiao of Antique, representing
                                    the Provincial Government, to enter into a Memorandum of
                                    Agreement with NAPOLCOM Region VI, the PNP Antique, and other
                                    national government agencies for the effective implementation of
                                    the system.
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FCD34D]">
                                Inter-agency coordination
                            </span>
                            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                Four agencies, one implementation
                            </h2>

                            <div className="mt-8 space-y-4">
                                {[
                                    {
                                        title: "DICT — Antique Provincial Office",
                                        body: "Coordination conducted September 11, 2024 at Salazar St., Brgy. Madrangca, San Jose, Antique.",
                                    },
                                    {
                                        title: "DILG — Antique Provincial Office",
                                        body: "Coordination conducted September 11, 2024 at Binirayan Hills, Brgy. 5, San Jose, Antique.",
                                    },
                                    {
                                        title: "NAPOLCOM Region VI",
                                        body: "System testing and MOA review conducted with the Regional Director and the NAPOLCOM VI technical staff.",
                                    },
                                    {
                                        title: "PNP Antique Provincial Office",
                                        body: "Cascading and training delivered to all municipal police stations across the province.",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-5"
                                    >
                                        <JournalText className="mt-0.5 h-5 w-5 shrink-0 text-[#FCD34D]" />
                                        <div>
                                            <p className="font-semibold">{item.title}</p>
                                            <p className="mt-1 text-sm leading-relaxed text-sky-100/80">
                                                {item.body}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Leadership ───────────────────────────────────────── */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                            Leadership
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            The people behind the system
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {LEADERSHIP.map((person) => (
                            <article
                                key={person.name}
                                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B2447] text-lg font-bold text-white">
                                    {person.name
                                        .replace(/^(Atty\.|PCOL|PLTCOL|Mr\.)\s+/, "")
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((part) => part.charAt(0))
                                        .join("")}
                                </div>
                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    {person.name}
                                </h3>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                                    {person.role}
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    {person.note}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Sign-in call to action ───────────────────────────── */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-[#0B2447] px-8 py-14 text-center shadow-2xl sm:px-16">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Ready to record your barangay&rsquo;s incidents?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-sky-100/90">
                            Sign in with the account issued by your municipal police station. If your
                            barangay has not been onboarded yet, coordinate with your Chief of Police
                            or the PNP Antique Provincial Office.
                        </p>
                        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#0B2447] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-50"
                            >
                                <BoxArrowInRight className="h-5 w-5" />
                                Barangay Sign In
                            </button>
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
                            >
                                Request an account
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────── */}
            <footer className="bg-[#081b33] py-14 text-sky-100/70">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 md:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/logo/e-blotter.png"
                                    alt="Barangay e-Blotter"
                                    className="h-9 w-auto"
                                />
                                <span className="text-lg font-bold text-white">
                                    Barangay e-Blotter
                                </span>
                            </div>
                            <p className="mt-4 max-w-sm text-sm leading-relaxed">
                                A web and mobile browser-based application provided free as part of
                                the joint initiative of NAPOLCOM Region VI and the PNP Antique
                                Provincial Command.
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-white">
                                Quick links
                            </p>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li>
                                    <Link href="/faq" className="transition hover:text-white">
                                        Frequently asked questions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact-us" className="transition hover:text-white">
                                        Contact us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/report/crime" className="transition hover:text-white">
                                        Report an incident
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setShowLogin(true)}
                                        className="transition hover:text-white"
                                    >
                                        Barangay sign in
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-white">
                                Emergency
                            </p>
                            <p className="mt-4 text-3xl font-extrabold text-white">911</p>
                            <p className="mt-1 text-sm">
                                For life-threatening emergencies, call 911 immediately. The e-Blotter
                                is a record-keeping system, not an emergency dispatch line.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs">
                        &copy; {new Date().getFullYear()} Barangay e-Blotter System &middot;
                        NAPOLCOM Region VI &amp; PNP Antique Provincial Office
                    </div>
                </div>
            </footer>
        </GuestLayout>
    );
}
