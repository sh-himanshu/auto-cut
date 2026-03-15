"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHaptics } from "@/app/hooks/use-haptics";

export function BackToHomeButton() {
    const { nudge } = useHaptics();

    return (
        <Link
            href="/"
            onClick={nudge}
            className="border-sand bg-surface text-stone hover:border-bronze hover:text-charcoal mb-10 flex w-fit cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"
        >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to Home
        </Link>
    );
}
