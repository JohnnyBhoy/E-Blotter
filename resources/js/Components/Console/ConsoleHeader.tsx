import React, { useState } from "react";
import {
    Buildings,
    Fingerprint,
    FileEarmarkBarGraph,
    Gear,
    Grid1x2,
    List,
    People,
    PinMap,
    X,
} from "react-bootstrap-icons";
import type { Icon } from "react-bootstrap-icons";
import DropdownNotification from "@/Components/components/Header/DropdownNotification";
import DropdownUser from "@/Components/components/Header/DropdownUser";
import { ConsoleScope } from "@/Components/Barangay/Dashboard/types";
import QuickActionsMenu from "./QuickActionsMenu";
import { ConsoleActions } from "./consoleActions";

type NavItem = {
    label: string;
    icon: Icon;
    /** What the item does on the console -- none of them navigate. */
    run: (actions: ConsoleActions) => void;
};

/**
 * Top navigation for the console.
 *
 * These used to be links to standalone pages, which took the user off the
 * console to see something it already shows. Each item now either narrows the
 * table in place or floats a panel over it.
 *
 * The items are the same at every level bar two: the area item is named after
 * whatever sits one step below the viewer (Purok for a barangay, Barangays for a
 * station, Cities for a province, and so on), and "People" is barangay-only --
 * barangay officials are the only roster the app keeps.
 */
const navFor = (scope: ConsoleScope): NavItem[] => {
    const items: NavItem[] = [
        {
            label: "Dashboard",
            icon: Grid1x2,
            run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        {
            label: "Blotter Entries",
            icon: Fingerprint,
            run: (actions) => actions.focusTable(),
        },
        {
            label: "Reports",
            icon: FileEarmarkBarGraph,
            run: (actions) => actions.openPanel("reports"),
        },
        {
            label: scope.childLabelPlural,
            icon: scope.level === "barangay" ? PinMap : Buildings,
            run: (actions) => actions.openPanel("areas"),
        },
    ];

    if (scope.level === "barangay") {
        items.push({
            label: "People",
            icon: People,
            run: (actions) => actions.openPanel("officials"),
        });
    }

    items.push({
        label: "Settings",
        icon: Gear,
        run: (actions) => actions.openPanel("settings"),
    });

    return items;
};

const itemClass =
    "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#1D4ED8] dark:text-bodydark1 dark:hover:bg-meta-4";

/** Sticky console header: identity, top nav, quick actions and account menu. */
const ConsoleHeader = ({
    scope,
    scopeName,
    actions,
}: {
    scope: ConsoleScope;
    scopeName: string;
    actions: ConsoleActions;
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const Logo = "/images/logo/e-blotter.png";
    const nav = navFor(scope);

    return (
        <header className="sticky top-0 z-999 w-full border-b border-[#E5E7EB] bg-white dark:border-strokedark dark:bg-boxdark">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-2.5 md:px-6 2xl:px-10">
                {/* Identity */}
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex min-w-0 items-center gap-2.5 text-left"
                >
                    <img src={Logo} alt="E-Blotter seal" className="h-9 w-9 shrink-0" />

                    <span className="min-w-0">
                        <span className="block truncate text-[13px] font-bold leading-tight tracking-tight text-[#0F172A] dark:text-white sm:text-sm">
                            E-BLOTTER SYSTEM
                        </span>
                        {/* Which slice of the country this console is showing. */}
                        <span className="block truncate text-xs text-[#64748B]">
                            {scope.levelLabel} &middot; {scopeName}
                        </span>
                    </span>
                </button>

                {/* Centre navigation */}
                <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
                    {nav.map((item) => {
                        const ItemIcon = item.icon;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => item.run(actions)}
                                className={itemClass}
                            >
                                <ItemIcon size={15} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Utilities */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <QuickActionsMenu scope={scope} actions={actions} />

                    <ul className="flex items-center">
                        <DropdownNotification />
                    </ul>

                    <DropdownUser
                        onProfile={() => actions.openPanel("profile")}
                        onSettings={() => actions.openPanel("settings")}
                    />

                    <button
                        type="button"
                        aria-label="Toggle navigation"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg border border-[#E5E7EB] p-2 text-[#475569] transition hover:text-[#1D4ED8] dark:border-strokedark dark:text-bodydark1 xl:hidden"
                    >
                        {menuOpen ? <X size={18} /> : <List size={18} />}
                    </button>
                </div>
            </div>

            {/* Collapsed navigation for tablet and mobile */}
            {menuOpen && (
                <nav className="grid grid-cols-2 gap-1 border-t border-[#E5E7EB] px-4 py-3 dark:border-strokedark sm:grid-cols-3 xl:hidden">
                    {nav.map((item) => {
                        const ItemIcon = item.icon;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    item.run(actions);
                                }}
                                className={itemClass}
                            >
                                <ItemIcon size={15} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            )}
        </header>
    );
};

export default ConsoleHeader;
