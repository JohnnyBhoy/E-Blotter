import React, { useEffect, useRef, useState } from "react";
import {
    CaretDownFill,
    ClipboardCheck,
    FileEarmarkBarGraph,
    GeoAlt,
    Lightning,
    PersonBadge,
    PinMap,
    PlusLg,
} from "react-bootstrap-icons";

import { ConsoleScope } from "@/Components/Barangay/Dashboard/types";
import { ConsoleActions, DISPOSITIONS } from "./consoleActions";

type Action = {
    label: string;
    icon: React.ReactNode;
    /** What the item does on the console -- none of them navigate. */
    run: (actions: ConsoleActions) => void;
};

type Group = {
    heading: string;
    actions: Action[];
};

/**
 * Every destination the sidebar used to carry, reworked as console actions. The
 * console has no sidebar, so anything missing here would be unreachable -- but
 * nothing here routes away either: a disposition narrows the table that is
 * already on screen, and the rest float a panel over it.
 *
 * The menu follows the viewer's level. Only a barangay files entries and keeps a
 * roster of officials and an incident map, so those items are withheld from the
 * rollup levels rather than shown and refused.
 */
const groupsFor = (scope: ConsoleScope): Group[] => {
    const groups: Group[] = [];

    if (scope.canEncode) {
        groups.push({
            heading: "Create",
            actions: [
                {
                    label: "New Blotter Entry",
                    icon: <PlusLg size={14} />,
                    run: (actions) => actions.newEntry(),
                },
            ],
        });
    }

    groups.push({
        heading: "Case Disposition",
        actions: DISPOSITIONS.map((item) => ({
            label: item.label,
            icon: <ClipboardCheck size={14} />,
            run: (actions: ConsoleActions) => actions.filterTable({ remarks: item.id }),
        })),
    });

    const browse: Action[] = [
        {
            label: "Incidents by Type",
            icon: <GeoAlt size={14} />,
            run: (actions) => actions.openPanel("incidents"),
        },
        {
            label: `Cases by ${scope.childLabel}`,
            icon: <PinMap size={14} />,
            run: (actions) => actions.openPanel("areas"),
        },
    ];

    if (scope.level === "barangay") {
        browse.push(
            {
                label: "Barangay Officials",
                icon: <PersonBadge size={14} />,
                run: (actions) => actions.openPanel("officials"),
            },
            {
                label: "Incident Map",
                icon: <GeoAlt size={14} />,
                run: (actions) => actions.openPanel("map"),
            },
        );
    }

    groups.push({ heading: "Browse", actions: browse });

    groups.push({
        heading: "Reports",
        actions: [
            {
                label: "Monthly Report",
                icon: <FileEarmarkBarGraph size={14} />,
                run: (actions) => actions.openPanel("reports"),
            },
            {
                label: "Daily Report",
                icon: <FileEarmarkBarGraph size={14} />,
                run: (actions) => actions.openPanel("reports"),
            },
        ],
    });

    return groups;
};

/** Frequently used actions for this level, collapsed into one header dropdown. */
const QuickActionsMenu = ({
    scope,
    actions,
}: {
    scope: ConsoleScope;
    actions: ConsoleActions;
}) => {
    const [open, setOpen] = useState(false);
    const container = useRef<HTMLDivElement>(null);
    const groups = groupsFor(scope);

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (!container.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEscape);

        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, []);

    return (
        <div className="relative" ref={container}>
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-lg bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#DBEAFE] dark:bg-meta-4 dark:text-white"
            >
                <Lightning size={14} />
                <span className="hidden sm:inline">Quick Actions</span>
                <CaretDownFill size={9} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg dark:border-strokedark dark:bg-boxdark"
                >
                    {groups.map((group) => (
                        <div key={group.heading} className="py-1">
                            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                                {group.heading}
                            </p>

                            {group.actions.map((action) => (
                                <button
                                    key={action.label}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setOpen(false);
                                        action.run(actions);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#334155] transition hover:bg-[#F8FAFC] hover:text-[#1D4ED8] dark:text-bodydark1 dark:hover:bg-meta-4"
                                >
                                    <span className="text-[#64748B]">{action.icon}</span>
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuickActionsMenu;
