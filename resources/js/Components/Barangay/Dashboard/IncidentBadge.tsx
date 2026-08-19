import React from "react";
import { ExclamationTriangle } from "react-bootstrap-icons";
import getIncidentType from "@/utils/functions/getIncidentType";
import getIncidentTypeShort from "@/utils/functions/getIncidentTypeShort";

/**
 * Tint pool for incident types. There are 40+ statutes and no colour is stored
 * with them, so the tile colour is derived from the ID and stays stable per type.
 */
const TINTS = [
    "bg-[#FEE2E2] text-[#DC2626]",
    "bg-[#EDE9FE] text-[#7C3AED]",
    "bg-[#FEF3C7] text-[#D97706]",
    "bg-[#DCFCE7] text-[#16A34A]",
    "bg-[#DBEAFE] text-[#2563EB]",
    "bg-[#FCE7F3] text-[#DB2777]",
];

/** Incident type as an icon tile plus its statute citation. */
const IncidentBadge = ({ id }: { id: number }) => {
    const tint = TINTS[Math.abs(Number(id) || 0) % TINTS.length];

    return (
        <div className="flex items-center gap-2.5">
            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${tint}`}>
                <ExclamationTriangle size={14} />
            </span>

            <span
                className="truncate text-sm font-medium text-[#1E293B] dark:text-bodydark1"
                title={getIncidentType(id)}
            >
                {getIncidentTypeShort(id)}
            </span>
        </div>
    );
};

export default IncidentBadge;
