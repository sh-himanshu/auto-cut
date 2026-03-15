import type { Metadata } from "next";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { Changelog } from "@/app/components/changelog";
import { BackToHomeButton } from "@/app/components/back-to-home-button";

export const metadata: Metadata = {
    title: "Changelog",
    description: "See what's new and improved in Auto Cut — the free, private, AI-powered background remover.",
    alternates: {
        canonical: "/changelog",
    },
};

export default function ChangelogPage() {
    return (
        <>
            {/* Animated mesh gradient background */}
            <div className="mesh-bg" aria-hidden="true" />
            <div className="noise-bg" aria-hidden="true" />

            <Header hideChangelog />

            <main className="relative z-10 mx-auto flex w-full max-w-6xl grow flex-col px-6 pt-20 pb-24">
                <BackToHomeButton />

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
