import Header from "@/Components/components/Header";
import Sidebar from "@/Components/components/Sidebar";
import { User } from "@/Pages/types";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import { Toaster } from "sonner";

export default function Authenticated({
    user,
    header,
    children,
    municipalities,
}: PropsWithChildren<{ user: User; header?: ReactNode; municipalities?: Array<{id: number, name: string}> }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 dark:text-black transition-colors duration-300">
                {/* <!-- ===== Page Wrapper Start ===== --> */}
                <div className="flex h-screen overflow-hidden">
                    {/* <!-- ===== Sidebar Start ===== --> */}
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} municipalities={municipalities} />
                    {/* <!-- ===== Sidebar End ===== --> */}

                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {/* <!-- ===== Header Start ===== --> */}
                        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                        {/* <!-- ===== Header End ===== --> */}

                        {/* <!-- ===== Main Content Start ===== --> */}
                        <main>
                            <div className="mx-auto max-w-screen-2xl bg-transparent">
                                {children}
                            </div>
                        </main>
                        {/* <!-- ===== Main Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
                {/* <!-- ===== Page Wrapper End ===== --> */}
            </div>
            <Toaster position="top-right" richColors />
        </>
    );
}
