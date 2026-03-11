import { useBlotterStore } from "@/utils/store/blotterStore";
import { Link } from "@inertiajs/react";
import React from "react";
import { Search, Bell, X } from "react-bootstrap-icons";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    const LogoIcon = "/images/logo/logo-icon.svg";
    const { blotter } = useBlotterStore();

    return (
        <header className="sticky top-0 z-999 flex w-full bg-white/95 dark:bg-claude-panel/95 backdrop-blur-xl border-b border-gray-100 dark:border-claude-border transition-all duration-300">
            <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="group relative z-50 flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-claude-panel-2 hover:bg-orange-50 dark:hover:bg-claude-accent/10 transition-all duration-200 lg:hidden"
                    >
                        <div className="relative w-5 h-5 flex flex-col justify-center items-center gap-1">
                            <span
                                className={`block h-0.5 w-4 rounded-full bg-gray-600 dark:bg-claude-text-muted transition-all duration-300 ${props.sidebarOpen ? "rotate-45 translate-y-1.5" : ""}`}
                            ></span>
                            <span
                                className={`block h-0.5 w-4 rounded-full bg-gray-600 dark:bg-claude-text-muted transition-all duration-300 ${props.sidebarOpen ? "opacity-0" : ""}`}
                            ></span>
                            <span
                                className={`block h-0.5 w-4 rounded-full bg-gray-600 dark:bg-claude-text-muted transition-all duration-300 ${props.sidebarOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                            ></span>
                        </div>
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}

                    {/* <!-- Logo --> */}
                    <Link className="flex items-center gap-2.5 group" href="/">
                        <div className="relative bg-white dark:bg-claude-panel-2 rounded-lg p-1.5 border border-gray-200 dark:border-claude-border">
                            <img
                                src={LogoIcon}
                                alt="Logo"
                                className="w-6 h-6"
                            />
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="text-base font-semibold text-gray-800 dark:text-claude-text">
                                E-Blotter
                            </h1>
                            <p className="text-xs text-gray-400 dark:text-claude-text-muted">
                                Digital Crime Reporting
                            </p>
                        </div>
                    </Link>
                    {/* <!-- Logo --> */}
                </div>

                {/* <!-- Search Bar --> */}
                <div className="hidden sm:block flex-1 max-w-sm mx-4">
                    <div className="relative">
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-claude-text-muted">
                            <Search size={15} />
                        </button>
                        <input
                            type="text"
                            placeholder="Search incidents, records..."
                            className="w-full bg-gray-100 dark:bg-claude-panel-2 border border-transparent dark:border-claude-border rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 dark:text-claude-text placeholder-gray-400 dark:placeholder-claude-text-muted focus:outline-none focus:ring-1 focus:ring-claude-accent/40 focus:border-claude-accent/40 transition-all duration-200"
                        />
                    </div>
                </div>
                {/* <!-- Search Bar --> */}

                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* <!-- Dark Mode Switcher --> */}
                    <div className="relative">
                        <DarkModeSwitcher />
                    </div>
                    {/* <!-- Dark Mode Switcher --> */}

                    {/* <!-- Notification Area --> */}
                    <div className="relative">
                        <button className="relative group flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-claude-panel-2 hover:bg-orange-50 dark:hover:bg-claude-accent/10 transition-all duration-200">
                            <Bell className="w-4 h-4 text-gray-500 dark:text-claude-text-muted group-hover:text-orange-600 dark:group-hover:text-claude-accent transition-colors" />
                            {blotter >= 1 && (
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                    </div>
                    {/* <!-- Notification Area --> */}

                    {/* <!-- User Area --> */}
                    <div className="relative">
                        <DropdownUser />
                    </div>
                    {/* <!-- User Area --> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
