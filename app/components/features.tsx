"use client";

import { motion, useInView } from "motion/react";
import { Brain, Layers, Palette, Download, type LucideIcon } from "lucide-react";
import { useRef } from "react";

const features: { icon: LucideIcon; title: string; description: string; color: string }[] = [
    {
        icon: Brain,
        title: "3 AI Models",
        description:
            "Switch between IMG.LY, RMBG-1.4, and RMBG-2.0 to balance speed, quality, and accuracy for any image.",
        color: "text-purple-400",
    },
    {
        icon: Layers,
        title: "Runs in Your Browser",
        description:
            "All processing happens locally — no uploads, no servers. Your images stay private on your device.",
        color: "text-sky-400",
    },
    {
        icon: Palette,
        title: "Custom Backgrounds",
        description: "Replace backgrounds with transparent, solid colors, or custom hex values before exporting.",
        color: "text-emerald-400",
    },
    {
        icon: Download,
        title: "Export as PNG, JPEG, or WEBP",
        description: "Download your edited images in multiple formats at full resolution with no watermarks or limits.",
        color: "text-amber-400",
    },
];

export function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="mt-24 grid w-full grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                        whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
                        className="group border-sand/50 bg-surface shadow-elegant-sm hover:border-bronze/30 hover:shadow-elegant cursor-default rounded-3xl border p-8 transition-all duration-500"
                    >
                        <motion.div
                            className={`border-sand bg-base mb-6 flex h-12 w-12 items-center justify-center rounded-full border ${feature.color} group-hover:border-bronze/40 transition-colors duration-300`}
                            whileHover={{ rotate: 8, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            <Icon className="h-5 w-5" strokeWidth={1.25} />
                        </motion.div>
                        <h3 className="text-charcoal mb-3 font-serif text-xl font-medium">{feature.title}</h3>
                        <p className="text-stone text-base leading-relaxed font-light">{feature.description}</p>
                    </motion.div>
                );
            })}
        </div>
    );
}
