import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { Changelog } from "@/app/components/changelog";

export const metadata: Metadata = {
    title: "Changelog",
};

export default function ChangelogPage() {
    return (
        <>
            {/* Animated mesh gradient background */}
            <div className="mesh-bg" aria-hidden="true" />
            <div className="noise-bg" aria-hidden="true" />

            <Header hideChangelog />

            <main className="relative z-10 mx-auto flex w-full max-w-6xl grow flex-col px-6 pt-20 pb-24">
                <Link
                    href="/"
                    className="border-sand bg-surface text-stone hover:border-bronze hover:text-charcoal mb-10 flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                    Back to Home
                </Link>

                <div className="mb-12 text-center">
                    <h1 className="text-charcoal mb-4 font-serif text-4xl font-medium tracking-tight md:text-5xl">
                        Changelog
                    </h1>
                    <p className="text-stone text-lg font-light tracking-wide">
                        What&rsquo;s new and improved in Auto Cut.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Changelog />
                </div>
            </main>

            <Footer />
        </>
    );
}
