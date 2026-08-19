import React from "react";
import { BuildingFill, MoonFill, PersonBadgeFill, SunFill } from "react-bootstrap-icons";

import Modal from "@/Components/Blotter/ui/Modal";
import useColorMode from "@/hooks/useColorMode";
import { ConsoleScope } from "@/Components/Barangay/Dashboard/types";

type SettingsPanelProps = {
    scope: ConsoleScope;
    /** The jurisdiction, already named -- see utils/functions/getAreaName. */
    scopeName: string;
    userName?: string;
    userEmail?: string;
    onClose: () => void;
};

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

/**
 * Console settings.
 *
 * The standalone Settings route was a stub that rendered the words "Settings
 * Page" under a breadcrumb reading "Map". This panel shows what the console
 * actually knows about the signed-in account -- which jurisdiction it covers and
 * how wide that is -- and carries the one preference the console owns: light or
 * dark. Profile and password live in the account menu, which is where the rest
 * of the app puts them.
 */
const SettingsPanel = ({
    scope,
    scopeName,
    userName,
    userEmail,
    onClose,
}: SettingsPanelProps) => {
    const [colorMode, setColorMode] = useColorMode() as [string, (value: string) => void];

    const isDark = colorMode === "dark";

    return (
        <Modal
            open
            onClose={onClose}
            title="Settings"
            subtitle="Console preferences and the account this console is signed in as."
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
            <div className="flex flex-col gap-4">
                <section className="rounded-xl border border-stroke bg-white px-4 py-2 dark:border-strokedark dark:bg-boxdark">
                    <Row
                        icon={<BuildingFill size={14} />}
                        label="Jurisdiction"
                        value={`${scope.levelLabel} — ${scopeName}`}
                    />
                    <Row
                        icon={<BuildingFill size={14} />}
                        label="PSGC code"
                        value={scope.code ? String(scope.code) : "Nationwide"}
                    />
                    <Row
                        icon={<BuildingFill size={14} />}
                        label={`${scope.childLabelPlural} covered`}
                        value={
                            scope.level === "barangay"
                                ? "This barangay only"
                                : `${scope.barangayCount.toLocaleString()} barangay accounts`
                        }
                    />
                    <Row
                        icon={<PersonBadgeFill size={14} />}
                        label="Signed in as"
                        value={
                            <>
                                {userName}
                                {userEmail ? (
                                    <span className="block text-xs text-body dark:text-bodydark">
                                        {userEmail}
                                    </span>
                                ) : null}
                            </>
                        }
                    />
                </section>

                <section className="rounded-xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
                    <h3 className="text-sm font-semibold text-black dark:text-white">Appearance</h3>
                    <p className="mt-0.5 text-xs text-body dark:text-bodydark">
                        Applies to this browser only.
                    </p>

                    <div className="mt-3 flex gap-2">
                        {[
                            { value: "light", label: "Light", icon: <SunFill size={13} /> },
                            { value: "dark", label: "Dark", icon: <MoonFill size={13} /> },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setColorMode(option.value)}
                                className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${
                                    (option.value === "dark") === isDark
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-stroke text-black hover:bg-whiten dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                                }`}
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </section>

                <p className="text-xs text-body dark:text-bodydark">
                    Profile details and password changes are in the account menu, top right.
                </p>
            </div>
        </Modal>
    );
};

export default SettingsPanel;
