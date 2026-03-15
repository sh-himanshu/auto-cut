import Link from "next/link";
import type { Metadata } from "next";
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

            <Header />

            <main className="relative z-10 mx-auto flex w-full max-w-6xl grow flex-col items-center px-6 pt-20 pb-24">
                <Link
                    href="/"
                    className="btn-elegant bg-charcoal text-surface mb-12 rounded-full px-8 py-3 font-light tracking-wide"
                >
                    Back to Home
                </Link>

                <div className="mb-12 max-w-2xl text-center">
                    <h1 className="text-charcoal mb-4 font-serif text-4xl font-medium tracking-tight md:text-5xl">
                        Changelog
                    </h1>
                    <p className="text-stone text-lg font-light tracking-wide">
                        What&rsquo;s new and improved in Auto Cut.
                    </p>
                </div>

                <Changelog />
            </main>

            <Footer />
        </>
    );
}
