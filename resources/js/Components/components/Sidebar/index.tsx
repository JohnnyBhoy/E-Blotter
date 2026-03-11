import getUserRole from "@/utils/functions/getUserRole";
import { useLoginRegisterStore } from "@/utils/store/loginRegisterStore";
import { Link } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import {
    Fingerprint,
    Gear,
    Grid1x2,
    List,
    X,
    House,
    FileText,
    People,
    BarChart,
    Shield,
    GeoAlt,
    ExclamationTriangle,
    ChevronDown,
    Plus,
    PencilSquare,
    Trash,
    Search,
    Funnel,
    Download,
    Eye,
    Pin,
    Clock,
    CheckCircle,
    PersonExclamation,
    Person,
    Calendar,
    ArrowRepeat,
} from "react-bootstrap-icons";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    municipalities?: Array<{ id: number; name: string }>;
}

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    municipalities,
}: SidebarProps) => {
    // Local states
    const [isCollapse, setIsCollapse] = useState<boolean>(false);
    const [municipalitiesOpen, setMunicipalitiesOpen] =
        useState<boolean>(false);

    const role = getUserRole();
    const roleStr = String(role);

    const { setShowLogout } = useLoginRegisterStore();

    const pathname = window.location.pathname;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const Logo = "/images/logo/e-blotter.png";

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === "true",
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document
                .querySelector("body")
                ?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    // Navigation items based on role
    const getNavItems = () => {
        const commonItems = [
            {
                href:
                    roleStr === "province" || role === 2
                        ? "/province-dashboard"
                        : roleStr === "barangay" || role === 5
                          ? "/barangay/dashboard"
                          : roleStr === "1"
                            ? "/admin-dashboard"
                            : "/dashboard",
                icon: House,
                label: "Dashboard",
                active: pathname.includes("dashboard"),
            },
        ];

        if (roleStr === "2" || roleStr === "province") {
            return [
                ...commonItems,
                {
                    href: "#",
                    icon: People,
                    label: "Municipal",
                    active: false,
                    isDropdown: true,
                    dropdownItems: municipalities || [],
                },
                {
                    href: "/analytics",
                    icon: BarChart,
                    label: "Analytics",
                    active: pathname.includes("analytics"),
                },
            ];
        }

        if (roleStr === "3" || roleStr === "municipal") {
            return [
                ...commonItems,
                {
                    href: "/incidents",
                    icon: FileText,
                    label: "Incidents",
                    active: pathname.includes("incidents"),
                },
                {
                    href: "/barangays",
                    icon: People,
                    label: "Barangays",
                    active: pathname.includes("barangays"),
                },
            ];
        }

        if (roleStr === "4" || roleStr === "station") {
            return [
                ...commonItems,
                {
                    href: "/incidents",
                    icon: FileText,
                    label: "Incidents",
                    active: pathname.includes("incidents"),
                },
                {
                    href: "/reports",
                    icon: ExclamationTriangle,
                    label: "Reports",
                    active: pathname.includes("reports"),
                },
            ];
        }

        if (roleStr === "5" || roleStr === "barangay") {
            return [
                ...commonItems,
                {
                    href: "/blotter",
                    icon: FileText,
                    label: "New Blotter",
                    active: pathname.includes("blotter"),
                },
            ];
        }

        if (roleStr === "1") {
            return [
                ...commonItems,
                {
                    href: "/admin/barangay",
                    icon: People,
                    label: "Barangay",
                    active: pathname.includes("barangay"),
                },
                {
                    href: "/admin/station",
                    icon: Shield,
                    label: "Station",
                    active: pathname.includes("station"),
                },
                {
                    href: "/admin/province",
                    icon: GeoAlt,
                    label: "Province",
                    active: pathname.includes("province"),
                },
            ];
        }

        return commonItems;
    };

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen ${isCollapse ? "w-20" : "w-72"} flex-col overflow-y-hidden bg-white dark:bg-claude-sidebar border-r border-gray-100 dark:border-claude-border shadow-xs duration-300 ease-linear lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-b border-gray-100 dark:border-claude-border bg-white dark:bg-claude-sidebar">
                <Link
                    href={
                        String(role) === "province" || role === 2
                            ? "/province-dashboard"
                            : role == 1
                              ? "/admin-dashboard"
                              : "/dashboard"
                    }
                    className="flex items-center gap-3 group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-claude-accent rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div className="relative bg-white dark:bg-claude-panel-2 rounded-xl p-2 shadow-md">
                            <img src={Logo} alt="Logo" className="h-8 w-8" />
                        </div>
                    </div>
                    {!isCollapse && (
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-claude-text">
                                E-Blotter
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-claude-text-muted">
                                Digital System
                            </p>
                        </div>
                    )}
                </Link>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden relative group"
                >
                    <div className="relative w-8 h-8 rounded-lg bg-gray-100 dark:bg-claude-panel-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 flex items-center justify-center">
                        <X className="w-4 h-4 text-gray-600 dark:text-claude-text-muted group-hover:text-red-500 transition-colors" />
                    </div>
                </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="flex flex-col justify-between h-full overflow-y-auto">
                {/* <!-- Sidebar Menu --> */}
                <nav className="py-4 px-4 lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            {!isCollapse ? (
                                <>
                                    <h3 className="text-xs font-semibold text-gray-400 dark:text-claude-text-muted uppercase tracking-wider">
                                        Main Menu
                                    </h3>
                                    <button
                                        onClick={() => setIsCollapse(true)}
                                        className="text-gray-400 dark:text-claude-text-muted hover:text-gray-600 dark:hover:text-claude-text transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsCollapse(false)}
                                    className="text-gray-400 dark:text-claude-text-muted hover:text-gray-600 dark:hover:text-claude-text transition-colors mx-auto"
                                >
                                    <List size={20} />
                                </button>
                            )}
                        </div>

                        <ul className="mb-6 flex flex-col gap-1">
                            {getNavItems().map((item: any, index) => (
                                <li key={index}>
                                    {item.isDropdown ? (
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setMunicipalitiesOpen(
                                                        !municipalitiesOpen,
                                                    )
                                                }
                                                className={`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-gray-700 dark:text-claude-text-muted duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-claude-panel hover:text-gray-900 dark:hover:text-claude-text transition-all w-full text-left ${
                                                    municipalitiesOpen
                                                        ? "bg-orange-50 dark:bg-claude-accent/10 text-orange-600 dark:text-claude-accent"
                                                        : ""
                                                }`}
                                            >
                                                <div className={`relative transition-colors ${municipalitiesOpen ? "text-orange-600 dark:text-claude-accent" : "text-gray-500 dark:text-claude-text-muted"} group-hover:text-orange-600 dark:group-hover:text-claude-accent`}>
                                                    <item.icon
                                                        size={18}
                                                        className="relative"
                                                    />
                                                </div>
                                                {!isCollapse && (
                                                    <>
                                                        <span className="font-medium flex-1">
                                                            {item.label}
                                                        </span>
                                                        <ChevronDown
                                                            size={14}
                                                            className={`transition-transform duration-300 text-gray-400 dark:text-claude-text-muted ${municipalitiesOpen ? "rotate-180" : ""}`}
                                                        />
                                                    </>
                                                )}
                                            </button>

                                            {/* Dropdown Menu */}
                                            {municipalitiesOpen &&
                                                !isCollapse && (
                                                    <div className="mt-1 ml-4 pl-3 border-l-2 border-gray-200 dark:border-claude-border">
                                                        <div className="py-1 max-h-64 overflow-y-auto">
                                                            {item.dropdownItems?.map(
                                                                (
                                                                    municipality: any,
                                                                    mIndex: number,
                                                                ) => (
                                                                    <Link
                                                                        key={mIndex}
                                                                        href={`/municipal/${municipality.id}`}
                                                                        className="block px-3 py-2 text-sm text-gray-600 dark:text-claude-text-muted hover:text-gray-900 dark:hover:text-claude-text hover:bg-gray-100 dark:hover:bg-claude-panel rounded-md transition-all duration-150"
                                                                    >
                                                                        {municipality.name}
                                                                    </Link>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium duration-200 ease-in-out transition-all ${
                                                item.active
                                                    ? "bg-orange-50 dark:bg-claude-accent/10 text-orange-700 dark:text-claude-accent"
                                                    : "text-gray-700 dark:text-claude-text-muted hover:bg-gray-100 dark:hover:bg-claude-panel hover:text-gray-900 dark:hover:text-claude-text"
                                            } ${isCollapse ? "justify-center" : ""}`}
                                        >
                                            <div
                                                className={`relative transition-colors ${item.active ? "text-orange-600 dark:text-claude-accent" : "text-gray-500 dark:text-claude-text-muted group-hover:text-orange-600 dark:group-hover:text-claude-accent"}`}
                                            >
                                                <item.icon
                                                    size={18}
                                                    className="relative"
                                                />
                                            </div>
                                            {!isCollapse && (
                                                <>
                                                    <span className="font-medium">
                                                        {item.label}
                                                    </span>
                                                    {item.active && (
                                                        <div className="absolute right-3 w-1.5 h-1.5 bg-claude-accent rounded-full"></div>
                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* <!-- User Info Footer --> */}
                {!isCollapse && (
                    <div className="p-4 border-t border-gray-100 dark:border-claude-border">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-claude-panel-2">
                            <div className="w-9 h-9 rounded-lg bg-claude-accent flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {roleStr === "1"
                                    ? "A"
                                    : roleStr === "2"
                                      ? "P"
                                      : roleStr === "3"
                                        ? "M"
                                        : roleStr === "4"
                                          ? "S"
                                          : roleStr === "5"
                                            ? "B"
                                            : "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-claude-text truncate">
                                    {roleStr === "1"
                                        ? "Administrator"
                                        : roleStr === "2"
                                          ? "Province"
                                          : roleStr === "3"
                                            ? "Municipal"
                                            : roleStr === "4"
                                              ? "Station"
                                              : roleStr === "5"
                                                ? "Barangay"
                                                : "User"}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-claude-text-muted">
                                    Active session
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
