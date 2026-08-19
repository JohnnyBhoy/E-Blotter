import React, { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronRight,
    FileEarmarkBarGraph,
    GeoAlt,
    PlusLg,
    Search,
} from "react-bootstrap-icons";

type Action = {
    title: string;
    description: string;
    href: string;
    icon: ReactNode;
};

const ACTIONS: Action[] = [
    {
        title: "New Blotter",
        description: "Create a new blotter record",
        href: "/blotter",
        icon: <PlusLg size={16} />,
    },
    {
        title: "Search Blotters",
        description: "Find and view existing blotter records",
        href: "/blotter/blotters",
        icon: <Search size={16} />,
    },
    {
        title: "Generate Reports",
        description: "Create and export blotter reports",
        href: "/blotter/monthly",
        icon: <FileEarmarkBarGraph size={16} />,
    },
    {
        title: "View Map",
        description: "See incident locations on the map",
        href: "/map",
        icon: <GeoAlt size={16} />,
    },
];

/** The four shortcuts across the bottom of the dashboard. */
const QuickActions = () => (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">
            Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ACTIONS.map((action) => (
                <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl border border-[#E5E7EB] p-4 transition hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-strokedark dark:hover:bg-meta-4"
                >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                        {action.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#0F172A] dark:text-white">
                            {action.title}
                        </span>
                        <span className="block text-xs text-[#64748B]">
                            {action.description}
                        </span>
                    </span>

                    <ChevronRight
                        size={12}
                        className="flex-shrink-0 text-[#CBD5E1] transition group-hover:text-[#2563EB]"
                    />
                </Link>
            ))}
        </div>
    </div>
);

export default QuickActions;
