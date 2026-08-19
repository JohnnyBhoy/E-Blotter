import React, { PropsWithChildren } from "react";
import ConsoleHeader from "@/Components/Console/ConsoleHeader";
import { ConsoleActions } from "@/Components/Console/consoleActions";
import { ConsoleScope } from "@/Components/Barangay/Dashboard/types";

/**
 * Shell for the blotter console: a persistent top header and nothing else.
 *
 * Every signed-in level uses it. Deliberately separate from
 * AuthenticatedLayout, which keeps the sidebar for the standalone pages that
 * still exist outside the console.
 */
const ConsoleLayout = ({
    scope,
    scopeName,
    actions,
    children,
}: PropsWithChildren<{
    scope: ConsoleScope;
    /** The jurisdiction, already named -- see utils/functions/getAreaName. */
    scopeName: string;
    actions: ConsoleActions;
}>) => (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-boxdark-2 dark:text-bodydark">
        <ConsoleHeader scope={scope} scopeName={scopeName} actions={actions} />

        <main className="mx-auto max-w-screen-2xl px-4 py-4 md:px-6 2xl:px-10">
            {children}
        </main>
    </div>
);

export default ConsoleLayout;
