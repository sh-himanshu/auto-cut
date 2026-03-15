"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Star, History } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "./theme-provider";
import { useHaptics } from "@/app/hooks/use-haptics";

import logoLight from "@/brand/autocut-logo-light.png";
import logoDark from "@/brand/autocut-logo-dark.png";

export function Header({ hideChangelog }: { hideChangelog?: boolean }) {
    const { theme, toggleTheme } = useTheme();
    const { nudge } = useHaptics();

    return (
        <header className="border-sand/50 bg-base/80 sticky top-0 z-50 w-full border-b px-6 py-6 backdrop-blur-md">
            <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
                {/* Brand */}
                <Link href="/" className="group flex cursor-pointer items-center gap-3">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={theme}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image
                                src={theme === "dark" ? logoDark : logoLight}
                                alt="Auto Cut"
                                width={32}
                                height={32}
                                className="transition-transform duration-500 group-hover:rotate-12"
                            />
                        </motion.div>
                    </AnimatePresence>
                    <span className="text-charcoal font-serif text-2xl font-medium tracking-wide italic">Auto Cut</span>
                </Link>

                {/* Right nav */}
                <div className="flex items-center gap-4">
                    {/* Changelog */}
                    {!hideChangelog && (
                        <Link
                            href="/changelog"
                            className="border-sand bg-surface text-stone hover:border-bronze hover:text-charcoal flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"
                        >
                            <History className="h-4 w-4" strokeWidth={1.5} />
                            <span className="hidden sm:inline">Changelog</span>
                        </Link>
                    )}

                    {/* Star on GitHub — hidden on mobile */}
                    <a
                        href="https://github.com/sh-himanshu/auto-cut"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-sand bg-surface text-stone hover:border-bronze hover:text-charcoal hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 sm:flex"
                    >
                        <Star className="h-4 w-4" strokeWidth={1.5} />
                        Star on GitHub
                    </a>

                    {/* Theme toggle */}
                    <button
                        onClick={() => {
                            nudge();
                            toggleTheme();
                        }}
                        className="border-sand bg-surface text-stone hover:border-bronze hover:text-charcoal relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300"
                        aria-label="Toggle Dark Mode"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {theme === "dark" ? (
                                <motion.span
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Sun className="h-4 w-4" strokeWidth={1.5} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Moon className="h-4 w-4" strokeWidth={1.5} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </header>
    );
}
