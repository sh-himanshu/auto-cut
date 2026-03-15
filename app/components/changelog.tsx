"use client";

import { motion } from "motion/react";
import { Sparkles, Layers, Brain, Palette, Download, Shield, Moon, Image } from "lucide-react";

const ENTRIES = [
    {
        version: "0.1.0",
        date: "March 2026",
        title: "Initial Release",
        items: [
            {
                icon: Brain,
                text: "3 AI models — IMG.LY (fast, on-device), RMBG-1.4 (high-quality transformer), and RMBG-2.0 (best quality, gated)",
            },
            {
                icon: Shield,
                text: "100% client-side processing — images never leave your device",
            },
            {
                icon: Palette,
                text: "Custom backgrounds — transparent, solid colors, or hex values",
            },
            {
                icon: Download,
                text: "Export as PNG, JPEG, or WEBP at full resolution with no watermarks",
            },
            {
                icon: Moon,
                text: "Light and dark theme with smooth transitions",
            },
            {
                icon: Image,
                text: "Sample images for quick testing without uploading",
            },
            {
                icon: Layers,
                text: "Offline-ready PWA with service worker caching",
            },
            {
                icon: Sparkles,
                text: "HuggingFace token support for gated model access",
            },
        ],
    },
];

export function Changelog() {
    return (
        <div className="w-full max-w-lg">
            {ENTRIES.map((entry, entryIdx) => (
                <div key={entry.version} className="relative">
                    {/* Version header */}
                    <div className="mb-5 flex items-baseline gap-3">
                        <span className="bg-charcoal text-surface rounded-full px-3 py-1 text-xs font-medium tracking-wide">
                            v{entry.version}
                        </span>
                        <span className="text-stone text-sm font-light">{entry.date}</span>
                    </div>

                    {/* Timeline items */}
                    <div className="relative ml-1 pl-6">
                        {/* Timeline line */}
                        <div className="border-sand absolute top-0 bottom-0 left-1.25 w-px border-l" />

                        {entry.items.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    className="relative mb-4 last:mb-0"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                >
                                    {/* Dot on timeline */}
                                    <div className="bg-bronze ring-surface absolute top-1.5 -left-6 h-2.5 w-2.5 rounded-full ring-2" />

                                    <div className="flex items-start gap-3">
                                        <Icon className="text-bronze mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                                        <p className="text-charcoal text-sm leading-relaxed font-light">{item.text}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {entryIdx < ENTRIES.length - 1 && <div className="bg-sand my-6 h-px" />}
                </div>
            ))}
        </div>
    );
}
