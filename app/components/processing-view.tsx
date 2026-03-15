"use client";

import { motion } from "motion/react";

interface ProcessingViewProps {
    progress: number;
    status: "loading-model" | "processing";
}

function getStepMessage(status: "loading-model" | "processing", progress: number) {
    if (status === "loading-model") {
        return { title: "Loading AI model...", subtitle: "Preparing the neural network" };
    }
    const percent = progress * 100;
    if (percent < 20) return { title: "Analyzing image...", subtitle: "Understanding composition" };
    if (percent < 50) return { title: "Detecting subject...", subtitle: "Identifying foreground elements" };
    if (percent < 80) return { title: "Removing background...", subtitle: "Separating layers" };
    return { title: "Refining edges...", subtitle: "Polishing the final result" };
}

export function ProcessingView({ progress, status }: ProcessingViewProps) {
    const percent = Math.round(progress * 100);
    const { title, subtitle } = getStepMessage(status, progress);
    const isLoadingModel = status === "loading-model";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24"
        >
            {/* Spinner */}
            <div className="relative mb-8 flex h-16 w-16 items-center justify-center">
                <div className="border-sand absolute inset-0 rounded-full border-[1.5px]" />
                <motion.div
                    className="border-bronze absolute inset-0 rounded-full border-[1.5px] border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                />
            </div>

            <div aria-live="polite">
                <h3 className="text-charcoal mb-2 font-serif text-xl font-medium italic">{title}</h3>
                <p className="text-stone text-sm font-light">{subtitle}</p>
            </div>

            {/* Progress bar */}
            {isLoadingModel ? (
                <div
                    role="progressbar"
                    aria-label="Loading AI model"
                    className="bg-sand relative mt-8 h-1 w-64 overflow-hidden rounded-full"
                >
                    <motion.div
                        className="bg-bronze absolute top-0 left-0 h-full w-1/3 rounded-full"
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    />
                </div>
            ) : (
                <>
                    <div
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Processing image: ${percent}%`}
                        className="bg-sand relative mt-8 h-1 w-64 overflow-hidden rounded-full"
                    >
                        <motion.div
                            className="bg-bronze absolute top-0 left-0 h-full rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>
                    <span className="text-stone mt-3 text-xs font-light">{percent}%</span>
                </>
            )}
        </motion.div>
    );
}
