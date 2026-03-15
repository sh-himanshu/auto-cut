"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface ProcessingViewProps {
    progress: number;
    status: "loading-model" | "processing";
}

const MESSAGES = [
    { title: "Loading AI model...", subtitle: "Preparing the neural network" },
    { title: "Analyzing image...", subtitle: "Understanding composition" },
    { title: "Detecting subject...", subtitle: "Identifying foreground elements" },
    { title: "Removing background...", subtitle: "Separating layers" },
    { title: "Refining edges...", subtitle: "Polishing the final result" },
];

function getStepMessage(status: "loading-model" | "processing", progress: number) {
    if (status === "loading-model") return MESSAGES[0];
    const percent = progress * 100;
    if (percent < 20) return MESSAGES[1];
    if (percent < 50) return MESSAGES[2];
    if (percent < 80) return MESSAGES[3];
    return MESSAGES[4];
}

export function ProcessingView({ progress, status }: ProcessingViewProps) {
    const { title, subtitle } = getStepMessage(status, progress);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20"
        >
            {/* AI sparkle animation */}
            <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
                {/* Pulsing glow ring */}
                <motion.div
                    className="bg-bronze/10 absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.div
                    className="bg-bronze/5 absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.7, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.4 }}
                />

                {/* Blinking sparkle icon */}
                <motion.div
                    animate={{ opacity: [1, 0.2, 1], scale: [1, 0.9, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <Sparkles className="text-bronze h-9 w-9" strokeWidth={1.25} />
                </motion.div>
            </div>

            <div aria-live="polite" className="text-center">
                <h3 className="text-charcoal mb-2 font-serif text-xl font-medium italic">{title}</h3>
                <p className="text-stone text-sm font-light">{subtitle}</p>
            </div>

            {/* Continuous shimmer bar */}
            <div
                role="progressbar"
                aria-label="Processing image"
                className="bg-sand relative mt-8 h-1 w-64 overflow-hidden rounded-full"
            >
                <motion.div
                    className="bg-bronze absolute top-0 left-0 h-full w-1/3 rounded-full"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
            </div>
        </motion.div>
    );
}
