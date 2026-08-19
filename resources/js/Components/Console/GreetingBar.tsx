import React, { useEffect, useState } from "react";
import { Calendar3, Clock } from "react-bootstrap-icons";

/** "Good morning" / "Good afternoon" / "Good evening" for the local hour. */
const greetingFor = (date: Date): string => {
    const hour = date.getHours();

    if (hour < 12) {
        return "Good morning";
    }

    return hour < 18 ? "Good afternoon" : "Good evening";
};

type GreetingBarProps = {
    /** The signed-in account name, shown as-is. */
    name: string;
    /** The jurisdiction being viewed: a barangay, city, province, region or the country. */
    scopeName?: string;
};

/** Compact greeting line with a live clock on the right. */
const GreetingBar = ({ name, scopeName }: GreetingBarProps) => {
    const [now, setNow] = useState(() => new Date());

    // Ticks once a minute -- the clock only shows hours and minutes, so a
    // per-second interval would re-render for nothing.
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60_000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-[#0F172A] dark:text-white">
                    {greetingFor(now)}, {name}! 👋
                </h1>
                <p className="mt-0.5 text-sm text-[#64748B]">
                    Here's what's happening in {scopeName || "your jurisdiction"} today.
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 text-sm text-[#64748B]">
                <span className="flex items-center gap-1.5">
                    <Calendar3 size={14} />
                    {now.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>

                <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {now.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    })}
                </span>
            </div>
        </div>
    );
};

export default GreetingBar;
